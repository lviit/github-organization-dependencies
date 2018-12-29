import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";

import DependencyQuery from "./DependencyQuery";
import OrganizationQuery from "./OrganizationQuery";
import RepositoryQuery from "./RepositoryQuery";
import { API_URI, API_REQ_HEADERS } from './constants';

const client = new ApolloClient({
  uri: API_URI,
  headers: API_REQ_HEADERS
});

const App = () => (
  <ApolloProvider client={client}>
    <h2>Github repo dependencies</h2>
    <OrganizationQuery />
    <RepositoryQuery />
    <DependencyQuery />
  </ApolloProvider>
);

render(<App />, document.getElementById("app"));
