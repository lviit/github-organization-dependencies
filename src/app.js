import React from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { createGlobalStyle } from "styled-components";
import { Normalize } from "styled-normalize";
import styled from "styled-components";

import Authentication from "./Authentication";
import Page from "./Page";
import {
  API_URI,
  API_PREVIEW_ACCEPT_HEADER,
  GITHUB_README_URL
} from "./constants";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=IBM+Plex+Mono:300, 500i, 600');

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'IBM Plex Mono', monospace;
    background: #f2f0ea;
  }

  h1 {
    font-size: 3.5rem;
  }

  h2 {
    font-size: 2.5rem;
  }

  h1, h2, h3 {
    font-weight: 600;
  }

  p,
  li {
    font-weight: 300;
    line-height: 1.4;
    list-style-type: none;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  a {
    color: black;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  max-width: 1100px;
`;

const createApolloClient = token =>
  new ApolloClient({
    uri: API_URI,
    headers: {
      Authorization: `bearer ${token}`,
      Accept: API_PREVIEW_ACCEPT_HEADER
    }
  });

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      authenticated: false
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("access_token");
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      fetch("/authenticate/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
      }).then(response => {
        response.json().then(data => {
          window.history.replaceState({}, document.title, "/");
          const token = data.access_token;
          window.localStorage.setItem("access_token", token);
          this.client = createApolloClient(token);
          this.setState({
            authenticated: true
          });
        });
      });
    } else if (token) {
      this.client = createApolloClient(token);
      this.setState({
        authenticated: true
      });
    }
  }

  render() {
    return (
      <Container>
        <Normalize />
        <GlobalStyle />
        <h1>Javascript dependencies for your github organization</h1>
        <p>
          Find out what npm packages your organization is using. Looks
          for dependencies in package.json files for repositories where the
          dependency graph is enabled. Find out how to enable the graph for your
          repository{" "}
          <a target="_blank" href={GITHUB_README_URL}>
            here.
          </a>
        </p>
        {this.state.authenticated ? (
          <Page apolloClient={this.client} />
        ) : (
          <Authentication />
        )}
      </Container>
    );
  }
}

render(<App />, document.getElementById("app"));
