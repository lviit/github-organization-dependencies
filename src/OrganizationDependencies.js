import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Bar } from "react-chartjs-2";
import { pipe, path, map, uniq, prop, chain } from "ramda";

const query = organization => gql`
  {
    organization(login: ${organization}) {
      repositories(first: 30) {
        edges {
          node {
            dependencyGraphManifests {
              edges {
                node {
                  dependencies {
                    nodes {
                      packageName
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const Packages = pipe(
  prop("data"),
  path(["organization", "repositories", "edges"]),
  chain(path(["node", "dependencyGraphManifests", "edges"])),
  chain(path(["node", "dependencies", "nodes"])),
  map(prop("packageName")),
  uniq,
  map(packageName => <div>{packageName}</div>)
);

const OrganizationDependencies = ({ organization }) => (
  <Query query={query(organization)}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return (
        <div>
          <h2>organization dependencies</h2>
          <Packages data={data} />
          {/*
          <Bar
            data={data}
            width={100}
            height={50}
            options={{
              maintainAspectRatio: false
            }}
          /> */}
        </div>
      );
    }}
  </Query>
);

export default OrganizationDependencies;
