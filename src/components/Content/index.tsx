import React, { Component } from "react";
import HashTable from "../Structures/HashTable";
import Trie from "../Structures/Trie";
import "./styles.scss";

type State = {
  currentRoute: string;
};

const componentMap: {
  [key: string]: { component: JSX.Element; name: string };
} = {
  "/trie": { component: <Trie />, name: "Trie" },
  "/hash_table": { component: <HashTable />, name: "Hash Table" },
};

export default class Content extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentRoute: window.location.pathname,
    };
  }

  componentDidMount() {
    this.setDocumentTitle();

    window.addEventListener("popstate", () => {
      this.setState(
        {
          currentRoute: window.location.pathname,
        },
        () => {
          this.setDocumentTitle();
        }
      );
    });
  }

  setDocumentTitle() {
    document.title = (
      componentMap[this.state.currentRoute] || { name: "Structures" }
    ).name;
  }

  render() {
    return (
      <div id="__content__">
        {
          (componentMap[this.state.currentRoute] || { component: null })
            .component
        }
      </div>
    );
  }
}
