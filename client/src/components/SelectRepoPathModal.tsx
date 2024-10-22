import { useRef, useState } from "react";
import { toast } from "react-toastify";

const SelectRepoPathModal: React.FC = () => {

    const [modalIsOpen, setIsOpen] = useState(false);
    const folderRef = useRef<HTMLInputElement>(null);
    const subtitle = useRef<any>(null);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);


    return (
        <>
            <h2 ref={subtitle}>Select a Folder</h2>
            <button onClick={closeModal}>Close</button>
            <input type="text" ref={folderRef} placeholder="Enter folder path" />
            <button
                onClick={async () => {
                    const folderPath = folderRef.current?.value;
                    if (!folderPath) {
                        toast.error("Folder path is required!");
                        return;
                    }

                    // TODO: Validate folder path using the server

                    toast.success("Folder path saved!");
                    closeModal();
                }}
            >
                Save Path
            </button>
        </>
    );

}

export default SelectRepoPathModal;
