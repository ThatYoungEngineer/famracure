import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./Routes/Routes";
import "./index.css";
import { Provider } from "react-redux";
import store from "./Redux/Store.jsx";
import "./i18n";
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PrimeReactProvider value={{ unstyled: false }}>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  </Provider>
  // </React.StrictMode>
);
