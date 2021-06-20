import React, {useContext, createContext, useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";


// this garbage code brought to you by https://reactrouter.com/web/example/auth-workflow

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext(null);

export function ProvideAuth({children}) {
  const auth = useGoogleAuthProvider();
  const fakeAuth = useMockAuthProvider();
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
function useGoogleAuthProvider() {
  const [user, setUser] = useState(null);

  function signin(credentials) {
    console.log("Signing in with Gauth");
    const profile = credentials.getBasicProfile();
    const id = profile.getId(); // Do not send to your backend! Use an ID token instead.
    const name = profile.getName();
    const image = profile.getImageUrl();
    const email = profile.getEmail(); // This is null if the 'email' scope is not present.
    const info = {id, name, image, email};
    setUser(info); // TODO: Figure out why this doesn't set the user properly. Even doing await doesnt work on it.
    return info;
  }

  function signout() {
    console.log("Signing out Gauth");
    setUser(null);
  }

  return {
    user,
    signin,
    signout
  };
}

function useMockAuthProvider() {
  const [user, setUser] = useState(null);

  function signin(credentials) {
    setUser("FakeUser");
    return {
      name: "FakeUser",
      imageURL: "N/A",
      email: "fakeuser@email.com"
    }
  }

  function signout() {
    setUser(null);
  }

  return {
    user,
    signin,
    signout
  };
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export function PrivateRoute({children, ...rest}) {
  let auth = useAuth();
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
function AuthButton() {
  let history = useHistory();
  let auth = useAuth();

  return auth.user ? (
    <p>
      Welcome!{" "}
      <button
        onClick={() => {
          auth.signout(() => history.push("/"));
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  );
}

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
