import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import router from 'umi/router';
import { isEqual } from 'lodash';
import { withRouter } from 'react-router';
import PathToRegexp from 'path-to-regexp';
import { Dropdown, Button, Icon, Tag, Menu, Tabs } from 'antd';
import { store } from '@/utils/storage';
import { ConnectProps, ConnectState } from '@/models/connect';
import styles from './index.less';

const TabPane = Tabs.TabPane;
interface ITagNavProps extends ConnectProps {
  children: any;
  breadcrumbNameMap?: any;
}

interface ITagNavState {
  tagBodyLeft: number;
  rightOffset: number;
  outerPadding: number;
  contextMenuLeft: number;
  contextMenuTop: number;
  visible: boolean;

  activeKey: string;
  noMatch: boolean;
  tabChildren: any;
  tabs: any[];
}

// @ts-ignore
@withRouter
class TagsNav extends PureComponent<ITagNavProps, ITagNavState> {
  private scrollOuter: HTMLDivElement;
  private scrollBody: HTMLDivElement;

  constructor(props) {
    super(props);

    this.state = {
      tagBodyLeft: 0,
      rightOffset: 40,
      outerPadding: 4,
      contextMenuLeft: 0,
      contextMenuTop: 0,
      visible: false,

      activeKey: '/',
      noMatch: false,
      tabChildren: {},
      tabs: store.get('tab_nav') || [],
    };
  }

  componentWillMount() {
    const {
      location: { pathname },
    } = this.props;
    const newState = this.setCurPanes(pathname);

    this.setState(newState, () => {
      this.tabStorage();
      this.getTagElementByRoute(pathname);
    });
  }

  componentDidUpdate(prevProps) {
    const {
      location: { pathname },
    } = this.props;
    const prevPathname = prevProps.location.pathname;

    if (pathname !== prevPathname) {
      const newState = this.setCurPanes(pathname);
      this.setState(newState, () => {
        this.tabStorage();
        this.getTagElementByRoute(pathname);
      });
    }
  }

  // 设置当前的panels
  setCurPanes = pathname => {
    const { tabs, tabChildren } = this.state;
    const { breadcrumbNameMap, children, location } = this.props;
    const activeKey = pathname;

    const currPaneIndex = tabs.findIndex(item => {
      if (item.path && PathToRegexp(item.path).test(pathname)) {
        item.pathname = pathname;
        tabChildren[pathname] = React.cloneElement(children, { location });
        return true;
      }
    });

    if (currPaneIndex !== -1) {
      return {
        ...this.state,
        activeKey,
        tabChildren,
        noMatch: false,
      };
    } else {
      // @ts-ignore
      const newTabs = Object.values(breadcrumbNameMap).filter(item => {
        if (item['path'] && PathToRegexp(item['path']).test(pathname)) {
          item['pathname'] = pathname;
          tabChildren[pathname] = React.cloneElement(children, { location });
          return item;
        }
      });

      if (newTabs.length) {
        return {
          ...this.state,
          activeKey,
          noMatch: false,
          tabChildren,
          tabs: tabs.concat(newTabs),
        };
      } else {
        return {
          ...this.state,
          activeKey,
          tabChildren,
          tabs: newTabs,
          noMatch: true,
        };
      }
    }
  };

  /**
   * 储存tabs
   */
  tabStorage = () => store.set('tab_nav', this.state.tabs);

  /**
   * tab点击事件
   * @param pathname
   */
  handleClick = pathname => {
    router.push(pathname);
  };

  /**
   * 点击滚动方法
   * @param offset
   */
  handleScroll = (offset: number) => {
    const outerWidth = this.scrollOuter.offsetWidth;
    const bodyWidth = this.scrollBody.offsetWidth;
    const { tagBodyLeft } = this.state;

    if (offset > 0) {
      this.setState({ tagBodyLeft: Math.min(0, tagBodyLeft + offset) });
    } else {
      if (outerWidth < bodyWidth) {
        if (tagBodyLeft < -(bodyWidth - outerWidth)) {
          this.setState({ tagBodyLeft });
        } else {
          this.setState({ tagBodyLeft: Math.max(tagBodyLeft + offset, outerWidth - bodyWidth) });
        }
      } else {
        this.setState({ tagBodyLeft: 0 });
      }
    }
  };

  /**
   * 关闭全部或关闭其他
   * @param key
   * @param index
   */
  handleTagOptions = async ({ key }, index) => {
    const { tabs, activeKey } = this.state;

    if (key === 'close-all') {
      await this.setState({ tabs: tabs.slice(0, 1) });
    } else if (key === 'close-others') {
      let resultTabs = [];
      if (index === -1) {
        // 保留当前选中项和首页
        resultTabs = tabs.filter((item, idx) => idx === 0 || item.pathname === activeKey);
        await this.setState({ tabs: resultTabs });
      } else {
        // 保留当前右键tag和首页
        resultTabs = tabs.filter((item, idx) => idx === 0 || index === idx);
        await this.setState({ tabs: resultTabs });
      }
    }

    this.tabStorage();
    const newTabs = this.state.tabs;
    router.push(newTabs[newTabs.length - 1].pathname);
  };

