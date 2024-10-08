import { useEffect, useState } from "react";
import { Snippet } from "../types/types";
import axios from "axios";
import CodeSnippet from "../components/CodeSnippet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchPage = () => {
  const [snips, setSnips] = useState<Snippet[]>([]);
  const [query, setQuery] = useState<string>("");

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const fetchData = async () => {
    console.log("Fetching data...");
    try {
      const response = await axios.get("http://localhost:5000/search", {
        params: {
          query: query.toLowerCase(),
        },
      });

      // Assuming response.data[0].snippets is the correct path
      console.log(response);

      const snippets: Snippet[] = response.data;

      setSnips(snippets.slice(0, 15));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSbumit = () => {
    console.log("Submitting...");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <ToastContainer
        position="top-right" // Position of the toast
        autoClose={1000} // Auto-close after 3 seconds
        hideProgressBar={true} // Show progress bar
        newestOnTop={true} // New toasts on top
        closeOnClick // Close on click
        draggable // Enable drag and drop
        draggablePercent={60} // Percentage of the toast width the user needs to drag to dismiss
        rtl={false} // Set to true for right-to-left layout
        theme="dark" // Can be "light" or "dark"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          name="query"
          value={query}
          onChange={handleQuery}
        />
        <button onClick={handleSbumit}>Search</button>
      </form>

      <div className="card">
        {snips.map((snip, index) => (
          <div key={index}>
            <h3>Language: {snip.lang}</h3>
            <pre>
              {/* <code>{snip.code}</> */}
              <CodeSnippet snip={snip} />
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
