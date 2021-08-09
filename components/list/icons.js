import { useState } from "react";
import firebase from "firebase/app";
import config from "../../config";
import {
    IfFirebaseAuthedAnd
} from "@react-firebase/auth";
import {
    FirebaseDatabaseProvider,
    FirebaseDatabaseNode
} from "@react-firebase/database";
import Add from '@/components/add';
import Icon from "@/components/icon";
import PopUp from "@/components/popup";

const ListIcons = props => {
    const { canAdd } = props;

    const [showPopUp, setShowPopUp] = useState(false);
    const [selectIcon, setSelectIcon] = useState(null);

    const onClickIcon = ({ name, value }) => {
        setShowPopUp(true);
        setSelectIcon({ name, value })
    };

    return <IfFirebaseAuthedAnd
        filter={({ providerId, user }) => {
            if (!user.email) { return false; }
            return (
                providerId !== "anonymous" &&
                user.email.indexOf("@luisaviaroma.com") > -1
            );
        }}
    >
        {({ isSignedIn, user, providerId }) => {
            return (
                <section className="flex flex-row flex-wrap justify-center">
                    {showPopUp && <PopUp>
                        <Icon
                            onClose={() => { setShowPopUp(false); }}
                            layout='full'
                            name={selectIcon.name}
                            value={selectIcon.value}
                        />
                    </PopUp>}
                    {isSignedIn && <>
                        <FirebaseDatabaseProvider firebase={firebase} {...config}>
                            <FirebaseDatabaseNode
                                path="icons/"
                                orderByKey
                            // orderByValue={"created_on"}
                            >
                                {({ value }) => {
                                    if (value === null || typeof value === "undefined") return null;
                                    const keys = Object.keys(value);
                                    const values = Object.values(value);
                                    console.log({ keys, values });
                                    // return <div />
                                    return values.map((val, i) => {
                                        const { name, code } = val || {}
                                        if (!!name) {
                                            return <Icon
                                                iconId={keys[i]}
                                                key={name}
                                                name={name}
                                                value={code}
                                                onButtonClick={onClickIcon}
                                                isEdit={canAdd}
                                            />
                                        } else {
                                            return <div />
                                        }
                                    });
                                }}
                            </FirebaseDatabaseNode>
                            <>{canAdd && <Add />}</>
                        </FirebaseDatabaseProvider>
                    </>}
                    {!isSignedIn && <>
                        <div>
                            You have to loggedin
                        </div>
                    </>}
                </section>
            );
        }}
    </IfFirebaseAuthedAnd>
}

export default ListIcons;