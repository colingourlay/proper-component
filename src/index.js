import hoist from 'hoist-non-react-statics';
import React from 'react';

function name(SourceComponent) {
  return `proper(${SourceComponent.displayName || SourceComponent.name || 'Component'})`;
}

function merge(element, props) {
  const { className: elementClassName, style: elementStyle } = element.props;
  let { className, style, ...rest } = props;

  className =
    elementClassName !== className ? `${elementClassName || ''} ${className || ''}`.trim() || null : elementClassName;

  style =
    typeof style === 'object'
      ? {
          ...(elementStyle || {}),
          ...style
        }
      : elementStyle;

  return React.cloneElement(element, {
    ...rest,
    className,
    style
  });
}

function wrapClassComponent(SourceComponent) {
  class ProperComponent extends SourceComponent {
    render() {
      return merge(super.render(), this.props);
    }
  }

  const ForwardRef = (props, ref) =>
    React.createElement(ProperComponent, Object.assign({ ref: typeof ref === 'function' ? ref : null }, props));

  ProperComponent.displayName = ForwardRef.displayName = name(SourceComponent);

  return React.forwardRef(ForwardRef);
}

function wrapFunctionalComponent(SourceComponent) {
  const ProperComponent = props => merge(SourceComponent(props), props);

  ProperComponent.displayName = name(SourceComponent);

  return ProperComponent;
}

export default SourceComponent =>
  hoist(
    (SourceComponent.prototype && SourceComponent.prototype.isReactComponent
      ? wrapClassComponent
      : wrapFunctionalComponent)(SourceComponent),
    SourceComponent
  );
