import { filter, pathSatisfies, contains, pipe, length, gt, __, path } from "ramda";

export const manifestIsPackageJson = pathSatisfies(contains("package.json"), [
  "node",
  "blobPath"
]);

export const notEmpty = pipe(
  length,
  gt(__, 0)
);

export const pathDepGraphFromRepo = path(["dependencyGraphManifests", "edges"]);
export const pathPackagesFromDepGraph = path(["node", "dependencies", "nodes"]);
