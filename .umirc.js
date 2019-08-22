import os from 'os';
import path, { resolve } from 'path';
import slash from 'slash2';
import themeConfig from './src/config/themeConfig.tsx';

const routerConfig = require('./src/config/routerConfig.tsx');
const { routerList } = routerConfig;

// 获取模块包名称
function getModulePackageName(module) {
  if (!module.context) {
    return null;
  }

  const nodeModulesPath = path.join(__dirname, '/node_modules/');
  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName = moduleDirName;
  // handle tree shaking
  if (packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)[1];
  }
  return packageName;
}

// ref: https://umijs.org/config/
export default {
  targets: {
    ie: 10,
    chrome: 46,
  },
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        dynamicImport: {
          webpackChunkName: true,
          level: 3,
          loadingComponent: './widget/PageLoading',
        },
        title: 'react-umi-antd',
        links: [{ src: '<%= PUBLIC_PATH %>favicon.ico', rel: 'icon', type: 'image/x-icon' }],
        locale: {
          enable: true,
          default: 'zh-CN',
        },
        ...(os.platform() === 'darwin'
          ? {
              dll: {
                include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
                exclude: ['@babel/runtime'],
              },
            }
          : {}),
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
            /configs\//,
          ],
        },
      },
    ],
  ],

  // 路由配置
  routes: routerList,
  // Theme for antd
  theme: themeConfig,
  // Webpack Configuration
  proxy: {
    '/cms_service': {
      // target: 'http://172.253.32.106:8082/',
      target: 'http://172.254.68.127:8081',
      changeOrigin: true,
      pathRewrite: {},
    },
    '/cms_task': {
      target: 'http://172.253.40.249:8081',
      changeOrigin: true,
      pathRewrite: {},
    },
  },
  alias: {
    components: resolve(__dirname, './src/components'),
    config: resolve(__dirname, './src/config'),
    constants: resolve(__dirname, './src/constants'),
    routes: resolve(__dirname, './src/routes'),
    services: resolve(__dirname, './src/services'),
    types: resolve(__dirname, './src/types'),
    utils: resolve(__dirname, './src/utils'),
    widget: resolve(__dirname, './src/widget'),
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('mixin.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdPath = match[1].replace('.less', '');
        const arr = slash(antdPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `cms${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
  ],
  // fix some package not transform to es5
  extraBabelIncludes: [/callbag-subscribe/, /ts-easing/],
  chainWebpack: config => {
    // optimize chunks
    config.optimization
      .runtimeChunk(false) // share the same chunks across different modules
      .splitChunks({
        chunks: 'async',
        name: 'vendors',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendors: {
            test: module => {
              const packageName = getModulePackageName(module);
              if (packageName) {
                return (
                  ['bizcharts', '@antv_data-set', '@ant-design_icons'].indexOf(packageName) >= 0
                );
              }
              return false;
            },
            name(module) {
              const packageName = getModulePackageName(module);

              if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
                return 'viz'; // visualization package
              }
              if (['@ant-design_icons'].indexOf(packageName) >= 0) {
                return 'icons'; // visualization package
              }
              return 'misc';
            },
          },
        },
      });
  },
};
