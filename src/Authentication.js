import React from "react";
import { GITHUB_CLIENT_ID } from "./constants.js";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;

  a {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background: #eae8e3;
    text-decoration: none;
    color: #000;

    &:hover {
      background: #d8d6d2;
    }
  }
`;

const Authentication = () => (
  <Container>
    <a
      href={'/authenticate/github'}
    >
      Authenticate with github
    </a>
  </Container>
);

export default Authentication;
