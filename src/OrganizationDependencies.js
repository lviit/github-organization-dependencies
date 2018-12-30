import React from "react";
import { HorizontalBar } from "react-chartjs-2";
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
  head
} from "ramda";

const packages = pipe(
  chain(path(["node", "dependencyGraphManifests", "edges"])),
  chain(path(["node", "dependencies", "nodes"])),
  groupBy(prop("packageName")),
  toPairs,
  sortBy(
    pipe(
      nth(1),
      length
    )
  ),
  reverse,
  map(apply(objOf)),
  slice(0, 20)
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
  });

  return (
    <div>
      <h2>Popular packages in organization</h2>
      <HorizontalBar
        data={{
          labels: titles(packageData),
          datasets: [
            {
              label: "# of repos included",
              backgroundColor: [
                "#1BBC9B",
                "#F1C40F",
                "#34495E",
                "#7E8C8D",
                "#2ECC70",
                "#1BBC9B",
                "#D25400",
                "#8F44AD",
                "#BEC3C7",
                "#3598DB",
                "#1BBC9B",
                "#E84C3D",
                "#F39C11",
                "#7E8C8D",
                "#16A086",
                "#1BBC9B",
                "#C1392B",
                "#95A5A5",
                "#8F44AD",
                "#E84C3D"
              ],
              data: values
            }
          ]
        }}
        options={{
          scales: {
            yAxes: [
              {
                ticks: {
                  fontFamily: "'IBM Plex Mono', monospace",
                  fill: "#000"
                }
              }
            ],
            xAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          legend: {
            labels: {
              fontFamily: "'IBM Plex Mono', monospace"
            }
          }
        }}
      />
    </div>
  );
};

export default OrganizationDependencies;
