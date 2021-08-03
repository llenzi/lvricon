import { useState } from "react";
import cn from "classnames";
import Button from '../buttons';

const UserMenu = props => {
    const { user, onSignIn, onSignOut, isSignedIn } = props;

    const [open, setOpen] = useState(false);

    const _onSignOut = () => {
        onSignOut();
    }

    const _onSignIn = () => {
        onSignIn();
    }

    const classMenu = cn('btn-container absolute top-full bg-gray-300 px-2 pb-2 flex flex-col justify-center w-40 inset-x-0 rounded-b', { 'hidden': !open });
    const classContainer = cn('relative bg-gray-300 p-2 flex flex-col justify-center w-40', { 'rounded': !open, 'rounded-t': open });

    return <>
        <div className={classContainer}>
            {!isSignedIn && <div className="btn-container flex flex-col justify-center">
                <Button
                    classStyle="border-gray-600 bg-white text-xs"
                    onClick={_onSignIn}
                >
                    Sign In
                </Button>
            </div>}
            {isSignedIn &&
                <div className="flex flex-col justify-center">
                    <div className="flex flex-col content-center justify-center">
                        <div
                            className="rounded-full border border-2 border-white relative overflow-hidden w-10 h-10 mx-auto cursor-pointer"
                            onClick={() => { setOpen(!open) }}
                        >
                            <img className="absolute" src={user.photoURL} />
                        </div>

                    </div>
                    <div className={classMenu}>
                        <span className="text-xs mt-1 text-center">{user.displayName}</span>
                        <Button
                            classStyle="border-gray-600 bg-white mt-4 text-xs"
                            onClick={_onSignOut}
                        >
                            Sign Out
                        </Button>

                    </div>
                </div>
            }
        </div>
    </>
}

export default UserMenu;