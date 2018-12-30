import React from "react";
import styled from "styled-components";

import DependencyQuery from "./DependencyQuery";
import { REPO } from "./constants";

const Container = styled.div`
  display: flex;
`;

const Button = styled.button`
  border: none;
  margin: 3px 0;
  &:hover {
    cursor: pointer;
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
    //console.log(data);
    return (
      <Container>
        <div>
          <h2>Repositories</h2>
          <p>{`${organization} has ${data.length} repositories with dependency data available`}</p>
          <ul>
            {/* <Repositories data={data} /> */}
            {data.map(repo => (
              <li key={repo.node.id}>
                <Button onClick={() => this.handleRepoChange(repo.node.name)}>
                  {repo.node.name}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <DependencyQuery
          repository={this.state.activeRepository}
          organization={organization}
        />
      </Container>
    );
  }
}

export default RepositoryQuery;
