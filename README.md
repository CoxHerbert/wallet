# WF UI Vant Edition

该工程已从原先的 uni-app 项目迁移为基于 **Vue 3 + Vite + Vant 4** 的前端组件库示例工程，核心演示 `wf-ui` 表单体系在 Vant 生态下的实现方式。

## 使用说明

```bash
# 安装依赖
pnpm install # 或 npm install / yarn install

# 本地开发
pnpm run dev

# 构建产物
pnpm run build
```

默认示例位于 `src/App.vue`，展示了使用 `WfForm` 组件构建配置化表单的基本方式。`src/components/wf-ui` 目录提供了基于 Vant 封装的输入组件，可按需扩展。

## 目录结构

```
├─ index.html          # 入口 HTML
├─ vite.config.js      # Vite 配置
├─ package.json        # 项目依赖
└─ src
   ├─ App.vue          # 示例页面
   ├─ main.js          # 入口文件，注册 Vant 组件
   ├─ styles           # 全局样式
   └─ components
      └─ wf-ui         # wf-ui 表单组件
```

## wf-ui 组件

- `WfForm`：配置化表单容器，负责渲染每个表单字段并提供提交事件。
- `InputField`、`SelectField`、`RadioField` 等：基于 Vant 封装的具体字段组件，支持常见的交互形态。

如需扩展新的字段类型，可在 `src/components/wf-ui/fields` 中新增组件，并在 `WfForm` 的 `resolveComponent` 函数内完成映射。
