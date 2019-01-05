import React from "react";
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

import OrganizationQuery from "./OrganizationQuery";
import RepositoryQuery from "./RepositoryQuery";
import OrganizationDependencies from "./OrganizationDependencies";
import Spinner from "./Spinner";
import { filterReposWithoutDependencies } from "./fp";

const query = organization => gql`
  query getDependencies($endCursor: String!) {
    organization(login: ${organization}) {
      repositories(first: 20, after: $endCursor) {
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
      fetchMoreTriggered: false
    };
  }

  handleOrgChange(e) {
    this.setState({
      activeOrganization: e.target.value
    });
  }

  initFetchMore(fetchMore, endCursor) {
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
                    ...fetchMoreResult.organization.repositories.edges
                  ]
                }
              }
            }
          : prev;
      }
    })
      .then(result => {
        const {
          endCursor,
          hasNextPage
        } = result.data.organization.repositories.pageInfo;

        hasNextPage && this.initFetchMore(fetchMore, endCursor);
      })
      .catch(e => {
        // If error just try to fetch again
        !e.message.includes("403") && this.initFetchMore(fetchMore, endCursor);
      });
  }

  render() {
    const {
      props: { apolloClient },
      state: { activeOrganization, fetchMoreTriggered }
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
                pageInfo: { endCursor, hasNextPage },
                totalCount,
                edges
              } = data.organization.repositories;

              if (!fetchMoreTriggered) {
                this.setState({ fetchMoreTriggered: true });
                this.initFetchMore(fetchMore, endCursor);
              }

              const reposWithDependencies = filterReposWithoutDependencies(
                data
              );

              return (
                <React.Fragment>
                  <Loader>
                    {"Loaded "} <span>{edges.length}</span>
                    {" repositories of total"}
                    <span>{totalCount}</span>
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
