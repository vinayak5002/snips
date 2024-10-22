import { useEffect, useRef, useState } from "react";
import { Snippet } from "../types/types";
import snipsApi from "../api/snipsApi";
import CodeSnippet from "../components/CodeSnippet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchPage = () => {
  const [snips, setSnips] = useState<Snippet[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const fetchData = async () => {
    if (query === "") return;

    console.log("Fetching data...");
    try {
      const data = await snipsApi.searchSnips(query.toLowerCase())
      console.log(data);
      const snippets: Snippet[] = data;
      setSnips(snippets.slice(0, 5));
      setIsSearched(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting...");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Clean up the event listener
    };
  }, []);

  return (
    <div className="h-auto flex flex-col items-center justify-start"> {/* Added pt-10 for padding top */}
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

      <div className={`flex ${isSearched ? "" : "flex-col mt-60"} justify-center items-center align-middle`}>
        <h1 className={`${isSearched ? "text-4xl" : "text-7xl"} m-6`}>Snips</h1>
        <form
          onSubmit={handleSubmit}
          className={`flex items-center ${isSearched ? 'mt-4 mb-10' : 'h-full justify-center'} mb-5`}
        >
          <div className="flex items-center border rounded w-96 mr-2">
            <input
              ref={inputRef}
              autoComplete="off"
              type="text"
              placeholder="Search..."
              name="query"
              value={query}
              onChange={handleQuery}
              className="p-2 flex-grow border-none rounded-r"
            />
            <span className="p-2">/</span>
          </div>

          <button
            type="submit"
            className="p-2 bg-gray-950 text-white rounded border border-white"
          >
            Search
          </button>
        </form>
        <p className={isSearched ? 'hidden' : 'block'}>Search. Copy. Paste.</p>
      </div>

      {snips.length === 0 ? (
        <p className="text-center"></p> // Center text
      ) : (
        <div className="" style={{ width: "50rem" }}>
          {snips.map((snip, index) => (
            <div key={index} className="mb-4">
              <h3>Language: {snip.lang}</h3>
              <pre>
                <CodeSnippet snip={snip} />
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
