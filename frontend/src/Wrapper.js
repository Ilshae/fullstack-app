import React, { useState } from "react";
import { IntlProvider } from "react-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import English from "./languages/en.json";
import Polish from "./languages/pl.json";

export const Context = React.createContext();
const queryClient = new QueryClient();

const Wrapper = props => {
  const [locale, setLocale] = useState(getInitialLocal);
  const [messages, setMessages] = useState(getInitialMessages(locale));

  const selectLang = newLocale => {
    localStorage.setItem("locale", newLocale);
    setLocale(newLocale);
    if (newLocale === "pl-PL") setMessages(Polish);
    else setMessages(English);
  };

  return (
    <Context.Provider value={{ locale, selectLang }}>
      <IntlProvider
        defaultLocale="pl-PL"
        locale={locale}
        messages={messages}
      >
        <QueryClientProvider client={queryClient}>
          {props.children}
          {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        </QueryClientProvider>
      </IntlProvider>
    </Context.Provider>
  );
};

const getInitialLocal = () => {
  const local = navigator.language;
  let lang;
  if (local === "pl-PL") {
    lang = Polish;
  } else {
    lang = English;
  }
  return localStorage.getItem("locale") || lang;
};

const getInitialMessages = locale => {
  if (locale === "en-US") return English;
  return Polish;
};

export default Wrapper;
