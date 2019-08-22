import React from 'react';
import ReactDOM from 'react-dom';

const destroyFns: Array<() => void> = [];

export function confirm(config, Component) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  let currentConfig = { ...config, close, visible: true } as any;

  function close(...args: any[]) {
    currentConfig = {
      ...currentConfig,
      visible: false,
      afterClose: destroy.bind(this, ...args),
    };
    render(currentConfig);
  }

  function update(newConfig) {
    currentConfig = {
      ...currentConfig,
      ...newConfig,
    };
    render(currentConfig);
  }

  function destroy(...args: any[]) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    const triggerCancel = args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args);
    }
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }
  }

  function render(props) {
    ReactDOM.render(<Component {...props} />, div);
  }

  render(currentConfig);
  return {
    destroy: close,
    update,
  };
}

export default class CommonModal {
  static message(props) {
    return confirm(props, <div>111</div>);
  }

  static destroyAll() {
    while (destroyFns.length) {
      const close = destroyFns.pop();
      if (close) {
        close();
      }
    }
  }
}
