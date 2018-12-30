import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { createGlobalStyle } from "styled-components";
import { Normalize } from "styled-normalize";
import styled from "styled-components";
import { pipe, path, map, uniq, prop, chain, reject, pathSatisfies, isEmpty } from "ramda";

import OrganizationQuery from "./OrganizationQuery";
import RepositoryQuery from "./RepositoryQuery";
import OrganizationDependencies from "./OrganizationDependencies";
import { API_URI, API_REQ_HEADERS, ORGANIZATION } from "./constants";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=IBM+Plex+Mono');

  body {
    font-family: 'IBM Plex Mono', monospace;
    background: #FAF7E9;
  }

  h1 {
    text-align: center;
    font-size: 3rem;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 1100px;
`;

const client = new ApolloClient({
  uri: API_URI,
  headers: API_REQ_HEADERS
});

const query = organization => gql`
  {
    organization(login: ${organization}) {
      repositories(first: 50) {
        edges {
          node {
            id
            name
            dependencyGraphManifests {
              edges {
                node {
                  dependencies {
                    nodes {
                      packageName
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      activeOrganization: ORGANIZATION
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
        <Container>
          <Normalize />
          <GlobalStyle />
          <h1>Github repo dependencies</h1>
          <OrganizationQuery handleOrgChange={e => this.handleOrgChange(e)} />
          <Query query={query(this.state.activeOrganization)}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              const filterReposWithoutDependencies = pipe(
                path(["organization", "repositories", "edges"]),
                reject(pathSatisfies(isEmpty, ['node', 'dependencyGraphManifests', 'edges'])),
              );
              const reposWithDependencies = filterReposWithoutDependencies(data);
              
              return (
                <React.Fragment>
                  <OrganizationDependencies
                    organization={this.state.activeOrganization} data={reposWithDependencies}
                  />
                  <RepositoryQuery
                    organization={this.state.activeOrganization} data={reposWithDependencies}
                  />
                </React.Fragment>
              );
            }}
          </Query>
        </Container>
      </ApolloProvider>
    );
  }
}

render(<App />, document.getElementById("app"));
