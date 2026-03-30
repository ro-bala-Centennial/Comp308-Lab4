import React from "react";
import { ApolloProvider } from "@apollo/client/react";
import App from "./App";
import client from "./apollo";

export default function RemoteApp() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}