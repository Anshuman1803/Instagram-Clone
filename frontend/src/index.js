import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import ReduxStore from "./Redux/ReduxStore";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <Provider store={ReduxStore}>
        <App />
      </Provider>
    </BrowserRouter>
  // {/* </React.StrictMode> */}
);
reportWebVitals();
