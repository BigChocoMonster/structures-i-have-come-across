import React, { Component } from "react";
import Common from "../Common";
import "./styles.scss";

type State = {
  insertionInput: number[][];
  table: { key: number; value: number }[][];
};
export default class HashTable extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      insertionInput: [
        [1, 20],
        [2, 70],
        [42, 80],
        [4, 25],
        [12, 44],
        [14, 32],
        [17, 11],
        [13, 78],
        [37, 98],
      ],
      table: new Array(5),
    };
  }

  componentDidMount() {
    this.startInsertion();
  }

  startInsertion() {
    for (let input of this.state.insertionInput) {
      const hash = this.hashFunction(input[0]);
      if (this.state.table[hash]) {
        this.state.table[hash].push({ key: input[0], value: input[1] });
      } else {
        this.state.table[hash] = new Array(1).fill({
          key: input[0],
          value: input[1],
        });
      }
    }

    this.setState((prevState) => ({
      table: prevState.table,
    }));
  }

  /**
   * hash functions should change according to data type of keys such that key becomes hashable
   * here the hash function chosen suits the number data type
   *
   * remember that hash functions must always be pure functions
   *  */
  hashFunction(key: number): number {
    return key % 5;
  }

  renderTable(): JSX.Element {
    return (
      <>
        {this.state.table.map((row, i) => (
          <div key={i}>
            {row &&
              row.map((column, j) => (
                <span key={j}>
                  &lt;{column.key}: {column.value}&gt;
                </span>
              ))}
          </div>
        ))}
      </>
    );
  }

  render() {
    return (
      <div id="__hashtable__">
        <Common title="Hash Table">
          <div className="playground">{this.renderTable()}</div>
        </Common>
      </div>
    );
  }
}

interface BinarySearchTreeNode {
  value: any;
  leftNode: BinarySearchTreeNode;
  rightNode: BinarySearchTreeNode;
}
