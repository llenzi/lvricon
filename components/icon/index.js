// import { useState } from 'react';
import cn from 'classnames';
import {
    FirebaseDatabaseMutation
} from "@react-firebase/database";

const Icon = props => {
    const { name, value, onButtonClick, onClose, layout, isEdit, iconId } = props;

    const _onClose = () => {
        onClose()
    }

    const _onButtonClick = () => {
        onButtonClick({ name, value });
    }

    const _onCopyClick = (val) => {
        console.log(val)
        navigator.clipboard.writeText(val)
    }

    const isFull = layout === 'full';
    const classContainer = isFull ? `icon icon-${name} icon-view mx-auto h-80 w-6/12 bg-white rounded border border-color-grey p-0 shadow overflow-y-auto` : `icon icon-${name} icon-view flex flex-col bg-gray-300 rounded m-4 align-middle justify-between border border-gray-900 text-center w-6/12 sm:w-4/12 lg:w-/12 xl:w-2/12 h-40`
    const classPreview = isFull ? 'm-2 flex flex-row justify-between' : 'm-2';
    const classTitle = cn('name p-2 bg-white border-b border-gray-900 rounded-t flex', { 'justify-center': !isFull, 'justify-between': isFull });
    const valueHTML = value.replace('fill="#000000"', 'fill="@fill@"');
    const valueColor = value.replace('@fill@', '#000000');
    // const [showHTML, setShowHTML] = useState(false);

    return <div className={classContainer}>
        <div className={classTitle}>
            <h4 className="font-medium">{name}</h4>
            {isFull && <button onClick={_onClose} className="px-2 py-1 border rounded-full text-xs">✕</button>}
        </div>
        <div className={classPreview}>
            <div>
                <div className="m-2 svg-container" key={name} dangerouslySetInnerHTML={{ __html: valueColor }} />
                {isFull && <div>
                    <button onClick={() => { _onCopyClick(valueHTML) }} className="px-10 py-2 border rounded text-white border-gray-900 bg-gray-800 text-sm">
                        Copy HTML
                    </button>
                </div>}
            </div>

            <pre className={cn("m-2 bg-gray-200 rounded max-w-lg whitespace-pre-wrap p-4 text-xs", { "hidden": !isFull })}>{valueHTML}</pre>
        </div>

        <div className="hidden h-1/6" />
        {!isEdit && !isFull && <div className="m-2">
            <button onClick={_onButtonClick} className="px-10 py-2 border rounded text-white border-gray-900 bg-gray-800 text-sm">
                Show HTML
            </button>
        </div>}
        {isEdit && !isFull && <div className="flex justify-center w-full border-t border-gray-900">
            <button onClick={_onButtonClick} className="px-2 py-2 text-white bg-gray-800 font-bold text-sm rounded-bl w-full text-center">
                Show HTML
            </button>
            <FirebaseDatabaseMutation
                type="set"
                path={`icons/${iconId}`}
            >
                {({ runMutation }) => (
                    <button
                        className="text-white bg-red-600 font-bold px-2 py-2 text-sm rounded-br w-full text-center"
                        onClick={async () => {
                            runMutation(null);
                        }}
                    >
                        Delete
                    </button>
                )}
            </FirebaseDatabaseMutation>
        </div>}
    </div>
}

export default Icon;