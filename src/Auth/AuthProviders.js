import {validateGoogleUser} from "../Endpoints";
import { useGoogleAuth, useGoogleUser } from 'react-gapi-auth2';

// this garbage code brought to you by https://reactrouter.com/web/example/auth-workflow
export const MockAuthProvider = {
  isAuthenticated: false,
  signin(cb) {
    MockAuthProvider.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    MockAuthProvider.isAuthenticated = false;
    setTimeout(cb, 100);
  }
}

export const GoogleAuthProvider = {
  isAuthenticated: false,
  signin(user) {
    // The `GoogleAuth` object described here:
    // https://developers.google.com/identity/sign-in/web/reference#authentication
    const { googleAuth } = useGoogleAuth();
    // The `GoogleUser` object described here:
    // https://developers.google.com/identity/sign-in/web/reference#users
    const { currentUser } = useGoogleUser();

    const profile = user.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    const id_token = user.getAuthResponse().id_token
    return validateGoogleUser(id_token)
      .then(res => {
        if (res.status === 200) GoogleAuthProvider.isAuthenticated = true;
      })
      .catch(error => console.log(error));
  },
  signOut() {
    // The `GoogleAuth` object described here:
    // https://developers.google.com/identity/sign-in/web/reference#authentication
    const { googleAuth } = useGoogleAuth();
    // The `GoogleUser` object described here:
    // https://developers.google.com/identity/sign-in/web/reference#users
    const { currentUser } = useGoogleUser();

    googleAuth.signOut().then(function () {
      GoogleAuthProvider.isAuthenticated = false;
      console.log('User signed out.');
    });
  }
}
