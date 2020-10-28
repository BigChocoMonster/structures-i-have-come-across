import React, { Component } from "react";
import Trie from "../Structures/Trie";
import "./styles.scss";

type State = {
  currentRoute: string;
};

const componentMap: { [key: string]: JSX.Element } = {
  "/trie": <Trie />,
};

export default class Content extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentRoute: window.location.pathname,
    };
  }

  componentDidMount() {
    window.addEventListener("popstate", () => {
      this.setState({
        currentRoute: window.location.pathname,
      });
    });
  }

  render() {
    return <div id="__content__">{componentMap[this.state.currentRoute]}</div>;
  }
}
