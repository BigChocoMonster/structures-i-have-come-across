import React, { Component } from "react";
import "./styles.scss";

type Props = {
  title: string;
};
export default class Common extends Component<Props, {}> {
  render() {
    return (
      <div id="structure-container">
        <div id="title">{this.props.title}</div>
        {this.props.children}
      </div>
    );
  }
}
