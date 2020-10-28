import React, { Component } from "react";
import "./styles.scss";

type Props = {
  leftText: string;
  disabled: boolean;
  rightText: string;
  onChange: (position: "left" | "right") => void;
};
type State = {
  position: "left" | "right";
};

export default class Radio extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      position: "left",
    };
  }

  render() {
    return (
      <div className="radio">
        <span>{this.props.leftText}</span>
        <div
          data-disabled={this.props.disabled}
          onClick={() => {
            if (this.props.disabled) {
              return;
            }

            this.setState(
              (prevState) => ({
                position: prevState.position === "left" ? "right" : "left",
              }),
              () => {
                this.props.onChange(this.state.position);
              }
            );
          }}
        >
          <div
            style={{
              marginLeft: this.state.position === "right" ? "auto" : "",
            }}
          ></div>
        </div>
        <span>{this.props.rightText}</span>
      </div>
    );
  }
}
