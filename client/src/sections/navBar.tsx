import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import snipsApi from "../api/snipsApi";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { setLastIndexed } from "../store/path/pathSlice";
import { toast } from "react-toastify";



const Navbar = () => {
	const navigator = useNavigate();
	const [loading, setLoading] = useState(false);
	const location = useLocation()
	const isSelectRepoPath = location.pathname === "/select-repo"

	const dispatch = useDispatch<AppDispatch>();

	const reIndexRepo = async () => {
		setLoading(true);

		try {
			console.log("Re-indexing repo...");
			const data = await snipsApi.reindexDocuments();
			dispatch(setLastIndexed(data.lastIndexed));
			console.log("Re-indexed repo: ", data);
		}
		catch (err) {
			console.log(err);
		}

		setLoading(false);
		// window.location.reload();
	}
 
	const checkForUpdates = async () => {
		console.log("Checking for updates")
		try {
			const isUpdated = await snipsApi.checkForUpdates();
			console.log("Updated: ", isUpdated);

			if (isUpdated) {
				toast.warn("Changes detected in repo, Re-indexing in process")
        		await reIndexRepo();
				toast.success("Current repo re-indexed");
			}

		}
		catch (error) {
			console.error("Error checking for updates", error);
		}
	}

	useEffect(() => {
		checkForUpdates();
	}, [])

	return (
		<nav className="bg-primary py-4">
			<div className="container mx-auto flex justify-between items-center">
				<div onClick={() => { navigator("/") }} className="text-white font-bold text-4xl cursor-pointer"><span>S</span></div>
				<ul className="flex space-x-4 items-center">
					<li>
						<a
						 	href="/history"
							className="flex items-center text-white bg-secondary hover:bg-black px-3 py-2 rounded"
						>
						History
						</a>
					</li>
					<li>
						<a
							className="flex items-center text-white bg-secondary hover:bg-black px-3 py-2 rounded"
							onClick={reIndexRepo}
						>
							Re-index repo
							<div className={`ml-2 ${loading ? "block" : "hidden"}`}>
								<TailSpin
									visible={true}
									height="20"
									width="20"
									color="#ffffff"
									ariaLabel="tail-spin-loading"
									radius="1"
									wrapperStyle={{}}
									wrapperClass=""
								/>
							</div>
						</a>
					</li>
					<li>
						{!isSelectRepoPath ? <a
							href="/select-repo"
							className="flex items-center text-white bg-secondary hover:bg-black px-3 py-2 rounded" // Added flex for consistency
						>
							Change repo
						</a> : <a
							href="/"
							className="flex items-center text-white bg-secondary hover:bg-black px-3 py-2 rounded" // Added flex for consistency
						>
							Home
						</a>}
					</li>
				</ul>

			</div>
		</nav>
	);
};

export default Navbar;
