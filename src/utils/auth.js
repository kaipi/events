import jwt from "jwt-decode";

export function checkJwtToken(token) {
  if (token === null || token == undefined) {
    return false;
  }
  if (jwt(token).exp < Date.now() / 1000) {
    return false;
  }
  return true;
}
