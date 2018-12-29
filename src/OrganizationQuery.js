import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { USER_NAME } from './constants';

const query = gql`
  {
    user(login: ${USER_NAME}) {
      organizations(first: 100) {
        edges {
          node {
            name
          }
        }
      }
    }
  }
`;

const OrganizationQuery = () => (
  <Query query={query}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
        console.log(data);
      return (
        <div>
          <h2>organizations</h2>
          {data.user.organizations.edges.map(org => <p>{org.node.name}</p>)}
        </div>
      );   
    }}
  </Query>
);

export default OrganizationQuery;
