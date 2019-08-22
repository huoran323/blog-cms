import React from 'react';
import { Menu, Icon } from 'antd';
import cx from 'classnames';
import { ClickParam } from 'antd/es/menu';
import { formatMessage, setLocale, getLocale } from 'umi-plugin-react/locale';

import HeaderDropdown from './components/HeaderDropdown';
import styles from './index.less';

const MenuItem = Menu.Item;

const locales = {
  'zh-CN': { label: '简体中文', icon: '🇨🇳' },
  'en-US': { label: 'English', icon: '🇬🇧' },
};

const SelectLang: React.FC<{ className?: string }> = props => {
  const { className } = props;
  const selectedLang = getLocale();

  // 设置语言
  const changeLang = ({ key }: ClickParam) => setLocale(key, false);

  const langMenu = (
    <Menu className={styles.langMenu} selectedKeys={[selectedLang]} onClick={changeLang}>
      {Object.keys(locales).map(locale => {
        const data = locales[locale];

        return (
          <MenuItem key={locale}>
            <span role="img" aria-label={data.label} style={{ marginRight: 6 }}>
              {data.icon}
            </span>
            {data.label}
          </MenuItem>
        );
      })}
    </Menu>
  );

  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={cx(styles.dropDown, className)}>
        <Icon type="global" title={formatMessage({ id: 'navBar.lang' })} />
      </span>
    </HeaderDropdown>
  );
};

export default SelectLang;
