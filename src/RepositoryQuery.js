import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import DependencyQuery from "./DependencyQuery";
import { REPO } from "./constants";

const query = organization => gql`
  {
    organization(login: ${organization}) {
      repositories(first: 100) {
        edges {
          node {
            name
          }
        }
      }
    }
  }
`;

class RepositoryQuery extends React.Component {
  constructor() {
    super();
    this.state = {
      activeRepository: REPO
    };
  }
  handleRepoChange(name) {
    this.setState({
      activeRepository: name,
    })
  }

  render() {
    const { organization } = this.props;
    return (
      <Query query={query(organization)}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          return (
            <div>
              <h2>Repositories</h2>
              <ul>
                {data.organization.repositories.edges.map(repo => (
                  <li>
                    <button onClick={() => this.handleRepoChange(repo.node.name)}>
                      {repo.node.name}
                    </button>
                  </li>
                ))}
              </ul>
              <DependencyQuery repository={this.state.activeRepository} organization={organization} />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default RepositoryQuery;
