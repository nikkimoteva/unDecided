import React, {createContext, useContext, useState} from "react";
import {Route, Redirect} from "react-router-dom";
import {
  addAuthListener,
  getAuthCookie,
  setAuthCookie
} from "../Common/Managers/CookieManager";
import {validateGoogleUser} from "../Common/Managers/EndpointManager";
import {validateUser} from "../Common/Managers/EndpointManager";
import {addUser} from "../Common/Managers/EndpointManager";

// Source: https://reactrouter.com/web/example/auth-workflow

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
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

// Authentication state holding the auth provider
function useAuthProvider() {
  const [user, setUser] = useState(getAuthCookie());  // when users refresh, immediately loads auth cookie
  addAuthListener(listenerCallback);

  function signup(name, email, password) { 
    console.log("Sign up");
    return addUser(name, email, password)
    .then ((res) => {
      //login
      if (res.status === 400 || res.data.error) {
        return res;
      } else {
        console.log("stored info in the backend");
        setAuthCookie({name, email});  // theoretically, this should setUser as well, since we added a listener to it
        setUser({name, email});
        return res;
      }
    })
    .catch(err => {
      console.error(err);
      // alert("Unable to signup. Please try again");
    });
  }

  function signin(email, password) {
    console.log("Sign in");
    return validateUser(email, password)
    .then ((usr) => {
      //login
      console.log(usr);
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
        const id = profile.getId(); // Do not send to your backend! Use an ID token instead.
        const name = profile.getName();
        const email = profile.getEmail(); // This is null if the 'email' scope is not present.
        setAuthCookie({id, name, email});  // theoretically, this should setUser as well, since we added a listener to it
        setUser({id, name, email});
        return Promise.resolve();
      })
      .catch(err => {
        console.error(err);
        alert("Unable to signin. Check your credentials.");
      });
  }

  function signout() {
    console.log("Signing out with Gauth");
    setAuthCookie("");
  }

  function listenerCallback(new_cookie) {
    console.log(`New Cookie Value: ${new_cookie.value}`);
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

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export function PrivateRoute({children, ...rest}) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({location}) =>
        auth.user ? (
          children
        ) : (
          <Redirect // TODO: May want to redirect to actual login page, but not necessary since they can't hit this route through the UI
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

/*
function LoginPage() {
  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = () => {
    auth.signin(() => {
      history.replace(from);
    });
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  );
}
*/