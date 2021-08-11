import React, {createContext, useContext, useState} from "react";
import {Route, Redirect} from "react-router-dom";
import {addAuthListener, getAuthCookie, setAuthCookie} from "../Common/Managers/CookieManager";
import {validateGoogleUser} from "../Common/Managers/EndpointManager";
import {validateUser} from "../Common/Managers/EndpointManager";
import {addUser} from "../Common/Managers/EndpointManager";

const authContext = createContext(undefined);

export function ProvideAuth({children}) {
  const auth = useAuthProvider();
  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return useContext(authContext);
}

function useAuthProvider() {
  const [user, setUser] = useState(getAuthCookie());
  addAuthListener(listenerCallback);

  function signup(name, email, password) { 
    console.log("Sign up");
    return addUser(name, email, password)
    .then ((res) => {
      if (res.status === 400 || res.data.error) {
        return res;
      } else {
        console.log("stored info in the backend");
        setAuthCookie({name, email});
        setUser({name, email});
        return res;
      }
    })
    .catch(err => {
      console.error(err);
    });
  }

  function signin(email, password) {
    console.log("Sign in");
    return validateUser(email, password)
    .then ((usr) => {
      if (usr.status === 200) {
        console.log("password has been validated");
        setAuthCookie({name: usr.data.name, email: usr.data.email});
        setUser({name, email});
      }
      return usr;
    })
    .catch(err => {
      console.error(err);
    });

  }

  function signinGoogle(credentials) {
    console.log("Signing in with Gauth");
    const id_token = credentials.getAuthResponse().id_token;
    return validateGoogleUser(id_token)
      .then(() => {
        console.log("Stored info in backend");
        const profile = credentials.getBasicProfile();
        const id = profile.getId();
        const name = profile.getName();
        const email = profile.getEmail();
        setAuthCookie({id, name, email});
        setUser({id, name, email});
        return Promise.resolve();
      })
      .catch(err => {
        console.error(err);
        alert("Unable to signin. Check your credentials.");
      });
  }

  function signout() {
    console.log("Signing out");
    setAuthCookie("");
  }

  function listenerCallback(new_cookie) {
    setUser(new_cookie.value);
  }

  return {
    user,
    signup,
    signin,
    signinGoogle,
    signout,
  };
}


export function PrivateRoute({children, ...rest}) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({location}) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: {from: location}
            }}
          />
        )
      }
    />
  );
}
