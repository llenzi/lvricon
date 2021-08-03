// import { useState } from 'react';
import cn from 'classnames';
import { Player, Controls } from '@lottiefiles/react-lottie-player';

const Lottie = props => {
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
    const classContainer = isFull ? `icon icon-${name} icon-view mx-auto h-80 w-6/12 bg-white rounded border border-color-grey p-0 shadow overflow-y-auto` : `icon icon-${name} icon-view flex flex-col bg-gray-50 rounded m-4 align-middle justify-between border border-gray-300 text-center w-60 h-60`
    const classPreview = isFull ? 'm-2 flex flex-row justify-between' : 'm-2';
    const classTitle = cn('name p-2 bg-white border-b border-gray-300 rounded-t flex justify-center', {'justify-center': !isFull, 'justify-between' : isFull});
    const valueHTML = JSON.stringify({ value }, null, 2);
    // const [showHTML, setShowHTML] = useState(false);

    return <div className={classContainer}>
        <div className={classTitle}>
            <h4 className="font-medium">{name}</h4>
            {isFull && <button onClick={_onClose} className="px-2 py-1 border rounded-full text-xs">✕</button>}
        </div>
        <div className={classPreview}>
            <div>
                <div className="m-2 lottie-container">
                    <Player
                        autoplay
                        loop
                        src={value}
                        style={{ height: '40px', width: '40px' }}
                    >
                        <Controls visible={false} buttons={['play', 'repeat']} />
                    </Player>
                </div>
                {isFull && <div>
                    <button onClick={() => { _onCopyClick(valueHTML) }} className="px-10 py-2 border rounded text-white border-gray-900 bg-gray-800 text-sm">
                        Copy HTML
                    </button>
                </div>}
            </div>

            <pre className={cn("m-2 bg-gray-200 rounded max-w-lg whitespace-pre-wrap p-4 text-xs overflow-hidden", { "hidden": !isFull })}>{valueHTML}</pre>
        </div>

        <div className="hidden h-1/6" />
        {!isFull && <div className="m-2">
            <button onClick={_onButtonClick} className="px-10 py-2 border rounded text-white border-gray-900 bg-gray-800 text-sm">
                Show HTML
            </button>
        </div>}
    </div>
}

export default Lottie;