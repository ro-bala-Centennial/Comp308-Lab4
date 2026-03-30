import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import Signup from "./components/Signup";
import Login from "./components/Login";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4001/graphql",
  }),
  cache: new InMemoryCache(),
});

export default function App() {
  const logout = () => {
    localStorage.removeItem("token");
    alert("Logged out");
  };

  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Authentication</h1>
        <Login />
        <hr />
        <Signup />
        <hr />
        <button onClick={logout}>Logout</button>
      </div>
    </ApolloProvider>
  );
}