import React, { Component } from "react";
import { data_structures } from "../../utils/constants";
import "./styles.scss";

export default class Bar extends Component<{}, {}> {
  setRoute(route: string) {
    window.history.pushState(null, route, `/${route.toLowerCase()}`);
    window.dispatchEvent(new Event("popstate"));
  }

  render() {
    return (
      <div id="__bar__">
        {data_structures.map((structure, index) => (
          <div
            key={index}
            className="structure-item"
            onClick={() => {
              this.setRoute(structure);
            }}
          >
            {structure}
          </div>
        ))}
      </div>
    );
  }
}
