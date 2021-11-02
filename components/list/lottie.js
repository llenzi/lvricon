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
import AddLottie from '@/components/add/addLottie';
import PopUp from "@/components/popup";
import LottiePlayer from '@/components/lottie';

const ListLottie = props => {
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
                        <LottiePlayer
                            onClose={() => { setShowPopUp(false); }}
                            layout='full'
                            name={selectIcon.name}
                            value={selectIcon.value}
                        />
                    </PopUp>}
                    {isSignedIn && <>
                        <FirebaseDatabaseProvider firebase={firebase} {...config}>
                            <FirebaseDatabaseNode
                                path="lottie/"
                                orderByKey
                            // orderByValue={"created_on"}
                            >
                                {({ value }) => {
                                    if (value === null || typeof value === "undefined") return null;
                                    const keys = Object.keys(value);
                                    const values = Object.values(value);
                                    console.log({ keys, values });
                                    // const values = Object.values(value);
                                    // console.log(JSON.stringify({ value }, null, 2));
                                    return values.map((val, i) => {
                                        const { name, code } = val || {}
                                        if (!!name) {
                                            return <LottiePlayer
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
                            <>{canAdd && <AddLottie />}</>
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

export default ListLottie;