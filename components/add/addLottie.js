import { useRef, useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { FirebaseDatabaseMutation } from "@react-firebase/database";
import { useDropzone } from 'react-dropzone';

const AddLottie = props => {
    const newNameTextFieldRef = useRef(null);
    const newSVGObjectRef = useRef(null);
    const [files, setFiles] = useState([]);

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: 'application/json',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => {
                console.log({ file, url: URL.createObjectURL(file), filename: file.name });
                const fileName = file.name.replace('.json', '');
                console.log({ fileName });
                window.filexx = file;
                return Object.assign(file, {
                    preview: URL.createObjectURL(file),
                    fileName: fileName
                })
            }));
        }
    });

    const thumbs = files.map(file => {
        const { preview, fileName, name } = file;
        // console.log({ file, fileName: file.name, preview: file.preview })
        return (
            <div key={name}>
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
                <aside className="h-full flex flex-col justify-center overflow-x-hidden">
                    <div className="mx-auto m-0 w-full">
                        <object ref={newSVGObjectRef} className="uploadSVG mx-auto w-full p-2 mb-4 -mt-4 overflow-y-hidden" id={fileName} data={preview} type="application/json" />
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
        <FirebaseDatabaseMutation type="push" path="lottie">
            {({ runMutation }) => (
                <form
                    onSubmit={async ev => {
                        ev.preventDefault();
                        // console.log({name: newNameTextFieldRef.current.value, svg: newSGVTextFieldRef.current.value});
                        const newName = newNameTextFieldRef.current.value;
                        // window.xsxs = newSVGObjectRef.current;
                        // console.log({ newName });
                        const newJSON = document.querySelector(`#${newName}`).contentDocument.querySelector('pre').textContent;
                        // console.log({ newJSON });

                        await runMutation({
                            name: newName,
                            code: newJSON,
                            created_at: firebase.database.ServerValue.TIMESTAMP,
                            updated_at: firebase.database.ServerValue.TIMESTAMP
                        });

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

export default AddLottie;