import usePortal from 'react-useportal'

const PopUp = props => {
    const { children } = props
    const { Portal } = usePortal()

    return (
        <Portal>
            <>
                <div className="overlay h-full w-full bg-black opacity-50 absolute inset-0 z-20" />
                <div className="absolute rounded inset-0 flex flex-col align-middle justify-center content-center h-full z-30">
                    {children}
                </div>
            </>
        </Portal>
    )
}

export default PopUp;