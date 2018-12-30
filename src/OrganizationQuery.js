import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

import { USER_NAME } from "./constants";
import { pipe, path, map, prop, propEq, find } from "ramda";

const query = gql`
  {
    user(login: ${USER_NAME}) {
      organizations(first: 100) {
        edges {
          node {
            name
            login
            avatarUrl,
            description
          }
        }
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
`;

const OrganizationInfo = styled.div`
  display: flex;
  align-items: center;

  h2 {
    font-size: 2rem;
  }
  p {
    font-weight: 500;
    font-style: italic;
  }

  img {
    max-height: 100px;
  }
`;

const OrganizationSwitcher = styled.div`
  margin-left: 3rem;

  label {
    font-size: 0.8rem;
  }
  select {
    margin-top: 5px;
  }
`;

const Organizations = pipe(
  prop("data"),
  path(["user", "organizations", "edges"]),
  map(({ node: { login, name } }) => <option value={login}>{name}</option>)
);

const activeOrganization = (organization, data) =>
  pipe(
    path(["user", "organizations", "edges"]),
    map(prop("node")),
    find(propEq("login", organization))
  )(data);

const OrganizationQuery = ({ handleOrgChange, organization }) => (
  <Query query={query}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
      const organizationInfo = activeOrganization(organization, data);

      return (
        <Container>
          <OrganizationInfo>
            <img src={organizationInfo.avatarUrl} />
            <div>
              <h2>{organizationInfo.name}</h2>
              <p>{organizationInfo.description}</p>
            </div>
            <OrganizationSwitcher>
              <label>Select organization</label>
              <select onChange={e => handleOrgChange(e)}>
                <Organizations data={data} />
              </select>
            </OrganizationSwitcher>
          </OrganizationInfo>
        </Container>
      );
    }}
  </Query>
);

export default OrganizationQuery;
