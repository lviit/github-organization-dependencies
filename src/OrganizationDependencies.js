import React from "react";
import { Bar } from "react-chartjs-2";
import {
  pipe,
  path,
  prop,
  chain,
  groupBy,
  sortBy,
  map,
  length,
  toPairs,
  apply,
  objOf,
  nth,
  reverse,
  slice,
  keys,
  head,
} from "ramda";

const packages = pipe(
  chain(path(["node", "dependencyGraphManifests", "edges"])),
  chain(path(["node", "dependencies", "nodes"])),
  groupBy(prop("packageName")),
  toPairs,
  sortBy(pipe(nth(1), length)),
  reverse,
  map(apply(objOf)),
  slice(0, 10),
);

const titles = pipe(
  map(keys),
  map(head)
);

const OrganizationDependencies = ({ organization, data }) => {
  const packageData = packages(data);

  // TODO: refactor
  const values = packageData.map(p => {
    const title = Object.keys(p)[0];
    return p[title].length;
  })

  return (
    <div>
      <h2>organization dependencies</h2>
      <Bar
        data={{
          labels: titles(packageData),
          datasets: [
            {
              label: "# of repos included",
              data: values
            }
          ]
        }}
        options={{
          maintainAspectRatio: false
        }}
      />
    </div>
  );
};

export default OrganizationDependencies;
