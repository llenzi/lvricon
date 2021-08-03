import { useRef, useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { FirebaseDatabaseMutation } from "@react-firebase/database";
import { useDropzone } from 'react-dropzone';

const Add = props => {
    const newNameTextFieldRef = useRef(null);
    const newSGVTextFieldRef = useRef(null);
    const [files, setFiles] = useState([]);

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: 'image/svg+xml',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => {
                console.log({file, url: URL.createObjectURL(file)});
                return Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })
            }));
            console.log({ files })
        }
    });

    const thumbs = files.map(file => (
        <div key={file.name}><div><img src={file.preview} /></div></div>
    ));

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return <FirebaseDatabaseMutation type="push" path="icons">
        {({ runMutation }) => (
            <form
                className="add flex flex-col bg-gray-50 rounded m-4 align-middle justify-between border border-gray-300 text-center w-2/12 h-60"
                onSubmit={async ev => {
                    ev.preventDefault();
                    // console.log({name: newNameTextFieldRef.current.value, svg: newSGVTextFieldRef.current.value});
                    const newName = newNameTextFieldRef.current.value;
                    let newSVG = newSGVTextFieldRef.current.value;
                    newSVG = newSVG.replaceAll('path-1', `path-${newName}`);
                    console.log({ newSVG });
                    // await runMutation({
                    //     name: newName,
                    //     code: newSVG,
                    //     created_at: firebase.database.ServerValue.TIMESTAMP,
                    //     updated_at: firebase.database.ServerValue.TIMESTAMP
                    // });
                    // newNameTextFieldRef.current.value = "";
                    // newSGVTextFieldRef.current.value = "";
                }}
            >
                <div>
                    <div className="p-0">
                        <div className="flex">
                            <div className="w-full">
                                {/* <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label> */}
                                <input
                                    id="name"
                                    className="p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border-gray-300 text-center"
                                    label="New SVG Name"
                                    aria-label="New SVG Name"
                                    placeholder="Name"
                                    ref={newNameTextFieldRef} />
                                <div {...getRootProps({ className: 'dropzone mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md' })}>
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                </div>
                                <aside>
                                    {thumbs}
                                </aside>
                                {/* <label htmlFor="svg" className="block text-sm font-medium text-gray-700">SVG</label> */}
                                {/* <textarea 
                                    id="svg"
                                    ref={newSGVTextFieldRef}
                                    rows="3"
                                    className="p-2 mt-2 block w-full"
                                    aria-label="New SVG HTML"
                                    placeholder="HTML"
                                /> */}

                            </div>
                        </div>
                    </div>
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
    </FirebaseDatabaseMutation>;
}

export default Add;