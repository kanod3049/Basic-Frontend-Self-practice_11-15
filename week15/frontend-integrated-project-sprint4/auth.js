import Keycloak from 'keycloak-js';
import { logoutbtn } from './ui.js';

// ================================
// Keycloak setup
// ================================
export const keycloak = new Keycloak({
  url: "https://bscit.sit.kmutt.ac.th/intproj25/ft/keycloak/",
  realm: "itb-ecors",
  clientId: "itb-ecors-or2",   
});

// ================================
// Sign out
// ================================
export function logoutUser() {
  const redirect = window.location.origin + '/intproj25/or2/itb-ecors/';
  const logoutUrl = keycloak.createLogoutUrl({ redirectUri: redirect }) + '&prompt=none';
  window.location.href = logoutUrl;
}

// Bind event listener
logoutbtn.addEventListener("click", logoutUser);