  /**
   * 关闭tab
   * @param pathname
   * @param e
   */
  close = async (pathname, e) => {
    e.stopPropagation();
    const newTabs = this.state.tabs.filter(item => item.pathname !== pathname);
    await this.setState({ tabs: newTabs });

    this.tabStorage();
    const { tabs } = this.state;
    router.push(tabs[tabs.length - 1].pathname);
  };

  /**
   * 滚动进入可视区
   * @param tag
   */
  moveToView = tag => {
    const outerWidth = this.scrollOuter.offsetWidth;
    const bodyWidth = this.scrollBody.offsetWidth;
    const { tagBodyLeft, outerPadding } = this.state;

    if (bodyWidth < outerWidth) {
      this.setState({ tagBodyLeft: 0 });
    } else if (tag.offsetLeft < -tagBodyLeft) {
      // 标签在可视区左侧
      this.setState({ tagBodyLeft: -tag.offsetLeft + outerPadding });
    } else if (
      tag.offsetLeft > -tagBodyLeft &&
      tag.offsetLeft + tag.offsetWidth < -tagBodyLeft + outerWidth
    ) {
      // 标签在可视区区域
      this.setState({
        tagBodyLeft: Math.min(0, outerWidth - tag.offsetWidth - tag.offsetLeft - outerPadding),
      });
    } else {
      // 标签在可视区右侧
      this.setState({
        tagBodyLeft: -(tag.offsetLeft - (outerWidth - outerPadding - tag.offsetWidth)),
      });
    }
  };

  // 通过路由获取标签元素
  getTagElementByRoute = route => {
    const tags = document.querySelectorAll('#scrollBody .ant-tag');
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      if (isEqual(route, tag.getAttribute('data-path'))) {
        this.moveToView(tag);
      }
    }
  };

  // 渲染导航条
  renderTagNav = () => {
    const { tagBodyLeft } = this.state;

    const menu = (index: number) => (
      <Menu onClick={e => this.handleTagOptions(e, index)}>
        <Menu.Item key="close-all">关闭所有</Menu.Item>
        <Menu.Item key="close-others">关闭其他</Menu.Item>
      </Menu>
    );

    return (
      <div className={styles['tags-nav']}>
        <div className={styles['close-on']}>
          <Dropdown overlay={menu(-1)}>
            <Button size="small" htmlType="button">
              <Icon type="close-circle" style={{ width: 18, height: 18 }} />
            </Button>
          </Dropdown>
        </div>

        <div className={classNames(styles['btn-con'], styles['left-btn'])}>
          <Button htmlType="submit" onClick={() => this.handleScroll(240)}>
            <Icon type="left" style={{ width: 18, height: 18 }} />
          </Button>
        </div>

        <div className={classNames(styles['btn-con'], styles['right-btn'])}>
          <Button htmlType="submit" onClick={() => this.handleScroll(-240)}>
            <Icon type="right" style={{ width: 18, height: 18 }} />
          </Button>
        </div>

        <div className={styles['scroll-outer']} ref={ref => (this.scrollOuter = ref)}>
          <div
            ref={ref => (this.scrollBody = ref)}
            className={styles['scroll-body']}
            id="scrollBody"
            style={{ left: tagBodyLeft }}
          >
            {this.renderTabItem(menu)}
          </div>
        </div>
      </div>
    );
  };

  // 渲染导航条
  renderTabItem = menu => {
    const { breadcrumbNameMap } = this.props;
    const { tabs, activeKey } = this.state;

    return tabs.map(({ name, path, pathname }, index) => {
      const isActive = pathname === activeKey;

      return (
        <Dropdown overlay={menu(index)} key={pathname} trigger={['contextMenu']}>
          <Tag
            className={styles.tag}
            closable={index !== 0}
            data-pathname={pathname}
            onClick={this.handleClick.bind(null, pathname)}
            onClose={this.close.bind(null, pathname)}
          >
            <span className={classNames(styles.dot, isActive && styles['tab-active'])} />
            <span className={isActive ? styles['text'] : ''}>
              {(breadcrumbNameMap[path] && breadcrumbNameMap[path].name) || name}
            </span>
          </Tag>
        </Dropdown>
      );
    });
  };

  render() {
    const { children } = this.props;
    const { tabs, tabChildren, activeKey, noMatch } = this.state;

    if (noMatch) return <div style={{ paddingTop: 66 }}>{children}</div>;
    return (
      <Tabs
        hideAdd={true}
        animated={false}
        tabBarGutter={5}
        activeKey={activeKey}
        className="tagNavBar"
        renderTabBar={() => <React.Fragment>{this.renderTagNav()}</React.Fragment>}
      >
        {tabs.map(pane => (
          <TabPane tab={pane.name} key={pane.pathname}>
            {tabChildren[pane.pathname]}
          </TabPane>
        ))}
      </Tabs>
    );
  }
}

export default connect(({ global }: ConnectState) => ({
  ...global,
}))(TagsNav);
