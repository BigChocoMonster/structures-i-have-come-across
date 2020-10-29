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
  deletionInput: string;
  deletionTree: TrieNode;
};

const wordPlaceholder =
  "Try searching for word(s) in the sentence (eg: brown or happy tofu)";
const prefixPlaceholder =
  "Try searching for prefix(es) for words in the sentence (eg: br or h tof)";

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
      deletionInput: "",
      deletionTree: new TrieNode(),
    };
  }

  componentDidUpdate(_: {}, prevState: State) {
    if (!prevState.isSearchDisabled && this.state.isSearchDisabled) {
      this.setState({
        searchInput: "",
        searchedWords: [],
        searchTree: new TrieNode(),
        deletionInput: "",
        deletionTree: new TrieNode(),
      });
    }

    if (prevState.searchBy !== this.state.searchBy) {
      this.setState({
        searchInput: "",
        searchedWords: [],
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

  renderTree(node: TrieNode, parameter?: "search" | "delete"): JSX.Element {
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

  startDeletion() {
    const deleteWord = (word: string) => {
      let current = this.state.deletionTree;
      let matchedNodeList: TrieNode[] = [];

      for (let character of word) {
        const childNode = current.children.get(character);
        if (childNode) {
          current = childNode;
          matchedNodeList.push(current);
        } else {
          break;
        }
      }

      if (current.isEndOfWord) {
        current = this.state.deletionTree;
        for (let index = 0; index < word.length; index++) {
          const character = word.charAt(index);
          const childNode = current.children.get(character);
          if (childNode === matchedNodeList[index]) {
            if (
              childNode.children.size === 0 ||
              childNode.children.size === 1
            ) {
              current.children.delete(character);
            } else {
              current = childNode;
            }
          }
        }
      }
    };

    this.setState(
      {
        deletionTree: deepcopy(this.state.tree),
      },
      () => {
        deleteWord(this.state.deletionInput);

        this.setState({
          deletionTree: this.state.deletionTree,
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
              placeholder={
                this.state.searchBy === "word"
                  ? wordPlaceholder
                  : prefixPlaceholder
              }
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
          <div className="subtitle">Deletion</div>
          <div className="input">
            Input:
            <input
              placeholder="Try entering a word that you would like to see gone (eg: home)"
              disabled={this.state.isSearchDisabled}
              value={this.state.deletionInput}
              onChange={(event) => {
                this.setState({ deletionInput: event.target.value });
              }}
              onKeyPress={(event) => {
                event.key === "Enter" &&
                  this.state.deletionInput.trim() &&
                  this.startDeletion();
              }}
            />
          </div>
          <button
            disabled={this.state.isSearchDisabled}
            onClick={() => {
              this.state.tree.children.size &&
                this.state.deletionInput.trim() &&
                this.startDeletion();
            }}
          >
            Start deletion
          </button>
          <div className="playground">
            {this.renderTree(this.state.deletionTree, "delete")}
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
