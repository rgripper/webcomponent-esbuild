# React in a Web Component

Recently I decided to experiment with setting up a microforontend app. It will be written in React and I thought of wrapping it in a web component.
The benefits are CSS encapsulation, ease of use and support all major browsers. A consuming web app will simply render an instance of the component and load an accompanying app bundle.

## First web component

Building a primitive web component was surprisingly easy to me (considering notoriously clunky DOM APIs).

CODE EXAMPLE (index.jsx - with static text, no glowing effect yet)
EvilPlanElement.jsx

First you defined a class inheriting from HtmlElement
Second you register it using
`window.customElements.define("evil-plan", EvilPlanElement)`

> Make sure you define your element with a prefix, e.g. `evil-`: <br>`window.customElements.define("evil-plan", EvilPlanElement)`

> Currently, there is no API to remove or rederfine your element. You would not care about it in production. But during development hot module reload will trigger another call to `window.customElements.define` which results in error `TODO: error text`

Let’s bundle it up! I'm using a new shiny new library [esbuild](TODO: link).
`esbuild src/EvilPlanElement.jsx --outfile=EvilPlanElement.min.js --bundle --minify --define:process.env.NODE_ENV='production' --target=chrome58,firefox57,safari11,edge16`
TODO: Screenshot of 'done in 0.24s'
That was fast!

## Preview

Using it in a static html page is easy. In a root of my pet project I have a file `public/index.html`

```
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

> If you use `create-react-app`, you can just put the code from `EvilPlanElement.jsx` in your `src/index.jsx` file. Then type your custom element within `<body>` same as in the example above. Webpack will insert script tag for you _on the flight_.

This works alright, but my gut feeling was - there must be a lot of corner cases. But not really, at least not in production. It is supported in all major browsers except IE and Edge 16-18 (before Edge migrated to use Chromium under the hood) (TODO: just put icons with versions). If you’re really anxious, you can use this [polyfill](https://github.com/webcomponents/polyfills)

### Passing data (attributes and properties)

One annoying bit in an HTML element not every property corresponds to an attribute, and watching data changes on both of them is two different stories.

CODE EXAMPLE (index.jsx - accepting text through a value attribute)

CODE EXAMPLE

### Libraries and refactoring

I looked at two most popular libraries to declaratively build web components
TODO: lit-component by Polimer project
TODO: StencilJS

TODO: decorators - they awent thro a total rewrite and the lattest Stage 2 proposal is very different from previous and sot supported by Babel and Typescript yet (I think everyone is waiting for Stage 3).

## What's the topic

If you are developing a usual business app, total separation of your micro Frontend code is the most productive option. (TODO: No talking to other teams (cheap to maintain? Communication chaos?))

...
(once per page // TODO: how to guarantee once per page call? In html we just manually put the script in the head and call defer)
<my-component val=”1”>
...
<my-component val=”2”>
...

</body>

The consuming team will only need to know a url where I deployed my bundled component.

TODO: Link to codesandbox, or, at least, github (url expiry would be a problem, so better github)

## Advanced use

Gotchas:
Yes, overriding globals is evil so both micro frontends and shell app should be careful with libraries they use.

TODO: EXAMPLE
Accessing document's head from microfrontend also breaks the rules. EG some libraries you use might try Inserting some CSS globally and not inside your web component. Your javascript scope is not isolated, and there are only partial solutions out there (eg using WebWorkers with (channel messaging)[https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API]). But you can isolate CSS by adding an optional shadow root. It will prevent global styles from affecting your component.

CODE EXAMPLE (GlowingText.jsx with Emotion CSS)

I’m using package `@emotion/react` to inject CSS. For this simple component I decided to avoid setting up create-react-app with babel and webpack under the hood. I simply add JSX pragma in the beginning of every component file where I use `emotion` (link to emotion React pragma). In this case default style injection produces the following style tags:

SCREENSHOT OF HTML with style tags in the HEAD

Yes, it’s using `<head>`! There is a react-specific solution to it - `CacheProvider`, the context provider for `emotion`’s config. (The name choice is surprising until I remembered that by caching it means injecting and caching styles in DOM?document?). We only need to declare it once in our root component - any of our microfrontend calls to `css` helper will inject-cache styles in our root and not in `<head>`

TBC...
