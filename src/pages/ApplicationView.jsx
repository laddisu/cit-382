// AKA NewView from lab 5
// I replaced NewView with ApplicationView to match my new naming for the views.

import { useState } from "react";

function ApplicationView({ onSave }) {
  /* This is what I started with but co pilot suggested to use 
  formData object to make it easier since I plan to pass the 
  entire application to other views. Why not pass one object 
  instead of 10.*/
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");

  // The const below is a live editable state of the form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    classStanding: "",
    major: "",
    minor: "",
    gpa: "",
    resume: {
      workExperience: [],
      projects: [],
      skills: [],
    },
    ShortAnswer: "",
  });

  // Resume form state for current input
  const [currentResumeEntry, setCurrentResumeEntry] = useState({
    category: "workExperience",
    workExperience: {
      company: "",
      position: "",
      duration: "",
      description: "",
    },
    projects: { title: "", description: "" },
    skills: { name: "" },
  });

  // Helper to update any field
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Update current resume entry field
  const updateResumeEntryField = (field, value) => {
    const category = currentResumeEntry.category;
    setCurrentResumeEntry((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  // Add resume entry to the appropriate category
  const addResumeEntry = () => {
    const category = currentResumeEntry.category;
    const entry = currentResumeEntry[category];

    // Validate that at least one field is filled
    const hasContent = Object.values(entry).some((val) => val.trim() !== "");
    if (!hasContent) {
      alert("Please fill in at least one field.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      resume: {
        ...prev.resume,
        [category]: [...prev.resume[category], entry],
      },
    }));

    // Reset current entry
    setCurrentResumeEntry((prev) => ({
      ...prev,
      [category]: {
        workExperience: {
          company: "",
          position: "",
          duration: "",
          description: "",
        },
        projects: { title: "", description: "" },
        skills: { name: "" },
      }[category],
    }));
  };

  // Remove resume entry from a category
  const removeResumeEntry = (category, index) => {
    setFormData((prev) => ({
      ...prev,
      resume: {
        ...prev.resume,
        [category]: prev.resume[category].filter((_, i) => i !== index),
      },
    }));
  };

  // Handle full submission
  const handleSubmit = () => {
    // Get next ID from localStorage
    const nextId = parseInt(localStorage.getItem("nextId") || "1", 10);

    //This const below is different from the one above because this is referring to the
    // final, saved submission.
    const application = {
      id: nextId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      classStanding: formData.classStanding,
      major: formData.major,
      minor: formData.minor,
      resume: formData.resume,
      shortAnswer: formData.shortAnswer,
      submittedAt: new Date().toISOString(),
    };

    // Save to parent
    onSave(application);

    // Increment ID for next submission
    localStorage.setItem("nextId", nextId + 1);

    // Clear form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      classStanding: "",
      major: "",
      minor: "",
      gpa: "",
      resume: {
        workExperience: [],
        projects: [],
        skills: [],
      },
      shortAnswer: "",
    });

    setCurrentResumeEntry({
      category: "workExperience",
      workExperience: {
        company: "",
        position: "",
        duration: "",
        description: "",
      },
      projects: { title: "", description: "", technologies: "" },
      skills: { name: "" },
    });
  };
  return (
    <div>
      {/* Internship description */}
      <h2>About the Organization</h2>
      <p>
        The BridgeForward Initiative offers exciting internship opportunities
        for students to gain real-world experience and contribute to meaningful
        projects.
      </p>

      <h2>APPLY NOW!</h2>
      <p>
        Please submit the application before 11:59 p.m. on March 26, 2026 in
        order to be considered for the internship.
      </p>

      {/* PERSONAL INFO */}
      <h3>Personal Information</h3>

      <label>
        First Name:
        <input
          value={formData.firstName}
          onChange={(e) => updateField("firstName", e.target.value)}
        />
      </label>

      <br />

      <label>
        Last Name:
        <input
          value={formData.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
        />
      </label>

      <br />

      <label>
        Email:
        <input
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
      </label>

      {/* ACADEMIC INFO */}
      <h3>Academic Information</h3>
      <label>
        Class Standing:
        <input
          value={formData.classStanding}
          onChange={(e) => updateField("classStanding", e.target.value)}
        />
      </label>
      <br />

      <label>
        Major:
        <input
          value={formData.major}
          onChange={(e) => updateField("major", e.target.value)}
        />
      </label>
      <br />

      <label>
        Minor:
        <input
          value={formData.minor}
          onChange={(e) => updateField("minor", e.target.value)}
        />
      </label>

      {/* RESUME INFO */}
      <h3>Resume Information</h3>
      <i>
        Please add information about your work experience, projects, and skills.
      </i>
      <br />
      <br />

      {/* Resume Category Selector */}
      <div style={{ marginBottom: "16px" }}>
        <label htmlFor="resumeCategory">
          Select Category:
          <select
            id="resumeCategory"
            value={currentResumeEntry.category}
            onChange={(e) =>
              setCurrentResumeEntry((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
            style={{ marginLeft: "8px" }}
          >
            <option value="workExperience">Work Experience</option>
            <option value="projects">Projects</option>
            <option value="skills">Skills/Certifications</option>
          </select>
        </label>
      </div>

      {/* Work Experience Section */}
      {currentResumeEntry.category === "workExperience" && (
        <fieldset
          style={{
            marginBottom: "16px",
            padding: "12px",
            border: "1px solid #ccc",
          }}
        >
          <legend>Work Experience</legend>
          <label>
            Company:
            <input
              type="text"
              value={currentResumeEntry.workExperience.company}
              onChange={(e) =>
                updateResumeEntryField("company", e.target.value)
              }
              style={{ marginLeft: "8px", width: "200px" }}
            />
          </label>
          <br />
          <label>
            Position:
            <input
              type="text"
              value={currentResumeEntry.workExperience.position}
              onChange={(e) =>
                updateResumeEntryField("position", e.target.value)
              }
              style={{ marginLeft: "8px", width: "200px" }}
            />
          </label>
          <br />
          <label>
            Duration:
            <input
              type="text"
              value={currentResumeEntry.workExperience.duration}
              onChange={(e) =>
                updateResumeEntryField("duration", e.target.value)
              }
              placeholder="Example: Jan 2023 - present"
              style={{ marginLeft: "8px", width: "200px" }}
            />
          </label>
          <br />
          <label>
            Description:
            <textarea
              value={currentResumeEntry.workExperience.description}
              onChange={(e) =>
                updateResumeEntryField("description", e.target.value)
              }
              style={{ marginLeft: "8px", width: "100%", minHeight: "60px" }}
            />
          </label>
          <br />
          <button onClick={addResumeEntry} style={{ marginTop: "8px" }}>
            Add Work Experience
          </button>
        </fieldset>
      )}

      {/* Projects Section */}
      {currentResumeEntry.category === "projects" && (
        <fieldset
          style={{
            marginBottom: "16px",
            padding: "12px",
            border: "1px solid #ccc",
          }}
        >
          <legend>Projects</legend>
          <label>
            Title:
            <input
              type="text"
              value={currentResumeEntry.projects.title}
              onChange={(e) => updateResumeEntryField("title", e.target.value)}
              style={{ marginLeft: "8px", width: "200px" }}
            />
          </label>
          <br />
          <label>
            Description:
            <textarea
              value={currentResumeEntry.projects.description}
              onChange={(e) =>
                updateResumeEntryField("description", e.target.value)
              }
              style={{ marginLeft: "8px", width: "100%", minHeight: "60px" }}
            />
          </label>
          <br />
          <button onClick={addResumeEntry} style={{ marginTop: "8px" }}>
            Add Project
          </button>
        </fieldset>
      )}

      {/* Skills/Certifications Section */}
      {currentResumeEntry.category === "skills" && (
        <fieldset
          style={{
            marginBottom: "16px",
            padding: "12px",
            border: "1px solid #ccc",
          }}
        >
          <legend>Skills/Certifications</legend>
          <label>
            Skill/Certification:
            <input
              type="text"
              value={currentResumeEntry.skills.name}
              onChange={(e) => updateResumeEntryField("name", e.target.value)}
              placeholder="Example: React, Adobe Suites, etc."
              style={{ marginLeft: "8px", width: "300px" }}
            />
          </label>
          <br />
          <button onClick={addResumeEntry} style={{ marginTop: "8px" }}>
            Add Skill
          </button>
        </fieldset>
      )}

      {/* Display added resume entries */}
      <div style={{ marginTop: "20px" }}>
        {Object.entries(formData.resume).map(
          ([category, entries]) =>
            entries.length > 0 && (
              <div key={category} style={{ marginBottom: "20px" }}>
                <h4>
                  {category === "workExperience"
                    ? "Work Experience"
                    : category === "projects"
                      ? "Projects"
                      : "Skills/Certifications"}
                </h4>
                {category === "skills" ? (
                  <ul>
                    {entries.map((entry, idx) => (
                      <li key={idx} style={{ marginBottom: "6px" }}>
                        {entry.name}
                        <button
                          onClick={() => removeResumeEntry(category, idx)}
                          style={{ marginLeft: "8px" }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  entries.map((entry, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        marginBottom: "8px",
                        borderRadius: "4px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      {category === "workExperience" && (
                        <>
                          <p>
                            <strong>{entry.position}</strong> at {entry.company}
                          </p>
                          <p>
                            <em>{entry.duration}</em>
                          </p>
                          <p>{entry.description}</p>
                        </>
                      )}
                      {category === "projects" && (
                        <>
                          <p>
                            <strong>{entry.title}</strong>
                          </p>
                          <p>{entry.description}</p>
                        </>
                      )}
                      <button onClick={() => removeResumeEntry(category, idx)}>
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            ),
        )}
      </div>

      {/* SHORT ANSWER */}
      <h3>Short Answer</h3>
      <label htmlFor="shortAnswer">
        Why are you applying to this particular internship rather than any other
        internships?
      </label>
      <br />
      <textarea
        id="shortAnswer"
        value={formData.shortAnswer}
        onChange={(e) => updateField("shortAnswer", e.target.value)}
        style={{ width: "100%", minHeight: "80px" }}
      />

      {/* SUBMIT */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSubmit}>Submit Application</button>
      </div>
    </div>
  );
}

export default ApplicationView;
