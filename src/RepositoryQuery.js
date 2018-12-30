import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

import DependencyQuery from "./DependencyQuery";
import { REPO } from "./constants";

const query = organization => gql`
  {
    organization(login: ${organization}) {
      repositories(first: 100) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

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
    const { organization } = this.props;
    return (
      <Query query={query(organization)}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          return (
            <Container>
              <div>
                <h2>Repositories</h2>
                <ul>
                  {/* <Repositories data={data} /> */}
                  {data.organization.repositories.edges.map(repo => (
                    <li key={repo.node.id}>
                      <Button
                        onClick={() => this.handleRepoChange(repo.node.name)}
                      >
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
        }}
      </Query>
    );
  }
}

export default RepositoryQuery;
