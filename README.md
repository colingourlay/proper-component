<h1 align="center">proper-component</h1>
<p align="center">Pass props to third-party React components, whether they expect them or not.</p>
<div align="center">
  <a href="https://npmjs.org/package/proper-component"><img src="https://img.shields.io/npm/v/proper-component.svg?style=flat-square" alt="NPM version" /></a> <a href="https://travis-ci.com/colingourlay/proper-component"><img src="https://img.shields.io/travis/com/colingourlay/proper-component/master.svg?style=flat-square" alt="Build status" /></a> <a href="https://npmjs.org/package/proper-component"><img src="https://img.shields.io/npm/dt/proper-component.svg?style=flat-square" alt="Download" /></a> <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="Code style" /></a>
</div>
  
## Usage

Say you want to use this third-party component...

```jsx third-party/Component.js
import React from 'react';

class Component extends React.Component {
  render() {
    return (
      <div className="component" style={{ color: 'tomato', fontStyle: 'italic' }}>
        {this.props.children}
      </div>
    );
  }
}

export default Component;
```

...but it doesn't allow forwarding of props it doesn't care about (stopping you from adding things like `id`s or `aria-*`/`data-*` attributes), nor does it allow you to apply any extra classes or styles.

```jsx
import React from 'react';
import { render } from 'react-dom';
import Component from 'third-party/Component';

render(
  <Component
    title="aww"
    className="utility-class"
    style={{
      color: 'thistle',
      fontWeight: 'bold'
    }}>
    Aww 😿
  </Component>,
  document.body
);
```

...will render[<sup>[1]</sup>](#global-styles):

<div class="component" style="color:tomato;font-style:italic">
  Aww 😿
</div>

```html
<div class="component" style="color:tomato;font-style:italic">
  Aww 😿
</div>
```

Well, that sucks.

Now lets use `proper-component` to make a [higher order component](https://reactjs.org/docs/higher-order-components.html) from `Component`, and suddenly, your wildest dreams become possible:

```jsx
import React from 'react';
import { render } from 'react-dom';
import Component from 'third-party/Component';
import proper from 'proper-component';

const ProperComponent = proper(Component);

render(
  <ProperComponent
    title="yay"
    className="utility-class"
    style={{
      color: 'thistle',
      fontWeight: 'bold'
    }}>
    Yay 🎉
  </ProperComponent>,
  document.body
);
```

...will render[<sup>[1]</sup>](#global-styles):

<div title="yay" class="component utility-class" style="color:thistle;font-style:italic;font-weight:bold">
  Yay 🎉
</div>

```html
<div title="yay" class="component utility-class" style="color:thistle;font-style:italic;font-weight:bold">
  Yay 🎉
</div>;
```

(...yay)

## Installation

```sh
npm install proper-component
```

## FAQs / Notes

- You technically shouldn't be messing with components in this way, because you're breaking encapsulation and responsibility principles and yadda-yadda (zzzZZZzzz), but here's another way of looking at it: If not being able to forward props was the _only_ reason you were ruling out a third party component library in your app, well, this is a win for everyone, isn't it?
- Under the hood, `ref`s are being forwarded correctly, so they're on the original component, not the HOC. Non-React static class methods are copied to the HOC too (thanks [`hoist-non-react-statics`](https://github.com/mridgway/hoist-non-react-statics));
- Currently, your `className` will be appended if one already exists on the element and your `style` will be merged with anything that currently exists. All other props are forwarded.
- Yes, this works for stateless function components too.
- This library assumes `Object.assign` is available in your environment. If you want to support older browsers, you might wanna throw in a polyfill.
- If you're using React's dev tools in Chrome, you can see how the magic HOC / `ref`-forwarding stuff works (the component `displayNames` are a giveaway. Or you can just read the source in `/src/index.js`. It's only a few lines.
- To get your head around what `proper-component` is doing, imagine it just effectively rewrote the third party component example from above as:

```jsx
class ProperComponent extends React.Component {
  render() {
    const {className = '', style = {}, children ...props} = this.props;

    return (
      <div
        className={`component ${className}`}
        style={{ color: 'tomato', fontStyle: 'italic', ...style }}
        {...props}>
        {children}
      </div>
    );
  }
}
```

Maybe we can get third-party component library maintainers to do this in the first place, and we wouldn't be in this situation in the first place. I look forward to `proper-component`'s reduncancy 🤞.

<p id="global-styles">[1] Assume these global styles are already in the DOM:</p>
<style>
.component {
  margin-bottom: 12px;
  border: 2px solid currentColor;
  padding: 6px 10px;
  background-color: papayawhip;
  font-family: sans-serif;
}
.utility-class {
  background-color: rebeccapurple;
}
</style>

```css
.component {
  margin-bottom: 12px;
  border: 2px solid currentColor;
  padding: 6px 10px;
  background-color: papayawhip;
  font-family: sans-serif;
}
.utility-class {
  background-color: rebeccapurple;
}
```

## Contributing

PRs are most welcome on [GitHub](https://github.com/colingourlay/proper-component)!

If you clone this project & `npm install` its development dependencies, you can run tests with `npm test` and and hack on anything under `/src`.

I've not gotten around to seeing how this plays with project-specific development setups what use stuff like TypeScript/Flow, or PropTypes checking, so I'd love it if you shared your experiences, or throw a fix my way. Everybody benefits!

## Authors

- Colin Gourlay ([colin@colin-gourlay.com](mailto:colin@colin-gourlay.com))
