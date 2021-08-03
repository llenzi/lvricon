import "firebase/auth";
import {
    IfFirebaseAuthed,
    IfFirebaseAuthedAnd
} from "@react-firebase/auth";

const Footer = () => {
    return <div className="hidden">
        <div>
            <IfFirebaseAuthed>
                {() => {
                    return <div>You are authenticated</div>;
                }}
            </IfFirebaseAuthed>
            <IfFirebaseAuthedAnd
                filter={({ providerId }) => providerId !== "anonymous"}
            >
                {({ providerId }) => {
                    return <div>You are authenticated with {providerId}</div>;
                }}
            </IfFirebaseAuthedAnd>
        </div>
    </div>
}

export default Footer;