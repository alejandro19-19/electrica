import React, { useState } from "react";
export const Context = React.createContext({});

//AVer de donde sacar una var para ese loginState desde login.
//Necesito que al recargar consulte si debe ponerse en el login o no.
export default function ContextProvider({ children }) {
  let data = {
    loginState: true,
    roll: null,
    name: null,
    temporalUser: null,
    dataUser: null,
  };
  const [appState, setAppState] = useState(data);
  return (
    <Context.Provider value={{ appState, setAppState }}>
      {children}
    </Context.Provider>
  );
}