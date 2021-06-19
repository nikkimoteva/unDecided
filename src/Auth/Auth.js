import React, { useContext, createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import {MockAuthProvider as fakeAuth} from "./AuthProviders";

// This example has 3 pages: a public page, a protected
// page, and a login screen. In order to see the protected
// page, you must first login. Pretty standard stuff.
//
// First, visit the public page. Then, visit the protected
// page. You're not yet logged in, so you are redirected
// to the login page. After you login, you are redirected
// back to the protected page.
//
// Notice the URL change each time. If you click the back
// button at this point, would you expect to go back to the
// login page? No! You're already logged in. Try it out,
// and you'll see you go back to the page you visited
// just *before* logging in, the public page.

// export default function AuthExample() {
//   return (
//     <ProvideAuth>
//       <Router>
//         <div>
//           <AuthButton />
//
//           <ul>
//             <li>
//               <Link to="/public">Public Page</Link>
//             </li>
//             <li>
//               <Link to="/protected">Protected Page</Link>
//             </li>
//           </ul>
//
//           <Switch>
//             <Route path="/public">
//               <PublicPage />
//             </Route>
//             <Route path="/login">
//               <LoginPage />
//             </Route>
//             <PrivateRoute path="/protected">
//               <ProtectedPage />
//             </PrivateRoute>
//           </Switch>
//         </div>
//       </Router>
//     </ProvideAuth>
//   );
// }

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext(); // TODO add auth provider here

// Makes the useAuth "hook" available to all children of this component
export function ProvideAuth({ children }) {
  const auth = useFakeAuth();
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
function useFakeAuth() {
  const [user, setUser] = useState(null);

  function signin(cb) {
    return fakeAuth.signin(() => {
      setUser("user");
    });
  }

  function signout(cb) {
    return fakeAuth.signout(() => {
      setUser(null);
    });
  }

  return {
    user,
    signin,
    signout
  };
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
export function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect // TODO: May want to redirect to actual login page, but not necessary since they can't hit this route through the UI
            to={{
              pathname: "/",
              state: { from: location }
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
