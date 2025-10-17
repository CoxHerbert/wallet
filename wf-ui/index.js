// plugins/prototypes.js
import { validateNull, validData, deepClone, findObject } from './util/index.js';

const prototypes = {
  validateNull,
  validData,
  deepClone,
  findObject,
  wfImage: 'https://oss.nutflow.vip/rider',
};

const Plugin = {
  install(app) {
    // 仅挂到 Vue 3 的全局原型上
    const gp = app.config.globalProperties;
    Object.entries(prototypes).forEach(([key, val]) => {
      gp[key] = val;
    });

    // 可选：提供一个命名空间，避免与现有属性名冲突
    gp.$wf = { ...prototypes };
  },
  author: 'SSC',
  version: '1.4.0',
};

export default Plugin;
// 如需在其他地方单独使用工具集合，可选择性导出
export { prototypes };
