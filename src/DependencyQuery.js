import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import {
  pipe,
  path,
  chain,
  filter,
  map,
  prop,
  contains,
  pathSatisfies
} from "ramda";
import Spinner from "./Spinner";

const Container = styled.div`
  background: #eae8e3;
  flex: 0 0 50%;
  padding: 50px;

  h3 {
    margin-top: 0;
    font-size: 2rem;
  }
`;

const TitleWithArrow = styled.h3`
  display: flex;
  align-items: center;

  span {
    margin-right: 10px;
  }
`;

const query = (repository, organization) => gql`
  {
    repository(owner: "${organization}", name: "${repository}") {
      dependencyGraphManifests {
        edges {
          cursor
          node {
            blobPath
            dependencies {
              nodes {
                packageName
                repository {
                  name
                }
                requirements
              }
              totalCount
            }
          }
        }
      }
    }
  }
`;

const Dependencies = pipe(
  path(["data", "repository", "dependencyGraphManifests", "edges"]),
  filter(pathSatisfies(contains("package.json"), ["node", "blobPath"])),
  chain(path(["node", "dependencies", "nodes"])),
  map(dep => (
    <li>
      {dep.packageName} {dep.requirements}
    </li>
  ))
);

const DependencyQuery = ({ repository, organization }) => (
  <Container>
    {repository ? (
      <Query query={query(repository, organization)}>
        {({ loading, error, data }) => {
          if (loading) return <Spinner />;
          if (error) return <p>Error :(</p>;

          return (
            <ul>
              <h3>{repository}</h3>
              <Dependencies data={data} />
            </ul>
          );
        }}
      </Query>
    ) : (
      <TitleWithArrow>
        <span>←</span>
        Select a repository from the list
      </TitleWithArrow>
    )}
  </Container>
);

export default DependencyQuery;
