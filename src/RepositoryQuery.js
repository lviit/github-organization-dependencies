import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

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

const RepositoryQuery = ({organization}) => (
  <Query query={query(organization)}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      return (
        <div>
          <h2>Repositories</h2>
          {data.organization.repositories.edges.map(repo => (
            <p>{repo.node.name}</p>
          ))}
        </div>
      );
    }}
  </Query>
);

export default RepositoryQuery;
