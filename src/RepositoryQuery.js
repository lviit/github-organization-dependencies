import React from "react";
import styled from "styled-components";

import DependencyQuery from "./DependencyQuery";
import {
  pipe,
  path,
  chain,
  filter,
  pathSatisfies,
  propSatisfies,
  contains,
  map,
  prop,
  gt,
  length,
  __,
} from "ramda";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const Header = styled.div`
  flex: 0 0 100%;

  input {
    padding: 10px 20px;
    font-size: 1.2rem;
    border: 3px solid #000;
    background: transparent;

    &::placeholder {
      font-style: italic;
      font-weight: 300;
    }
  }
`;

const Left = styled.div`
  flex: 0 0 50%;

  ul {
    padding: 50px 0 50px;
  }
`;

const Button = styled.button`
  transition: all 0.3s ease-in-out;
  border: none;
  padding: ${props => (props.active ? "20px" : "10px 20px")};
  font-weight: ${props => (props.active ? "600" : "400")};
  width: 100%;
  text-align: left;
  font-size: 1.2rem;
  background: ${props => (props.active ? "#eae8e3" : "none")};

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

/* TODO: handleRepoChange?
const Repositories = pipe(
  path(["data", "organization", "repositories", "edges"]),
  map(repo => (
    <li key={repo.node.id}>
      <Button onClick={() => this.handleRepoChange(repo.node.name)}>
        {repo.node.name}
      </Button>
    </li>
  ))
);
*/

const filterByKeywords = (keywords, data) =>
  pipe(
    map(prop("node")),
    filter(
      pipe(
        path(["dependencyGraphManifests", "edges"]),
        filter(pathSatisfies(contains("package.json"), ["node", "blobPath"])),
        chain(path(["node", "dependencies", "nodes"])),
        filter(propSatisfies(contains(keywords), 'packageName')),
        length,
        gt(__, 0),
      )
    )
  )(data);

class RepositoryQuery extends React.Component {
  constructor() {
    super();
    this.state = {
      activeRepository: "",
      keywords: ""
    };
  }
  handleRepoChange(name) {
    this.setState({
      activeRepository: name
    });
  }

  search(e) {
    this.setState({ keywords: e.target.value });
  }

  render() {
    const { organization, data } = this.props;
    const { activeRepository, keywords } = this.state;
    const filteredData = keywords
      ? filterByKeywords(keywords, data)
      : map(prop("node"), data);

    return (
      <Container>
        <Header>
          <h2>Repositories</h2>
          <p>{`${organization} has ${
            data.length
          } repositories with dependency data available. Select a repository to view it's dependencies, or filter repositories by package name.`}</p>
          <input
            type="text"
            placeholder="search by package name"
            onChange={e => this.search(e)}
          />
        </Header>
        <Left>
          <ul>
            {/* <Repositories data={data} /> */}
            {filteredData.map(({ name, id }) => (
              <li key={id}>
                <Button
                  active={activeRepository === name}
                  onClick={() => this.handleRepoChange(name)}
                >
                  {name}
                </Button>
              </li>
            ))}
          </ul>
        </Left>
        <DependencyQuery
          repository={activeRepository}
          organization={organization}
        />
      </Container>
    );
  }
}

export default RepositoryQuery;
