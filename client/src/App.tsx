import { useEffect, useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";
import axios from "axios";

type Snippet = {
  lang: string;
  code: string;
};

function App() {
  const [snippetList, setSnippetList] = useState<Snippet[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/repos/0");
      // Assuming response.data[0].snippets is the correct path
      console.log(response);

      const snippets: Snippet[] = response.data;
      
      setSnippetList(snippets);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="card">
        {snippetList.map((snip, index) => (
          <div key={index}>
            <h3>Language: {snip.lang}</h3>
            {/* Render code snippet with proper Markdown formatting */}
            <ReactMarkdown>
              {`~~~${snip.lang}\n${snip.code}\n~~~`}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
