import { StrictMode, useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import { store, AppDispatch } from "./store/store";
import { useDispatch } from "react-redux";
import { updateCurrentRepoPath } from "./store/path/pathSlice";
import SelectRepoPage from "./pages/SelectRepoPage";
import Navbar from "./sections/navBar";
import Footer from "./sections/footer";
import snipsApi from "./api/snipsApi";


function RepoHandler() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const fetchCurrentRepo = async () => {
    try {
      const data = await snipsApi.getCurrentRepo();
      const currentRepoPath: string = data.path;

      console.log("Current repo path in repoHandeller: ", data);

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
        <div className="flex flex-col min-h-screen"> {/* Flex container with full height */}
          <BrowserRouter>
            <Navbar />
            <main className="flex-grow"> {/* Main content area */}
              <Routes>
                <Route path="/" element={<RepoHandler />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/select-repo" element={<SelectRepoPage />} />
              </Routes>
            </main>
            <Footer /> {/* Footer stays at the bottom */}
          </BrowserRouter>
        </div>
      </StrictMode>
    </Provider>
  );
}

export default App;
