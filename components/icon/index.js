// import { useState } from 'react';
import cn from 'classnames';

const Icon = props => {
    const { name, value, onButtonClick, onClose, layout } = props;

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
    const classContainer = isFull ? `icon icon-${name} icon-view mx-auto h-80 w-6/12 bg-white rounded border border-color-grey p-0 shadow overflow-y-auto` : `icon icon-${name} icon-view flex flex-col bg-gray-50 rounded m-4 align-middle justify-between border border-gray-300 text-center w-2/12 h-40`
    const classPreview = isFull ? 'm-2 flex flex-row justify-between' : 'm-2';
    const valueHTML = value.replace('fill="#000000"', 'fill="@fill@"');
    // const [showHTML, setShowHTML] = useState(false);

    return <div className={classContainer}>
        <div className="name p-2 bg-white border-b border-gray-300 rounded-t flex justify-between">
            <div>{name}</div>
            {isFull && <button onClick={_onClose} className="px-2 py-1 border rounded-full text-xs">✕</button>}
        </div>
        <div className={classPreview}>
            <div>
                <div className="m-2 svg-container" key={name} dangerouslySetInnerHTML={{ __html: value }} />
                {isFull && <div>
                    <button onClick={() => { _onCopyClick(valueHTML) }} className="px-10 py-2 border rounded text-white border-gray-900 bg-gray-800 text-sm">
                        Copy HTML
                    </button>
                </div>}
            </div>

            <pre className={cn("m-2 bg-gray-200 rounded max-w-lg whitespace-pre-wrap p-4 text-xs", { "hidden": !isFull })}>{valueHTML}</pre>
        </div>

        <div className="hidden h-1/6" />
        {!isFull && <div className="m-2">
            <button onClick={_onButtonClick} className="px-10 py-2 border rounded text-white border-gray-900 bg-gray-800 text-sm">
                Show HTML
            </button>
        </div>}
    </div>
}

export default Icon;