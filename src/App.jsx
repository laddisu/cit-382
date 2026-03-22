import { useEffect, useState } from "react";
import IdentifiedView from "./pages/IdentifiedView.jsx";
import ApplicationView from "./pages/ApplicationView.jsx";
import DeidentifiedView from "./pages/DeidentifiedView.jsx";

import {
  getApplications,
  saveApplication,
  deleteApplication,
  incrementNextId,
  saveReview,
} from "./storage.js";

function App() {
  const [applications, setApplications] = useState([]);
  const [view, setView] = useState("loading"); // "loading" | "identified" | "application" | "deidentified"
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // Load applications on startup
  useEffect(() => {
    const saved = getApplications();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApplications(saved);
    setView("application");
    setIsLoading(false);
  }, []);

  // Save whenever applications change (but not on first load)
  useEffect(() => {
    if (isLoading) return;
    // storage.js handles saving inside saveApplication, so nothing needed here
  }, [applications, isLoading]);

  // Update document title
  useEffect(() => {
    document.title = `Internship Applications: ${applications.length}`;
  }, [applications.length]);

  // Handle saving a new application
  function handleSave(app) {
    saveApplication(app);
    incrementNextId();

    // Refresh local state
    setApplications(getApplications());

    // Alert user
    alert("Application submitted successfully!");
  }

  // Remove an application
  function handleRemove(id) {
    deleteApplication(id);
    setApplications(getApplications());
    if (selectedId === id) setSelectedId(null);
  }

  // Save a review
  function handleSaveReview(applicationId, review) {
    saveReview(applicationId, review);
    // Refresh applications to reflect the new review
    setApplications(getApplications());
  }

  // Clear all applications
  function clearAll() {
    localStorage.clear();
    setApplications([]);
    setSelectedId(null);
  }

  return (
    <div style={{ padding: "16px" }}>
      <h1>BridgeForward Initiative Internship</h1>

      {/* Navigation */}
      <button onClick={() => setView("application")}>Application</button>
      <button onClick={() => setView("deidentified")}>Deidentified</button>
      <button onClick={() => setView("identified")}>Identified</button>

      <hr />

      {/* Views */}
      {view === "identified" && (
        <IdentifiedView
          applications={applications}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRemove={handleRemove}
        />
      )}

      {view === "application" && <ApplicationView onSave={handleSave} />}

      {view === "deidentified" && (
        <DeidentifiedView
          applications={applications}
          selectedId={selectedId}
          onSaveReview={handleSaveReview}
        />
      )}

      <button onClick={clearAll}>Clear All</button>
    </div>
  );
}

export default App;
