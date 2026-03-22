import { useEffect, useState } from "react";
import ResumeDisplay from "../components/ResumeDisplay.jsx";

// DeidentifiedView and reviewers can submit reviews

// Props:
// - applications: array of application objects
// - selectedId: optional id to pre-select
// - onSaveReview: function(applicationId, review) -> called when reviewer saves
export default function DeidentifiedView({
  applications = [],
  selectedId: propSelectedId = null,
  onSaveReview,
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");

  const [selectedId, setSelectedId] = useState(
    propSelectedId ?? applications[0]?.id ?? null,
  );

  useEffect(() => {
    if (propSelectedId !== null && propSelectedId !== undefined)
      setSelectedId(propSelectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propSelectedId]);

  const application = applications.find((a) => a.id === selectedId) ?? null;

  const [technical, setTechnical] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [cultureFit, setCultureFit] = useState(3);
  const [overall, setOverall] = useState(3);
  const [comments, setComments] = useState("");
  const [reviewerName, setReviewerName] = useState("");

  useEffect(() => {
    // reset reviewer inputs when application changes
    setTechnical(3);
    setCommunication(3);
    setCultureFit(3);
    setOverall(3);
    setComments("");
    setReviewerName("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function handleSave() {
    if (!application) return;

    // Require reviewer name
    if (!reviewerName.trim()) {
      alert("Please enter your name before submitting the review.");
      return;
    }

    const review = {
      reviewerName: reviewerName.trim(),
      technical: Number(technical),
      communication: Number(communication),
      cultureFit: Number(cultureFit),
      overall: Number(overall),
      comments: String(comments),
      reviewedAt: new Date().toISOString(),
    };

    if (typeof onSaveReview === "function") {
      onSaveReview(application.id, review);
      // eslint-disable-next-line no-alert
      alert("Review saved successfully!");
      // Reset form
      setTechnical(3);
      setCommunication(3);
      setCultureFit(3);
      setOverall(3);
      setComments("");
      setReviewerName("");
    } else {
      // fallback: store review on the application object in-memory
      // (not persisted) — this keeps the view usable even if parent
      // hasn't wired a save handler yet.
      application.reviews = application.reviews ?? [];
      application.reviews.push(review);
      // force a visual acknowledgement
      // eslint-disable-next-line no-alert
      alert("Review added (not persisted). Provide onSaveReview to persist.");
    }
  }

  if (!isAuthenticated) {
    return (
      <div>
        <p>This page is only for reviewers</p>
        <input
          type="password"
          value={enteredPassword}
          onChange={(e) => setEnteredPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button
          onClick={() => {
            if (enteredPassword === "Reviewer") {
              setIsAuthenticated(true);
            } else {
              alert("Incorrect password");
            }
          }}
        >
          Submit
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Deidentified View</h2>

      {applications.length === 0 && <p>No applications available to review.</p>}

      {applications.length > 0 && (
        <div style={{ marginBottom: "12px" }}>
          <label>
            Select Application:
            <select
              value={selectedId ?? ""}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              style={{ marginLeft: "8px" }}
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {`#${app.id} `}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {application && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          <h3>Application #{application.id}</h3>

          <p>
            <strong>Major:</strong> {application.major}
          </p>
          <p>
            <strong>Minor:</strong> {application.minor}
          </p>

          <h4>Short Answer</h4>
          <p>{application.shortAnswer}</p>

          <ResumeDisplay resume={application.resume} />
          {/* this is now left out because I added a new component ResumeDisplay that displays 
          the resume items on both DeidentidiedView and IdentifiedView, so I removed the old 
          resume display code  */}

          <h4 style={{ marginTop: "16px" }}>Scoring</h4>

          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="reviewerName">
              Reviewer Name: <span style={{ color: "red" }}>*</span>
            </label>
            <br />
            <input
              id="reviewerName"
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 80px",
              gap: "8px",
              alignItems: "center",
              maxWidth: "520px",
            }}
          >
            <label>Technical Skills (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={technical}
              onChange={(e) => setTechnical(e.target.value)}
            />

            <label>Communication Skills (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={communication}
              onChange={(e) => setCommunication(e.target.value)}
            />

            <label>Culture Fit (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={cultureFit}
              onChange={(e) => setCultureFit(e.target.value)}
            />

            <label>Overall (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={overall}
              onChange={(e) => setOverall(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "12px" }}>
            <label htmlFor="reviewComments">Comments (optional)</label>
            <br />
            <textarea
              id="reviewComments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              style={{ width: "100%", minHeight: "80px" }}
            />
          </div>

          <div style={{ marginTop: "12px" }}>
            <button onClick={handleSave}>Save Review</button>
          </div>
        </div>
      )}
    </div>
  );
}
