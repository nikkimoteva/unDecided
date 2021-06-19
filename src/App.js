import React, {useState} from 'react';
import "./Button.css"
import {Modal, responsiveFontSizes} from "@material-ui/core";
import {createMuiTheme, StylesProvider, ThemeProvider} from "@material-ui/core/styles";
import {ProvideAuth} from "./Auth/Auth";
import { GApiProvider } from 'react-gapi-auth2';
import BaseRouter from "./BaseRouter";


export default function App() {
  const clientConfig = {
    client_id: '296036318202-uraiim5u0cf5qpqhujl3aaj1kniuu41e.apps.googleusercontent.com',
    // cookie_policy: 'single_host_origin',
    // scope: 'https://www.googleapis.com/auth/<POLICY>'
  };

  let theme = createMuiTheme({
    // See https://material-ui.com/customization/theming/

    // color palette
    palette: {
      type: "dark",
      divider: "rgba(255, 255, 255, 0.12)",
    },
    // fonts and font sizes
    typography: {},
    //default component props, like spacing, ripple effect, etc
    props: {},
    // all other component styles
    overrides: {}
  });

  theme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={theme}> {/*Provides default global theme*/}
      <StylesProvider injectFirst> {/*Makes it so we can override default styles*/}
        <GApiProvider clientConfig={clientConfig}>  {/*Provides hooks for getting google api stuff*/}
          <ProvideAuth> {/*Provides useAuth hook so every component can check for authentication*/}
            <BaseRouter/>
          </ProvideAuth>
        </GApiProvider>
      </StylesProvider>
    </ThemeProvider>
  )
}
