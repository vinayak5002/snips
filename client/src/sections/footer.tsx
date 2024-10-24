import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Footer = () => {

	const currentRepoPath = useSelector(
		(state: RootState) => state.currentRepoPath.path,
	)

	const lastIndexed = useSelector(
		(state: RootState) => state.currentRepoPath.lastIndexed,
	);

	function timeAgo(dateString: string): string {
		const now = new Date();
		const pastDate = new Date(dateString);
		const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

		console.log("Now: ", now);

		console.log("lastIndexed: ", lastIndexed);
		console.log("dateString: ", dateString);
		console.log("Past date: ", pastDate);

		console.log("Last indexed x seconds ago: ", seconds);

		let interval: number;

		interval = Math.floor(seconds / 31536000); // years
		if (interval > 1) return `${interval} years ago`;
		if (interval === 1) return `1 year ago`;

		interval = Math.floor(seconds / 2592000); // months
		if (interval > 1) return `${interval} months ago`;
		if (interval === 1) return `1 month ago`;

		interval = Math.floor(seconds / 86400); // days
		if (interval > 1) return `${interval} days ago`;
		if (interval === 1) return `1 day ago`;

		interval = Math.floor(seconds / 3600); // hours
		if (interval > 1) return `${interval} hours ago`;
		if (interval === 1) return `1 hour ago`;

		interval = Math.floor(seconds / 60); // minutes
		if (interval > 1) return `${interval} mins ago`;
		if (interval === 1) return `1 min ago`;

		return seconds < 5 ? "few seconds ago" : `${seconds} seconds ago`;
	}


	return (
		<nav className="bg-secondary py-4 flex justify-between">
			<div className="container mx-auto flex justify-between">
				<div className="text-white font-bold text-lg"></div>
				<ul className="flex space-x-4">
					<li>
						<a className="text-white bg-secondary hover:bg-black px-3 py-2 rounded">Current repo: {currentRepoPath}</a>
						<a className="text-white bg-secondary hover:bg-black px-3 py-2 rounded">Last indexed: {timeAgo(lastIndexed)}</a>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default Footer;