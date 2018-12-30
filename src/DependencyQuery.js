import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import { pipe, path, chain, filter, map, prop, contains, pathSatisfies } from "ramda";
import Spinner from './Spinner';

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

const Dependencies = pipe(
  prop("data"),
  path(["repository", "dependencyGraphManifests", "edges"]),
  filter(pathSatisfies(contains('package.json'), ['node', 'blobPath'])),
  chain(path(["node", "dependencies", "nodes"])),
  map(dep => (
    <li>
      {dep.packageName} {dep.requirements}
    </li>
  ))
);

const DependencyQuery = ({ repository, organization }) => (
  <Query query={query(repository, organization)}>
    {({ loading, error, data }) => {
      if (loading) return <Spinner />;
      if (error) return <p>Error :(</p>;

      return (
        <ul>
          <h2>dependencies for {repository}</h2>
          <Dependencies data={data} />
        </ul>
      );
    }}
  </Query>
);

export default DependencyQuery;
