import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { USER_NAME } from "./constants";
import { pipe, path, map, prop } from "ramda";

const query = gql`
  {
    user(login: ${USER_NAME}) {
      organizations(first: 100) {
        edges {
          node {
            name
            login
          }
        }
      }
    }
  }
`;

const Organizations = pipe(
  prop("data"),
  path(["user", "organizations", "edges"]),
  map(({ node: { login, name } }) => (
    <option value={login}>{name}</option>
  ))
);

const OrganizationQuery = ({ handleOrgChange }) => (
  <Query query={query}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return (
        <div>
          <h2>Select organization</h2>
          <select onChange={e => handleOrgChange(e)}>
            <Organizations data={data} />
          </select>
        </div>
      );
    }}
  </Query>
);

export default OrganizationQuery;
