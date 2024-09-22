import { useEffect, useState } from "react";
import { Snippet } from "../types/types";
import axios from "axios";

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

      setSnips(snippets);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSbumit = () => {
    console.log("Submitting...");
    fetchData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        name="query"
        value={query}
        onChange={handleQuery}
      />
      <button onClick={handleSbumit}>Search</button>

      <div className="card">
        {snips.map((snip, index) => (
          <div key={index}>
            <h3>Language: {snip.lang}</h3>
            <pre>
              <code>{snip.code}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
