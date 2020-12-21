import React from "react";
import ReactDOM from "react-dom";

class EvilPlanElement extends HTMLElement {
  _ransom = "one million dollars!";

  get ransom() {
    return this._ransom;
  }

  // every time this property is changed on a DOM element like this `document.querySelector('...').ransom = 'blah';`
  set ransom(value) {
    this._plan = value;
    render();
  }

  static get observedAttributes() {
    return ['ransom', 'someother'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'ransom': 
        // it doesn't have to match property name on the element
        // but it can only be a string
        this.ransom = newValue
        return;
      default:
        // do nothing
        return;
    }
  }

  render() {
    // 
    ReactDOM.render(<App ransom={this.ransom}></App>, this);
  }

  connectedCallback() {
    // every property assigned to the element before your component was defined, is available now
    render();
  }
}

function App(props) {
  return <button onClick={() => alert(props.ransome)}>Hold the world ransom for...</button>;
}

const tagName = "evil-plan";

if (!window.customElements.get(tagName)) {
  // prevent rerunning on hot module reloads
  window.customElements.define(tagName, EvilPlanElement);
}
