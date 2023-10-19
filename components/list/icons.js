import { useState } from "react";
import dynamic from 'next/dynamic'
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
// import Save from "@/components/save";

const IconFontButton = dynamic(() => import('../save/buttonSave'), {
    ssr: false,
})

const ListIcons = props => {
    const { canAdd, path = "icons/" } = props;

    const [showPopUp, setShowPopUp] = useState(false);
    const [selectIcon, setSelectIcon] = useState(null);
    const [canExport, setCanExport] = useState(false);
    const [canExportWebFont, setCanExportWebFont] = useState(true);

    const onClickIcon = ({ name, value }) => {
        setShowPopUp(true);
        setSelectIcon({ name, value })
    };

    const bulkExport = (icons) => {
        var iconsExport = {};
        icons.map(({ name, code }) => {
            name = name.replace('@2x', '');

            iconsExport[name] = code;
        })
        // console.log({ icons, iconsExport });
        window.iconsExport = iconsExport;
        const exportIcons = JSON.stringify(iconsExport);
        navigator.clipboard.writeText(exportIcons)
    }


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
                                path={path}
                                orderByKey
                            >
                                {({ value }) => {
                                    if (value === null || typeof value === "undefined") return null;
                                    const keys = Object.keys(value);
                                    const values = Object.values(value);

                                    return (
                                        <>
                                            {canExport && <div className="flex flex-row flex-wrap justify-center">
                                                <div className="bulk-export flex flex-col bg-gray-300 rounded m-4 p-2 align-middle justify-between border border-gray-900 text-center w-full">
                                                    <h2 className="pb-2">Bulk Export HTML</h2>
                                                    <button onClick={() => { bulkExport(values) }} className="px-10 py-2 border rounded text-white border-gray-900 bg-gray-800 text-sm">
                                                        Export
                                                    </button>
                                                </div>
                                            </div>}
                                            {/* {canExportWebFont && <Save values={values} />} */}
                                            {canExportWebFont && <IconFontButton icons={values} />}
                                            <div className="flex flex-row flex-wrap justify-center w-full">
                                                {values.map((val, i) => {
                                                    console.log({ val })
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
                                                })}
                                            </div>
                                        </>
                                    );
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