import React from "react";
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { pipe, path, reject, pathSatisfies, isEmpty, uniqBy } from "ramda";
import styled from "styled-components";

import OrganizationQuery from "./OrganizationQuery";
import RepositoryQuery from "./RepositoryQuery";
import OrganizationDependencies from "./OrganizationDependencies";
import Spinner from "./Spinner";

const query = organization => gql`
  query getDependencies($endCursor: String!) {
    organization(login: ${organization}) {
      repositories(first: 20, after: $endCursor) {
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
                      repository {
                        url
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
  }
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  span {
    font-weight: 600;
    margin: 0 5px;
  }
`;

class Page extends React.Component {
  constructor() {
    super();

    this.state = {
      activeOrganization: "",
      prevCursor: ""
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
      state: { activeOrganization, prevCursor }
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
            notifyOnNetworkStatusChange
            variables={{
              endCursor: ""
            }}
          >
            {({ loading, error, data, fetchMore }) => {
              if (error) return <p>Error :(</p>;
              if (!data.organization) return <Spinner />;

              const {
                endCursor,
                hasNextPage
              } = data.organization.repositories.pageInfo;

              if (!loading && hasNextPage && endCursor !== prevCursor) {
                // @TODO: figure out a better way to avoid duplicates that this prevCursor nonsense
                this.setState({
                  prevCursor: endCursor
                });
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
              }

              const filterReposWithoutDependencies = pipe(
                path(["organization", "repositories", "edges"]),
                reject(
                  pathSatisfies(isEmpty, [
                    "node",
                    "dependencyGraphManifests",
                    "edges"
                  ])
                )
                //uniqBy(path(['node, name']))
              );

              const reposWithDependencies = filterReposWithoutDependencies(
                data
              );

              return (
                <React.Fragment>
                  <Loader>
                    {"Loaded "}{" "}
                    <span>{data.organization.repositories.edges.length}</span>
                    {" repositories"}
                    {loading && <Spinner small={true} />}
                    {!hasNextPage && "...done!"}
                  </Loader>
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
