import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";

import OrganizationQuery from "./OrganizationQuery";
import RepositoryQuery from "./RepositoryQuery";
import { API_URI, API_REQ_HEADERS, ORGANIZATION } from "./constants";

const client = new ApolloClient({
  uri: API_URI,
  headers: API_REQ_HEADERS
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      activeOrganization: ORGANIZATION,
    };
  }

  handleOrgChange(e) {
    this.setState({
      activeOrganization: e.target.value
    });
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <h2>Github repo dependencies</h2>
        <OrganizationQuery handleOrgChange={e => this.handleOrgChange(e)} />
        <RepositoryQuery organization={this.state.activeOrganization} />
      </ApolloProvider>
    );
  }
}

render(<App />, document.getElementById("app"));
