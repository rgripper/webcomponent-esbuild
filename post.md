# React + Web Component = Microfrontend

## What's with the microfrontend stuff?

Recently I decided to understand more about building and integrating a microforontend.
You might hear about this stuff when your company wants multiple teams to build a big new web project. The company does not want teams to fight over a single monsterous SPA. It desides to break the project down into several mini-apps orchestrated by a shell app. Each team then can work in isolation, pick their own tech stack, preferred flavour of agile and so on.

## Concept

Now comes a question of tech to glue mini-apps to a shell app. It would consist of an _Adaptor_ for a child app, and a _Loader_ in a shell app. Adaptor defines a protocol to mount/unmount and exchange data with a mini-app, converting Angular- or React- specific details to a neutral form. Loader simply loads child bundles and runs Adaptors within the shell app.

One of the popular implementations of the concept is [single-spa](https://single-spa.js.org/). It has several [Adaptors](https://single-spa.js.org/docs/ecosystem-react/) written for the most popular frameworks: React, Angular, etc. For a simple loader look at their [Parcel](https://single-spa.js.org/docs/parcels-overview) object.

## My setup

I decided to try something more barebones: Web Components. They are a browser standard that works well as an Adaptor. Web components track their own loading, unloading and changes to properties and HTML attributes. Another huge benefit is CSS encapsulation (more on that below). But of course I will have to bind React stuff to a web component. As for the Loader, it is quite simple -
shell app simply renders `<my-mini-app>` tag and loads an accompanying mini-app bundle (order should not matter).

## Simple web component

Making a primitive web component was surprisingly easy (considering the notoriously clunky DOM APIs).

```javascript
/** src/index.jsx */

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
```

First I defined a class inheriting from HtmlElement. Then I registered it using
`window.customElements.define("evil-plan", EvilPlanElement)`

> Make sure you define custom elements with a prefix, e.g. `myproj-button`

> Currently, there is no API to remove or redefine custom elements. You would not care about it in production. But in dev mode you probably run a Hot Module Reloader (HMR). You make a change in your code and HMR reruns it without refreshing the page. Your code makes a call to `window.customElements.define` **again** with the same tag name. Bam! You've got an error: `Uncaught DOMException: CustomElementRegistry.define: 'evil-plan' has already been defined as a custom element`.

### Passing data (attributes and properties)

One annoying bit in that in HTML elements not every property corresponds to an attribute with the same name, so you would ideally set up two different listeners - one for properties and one for attributes.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

class EvilPlanElement extends HTMLElement {
  _ransom = "one million dollars!";

  get ransom() {
    return this._ransom;
  }

  // every time this property is changed on a DOM element like this `document.querySelector('...').ransom = 'blah';`
  set ransom(value) {
    this._plan = value;
    this.render();
  }

  // only changes to these attributes will trigger `attributeChangedCallback` method
  static get observedAttributes() {
    return ["ransom", "someother"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // when someone changes HTML or does element.setAttribute('ransom', '1 million dollars')

    switch (name) {
      case "ransom":
        // it doesn't have to match property name on the element
        // but it is always a string
        this._ransom = newValue;
        return;
      default:
        // do nothing
        return;
    }
  }

  render() {
    // renders your App within this element
    ReactDOM.render(<App ransom={this.ransom}></App>, this);
  }

  connectedCallback() {
    // every property assigned to the element before your component was defined, is available now
    this.render();
  }
}

const tagName = "evil-plan";

// condition to prevent rerunning on hot module reloads
if (!window.customElements.get(tagName)) {
  window.customElements.define(tagName, EvilPlanElement);
}
```

You can play with the sandbox here:
https://codesandbox.io/s/blog-webcomponent-props-yrelv?file=/src/index.js

I thought of writing a few neat decorators for attribute/property wiring. Sadly, the latest version of [decorator proposal](https://github.com/tc39/proposal-decorators) is a total rewrite and is not yet supported by either Babel or Typescript.

### Bundling and deployment

Let’s bundle it up! I'm using a shiny new library [esbuild](https://esbuild.github.io/).

```
yarn add -D esbuild
```

Then add/update `build` command in your `package.json`:

```json
  "scripts": {
    ...
    "build": "esbuild src/index.jsx --outfile=build/bundle.min.js --bundle --minify --define:process.env.NODE_ENV='production' --target=chrome58,firefox57,safari11,edge16"
  }
```

```
yarn build
...
Done in 0.57s
```

## Preview and Deployment

Using it in a static html page is easy. In a root of my pet project I have a file `build/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="./bundle.min.js"></script>
  </head>
  <body>
    <evil-plan ransom="a single dollar"></evil-plan>
  </body>
</html>
```

To deploy it to Github Pages, I used a package [gh-pages](https://www.npmjs.com/package/gh-pages).

```
yarn add -D gh-pages
```

Then I added a `deploy` command to `package.json`:

```json
  "scripts": {
    ...
    "deploy": "gh-pages -d ./build"
  }
```

Then I ran the command

```
yarn deploy

Published
Done in 11.38s.
```

Now it is accessible on https://rgripper.github.io/blog-webcomponent-props/

> URL format for a deployed web app is `https://<username>.github.io/<reponame>/`

This worked alright, but there must be a lot of corner cases, right? Not really, at least not in production. Web components are supported in [all major browsers](https://caniuse.com/custom-elementsv1) except IE and Edge 16-18 (before Edge migrated to use Chromium under the hood). If you have to support legacy browsers, use this [polyfill](https://github.com/webcomponents/polyfills)

## CSS story

One of the selling points of web components is CSS isolation. Every global style, say `h1 { color: red }` will only get applied within a special node called [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) within the web component. To find it you need to turn Settings in chrome to display it. Actually, even built-in elements have a shadow root. For example `<input type="number">` has toggle elements inside its shadow root.

<img src="https://rgripper.github.io/blog-webcomponent-props/blog/input-number.png"/>

If you use `create-react-app` to set up your app, by default your CSS will be injected into `<head>`. The shadow root of your component will not let any of the styles into our component, which must be fixed! The easiest solution is to use CSS-in-JS, for example `@emotion/react` package. To configure where to inject your styles, use `<CacheProvider>` component (confusing name, I know). Wrap it around your root component and any of our calls to `css` helper will inject-cache styles in the shadow root and not in `<head>`.

<img src="https://rgripper.github.io/blog-webcomponent-props/blog/style.png"/>

## Results

If you'd like to poke my code, you can use my repo or a linked codesandbox here
https://codesandbox.io/s/github/rgripper/blog-webcomponent-props

Of course it is very basic, an custom component can be generalised and put into a separate package, exposing just a helper function, used like this:

```javascript
defineWebComponent("evil-plan", App, ["appPropName1", "appPropName2"]);
```

It would create an anonymous HTMLElement, define it and wire the props.

## Final thoughts

It was pretty hard decide what to pick for an actual project - Web Components or single-spa. Here are the pros and cons:

### Single SPA

**Pros**

Popular repo, a few maintainers
Has nice documentation (though a bit confusing/overwhelming)
Adaptor is small and easy to apply
Has a CRA-like project bootstrapper that adds webpack magic for you

**Cons**

You need to learn a custom framework
Webpack stuff is magical, relies on SystemJS (which is not that popular anymore)
I haven't found any built-in CSS/CSS-module wiring

### Web components

**Pros**

Well-documentend standard Web Component API.
Writing Loader is easy and can be used with any Router

**Cons**

Web Component API/lifecycle is not straightforward
You need to support it (I only found one react-to-web-component helper)
You either bundle into one big script file, or load chunks reading `asset-manifest.json`, produced by CRA `build` command.
