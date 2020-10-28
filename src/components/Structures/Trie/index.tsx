import React, { Component } from "react";
import { deepcopy } from "../../../utils/functions";
import Common from "../Common";
import "./styles.scss";

type State = {
  tree: TrieNode;
  searchTree: TrieNode;
  searchInput: string;
  insertionInput: string;
};
export default class Trie extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      tree: new TrieNode(),
      searchTree: new TrieNode(),
      insertionInput: "A brown fox has graced our home",
      searchInput: "brown",
    };
  }

  startInsertion() {
    const insertWord = (word: string) => {
      let current = this.state.tree;
      for (let character of word) {
        let childNode = current.children.get(character);
        if (!childNode) {
          childNode = new TrieNode();
          current.children.set(character, childNode);
        }
        current = childNode;
      }

      current.isEndOfWord = true;
    };

    this.setState(
      {
        tree: new TrieNode(),
      },
      () => {
        for (let word of this.state.insertionInput.trim().split(" ")) {
          insertWord(word);
        }

        this.setState({
          tree: this.state.tree,
        });
      }
    );
  }

  renderTree(node: TrieNode, parameter?: "search"): JSX.Element {
    if (node.isEndOfWord) {
      return <>.</>;
    } else {
      return (
        <>
          {Array.from(node.children).map(([key, value], index) => (
            <div key={index} className="node">
              <div
                style={{
                  color:
                    value.hasMatched && parameter === "search" ? "blue" : "",
                }}
              >
                {key}
              </div>
              <div>🠓</div>
              <div className="playground">
                {this.renderTree(value, parameter)}
              </div>
            </div>
          ))}
        </>
      );
    }
  }

  startSearch() {
    const searchWord = (word: string) => {
      let current = this.state.searchTree;

      for (let character of word) {
        const childNode = current.children.get(character);
        if (childNode) {
          current = childNode;
          current.hasMatched = true;
        } else {
          break;
        }
      }
    };

    this.setState(
      {
        searchTree: deepcopy(this.state.tree),
      },
      () => {
        searchWord(this.state.searchInput);

        this.setState({
          searchTree: this.state.searchTree,
        });
      }
    );
  }

  render() {
    return (
      <div id="__trie__">
        <Common title="Trie">
          <div className="input">
            Input:
            <input
              value={this.state.insertionInput}
              onChange={(event) => {
                this.setState({ insertionInput: event.target.value });
              }}
              onKeyPress={(event) => {
                event.key === "Enter" &&
                  this.state.insertionInput.trim() &&
                  this.startInsertion();
              }}
            />
          </div>
          <div className="subtitle">Insertion</div>
          <button
            onClick={() => {
              this.state.insertionInput.trim() && this.startInsertion();
            }}
          >
            Start insertion
          </button>
          <div className="playground">{this.renderTree(this.state.tree)}</div>
          <div className="subtitle">Search</div>
          <div className="input">
            Input:
            <input
              value={this.state.searchInput}
              onChange={(event) => {
                this.setState({ searchInput: event.target.value });
              }}
              onKeyPress={(event) => {
                event.key === "Enter" &&
                  this.state.searchInput.trim() &&
                  this.startSearch();
              }}
              autoFocus={true}
            />
          </div>
          <button
            onClick={() => {
              this.state.tree.children.size &&
                this.state.searchInput.trim() &&
                this.startSearch();
            }}
          >
            Start search
          </button>
          <div className="playground">
            {this.renderTree(this.state.searchTree, "search")}
          </div>
        </Common>
      </div>
    );
  }
}

class TrieNode {
  hasMatched?: boolean;
  isEndOfWord: boolean = false;
  children: Map<string, TrieNode> = new Map();
}
