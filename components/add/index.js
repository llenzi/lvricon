import { useRef, useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { FirebaseDatabaseMutation } from "@react-firebase/database";
import { useDropzone } from 'react-dropzone';
import Notification from "@/components/popup/notification";
import 'firebase/storage';

const Add = ({ iconType }) => {

    const isApp = iconType === 'app';
    const pathToPush = isApp ? "icons" : "web/icons";

    const newNameTextFieldRef = useRef(null);
    const newUrlRef = useRef(null);
    // const newSGVTextFieldRef = useRef(null);
    const newSVGObjectRef = useRef(null);
    const [files, setFiles] = useState([]);

    const [showPopUp, setShowPopUp] = useState(false);
    const [error, setError] = useState([]);


    const [svgUrl, setSvgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: 'image/svg+xml',
        onDrop: acceptedFiles => {

            const file = acceptedFiles[0];
            if (!file) return;

            const storage = firebase.storage();
            const storageRef = storage.ref();
            const spaceRef = storageRef.child(`icons/${file.name}`);
            const uploadTask = spaceRef.put(file);

            uploadTask.on("state_changed",
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgresspercent(progress);
                },
                (error) => {
                    alert(error);
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        setSvgUrl(downloadURL)

                        setFiles(acceptedFiles.map(_ => {
                            const fileName = _.name.replace('.svg', '');
                            console.log({ _, fileName, downloadURL });
                            return Object.assign(_, {
                                preview: URL.createObjectURL(_),
                                fileName: fileName,
                                url: downloadURL
                            })
                        }));


                    });
                }
            );
        }
    });

    const thumbs = files.map(file => {
        const { preview, fileName, name, url } = file;
        console.log({ error, svgUrl });
        return (
            <div key={name}>
                {showPopUp && <Notification
                    title="Attenzione"
                    errors={[...new Set(error)]}
                    text="sono stati riscontrati i seguenti errori e il caricamento non verrà effettuato (si consiglia di vedere gli altri SVG come sono stati realizzati):"
                    type="warning"
                    onClose={() => {
                        newNameTextFieldRef.current.value = "";
                        newSVGObjectRef.current.value = "";
                        setFiles([]);
                        setShowPopUp(false);
                    }}
                />}
                <div className="name p-2 bg-white border-b border-gray-300 rounded-t flex justify-center">
                    <input
                        readOnly
                        id="name"
                        className="font-medium border-b focus:outline-none focus:border-gray-600"
                        label="New SVG Name"
                        aria-label="New SVG Name"
                        placeholder="Name"
                        value={fileName}
                        ref={newNameTextFieldRef} />
                    <input
                        readOnly
                        id="name"
                        className="hidden"
                        label="url"
                        aria-label="url"
                        placeholder="Url"
                        value={url}
                        ref={newUrlRef} />
                </div>
                <aside className="h-full flex flex-col justify-center">
                    <div className="mx-auto my-2 mb-6">
                        <object ref={newSVGObjectRef} className="uploadSVG mx-auto" id={fileName} data={preview} type="image/svg+xml" />
                        {/* {!isApp && svgUrl && <img className="uploadSVG" src={svgUrl} alt={fileName} />} */}
                    </div>
                </aside>
            </div>
        )
    });

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return <div
        className="add flex flex-col bg-gray-50 rounded m-4 align-middle justify-between border border-gray-300 text-center w-2/12 h-auto"
    >
        {!thumbs.length && <div {...getRootProps({ className: 'dropzone m-1 flex flex-col justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-full content-center' })}>
            <input {...getInputProps()} />
            {!progresspercent && <p>Drag 'n' drop some files here, or click to select files</p>}
            {!!progresspercent && <p>{progresspercent}%</p>}
        </div>}
        {thumbs && <>{thumbs}</>}
        <FirebaseDatabaseMutation type="push" path={pathToPush}>
            {({ runMutation }) => (
                <form
                    onSubmit={async ev => {
                        ev.preventDefault();
                        // console.log({ files })
                        // console.log({name: newNameTextFieldRef.current.value, svg: newSGVTextFieldRef.current.value});
                        const newName = newNameTextFieldRef.current.value;
                        const url = newUrlRef.current.value;
                        // let newSVG = newSGVTextFieldRef.current.value;
                        window.xsxs = newSVGObjectRef.current;
                        let newSVG = newSVGObjectRef.current.contentDocument.rootElement.outerHTML;
                        let hasError = false;
                        let errorsArray = [];
                        if (!newSVGObjectRef.current.contentDocument.rootElement.hasAttribute('width')) {
                            console.log(`bisogna impostare una width per l'svg`);
                            errorsArray = [...errorsArray, `bisogna impostare una width per l'svg`];
                            hasError = true;
                        }
                        if (!newSVGObjectRef.current.contentDocument.rootElement.hasAttribute('height')) {
                            errorsArray = [...errorsArray, `bisogna impostare una height per l'svg`];
                            hasError = true;
                        }
                        newSVGObjectRef.current.contentDocument.rootElement.querySelectorAll('path').forEach(item => {
                            if (!item.id) {
                                // console.log('attenzione ogni path deve avere un id');
                                errorsArray = [...errorsArray, `ogni path deve avere un id`];
                                hasError = true;
                            }
                        });
                        if (hasError) {
                            console.log({ errorsArray });
                            setError([...error, ...errorsArray]);
                            setShowPopUp(true);
                            return false;
                        }
                        // console.log({ newSVGObjectRef, contentDoc: newSVGObjectRef.current.contentDocument.rootElement.outerHTML });
                        newSVG = newSVG.replaceAll('path-1', `path-${newName}`);
                        // console.log({ newSVG });
                        const { key } = await runMutation({
                            name: newName,
                            code: newSVG,
                            created_at: firebase.database.ServerValue.TIMESTAMP,
                            updated_at: firebase.database.ServerValue.TIMESTAMP,
                            url: url
                        });
                        // console.log({ key });
                        newNameTextFieldRef.current.value = "";
                        newSVGObjectRef.current.value = "";
                        setFiles([]);
                    }}
                >
                    <div>
                        <div className="p-2 flex">
                            <button
                                type="submit"
                                className="w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Save
                            </button>
                        </div>
                    </div>
                </form>


            )}
        </FirebaseDatabaseMutation>
    </div>;
}

export default Add;