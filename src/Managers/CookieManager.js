import Cookies from 'universal-cookie';


const cookies = new Cookies();

export function setAuthCookie(profile) {
  console.log(`Setting auth to ${profile}`);
  cookies.set('auth', profile, {path: "/", maxAge: 86400})
}

export function getAuthCookie() {
  return cookies.get('auth');
}

export function addAuthListener(callback) {
  cookies.addChangeListener(callback);
}

export function removeAuthListener(callback) {
  cookies.removeChangeListener(callback);
}
