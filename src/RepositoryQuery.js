import React from "react";
import styled from "styled-components";

import DependencyQuery from "./DependencyQuery";
import { REPO } from "./constants";

const Container = styled.div`
  display: flex;
  margin-top: 5rem;
`;

const Left = styled.div`
  flex: 0 0 50%;
`;

const Button = styled.button`
  transition: all 0.3s ease-in-out;
  border: none;
  padding: ${props => (props.active ? "20px 10px": "10px")};
  font-weight: ${props => (props.active ? "600": "400")}; 
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

class RepositoryQuery extends React.Component {
  constructor() {
    super();
    this.state = {
      activeRepository: REPO
    };
  }
  handleRepoChange(name) {
    this.setState({
      activeRepository: name
    });
  }

  render() {
    const { organization, data } = this.props;
    const { activeRepository } = this.state;
    console.log(data);
    return (
      <Container>
        <Left>
          <h2>Repositories</h2>
          <p>{`${organization} has ${
            data.length
          } repositories with dependency data available. Select a repository to view it's dependencies.`}</p>
          <ul>
            {/* <Repositories data={data} /> */}
            {data.map(({ node: { name, id } }) => (
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
