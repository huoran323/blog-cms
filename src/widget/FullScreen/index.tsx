import React, { PureComponent } from 'react';
import { Icon, Tooltip } from 'antd';
import { eventListen } from '@/utils/util';

declare var document: Document & {
  fullScreen: any;
  fullscreenElement: any;
  webkitFullscreenElement: any;
  webkitIsFullScreen: any;
  webkitCancelFullScreen: any;
  mozFullScreen: any;
  mozFullScreenElement: any;
  mozCancelFullScreen: any;
  msExitFullscreen: any;
};

class FullScreen extends PureComponent<{ value?: boolean }> {
  state = {
    isFullScreen: false,
  };

  private showFullScreenBtn: boolean = window.navigator.userAgent.indexOf('MSIE') < 0;

  componentDidMount() {
    const isFullScreen =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen;

    const callback = () => this.setState({ isFullScreen: !isFullScreen });
    eventListen(document, 'fullscreenchange', callback);
    eventListen(document, 'mozfullscreenchange', callback);
    eventListen(document, 'webkitfullscreenchange', callback);
    eventListen(document, 'msfullscreenchange', callback);

    this.setState({ isFullScreen: !!isFullScreen });
  }

  handleFullScreen = () => {
    const main = document.body as any;
    const { isFullScreen } = this.state;

    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else {
      if (main.requestFullscreen) {
        main.requestFullscreen();
      } else if (main.mozRequestFullScreen) {
        main.mozRequestFullScreen();
      } else if (main.webkitRequestFullScreen) {
        main.webkitRequestFullScreen();
      } else if (main.msRequestFullscreen) {
        main.msRequestFullscreen();
      }
    }
  };

  render() {
    const { isFullScreen } = this.state;
    const fullScreenStyle = {
      fontSize: '16px',
      margin: '0 12px',
      cursor: 'pointer',
    };

    if (!this.showFullScreenBtn) return null;
    return (
      <div style={fullScreenStyle}>
        <Tooltip placement="bottom" title={isFullScreen ? '退出全屏' : '全屏'}>
          <Icon
            onClick={this.handleFullScreen}
            type={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
          />
        </Tooltip>
      </div>
    );
  }
}

export default FullScreen;
