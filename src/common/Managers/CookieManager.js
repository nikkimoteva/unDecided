// import Cookies from 'universal-cookie';
import {Cookies} from 'react-cookie';


let _cookies;
console.log("Executed CookieManager");

function cookies() {
  if (_cookies === undefined) _cookies = new Cookies();
  return _cookies;
}

export function setAuthCookie(profile) {
  console.log(`Setting auth to ${profile}`);
  cookies().set('auth', profile, {path: "/", maxAge: 86400, sameSite: 'lax'});
}

// Shouldn't remove any cookies, because removing the cookie removes the listener
export function removeAuthCookie() {
  console.log("Removing auth cookie");
  cookies().remove('auth', {path: "/"});
}

export function getAuthCookie() {
  return cookies().get('auth');
}

export function addAuthListener(callback) {
  cookies().addChangeListener(callback);
}

export function removeAuthListener(callback) {
  cookies().removeChangeListener(callback);
}
