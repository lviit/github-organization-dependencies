import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { ORGANIZATION } from "./constants";

const query = gql`
  {
    organization(login: ${ORGANIZATION}) {
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

const RepositoryQuery = () => (
  <Query query={query}>
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
