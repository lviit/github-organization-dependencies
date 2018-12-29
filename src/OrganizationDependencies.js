import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { USER_NAME } from "./constants";

const query = organization => gql`
  {
    organization(login: ${organization}) {
      repositories(first: 70) {
        edges {
          node {
            dependencyGraphManifests {
              edges {
                node {
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

const OrganizationDependencies = ({ organization }) => (
  <Query query={query(organization)}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      console.log(data);
      return (
        <div>
          <h2>organization dependencies</h2>
          {data.organization.repositories.edges.map(repo =>
            repo.node.dependencyGraphManifests.edges.map(manifest =>
              manifest.node.dependencies.nodes.map(dependency => (
                <div>{dependency.packageName}</div>
              ))
            )
          )}
        </div>
      );
    }}
  </Query>
);

export default OrganizationDependencies;
