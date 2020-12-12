import React from "react";
import ReactDOM from "react-dom";

class EvilPlanElement extends HTMLElement {
  connectedCallback() {
    ReactDOM.render(<button onClick={() => alert("one million dollars!")}>Hold the world ransom for...</button>, this);
  }
}

const tagName = "evil-plan";

if (!window.customElements.get(tagName)) {
  // prevent rerunning on hot module reloads
  window.customElements.define(tagName, EvilPlanElement);
}
