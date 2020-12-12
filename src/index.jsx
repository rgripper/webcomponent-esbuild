/** @jsx jsx */
import { jsx, CacheProvider } from "@emotion/react";
import ReactDOM from "react-dom";
import createCache from "@emotion/cache";
import { GlowingText } from "./GlowingText";

class FancyGlowElement extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const renderRoot = document.createElement("div");
    shadowRoot.appendChild(renderRoot);

    const cache = createCache({
      key: "whatevs",
      container: shadowRoot,
    });

    fontPromise.then(() => {
      ReactDOM.render(
        <CacheProvider value={cache}>
          <GlowingText value="Kaboom!" />
        </CacheProvider>,
        renderRoot
      );
    });
  }
}



const fontPromise = new FontFace(
  "Monoton",
  "url(https://fonts.gstatic.com/s/monoton/v10/5h1aiZUrOngCibe4TkHLQg.woff2)",
  { style: "normal", weight: 400 }
)
  .load()
  .then((font) => {
    document.fonts.add(font);
  });

if (!window.customElements.get("fancy-glow")) {
  // prevent redefining in places like codesandbox
  window.customElements.define("fancy-glow", FancyGlowElement);
}
