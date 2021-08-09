import React, {createContext, useContext, useState} from "react";

const loginModalContext = createContext({});

export function useLoginModalContext() {
  return useContext(loginModalContext);
}

export function ProvideLoginModalState({children}) {
  const loginModal = useLoginModalProvider();
  return (
    <loginModalContext.Provider value={loginModal}>
      {children}
    </loginModalContext.Provider>
  );
}

function useLoginModalProvider() {
  const [loginModal, setLoginModal] = useState(false);

  return {
    loginModal,
    setLoginModal
  };
}
