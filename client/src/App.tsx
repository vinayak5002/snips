import { StrictMode, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import { store } from "./store/store";
import { useDispatch } from "react-redux";
import { set } from "./store/path/pathSlice";
import SelectRepoPage from "./pages/SelectRepoPage";

// Create a new component for handling the repo fetching and navigation logic
function RepoHandler() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchCurrentRepo = async () => {
    try {
      const response = await axios.get("http://localhost:5000/current-repo");
      console.log(response);

      const currentRepoPath = response.data;

      dispatch(set(currentRepoPath));

      console.log("Current repo path: ", currentRepoPath);

      if (currentRepoPath === "") {
        console.log("Current repo path not set");
        navigate("/select-repo");
      } else {
        navigate("/search");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCurrentRepo();
  }, [dispatch]);

  return null; 
}

function App() {
  return (
    <Provider store={store}>
      <StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RepoHandler />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/select-repo" element={<SelectRepoPage />} />
          </Routes>
        </BrowserRouter>
      </StrictMode>
    </Provider>
  );
}

export default App;
