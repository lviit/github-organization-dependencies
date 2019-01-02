import React from "react";
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { pipe, path, reject, pathSatisfies, isEmpty } from "ramda";

import OrganizationQuery from "./OrganizationQuery";
import RepositoryQuery from "./RepositoryQuery";
import OrganizationDependencies from "./OrganizationDependencies";
import Spinner from "./Spinner";

const query = organization => gql`
  query getDependencies($endCursor: String!) {
    organization(login: ${organization}) {
      repositories(first: 50, after: $endCursor) {
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
                      requirements
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

class Page extends React.Component {
  constructor() {
    super();

    this.state = {
      activeOrganization: ""
    };
  }

  handleOrgChange(e) {
    this.setState({
      activeOrganization: e.target.value
    });
  }

  render() {
    const {
      props: { apolloClient },
      state: { activeOrganization }
    } = this;
    return (
      <ApolloProvider client={apolloClient}>
        <OrganizationQuery
          handleOrgChange={e => this.handleOrgChange(e)}
          organization={activeOrganization}
        />
        {activeOrganization && (
          <Query
            query={query(activeOrganization)}
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
                    return fetchMoreResult
                      ? {
                          organization: {
                            ...fetchMoreResult.organization,
                            repositories: {
                              ...fetchMoreResult.organization.repositories,
                              edges: [
                                ...prev.organization.repositories.edges,
                                ...fetchMoreResult.organization.repositories
                                  .edges
                              ]
                            }
                          }
                        }
                      : prev;
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
                    organization={activeOrganization}
                    data={reposWithDependencies}
                  />
                  <RepositoryQuery
                    organization={activeOrganization}
                    data={reposWithDependencies}
                  />
                </React.Fragment>
              );
            }}
          </Query>
        )}
      </ApolloProvider>
    );
  }
}

export default Page;
