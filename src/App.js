import React, {createContext, useState} from 'react';
import "./common/Button.css";
import {responsiveFontSizes} from "@material-ui/core";
import {createMuiTheme, StylesProvider, ThemeProvider} from "@material-ui/core/styles";
import {ProvideGoogleAuth} from "./common/Auth";
import BaseRouter from "./BaseRouter";
import {ProvideLoginModalState, useLoginModalProvider} from "./common/LoginModalProvider";


export default function App() {
  let theme = createMuiTheme({
    // See https://material-ui.com/customization/theming/

    // color palette
    palette: {
      //   type: "dark",
      //   divider: "rgba(255, 255, 255, 0.12)",
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
        <ProvideGoogleAuth> {/*Provides useAuth hook so every component can check for authentication*/}
          <ProvideLoginModalState>
            <BaseRouter/>
          </ProvideLoginModalState>
        </ProvideGoogleAuth>
      </StylesProvider>
    </ThemeProvider>
  );
}
