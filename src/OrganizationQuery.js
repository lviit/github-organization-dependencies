import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";

import { pipe, path, map, prop, propEq, find, prepend } from "ramda";

const query = gql`
  {
    viewer {
      login
      organizations(first: 100) {
        edges {
          node {
            name
            login
            avatarUrl
            description
          }
        }
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const OrganizationInfo = styled.div`
  display: flex;

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
  margin-left: auto;
  padding-left: 3rem;

  label {
    font-size: 0.8rem;
    display: block;
  }
  select {
    margin-top: 5px;
  }
`;

const Hello = styled.p`
  text-align: right;
  margin-top: 20px;

  b {
    font-weight: 600;
  }
`;

const Organizations = pipe(
  path(["data", "viewer", "organizations", "edges"]),
  map(({ node: { login, name } }) => <option value={login} key={login}>{name}</option>),
  prepend(
    <option value="none" disabled key="none">
      {"<none>"}
    </option>
  )
);

const activeOrganization = (organization, data) =>
  pipe(
    path(["viewer", "organizations", "edges"]),
    map(prop("node")),
    find(propEq("login", organization))
  )(data);

const OrganizationQuery = ({ handleOrgChange, organization }) => (
  <Query query={query}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      const organizationInfo = organization
        ? activeOrganization(organization, data)
        : null;

      return (
        <React.Fragment>
          <Hello>
            Signed in as <b>{data.viewer.login}.</b>
          </Hello>
          <Container>
            <OrganizationInfo>
              {organizationInfo ? (
                <React.Fragment>
                  <img src={organizationInfo.avatarUrl} />
                  <div>
                    <h2>{organizationInfo.name}</h2>
                    <p>{organizationInfo.description}</p>
                  </div>
                </React.Fragment>
              ) : (
                <h2>Select organization →</h2>
              )}
            </OrganizationInfo>
            <OrganizationSwitcher>
              <label>Select organization</label>
              <select defaultValue={"none"} onChange={e => handleOrgChange(e)}>
                <Organizations data={data} />
              </select>
            </OrganizationSwitcher>
          </Container>
        </React.Fragment>
      );
    }}
  </Query>
);

export default OrganizationQuery;
