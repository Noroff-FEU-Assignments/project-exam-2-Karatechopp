export function getProfileName() {
  return localStorage.getItem("ns_name");
}

export function getProfileEmail() {
  return localStorage.getItem("ns_email");
}

export function getToken() {
  return JSON.parse(localStorage.getItem("ns_token"));
}

export function clearStorageLogout() {
  localStorage.clear("ns_token");
  localStorage.clear("ns_name");
  localStorage.clear("ns_email");
}
