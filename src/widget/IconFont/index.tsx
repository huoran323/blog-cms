import { Icon } from 'antd';
import projectConfig from '@/config/projectConfig';

// use:
// import IconFont from '@/components/IconFont';
// <IconFont type='icon-demo' className='xxx-xxx' />
const { iconFontUrl } = projectConfig;
export default Icon.createFromIconfontCN({ scriptUrl: iconFontUrl });
