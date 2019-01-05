import {
  filter,
  pathSatisfies,
  contains,
  pipe,
  length,
  gt,
  __,
  path,
  map,
  propSatisfies,
  prop,
  reject,
  isEmpty,
  chain,
  uniq,
  groupBy,
  sortBy,
  toPairs,
  apply,
  objOf,
  nth,
  reverse,
  slice,
  tap,
  find,
  pathEq
} from "ramda";

export const pathDepGraphFromRepo = path([
  "node",
  "dependencyGraphManifests",
  "edges"
]);
export const pathPackagesFromDepGraph = path(["node", "dependencies", "nodes"]);
export const manifestIsPackageJson = pathSatisfies(contains("package.json"), [
  "node",
  "blobPath"
]);

export const notEmpty = pipe(
  length,
  gt(__, 0)
);

// Type: Repository
export const filterByKeywords = (keywords, data) =>
  pipe(
    filter(
      pipe(
        pathDepGraphFromRepo,
        filter(manifestIsPackageJson),
        chain(pathPackagesFromDepGraph),
        filter(propSatisfies(contains(keywords), "packageName")),
        notEmpty
      )
    )
  )(data);

// Type: Repository
export const filterEmpty = pipe(
  filter(
    pipe(
      pathDepGraphFromRepo,
      notEmpty
    )
  )
);

// Type: Repository
export const filterByName = (name, data) =>
  pipe(
    filterEmpty,
    find(pathEq(["node", "name"], name)),
  )(data);

// Type: Repository
export const packageMatches = (keywords, filteredData) =>
  pipe(
    chain(pathDepGraphFromRepo),
    filter(manifestIsPackageJson),
    chain(pathPackagesFromDepGraph),
    filter(propSatisfies(contains(keywords), "packageName")),
    map(prop("packageName")),
    uniq
  )(filteredData);

// Type: Repository
export const packages = pipe(
  chain(pathDepGraphFromRepo),
  filter(manifestIsPackageJson),
  chain(pathPackagesFromDepGraph),
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
  slice(0, 30)
);

// Type: Organization
export const filterReposWithoutDependencies = pipe(
  path(["organization", "repositories", "edges"]),
  reject(pathSatisfies(isEmpty, ["node", "dependencyGraphManifests", "edges"]))
  //uniqBy(path(['node, name']))
);
