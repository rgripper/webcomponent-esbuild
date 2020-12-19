# React + Web Component = Microfrontend

## What's with the microfrontend stuff?

Recently I decided to understand more about building and integrating a microforontend. 
You might hear about this stuff when your company wants multiple teams to build a big new web project. The company does not want teams to fight over a single monsterous SPA. It desides to break the project down into several mini-apps orchestrated by a shell app. Each team then can work in isolation, pick their own tech stack, preferred flavour of agile and so on.

## Concept

Now comes a question of tech to glue mini-apps to a shell app. It would consist of an _Adaptor_ for a child app, and a _Loader_ in a shell app. Adaptor defines a protocol to mount/unmount and exchange data with a mini-app, converting Angular- or React- specific details to a neutral form. Loader simply loads child bundles and runs Adaptors within the shell app.

One of the popular implementations of the concept is [single-spa](https://single-spa.js.org/). It has several adaptors written for the most popular frameworks: React, Angular, etc. Loader there also acts as a primary router, loading and unloading child apps based on a url.

## My setup

I decided to try something more barebones: Web Components. They are a browser standard that works well as an Adaptor. Web components track their own loading, unloading and changes to properties and HTML attributes. Another huge benefit is CSS encapsulation (more on that below). But of course I will have to bind React stuff to a web component. As for the Loader, it is quite simple -
shell app simply renders `<my-mini-app>` tag and loads an accompanying mini-app bundle (order should not matter).

## Simple web component

Making a primitive web component was surprisingly easy (considering the notoriously clunky DOM APIs).

```javascript
/** src/EvilPlanElement.jsx */

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

## Preview

Using it in a static html page is easy. In a root of my pet project I have a file `public/index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="../EvilPlanElement.min.js"></script>
  </head>
  <body>
    <evil-plan></evil-plan>
  </body>
</html>
```

> If you use `create-react-app`, you can just put the code from `EvilPlanElement.jsx` in your `src/index.jsx` file. Then type your custom element within `<body>` is the same as in the example above. Webpack will insert a script tag for you _on the flight_.

This worked alright, but there must be a lot of corner cases, right? Not really, at least not in production. Web components are supported in [all major browsers](https://caniuse.com/custom-elementsv1) except IE and Edge 16-18 (before Edge migrated to use Chromium under the hood) (TODO: just put icons with versions). If you have to support legacy browsers, use this [polyfill](https://github.com/webcomponents/polyfills)

### Passing data (attributes and properties)

One annoying bit in that in HTML elements not every property corresponds to an attribute with the same name, so listening to changes of both is two different stories.

CODE EXAMPLE (index.jsx - accepting text through a value attribute)

CODE EXAMPLE

I thought of writing a few neat decorators for attribute/property wiring. Sadly, the latest version of [decorator proposal](https://github.com/tc39/proposal-decorators) is a total rewrite and is not yet supported by either Babel or Typescript.

### Bundling and Deployment

Let’s bundle it up! I'm using a shiny new library [esbuild](TODO: link).<br/>
`esbuild src/EvilPlanElement.jsx --outfile=EvilPlanElement.min.js --bundle --minify --define:process.env.NODE_ENV='production' --target=chrome58,firefox57,safari11,edge16`
'Done in 0.38s' - that was fast!

I decided to do it on GitHub Pages using package `gh-pages`
https://github.com/tschaub/gh-pages

// TODO: meybe we don't need that
> Your scripts are not isolated from any other scripts on the page, and there are only partial solutions out there (e.g. using WebWorkers with (channel messaging)[https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API])

## CSS story

One of the selling points of web components is CSS isolation. Every global style, say `h1 { color: red }` will only get applied within a special node called [ShadowRoot](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot) within the web component. To find it you need to turn Settings in chrome to display it. Actually, even built-in elements, like `<select>` contain a shadow root.

TODO: screenshot of a shadow root in Chrome inspector

I’m using package `@emotion/react` to inject CSS. For this simple component I decided to avoid setting up create-react-app with babel and webpack under the hood. I simply add JSX pragma in the beginning of every component file where I use `emotion` (link to emotion React pragma). In this case default style injection produces the following style tags:

SCREENSHOT OF HTML with style tags in the HEAD

Yes, it’s using `<head>`! There is a react-specific solution to it - `CacheProvider`, the context provider for `emotion`’s config. (The name choice is surprising until I remembered that by caching it means injecting and caching styles in DOM?document?). We only need to declare it once in our root component - any of our microfrontend calls to `css` helper will inject-cache styles in our root and not in `<head>`

SCREENSHOT OF HTML with style tags under a shadow root

TODO: a paragraph of conclusion
