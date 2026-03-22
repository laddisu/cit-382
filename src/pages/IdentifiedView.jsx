import { useState } from "react";
import ResumeDisplay from "../components/ResumeDisplay.jsx";

// Applications with identifying info
function IdentifiedView({ applications }) {
  // Filter to only show applications that have been reviewed

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const reviewedApplications = applications.filter(
    (app) => app.reviews && app.reviews.length > 0,
  );
  if (!isAuthenticated) {
    return (
      <div>
        <p>
          This page can only be accessed by reviewers who finished their
          reviews.
        </p>
        <input
          type="password"
          value={enteredPassword}
          onChange={(e) => setEnteredPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button
          onClick={() => {
            if (enteredPassword === "Completed") {
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
      <h2>Identified Applications</h2>

      {reviewedApplications.length === 0 && (
        <p>No reviewed applications yet.</p>
      )}

      {reviewedApplications.map((app) => (
        <div
          key={app.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Application #{app.id}</h3>

          <p>
            <strong>Name:</strong> {app.firstName} {app.lastName}
          </p>
          <p>
            <strong>Email:</strong> {app.email}
          </p>
          <p>
            <strong>Class Standing:</strong> {app.classStanding}
          </p>
          <p>
            <strong>Major:</strong> {app.major}
          </p>
          <p>
            <strong>Minor:</strong> {app.minor}
          </p>

          <ResumeDisplay resume={app.resume} />

          <h4>Short Answer</h4>
          <p>{app.shortAnswer}</p>

          <h4>Reviews</h4>
          {app.reviews && app.reviews.length > 0 ? (
            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "10px",
                borderRadius: "4px",
              }}
            >
              {app.reviews.map((review, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: "10px",
                    paddingBottom: "10px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <p>
                    <strong>Reviewer:</strong>{" "}
                    {review.reviewerName || "Anonymous"}
                  </p>
                  <p>
                    <strong>Technical:</strong> {review.technical} |{" "}
                    <strong>Communication:</strong> {review.communication} |{" "}
                    <strong>Culture Fit:</strong> {review.cultureFit} |{" "}
                    <strong>Overall:</strong> {review.overall}
                  </p>
                  {review.comments && (
                    <p>
                      <strong>Comments:</strong> {review.comments}
                    </p>
                  )}
                  <p style={{ fontSize: "0.8rem", color: "#666" }}>
                    Reviewed: {new Date(review.reviewedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet.</p>
          )}

          <p style={{ fontSize: "0.8rem", color: "#666" }}>
            Submitted: {new Date(app.submittedAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default IdentifiedView;
