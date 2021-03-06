import React from "react";
import styled from "styled-components";

import DependencyQuery from "./DependencyQuery";

import {
  filterByKeywords,
  filterEmpty,
  packageMatches,
  filterByName
} from "./fp";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const Header = styled.div`
  flex: 0 0 100%;

  input {
    padding: 10px 20px;
    font-size: 1.2rem;
    border: 3px solid #000;
    background: transparent;
    padding-right: 45px;
    min-width: 340px;

    &::placeholder {
      font-style: italic;
    }
  }

  svg {
    margin-left: -30px;
    transform: scale(1.5);
  }
`;

const StyledPackagesFound = styled.p`
  background: #eae8e3;
  padding: 20px;
  margin: 2rem 0;

  span {
    font-style: italic;
    font-weight: 600;
  }
`;

const Left = styled.div`
  flex: 0 0 50%;

  ul {
    padding: 50px 0 50px;
  }
`;

const Button = styled.button`
  transition: all 0.3s ease-in-out;
  border: none;
  padding: ${props => (props.active ? "20px" : "10px 20px")};
  font-weight: ${props => (props.active ? "600" : "400")};
  width: 100%;
  text-align: left;
  font-size: 1.2rem;
  background: ${props => (props.active ? "#eae8e3" : "none")};

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

class RepositoryQuery extends React.Component {
  constructor() {
    super();
    this.state = {
      activeRepository: "",
      keywords: ""
    };
  }
  handleRepoChange(name) {
    this.setState({
      activeRepository: name
    });
  }

  search(e) {
    this.setState({ keywords: e.target.value });
  }

  render() {
    const { organization, data } = this.props;
    const { activeRepository, keywords } = this.state;

    const filteredData = keywords
      ? filterByKeywords(keywords, data)
      : filterEmpty(data);

    const packagesFound = keywords
      ? packageMatches(keywords, filteredData)
      : null;

    return (
      <Container>
        <Header>
          <h2>Repositories</h2>
          <p>{`${organization} has ${
            data.length
          } repositories with dependency data available. Select a repository to view it's dependencies, or filter repositories by package name.`}</p>
          <input
            type="text"
            placeholder="search by package name"
            onChange={e => this.search(e)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13">
            <g strokeWidth="2" stroke="#000" fill="none">
              <path d="M11.29 11.71l-4-4" />
              <circle cx="5" cy="5" r="4" />
            </g>
          </svg>
          {packagesFound && (
            <StyledPackagesFound>
              {"Found packages"} <span>{packagesFound.join(", ")}</span> {"in "}
              <span>{filteredData.length}</span>
              {" repositories."}
            </StyledPackagesFound>
          )}
        </Header>
        <Left>
          <ul>
            {/* <Repositories data={data} /> */}
            {filteredData.map(({ node: { name, id } }, i) => (
              <li key={i}>
                <Button
                  active={activeRepository === name}
                  onClick={() => this.handleRepoChange(name)}
                >
                  {name}
                </Button>
              </li>
            ))}
          </ul>
        </Left>
        <DependencyQuery data={filterByName(activeRepository, data)} />
      </Container>
    );
  }
}

export default RepositoryQuery;
