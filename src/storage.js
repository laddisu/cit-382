// storage.js

const APPLICATIONS_KEY = "applications";
const NEXT_ID_KEY = "capstone-lia-nextId";

//Load all applications
export function getApplications() {
  try {
    const json = localStorage.getItem(APPLICATIONS_KEY);
    if (!json) return [];
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

//Save all applications
export function saveApplication(app) {
  try {
    const apps = getApplications();
    apps.push(app);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
  } catch {
    //ignore storage errors
  }
}

//Get next ID for new application
export function getNextId() {
  const raw = localStorage.getItem(NEXT_ID_KEY);
  return raw ? parseInt(raw, 10) : 1;
}

//Increment next ID after saving an application
export function incrementNextId() {
  const next = getNextId() + 1;
  localStorage.setItem(NEXT_ID_KEY, next);
}

// Optional: delete an application
export function deleteApplication(id) {
  const apps = getApplications().filter((app) => app.id !== id);
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
}

// Save a review for an application
export function saveReview(applicationId, review) {
  try {
    const apps = getApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (!app) return; // application not found
    app.reviews = app.reviews ?? [];
    app.reviews.push(review);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
  } catch {
    // ignore storage errors
  }
}

// Get all reviews for an application
export function getReviews(applicationId) {
  try {
    const apps = getApplications();
    const app = apps.find((a) => a.id === applicationId);
    return app?.reviews ?? [];
  } catch {
    return [];
  }
}
