import React from "react";
import { ApolloProvider } from "@apollo/client/react";
import App from "./App";
import client from "./apollo";

export default function Bootstrap() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}