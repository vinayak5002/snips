
const Navbar = () => {
	return (
		<nav className="bg-primary py-4 flex justify-between">
			<div className="container mx-auto flex justify-between">
				<div className="text-white font-bold text-lg">S</div>
				<ul className="flex space-x-4">
					<li>
						<a href="/contact" className="text-white bg-secondary hover:bg-black px-3 py-2 rounded">Re-index repo</a>
					</li>
					
					<li>
						<a href="/contact" className="text-white bg-secondary hover:bg-black px-3 py-2 rounded">Change repo</a>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
