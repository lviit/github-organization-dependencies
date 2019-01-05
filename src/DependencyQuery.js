import React from "react";
import styled from "styled-components";
import {
  pipe,
  path,
  chain,
  filter,
  map,
  contains,
  pathSatisfies,
  prop,
  tap
} from "ramda";

const Container = styled.div`
  background: #eae8e3;
  flex: 0 0 50%;
  padding: 50px;

  h3 {
    margin-top: 0;
    font-size: 2rem;
  }

  li {
    font-size: 1.1rem;
    margin: 5px 0;
  }
`;

const TitleWithArrow = styled.h3`
  display: flex;
  align-items: center;

  span {
    margin-right: 10px;
  }
`;

const Dependencies = pipe(
  prop("data"),
  filter(pathSatisfies(contains("package.json"), ["node", "blobPath"])),
  chain(path(["node", "dependencies", "nodes"])),
  map((dep, i) => (
    <li key={i}>
      <a target="_blank" href={dep.repository && dep.repository.url}>
        {dep.packageName} {dep.requirements}
      </a>
    </li>
  ))
);

const DependencyQuery = ({ data }) => (
  <Container>
    {data ? (
      <ul>
        <h3>{data.node.name}</h3>
        <Dependencies data={data.node.dependencyGraphManifests.edges} />
      </ul>
    ) : (
      <TitleWithArrow>
        <span>←</span>
        Select a repository from the list
      </TitleWithArrow>
    )}
  </Container>
);

export default DependencyQuery;
