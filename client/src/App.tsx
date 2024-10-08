import { StrictMode, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import SearchPage from "./Pages/SearchPage";
import { store, AppDispatch } from "./store/store";
import { useDispatch } from "react-redux";
import { updateCurrentRepoPath } from "./store/path/pathSlice";
import SelectRepoPage from "./Pages/SelectRepoPage";


function RepoHandler() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const fetchCurrentRepo = async () => {
    try {
      const response = await axios.get("http://localhost:5000/current-repo");
      const currentRepoPath: string = response.data; 

      
      console.log("Current repo path in repoHandeller: ", response);
      
      if (currentRepoPath === "") {
        console.log("Current repo path not set");
        navigate("/select-repo");
      } else {
        dispatch(updateCurrentRepoPath(currentRepoPath));
        navigate("/search");
      }
    } catch (error) {
      console.error("Error fetching current repo:", error);
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
