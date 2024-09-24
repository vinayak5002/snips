import { ChangeEvent, useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { set } from "../store/path/pathSlice";

type UserRepoPath = {
  path: string;
};

const SelectRepo = () => {
  const [userRepoPathList, setUserRepoPathList] = useState<string[]>([]);

  const [selectPath, setSelectPath] = useState("");

  const currentRepoPath = useSelector(
    (state: RootState) => state.currentRepoPath.path
  );
  const dispatch = useDispatch();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const {value} = event.target;

    setSelectPath(value);

    dispatch(set(value));
  }

  const fetchUserRepoPathList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/saved-repos");
      const data = response.data;

      const repoPathList = data.map((e: UserRepoPath) => e.path);
      console.log(repoPathList);

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

      {/* add a dropdown */}
      <select
        name="gender"
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
