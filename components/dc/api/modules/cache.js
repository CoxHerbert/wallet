import http from '@/http/api.js';
import store from '@/store/';

const queue = {};

export default {
    getView({ url, data }) {
        return new Promise((resolve, reject) => {
            if (!queue[url]) {
                // 初始化队列
                queue[url] = {
                    data: [],
                    timer: null,
                    promises: [],
                };
            }
            const globalData = store.getters.globalData;

            // 确保 globalData[url] 被初始化为对象
            if (!globalData[url]) {
                globalData[url] = {};
            }

            const currentQueue = queue[url];
            const currentGlobalData = globalData[url];
            const currentGlobalDataIds = Object.keys(currentGlobalData);

            // 过滤 data 中的重复数据（与 globalData 中的 id 比较）
            const filteredData = data.filter((id) => !currentGlobalDataIds.includes(String(id)));

            // 合并请求数据并去重
            currentQueue.data = [...new Set([...currentQueue.data, ...filteredData])];

            // 保存当前请求的 Promise
            currentQueue.promises.push({ resolve, reject });

            // 如果没有定时器，设置 200ms 延迟请求
            if (!currentQueue.timer) {
                currentQueue.timer = setTimeout(async () => {
                    // 如果队列中没有数据，直接清空并返回
                    if (currentQueue.data.length === 0) {
                        const resData = data.map((id) => globalData[url][id]); // 直接返回传入数据结构，填充为 null
                        currentQueue.promises.forEach(({ resolve }) => resolve(resData));
                        delete queue[url];
                        return;
                    }

                    try {
                        // 发起请求
                        const res = await http.request({
                            url,
                            method: 'post',
                            data: currentQueue.data,
                        });
                        const { code } = res;

                        if (code === 200) {
                            // 更新 globalData 缓存
                            res.data.forEach((item) => {
                                if (item.id) {
                                    globalData[url][item.id] = item;
                                } else if (item.id == null && item.fnumber) {
                                    item.id = item.fnumber;
                                    globalData[url][item.fnumber] = item;
                                }
                            });
                            // store.dispatch('UpdateGlobalData', globalData);
                            const globalData2 = store.getters.globalData;

                            // 根据传入的 data 匹配响应数据
                            const resData = data.map((id) => {
                                return globalData2[url][id] || { id };
                            });

                            // 触发所有保存的 Promise，返回用户传入 data 对应的结果
                            currentQueue.promises.forEach(({ resolve }) => resolve(resData));
                        } else {
                            // 如果请求失败，触发所有 Promise 的 reject
                            currentQueue.promises.forEach(({ reject }) =>
                                reject(new Error(`Request failed with code: ${code}`))
                            );
                        }
                    } catch (error) {
                        // 请求异常时，触发所有 Promise 的 reject
                        currentQueue.promises.forEach(({ reject }) => reject(error));
                    } finally {
                        // 清空队列
                        delete queue[url];
                    }
                }, 300); // 200ms 延迟
            }
        });
    },
    getQuery({ url, params }) {
        return new Promise(async (resolve, reject) => {
            try {
                const globalData = store.getters.globalData;
                // 确保 globalData[url] 被初始化为对象
                if (!globalData[url]) {
                    globalData[url] = {};
                }
                // 发起请求
                const res = await http.request({
                    url,
                    method: 'post',
                    params,
                });
                const { code, data: resData } = res;
                if (code === 200) {
                    resData.forEach((item) => {
                        globalData[url][item.id] = item;
                    });
                    resolve(res);
                }
            } catch (error) {
                reject(error);
            }
        });
    },
    getList({ url, params }) {
        return new Promise(async (resolve, reject) => {
            try {
                const globalData = store.getters.globalData;
                // 确保 globalData[url] 被初始化为对象
                if (!globalData[url]) {
                    globalData[url] = {};
                }
                // 发起请求
                const res = await http.request({
                    url,
                    method: 'post',
                    params,
                });
                const { code, data: resData } = res;
                if (code === 200) {
                    resData.forEach((item) => {
                        globalData[url][item.id] = item;
                    });
                    resolve(resData);
                }
            } catch (error) {
                reject(error);
            }
        });
    },
};
