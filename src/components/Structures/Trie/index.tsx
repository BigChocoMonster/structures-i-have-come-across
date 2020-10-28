import React, { Component } from "react";
import { deepcopy } from "../../../utils/functions";
import Radio from "../../../utils/Radio";
import Common from "../Common";
import "./styles.scss";

type State = {
  tree: TrieNode;
  searchTree: TrieNode;
  searchInput: string;
  insertionInput: string;
  isSearchDisabled: boolean;
  searchBy: "word" | "prefix";
  searchedWords: { text: string; hasMatched: boolean }[];
};
export default class Trie extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      tree: new TrieNode(),
      searchTree: new TrieNode(),
      insertionInput: "",
      searchInput: "",
      isSearchDisabled: true,
      searchedWords: [],
      searchBy: "word",
    };
  }

  componentDidUpdate(_: {}, prevState: State) {
    if (
      (!prevState.isSearchDisabled && this.state.isSearchDisabled) ||
      prevState.searchBy !== this.state.searchBy
    ) {
      this.setState({
        searchInput: "",
        searchedWords: [],
        tree: new TrieNode(),
        searchTree: new TrieNode(),
      });
    }
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
          isSearchDisabled: false,
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
      let hasMatched: boolean = true;

      for (let character of word) {
        const childNode = current.children.get(character);
        if (childNode) {
          current = childNode;
          current.hasMatched = true;
        } else {
          hasMatched = false;
          break;
        }
      }

      this.setState((prevState) => ({
        searchedWords: prevState.searchedWords.concat({
          text: word,
          hasMatched:
            this.state.searchBy === "word" ? current.isEndOfWord : hasMatched,
        }),
      }));
    };

    this.setState(
      {
        searchedWords: [],
        searchTree: deepcopy(this.state.tree),
      },
      () => {
        for (let word of this.state.searchInput.split(" ")) {
          searchWord(word);
        }

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
              placeholder="Try entering a sentence (eg: A brown fox has graced our home)"
              value={this.state.insertionInput}
              onChange={(event) => {
                this.setState({
                  insertionInput: event.target.value,
                  isSearchDisabled: true,
                });
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
            disabled={!this.state.insertionInput}
            onClick={() => {
              this.state.insertionInput.trim() && this.startInsertion();
            }}
          >
            Start insertion
          </button>
          <div className="playground">{this.renderTree(this.state.tree)}</div>
          <div className="subtitle">Search</div>
          <Radio
            disabled={this.state.isSearchDisabled}
            leftText="By word"
            rightText="By prefix"
            onChange={(position: "left" | "right") => {
              this.setState({
                searchBy: position === "right" ? "prefix" : "word",
              });
            }}
          />
          <div className="input">
            Input:
            <input
              placeholder="Try searching for word(s) in the sentence (eg: brown or happy tofu)"
              disabled={this.state.isSearchDisabled}
              value={this.state.searchInput}
              onChange={(event) => {
                this.setState({ searchInput: event.target.value });
              }}
              onKeyPress={(event) => {
                event.key === "Enter" &&
                  this.state.searchInput.trim() &&
                  this.startSearch();
              }}
            />
          </div>
          <button
            disabled={this.state.isSearchDisabled}
            onClick={() => {
              this.state.tree.children.size &&
                this.state.searchInput.trim() &&
                this.startSearch();
            }}
          >
            Start search
          </button>
          <div id="pill-container">
            {this.state.searchedWords.map((word, index) => (
              <div
                key={index}
                className={`pill ${word.hasMatched ? "has" : "has-not"}`}
              >
                {word.text}
                {this.state.searchBy === "prefix" ? "-" : ""}
              </div>
            ))}
          </div>
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
