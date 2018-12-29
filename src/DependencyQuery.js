import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

const item = styled.li``;

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

const includeManifest = manifest => manifest.node.blobPath.includes('package.json');

const DependencyQuery = ({ repository, organization }) => (
  <Query query={query(repository, organization)}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      console.log(data);

      return (
        <ul>
          <h2>dependencies for {repository}</h2>
          {data.repository.dependencyGraphManifests.edges.map(manifest =>
            includeManifest(manifest) && manifest.node.dependencies.nodes.map(dependency => (
              <li>{dependency.packageName} {dependency.requirements}</li>
            ))
          )}
        </ul>
      );
    }}
  </Query>
);

export default DependencyQuery;
