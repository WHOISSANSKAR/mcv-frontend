// src/api_call.js

// Base URL of your Flask backend
export const BASE_URL = "http://localhost:5000";

// Optional helper function to call APIs
export async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
}
