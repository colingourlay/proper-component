const React = require('react');
const renderer = require('react-test-renderer');
const proper = require('..');

// Values used across components/tests

const text = 'OK';
const originalClassName = 'component-class';
const originalStyle = { color: 'tomato', fontStyle: 'italic' };
const className = 'utility-class';
const style = { color: 'thistle', fontWeight: 'bold' };

// Components

class Component extends React.Component {
  static getText() {
    return text;
  }

  render() {
    return (
      <div className={originalClassName} style={originalStyle}>
        {this.props.children}
      </div>
    );
  }
}

function FunctionalComponent({ children }) {
  return (
    <div className={originalClassName} style={originalStyle}>
      {children}
    </div>
  );
}

FunctionalComponent.getText = () => text;
FunctionalComponent.displayName = 'FunctionalComponent';

// Proper components

const ProperComponent = proper(Component);
const ProperFunctionalComponent = proper(FunctionalComponent);

// Tests

describe('<Component />', () => {
  test(`It discards props it didn't expect`, () => {
    const component = renderer.create(<Component className={className} style={style} title={text} />);
    const tree = component.toJSON();

    expect(tree.props.className).toBe(originalClassName);
    expect(tree.props.style).toMatchObject(originalStyle);
    expect(tree.props.title).toBeUndefined();
  });
});

describe('<FunctionalComponent />', () => {
  test(`It discards props it didn't expect`, () => {
    const component = renderer.create(<FunctionalComponent className={className} style={style} title={text} />);
    const tree = component.toJSON();

    expect(tree.props.className).toBe(originalClassName);
    expect(tree.props.style).toMatchObject(originalStyle);
    expect(tree.props.title).toBeUndefined();
  });
});

describe('<ProperComponent />', () => {
  test(`It still has static class functions`, () => {
    expect(ProperComponent.getText()).toBe(text);
  });

  test(`It looks like the wrapped component if props aren't passed`, () => {
    const originalComponent = renderer.create(<Component />);
    const component = renderer.create(<ProperComponent />);
    const originalTree = originalComponent.toJSON();
    const tree = component.toJSON();

    expect(tree).toMatchObject(originalTree);
  });

  test(`It retains props it didn't expect`, () => {
    const component = renderer.create(<ProperComponent className={className} style={style} title={text} />);
    const tree = component.toJSON();

    expect(tree.props.title).toBe(text);
  });

  test(`It appends classNames it didn't expect`, () => {
    const component = renderer.create(<ProperComponent className={className} style={style} title={text} />);
    const tree = component.toJSON();

    expect(tree.props.className).toBe(`${originalClassName} ${className}`);
  });

  test(`It merges styles it didn't expect`, () => {
    const component = renderer.create(<ProperComponent className={className} style={style} title={text} />);
    const tree = component.toJSON();

    expect(tree.props.style).toMatchObject({
      ...originalStyle,
      ...style
    });
  });
});

describe('<ProperFunctionalComponent />', () => {
  test(`It still has static functions`, () => {
    expect(ProperComponent.getText()).toBe(text);
  });

  test(`It looks like the wrapped component if props aren't passed`, () => {
    const originalComponent = renderer.create(<FunctionalComponent />);
    const component = renderer.create(<ProperFunctionalComponent />);
    const originalTree = originalComponent.toJSON();
    const tree = component.toJSON();

    expect(tree).toMatchObject(originalTree);
  });

  test(`It retains props it didn't expect`, () => {
    const component = renderer.create(<ProperFunctionalComponent className={className} style={style} title={text} />);
    const tree = component.toJSON();

    expect(tree.props.title).toBe(text);
  });

  test(`It appends classNames it didn't expect`, () => {
    const component = renderer.create(<ProperFunctionalComponent className={className} style={style} title={text} />);
    const tree = component.toJSON();

    expect(tree.props.className).toBe(`${originalClassName} ${className}`);
  });

  test(`It merges styles it didn't expect`, () => {
    const component = renderer.create(<ProperFunctionalComponent className={className} style={style} title={text} />);
    const tree = component.toJSON();

    expect(tree.props.style).toMatchObject({
      ...originalStyle,
      ...style
    });
  });
});
