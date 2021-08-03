import usePortal from 'react-useportal'

const PopUp = props => {
    const { children } = props
    const { Portal } = usePortal()

    return (
        <Portal>
            {children}
        </Portal>
    )
}

export default PopUp;