import { formatMessage } from 'umi-plugin-react/locale';
import icon403 from '@/assets/exception/403.svg';
import icon404 from '@/assets/exception/404.svg';
import icon500 from '@/assets/exception/500.svg';

const config = {
  403: {
    img: icon403,
    title: '403',
    backText: formatMessage({ id: 'app.exception.backText' }),
    desc: formatMessage({ id: 'app.exception.description.403' }),
  },
  404: {
    img: icon404,
    title: '404',
    backText: formatMessage({ id: 'app.exception.backText' }),
    desc: formatMessage({ id: 'app.exception.description.404' }),
  },
  500: {
    img: icon500,
    title: '500',
    backText: formatMessage({ id: 'app.exception.backText' }),
    desc: formatMessage({ id: 'app.exception.description.500' }),
  },
};

export default config;
