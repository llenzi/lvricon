import usePortal from 'react-useportal'
import cn from 'classnames';

const Notification = props => {
    const { title, text, errors, onClose, type } = props;
    const { Portal } = usePortal();

    console.log('Notification')

    const _onClose = () => {
        onClose();
    }

    const titleClass = cn('text-white font-bold rounded-t px-4 py-2 relative', {
        'bg-red-500': type === 'warning',
        'bg-teal-500': type === 'default',
    });

    const textClass = cn('border border-t-0 rounded-b px-4 py-3', {
        'bg-red-100 border-red-400 text-red-700': type === 'warning',
        'bg-teal-100 border-teal-400 text-teal-700': type === 'default',
    })

    const buttonClass = cn('fill-current h-6 w-6', {
        'text-red-100': type === 'warning',
        'text-teal-100': type === 'default',
    });

    return (
        <Portal>
            <>
                <div className="overlay h-full w-full bg-black opacity-50 absolute inset-0 z-20" />
                <div className="absolute rounded inset-0 flex flex-col align-middle justify-start content-center h-full z-30 m-4">
                    <div role="alert">
                        <div className={titleClass}>
                            <strong className="font-bold mr-2">{title}</strong>
                            <span className="absolute top-0 bottom-0 right-0 p-2">
                                <svg onClick={_onClose} className={buttonClass} role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <title>Close</title>
                                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                </svg>
                            </span>
                        </div>
                        <div className={textClass}>
                            {text}
                            {!!errors.length && <ul className="list-disc pl-6">
                                {errors.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>}
                        </div>
                    </div>
                </div>
            </>
        </Portal>
    )
}

export default Notification;