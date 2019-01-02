import { filter, pathSatisfies, contains, pipe, length, gt, __ } from "ramda";

export const filterDepGraphManifests = filter(
  pathSatisfies(contains("package.json"), ["node", "blobPath"])
);

export const notEmpty = pipe(
  length,
  gt(__, 0)
);
