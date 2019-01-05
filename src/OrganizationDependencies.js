import React from "react";
import { HorizontalBar } from "react-chartjs-2";
import {
  pipe,
  map,
  keys,
  head,
} from "ramda";

import { packages } from './fp';

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
      <h2>Popular packages</h2>
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
                "#E84C3D",
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
              ],
              data: values
            }
          ]
        }}
        height={250}
        options={{
          scales: {
            yAxes: [
              {
                barThickness : 15,
                ticks: {
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontColor: "#000",
                  fontSize: 14,
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
