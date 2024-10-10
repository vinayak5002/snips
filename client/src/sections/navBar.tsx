import axios from "axios";
import { useState } from "react";
import ClockLoader from "react-spinners/ClockLoader";

const Navbar = () => {
	const [loading, setLoading] = useState(false);

	const reIndexRepo = async () => {
		setLoading(true);
		
		try {
			const response = await axios.post("http://localhost:5000/re-index");
			console.log(response);
		}
		catch (err) {
			console.log(err);
		}

		setLoading(false);
		window.location.reload();
	}

	return (
		<nav className="bg-primary py-4">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-white font-bold text-lg">S</div>
				<ul className="flex space-x-4 items-center">
					<li>
						<a
							className="flex items-center text-white bg-secondary hover:bg-black px-3 py-2 rounded"
							onClick={reIndexRepo}
						>
							Re-index repo
							<div className={`ml-2 ${loading ? "block" : "hidden"}`}>
								<ClockLoader color="#fff" size={15} loading={loading}/>
							</div>
						</a>
					</li>
					<li>
						<a
							href="/select-repo"
							className="flex items-center text-white bg-secondary hover:bg-black px-3 py-2 rounded" // Added flex for consistency
						>
							Change repo
						</a>
					</li>
				</ul>

			</div>
		</nav>
	);
};

export default Navbar;
