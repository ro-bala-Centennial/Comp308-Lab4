import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import CreatePost from "./components/CreatePost";
import PostList from "./components/PostList";
import CreateHelpRequest from "./components/CreateHelpRequest";
import HelpRequestList from "./components/HelpRequestList";

const httpLink = new HttpLink({
  uri: "http://localhost:4002/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Community Engagement</h1>
        <CreatePost />
        <hr />
        <PostList />
        <hr />
        <CreateHelpRequest />
        <hr />
        <HelpRequestList />
      </div>
    </ApolloProvider>
  );
}