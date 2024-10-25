import { ChangeEvent, useState } from "react";
import { UserRepoPath } from "../../types/types";
import { useSelector, useDispatch} from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { updateCurrentRepoPath } from "../../store/path/pathSlice";
import snipsApi from "../../api/snipsApi";

type ChangeRepoProps = {
  pathList: UserRepoPath[];
};

const ChangeRepo = ( { pathList }: ChangeRepoProps ) => {
  const [selectPath, setSelectPath] = useState("");
  
  const currentRepoPath = useSelector(
    (state: RootState) => state.currentRepoPath.path
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectPath(value);

    dispatch(updateCurrentRepoPath(value));

    snipsApi.setCurrentRepo(value);
  };


	return (
		<>
			<h1 className="text-4xl font-bold mb-4">Change Repo</h1>
			<h2 className="mb-2">From saved repos: </h2>
			<select
				name="repoPath"
				className="form-control bg-secondary border-gray-700 rounded-md p-2 mb-4 w-auto max-w-4xl"
				value={selectPath}
				onChange={handleChange}
			>
				<option value="">Current: {currentRepoPath}</option>
				{pathList.map((ele, idx) => (
					<option value={ele.path} key={idx}>
						{ele.path}
					</option>
				))}
			</select>
		</>
	);

}

export default ChangeRepo;