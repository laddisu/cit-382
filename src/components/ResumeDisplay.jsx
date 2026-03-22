export default function ResumeDisplay({ resume }) {
  return (
    <>
      <h4>Resume</h4>
      {resume && Object.values(resume).some((arr) => arr.length > 0) ? (
        <div>
          {resume.workExperience && resume.workExperience.length > 0 && (
            <div style={{ marginBottom: "12px" }}>
              <h5>Work Experience</h5>
              {resume.workExperience.map((exp, i) => (
                <div
                  key={i}
                  style={{ marginLeft: "12px", marginBottom: "8px" }}
                >
                  <p>
                    <strong>{exp.position}</strong> at {exp.company}
                  </p>
                  <p>
                    <em>{exp.duration}</em>
                  </p>
                  <p>{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          {resume.projects && resume.projects.length > 0 && (
            <div style={{ marginBottom: "12px" }}>
              <h5>Projects</h5>
              {resume.projects.map((proj, i) => (
                <div
                  key={i}
                  style={{ marginLeft: "12px", marginBottom: "8px" }}
                >
                  <p>
                    <strong>{proj.title}</strong>
                  </p>
                  <p>{proj.description}</p>
                  <p>
                    <em>Skills: {proj.technologies}</em>
                  </p>
                </div>
              ))}
            </div>
          )}
          {resume.skills && resume.skills.length > 0 && (
            <div style={{ marginBottom: "12px" }}>
              <h5>Skills/Certifications</h5>
              <ul style={{ marginLeft: "24px" }}>
                {resume.skills.map((skill, i) => (
                  <li key={i}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>No resume items provided.</p>
      )}
    </>
  );
}
