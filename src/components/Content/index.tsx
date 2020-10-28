import React, { Component } from "react";
import "./styles.scss";

type State = {
  currentRoute: string;
};

export default class Content extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentRoute: window.location.pathname.slice(1),
    };
  }

  componentDidMount() {
    window.addEventListener("popstate", () => {
      this.setState({
        currentRoute: window.location.pathname.slice(1),
      });
    });
  }

  render() {
    return <div id="__content__">{this.state.currentRoute}</div>;
  }
}
