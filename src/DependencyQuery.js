import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const query = (repository, organization) => gql`
  {
    repository(owner: "${organization}", name: "${repository}") {
      dependencyGraphManifests {
        edges {
          cursor
          node {
            blobPath
            dependencies {
              edges {
                node {
                  packageName
                }
              }
              nodes {
                packageName
                repository {
                  name
                }
                requirements
              }
              totalCount
            }
            dependenciesCount
            exceedsMaxSize
            filename
            id
            parseable
            repository {
              name
            }
          }
        }
        nodes {
          blobPath
          dependencies {
            edges {
              node {
                packageName
              }
            }
            nodes {
              packageName
              repository {
                name
              }
              requirements
            }
            totalCount
          }
          dependenciesCount
          exceedsMaxSize
          filename
          id
          parseable
          repository {
            name
          }
        }
        totalCount
      }
    }
  }
`;

const schemaQuery = gql`
  {
    __type(name: "DependencyGraphDependencyEdge") {
      name
      kind
      description
      fields {
        name
      }
    }
  }
`;

const DependencyQuery = ({repository, organization}) => (
  <Query query={query(repository, organization)}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.repository.dependencyGraphManifests.edges.map(manifest =>
        manifest.node.dependencies.nodes.map(dependency => (
          <div>{dependency.packageName}</div>
        ))
      );
    }}
  </Query>
);

export default DependencyQuery;
