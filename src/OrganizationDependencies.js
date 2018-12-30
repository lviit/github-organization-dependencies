import React from "react";
import { Bar } from "react-chartjs-2";
import { pipe, path, map, uniq, prop, chain } from "ramda";

const Packages = pipe(
  prop("data"),
  chain(path(["node", "dependencyGraphManifests", "edges"])),
  chain(path(["node", "dependencies", "nodes"])),
  map(prop("packageName")),
  uniq,
  map(packageName => <div>{packageName}</div>)
);

const OrganizationDependencies = ({ organization, data }) => (
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

export default OrganizationDependencies;
