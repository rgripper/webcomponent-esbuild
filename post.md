# Web Component as a Microfrontend

Only a decade ago a popular approach to managing teams in a company was to create talent pools based on the service layer an employee belongs to. A sysadmin, db developer, ux etc - you‘d have to mainly hang around your own ‘kind’ of human resource. Us versus them ensues.
Now we get to have cross-functional teams, and a blend of responsibilities in each person. And obeying good old [Convey’s law](https://en.wikipedia.org/wiki/Conway%27s_law) we go on to design stuff with way we communicate within the company. We take a slice of a product and build it from the ground up. One of the way making the frontend part of the slice is to package it all up in a web component.

## First web component

For me building a simple web component was surprisingly easy (considering notoriously clunky DOM APIs)

CODE EXAMPLE (index.jsx - with static text, no glowing effect yet)

Let’s bundle it up. I'm using a new blazingly fast library [esbuild](TODO: link), the whole bundle is done in 35ms! \*(TODO: maybe screenshot of the console instead)

## Preview

Now lets use our component on a web page, like we could even in production:
CODE EXAMPLE (index.html) (TODO: defer ? or async? Do we care?)

This works alright, but my gut feeling was - there must be a lot of corner cases. But not really. It is supported on all major browsers except IE and Edge 16-18 (before they moved to Chromium engine) (just put icons with versions). If you’re really anxious, you can use this [polyfill](https://github.com/webcomponents/polyfills)

Now lets pass a value

CODE EXAMPLE (index.jsx - accepting text through a value attribute)

Let’s tidy up using a tiny decorator (TODO: for component name, also maybe for attribute passing).

CODE EXAMPLE

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
