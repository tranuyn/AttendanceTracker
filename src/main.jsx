import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { StyleProvider } from "@ant-design/cssinjs";
import { Auth0Provider } from "@auth0/auth0-react";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import store from "./store"; 
import { App as AntdApp } from "antd";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENTID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StyleProvider layer>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#4B93CD",
            fontFamily: "Inter",
          },
        }}
      >
        <Auth0Provider
          domain={domain}
          clientId={clientId}
          authorizationParams={{
            redirect_uri: window.location.origin + "/callback",
          }}
        >
          <Provider store={store}>
            <AntdApp>
              <App />
            </AntdApp>
          </Provider>
        </Auth0Provider>
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>
);
