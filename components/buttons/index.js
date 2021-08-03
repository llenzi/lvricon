import cn from "classnames";

const Button = props => {
    const { children, onClick, classStyle } = props;

    return <button
        className={cn('px-4 py-2 rounded border', classStyle)}
        onClick={onClick}
    >
        {children}
    </button>
}

export default Button;