import { useRef, useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { FirebaseDatabaseMutation } from "@react-firebase/database";
import { useDropzone } from 'react-dropzone';
import Notification from "@/components/popup/notification";
import uploadFileRequest from "@/components/axios";
import axios from 'axios';

const handleSend = async (data) => {
    // Send the data to the server in JSON format.
    const body = new FormData();
    body.append("file", data);

    // API endpoint where we send form data.
    const endpoint = '/api/form'

    // Form the request for sending data to the server.
    const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
            'Content-Type': 'application/json',
        },
        // Body of the request is the JSON data we created above.
        body
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    const result = await response.json()
    console.log({ result });
}

const Add = props => {
    const newNameTextFieldRef = useRef(null);
    // const newSGVTextFieldRef = useRef(null);
    const newSVGObjectRef = useRef(null);
    const [files, setFiles] = useState([]);

    const [showPopUp, setShowPopUp] = useState(false);
    const [error, setError] = useState([]);

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: 'image/png, image/jpeg, image/svg+xml',
        onDrop: acceptedFiles => {

            // const { name, file } = file;
            // console.log({ formData });
            // uploadFileRequest(formData, (progress) => {
            //     console.log(`Current progress:`, Math.round((progress.loaded * 100) / progress.total))
            // })

            console.log({ acceptedFiles, primo: acceptedFiles[0] });

            handleSend(acceptedFiles[0]);

            // axios
            //     .post("/api/upload_svg", formData)
            //     .then((res) => console.log(res))
            //     .catch((err) => console.log(err));

            // setFiles(acceptedFiles.map(file => {
            //     console.log({ file, url: URL.createObjectURL(file), filename: file.name });
            //     const fileName = file.name.replace('.svg', '');
            //     console.log({ fileName });
            //     return Object.assign(file, {
            //         preview: URL.createObjectURL(file),
            //         fileName: fileName
            //     })
            // }));
        }
    });

    const thumbs = files.map(file => {
        const { preview, fileName, name } = file;
        console.log({ error });
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
                </div>
                <aside className="h-full flex flex-col justify-center">
                    <div className="mx-auto my-2">
                        <object ref={newSVGObjectRef} className="uploadSVG mx-auto" id={fileName} data={preview} type="image/svg+xml" />
                    </div>
                </aside>
            </div>
        )
    });

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    console.log({ filessss: files })

    return <div
        className="add flex flex-col bg-gray-50 rounded m-4 align-middle justify-between border border-gray-300 text-center w-2/12 h-auto"
    >
        {!thumbs.length && <div {...getRootProps({ className: 'dropzone m-1 flex flex-col justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-full content-center' })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
        </div>}
        {thumbs && <>{thumbs}</>}
        <FirebaseDatabaseMutation type="push" path="icons">
            {({ runMutation }) => (
                <form
                    onSubmit={async ev => {
                        ev.preventDefault();
                        // console.log({name: newNameTextFieldRef.current.value, svg: newSGVTextFieldRef.current.value});
                        const newName = newNameTextFieldRef.current.value;
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
                            updated_at: firebase.database.ServerValue.TIMESTAMP
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