import { DIC_PROPS } from '../util/variable.js';

export default {
  methods: {
    async handleDic(column) {
      let { dicData, dicUrl, prop, props, cascader, dataType } = column || {};
      props = { ...DIC_PROPS, ...(props || {}) };

      let remoteDic = [];
      const localeDic = dicData || [];

      // 处理级联：监听 form[prop] 变化
      if (!this?.validateNull?.(cascader)) {
        this.$watch(
          () => this.form?.[prop],
          (val) => {
            if (!val) return;

            cascader.forEach(async (c) => {
              let col = this.deepClone?.(this.findObject?.(this.option?.column, c));
              if (col !== -1 && col) {
                // 动态替换 dicUrl 中的 {{...}}
                let url = col.dicUrl;
                let cascaderKey = url?.match?.(/[^\{\}]+(?=\})/g);
                if (url && cascaderKey) {
                  cascaderKey.forEach((key) => {
                    if (key === 'key') {
                      url = url.replace('{{key}}', val);
                    } else {
                      url = url.replace(`{{${key}}}`, this.form?.[key]);
                    }
                  });
                  col.dicUrl = url;
                }

                // 动态替换 dicQuery 中的 {{...}}
                let query = col.dicQuery;
                if (query) {
                  for (const k in query) {
                    cascaderKey = query[k]?.match?.(/[^\{\}]+(?=\})/g);
                    if (cascaderKey) {
                      cascaderKey.forEach((key) => {
                        if (key === 'key') {
                          query[k] = query[k].replace('{{key}}', val);
                        } else {
                          query[k] = query[k].replace(`{{${key}}}`, this.form?.[key]);
                        }
                      });
                    }
                  }
                  col.dicQuery = query;
                }

                const res = await this.handleDictHttp(col);
                if (res) {
                  // Vue 3：直接赋值
                  if (this.dic) this.dic[col.prop] = res;

                  if (!this?.validateNull?.(res) && !this?.validateNull?.(col.cascaderIndex)) {
                    try {
                      this.form[col.prop] = res[col.cascaderIndex][props.value];
                    } catch (e) {
                      this.form[col.prop] = '';
                    }
                  } else {
                    this.form[col.prop] = '';
                  }
                }
              }
            });
          }
        );
      }

      // 远程字典
      if (dicUrl) {
        const hasTpl = dicUrl.match(/[^\{\}]+(?=\})/g);
        if (hasTpl) return localeDic; // 有模板占位符时，交给级联监听去拉取
        remoteDic = await this.handleDictHttp(column);
      }

      // 合并远端与本地字典（都为数组时用 concat，否则择一）
      const dic =
        Array.isArray(remoteDic) && Array.isArray(languageDic /* typo fix */)
          ? [...remoteDic, ...localeDic]
          : (remoteDic ?? localeDic);

      if (dataType === 'string') {
        const valueKey = props?.value ?? 'value';
        const childrenKey = props?.children ?? 'children';
        this._handleDic(dic, valueKey, childrenKey);
      }

      return dic;
    },

    async handleDictHttp(column) {
      let remoteDic = [];
      let { dicUrl, dicMethod, dicQuery, dicFormatter } = column || {};
      if (!dicMethod) dicMethod = 'get';

      const method = dicMethod.toLowerCase() === 'post' ? 'POST' : 'GET';
      const param = { url: dicUrl, method };
      if (method === 'POST') param.data = dicQuery;
      else param.params = dicQuery;

      const res = await this.$http.request(param);
      remoteDic = typeof dicFormatter === 'function' ? dicFormatter(res) : (res?.data ?? res);

      return remoteDic;
    },

    _handleDic(list, valueKey, childrenKey) {
      if (!list) return;
      list.forEach((item) => {
        // 统一为字符串
        if (item?.[valueKey] !== undefined && item?.[valueKey] !== null) {
          item[valueKey] = String(item[valueKey]);
        }
        if (!this?.validateNull?.(item?.[childrenKey])) {
          this._handleDic(item[childrenKey], valueKey, childrenKey);
        }
      });
    },
  },
};
