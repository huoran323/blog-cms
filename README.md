# react-umi-antd

## 代码规范

- JS命名采用驼峰形式
- CSS命名采用中划线形式，可以考虑使用bem方式

```bash
// 样式建议书写优先级
1. 位置相关: position, top, bottom, left, right, z-index
2. display布局相关: display, flex, align-items, justify-content
3. 盒子模型相关: width, height, margin, padding, border
4. 装饰相关: color, background-color, font-size
5. 其他: vertical-align, overflow
```

## 快速开始

- 进入项目目录安装依赖: yarn install
- 开发环境下运行: yarn start
- 代码检查: yarn lint

### 配置文件说明

- 表单验证配置: utils 目录下的 validate.tsx 文件
- 页面搜索相关配置: 各个模块下面的 config 目录下的 search.tsx 文件下面
- 页面列表相关配置: 各个模块下面的 config 目录下的 form.tsx 文件下面
- 页面弹窗相关配置: 各个模块下面的 config 目录下的 form.tsx 文件下面

### 项目结构描述

```bash
|—— dist/             // 默认 build 输出目录
|—— mock/             // mock 文件所在目录，基于express
|—— public/           // 项目公共文件所在目录
|—— src/
    |—— assets/       // 静态资源目录
    |—— components/   // 项目组件目录
    |—— config/       // 配置文件目录
        |—— projectConfig.tsx
        |—— echartsConfig.tsx   // echarts主题配置
        |—— projectConfig.tsx   // 项目配置
        |—— routerConfig.tsx    // 路由配置
        |—— themeConfig.tsx     // antd 默认主题覆盖配置
    |—— layouts
        |—— BasicLayout.tsx     // 基础layout
        |—— UserLayout.tsx      // 登录layout
    |—— models/
        |—— app.tsx            // 全局公共模型配置
    |—— pages/
        |—— Authorized.tsx     // 页面权限控制组件
    |—— services/     // 项目服务目录
    |—— types/        // ts接口类型配置目录
    |—— utils/        // 项目工具类目录
    |—— widgets/
        |—— Breadcrumb    // 面包屑导航
        |—— Ellipsis      // 溢出...
        |—— Exception     // 异常
        |—— GlobalHeader  // 全局头部
        |—— PageLoading   // 页面加载
        |—— SiderMenu     // 侧边菜单
        |—— TagsNav       // 标签导航
    |—— app.tsx       // 项目dva入口文件
    |—— global.less   // 全局样式文件
|—— .editorconfig     // 编辑器配置文件
|—— .env              // 开发环境配置文件
|—— .eslintignore     // eslint语法检查忽略配置
|—— .eslintrc         // eslint配置文件
|—— .gitignore        // git配置文件
|—— .prettierignore   // pretter代码检查忽略配置
|—— .prettierrc       // pretter配置文件
|—— .stylelintrc.json // stylelint配置文件
|—— .umirc.js         // umi配置文件
|—— .jest.config.js   // jest测试配置文件
|—— jsconfig.json     // js语法配置文件
|—— package.json
|—— tsconfig.json     // ts配置文件
|—— tslint.json       // ts语法检查配置文件
```

## MockJS

**随机获取图片**:
  - unsplash: `https://source.unsplash.com/300x300`,
  - lorempixel: `http://lorempixel.com/320/240/`
  - bing: `https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture` 


## windows查看指定端口是否占用和查看进程

```bash
// 查看指定端口号PID
netstat -ano|findstr 7000

// 终止端口号占用进程
taskkill /F /t /PID 2328
```
