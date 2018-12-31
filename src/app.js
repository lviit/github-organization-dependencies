import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-boost";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { createGlobalStyle } from "styled-components";
import { Normalize } from "styled-normalize";
import styled from "styled-components";
import { pipe, path, reject, pathSatisfies, isEmpty } from "ramda";

import OrganizationQuery from "./OrganizationQuery";
import RepositoryQuery from "./RepositoryQuery";
import OrganizationDependencies from "./OrganizationDependencies";
import { API_URI, API_REQ_HEADERS, ORGANIZATION } from "./constants";
import Spinner from "./Spinner";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=IBM+Plex+Mono:300, 500i, 600');

  body {
    font-family: 'IBM Plex Mono', monospace;
    background: #f2f0ea;
  }

  h1 {
    font-size: 3.5rem;
  }

  h2 {
    font-size: 2.5rem;
  }

  h1, h2, h3 {
    font-weight: 600;
  }

  p,
  li {
    font-weight: 300;
    line-height: 1.4;
    list-style-type: none;
  }

  ul {
    margin: 0;
    padding: 0;
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
  query getDependencies($endCursor: String!) {
    organization(login: ${organization}) {
      repositories(first: 50, after: $endCursor) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            name
            dependencyGraphManifests {
              edges {
                node {
                  blobPath
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
          <h1>Github organization dependencies</h1>
          <p>
            Find out what packages your organization is using. Currently only
            looks for dependencies in package.json for repositories where the
            depency graph is enabled. Find out how to enable the graph for your
            repository{" "}
            <a
              target="_blank"
              href="https://help.github.com/articles/listing-the-packages-that-a-repository-depends-on/#enabling-the-dependency-graph-for-a-private-repository"
            >
              here.
            </a>
          </p>

          <OrganizationQuery
            handleOrgChange={e => this.handleOrgChange(e)}
            organization={this.state.activeOrganization}
          />
          <Query
            query={query(this.state.activeOrganization)}
            //notifyOnNetworkStatusChange
            variables={{
              endCursor: ""
            }}
          >
            {({ loading, error, data, fetchMore }) => {
              if (loading) return <Spinner />;
              if (error) return <p>Error :(</p>;

              const {
                endCursor,
                hasNextPage
              } = data.organization.repositories.pageInfo;

              hasNextPage &&
                fetchMore({
                  variables: {
                    endCursor
                  },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    return fetchMoreResult ? {
                      organization: {
                        ...fetchMoreResult.organization,
                        repositories: {
                          ...fetchMoreResult.organization.repositories,
                          edges: [
                            ...prev.organization.repositories.edges,
                            ...fetchMoreResult.organization.repositories.edges
                          ]
                        }
                      }
                    } : prev;
                  }
                });

              const filterReposWithoutDependencies = pipe(
                path(["organization", "repositories", "edges"]),
                reject(
                  pathSatisfies(isEmpty, [
                    "node",
                    "dependencyGraphManifests",
                    "edges"
                  ])
                )
              );
              const reposWithDependencies = filterReposWithoutDependencies(
                data
              );

              //console.log(data);
              return (
                <React.Fragment>
                  <OrganizationDependencies
                    organization={this.state.activeOrganization}
                    data={reposWithDependencies}
                  />
                  <RepositoryQuery
                    organization={this.state.activeOrganization}
                    data={reposWithDependencies}
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
