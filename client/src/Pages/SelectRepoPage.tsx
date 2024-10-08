import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { updateCurrentRepoPath } from "../store/path/pathSlice";

type UserRepoPath = {
  path: string;
};

const SelectRepo = () => {
  const [userRepoPathList, setUserRepoPathList] = useState<string[]>([]);

  const [selectPath, setSelectPath] = useState("");

  const currentRepoPath = useSelector(
    (state: RootState) => state.currentRepoPath.path
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const {value} = event.target;

    setSelectPath(value);

    dispatch(updateCurrentRepoPath(value));
  }

  const fetchUserRepoPathList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/saved-repos");
      const data = response.data;

      const repoPathList = data.map((e: UserRepoPath) => e.path);
      console.log("Saved repo paths list: ", repoPathList);

      setUserRepoPathList(repoPathList);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserRepoPathList();
  }, []);

  return (
    <div>
      <h1>Snips</h1>
      <h2>Select Repo</h2>

      <h3>
        Current repo: {currentRepoPath === "" ? "Not Set" : currentRepoPath}
      </h3>

      <select
        name="repoPath"
        className="form-control"
        value={selectPath}
        onChange={handleChange}
      >
        <option value="">--Select From your saved repos--</option>
        {userRepoPathList.map((ele, idx) => (
          <option value={ele} key={idx}>
            {ele}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectRepo;
