import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { StyleProvider } from "@ant-design/cssinjs";
import { Auth0Provider } from "@auth0/auth0-react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENTID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StyleProvider layer>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin + "/timesheet",
        }}
      >
        <App />
      </Auth0Provider>
    </StyleProvider>
  </StrictMode>
);
