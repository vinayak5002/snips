import { ChangeEvent, useEffect, useRef, useState } from "react";
import snipsApi from "../api/snipsApi";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { updateCurrentRepoPath } from "../store/path/pathSlice";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";

const customStyles = {
  content: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#242424',
    color: '#fff',
    padding: '40px', // Adjust padding if needed
    border: 'none',
    borderRadius: '10px',
    width: '80vw', // Set width to 80% of the viewport width
    maxWidth: '600px', // Set a maximum width for larger screens
    height: '30vh', // Set height to 60% of the viewport height
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Overlay color
  },
};


Modal.setAppElement('#root');

type UserRepoPath = {
  path: string;
};

const SelectRepo = () => {
  const [userRepoPathList, setUserRepoPathList] = useState<string[]>([]);
  const [selectPath, setSelectPath] = useState("");
  const folderRef = useRef<HTMLInputElement>(null);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [folderPathWarning, setFolderPathWarning] = useState("");

  const currentRepoPath = useSelector(
    (state: RootState) => state.currentRepoPath.path
  );
  const dispatch = useDispatch<AppDispatch>();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSelectRepo = async () => {
    openModal();
  };

  const handleNewRepo = async () => {

    const folderPath = folderRef.current?.value;
    if (!folderPath) {
      toast.error("Folder path is required!");
      return;
    }

    // TODO: Validate folder path using server
    try {
      const isValid = await snipsApi.checkRepoPath(folderPath);

      console.log("isValid: ", isValid);

      if(!isValid) {
        setFolderPathWarning("Invalid folder path");
        return;
      }

      setFolderPathWarning("");
    }
    catch {
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    // Check if folder path is already saved
    const isPathPresent = userRepoPathList.includes(folderPath);

    console.log("isPathPresent: ", isPathPresent);

    if (isPathPresent) {
      setFolderPathWarning("Folder path already saved");
      return;
    }

    // TODO: Update new Repo path to server
    try {
      const newUserRepoPathList = await snipsApi.addRepoPath(folderPath);

      setUserRepoPathList(newUserRepoPathList);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
      return;
    }


    toast.success("Folder path saved!");
    closeModal();
  }

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectPath(value);
    dispatch(updateCurrentRepoPath(value));
    snipsApi.setCurrentRepo(value);
  };

  const fetchUserRepoPathList = async () => {
    try {
      const data = await snipsApi.getSavedRepos();
      const repoPathList = data.map((e: UserRepoPath) => e.path);
      setUserRepoPathList(repoPathList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserRepoPathList();
  }, []);

  return (
    <div id="select-repo-page">

      <div className="min-h-screen bg-primary text-white flex flex-col items-start justify-start p-5">
        <ToastContainer
          position="bottom-right"
          autoClose={1000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          draggable
          draggablePercent={60}
          rtl={false}
          theme="dark"
        />
        <h1 className="text-4xl font-bold mb-4">Change Repo</h1>
        <h2 className="mb-2">From saved repos: </h2>
        <select
          name="repoPath"
          className="form-control bg-secondary border-gray-700 rounded-md p-2 mb-4 w-auto max-w-4xl"
          value={selectPath}
          onChange={handleChange}
        >
          <option value="">Current: {currentRepoPath}</option>
          {userRepoPathList.map((ele, idx) => (
            <option value={ele} key={idx}>
              {ele}
            </option>
          ))}
        </select>

        <h1 className="text-4xl font-bold mt-4 mb-4">Select new repo</h1>

        <p className="mb-2">Or enter a new repo's path:</p>
        <button
          onClick={handleSelectRepo}
          className="bg-secondary hover:bg-gray-950 text-white font-bold py-2 px-4 rounded"
        >
          Save folder as repo
        </button>

        <Modal
          isOpen={modalIsOpen}
          ariaHideApp={false}
          onRequestClose={closeModal}
          style={customStyles}
          overlayClassName="fixed inset-0 bg-black bg-opacity-75" // Overlay styles
          contentLabel="Select Folder Modal"
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-secondary hover:text-white" // Close button styles
          >
            Close
          </button>

          <div className="flex flex-col justify-between h-full"> {/* Flex container for spacing */}
            <h2 className="text-2xl text-white mb-4">Select a Folder</h2>

            <input
              type="text"
              ref={folderRef}
              placeholder="Enter folder path"
              className="w-full p-2 mb-4 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary" // Input styles
            />

            { folderPathWarning !== "" ?  <p className="text-red-700">Invalid folder path</p> : <></> }

            <button
              onClick={handleNewRepo}
              className="w-full bg-secondary text-white font-semibold py-2 rounded-md transition duration-200" // Save button styles
            >
              Save Path
            </button>
          </div>
        </Modal>


      </div>
    </div>
  );
};

export default SelectRepo;
