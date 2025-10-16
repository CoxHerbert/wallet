import http from '@/http/api.js';

export default {
    // 主数据列表
    list(params) {
        return http.request({
            url: '/api/blade-bip/mmr-plan-order/list',
            method: 'get',
            params,
        });
    },
    // 主数据列表
    listNoCache(params) {
        return http.request({
            url: '/api/blade-bip/mmr-plan-order/list-no-cache',
            method: 'get',
            params,
        });
    },

    // 保存接口
    submit(data) {
        return http.request({
            url: '/api/blade-bip/mmr-plan-order/submit',
            method: 'post',
            data,
        });
    },

    // 删除接口
    remove(params) {
        return http.request({
            url: '/api/blade-bip/mmr-plan-order/remove',
            method: 'DELETE',
            params,
        });
    },

    // 详情接口
    detail(params) {
        return http.request({
            url: '/api/blade-bip/mmr-plan-order/detail',
            method: 'GET',
            params,
        });
    },
    // 下拉接口
    select(params) {
        return http.request({
            url: '/api/blade-bip/mmr-plan-order/customer-product-search',
            method: 'GET',
            params,
        });
    },

    // 已排计划接口
    findScheduling(params) {
        return http.request({
            url: '/api/blade-bip/mmr-plan-order-phase/find-scheduling-plan-by-plan-order-id',
            method: 'GET',
            params,
        });
    },
    // 根据Uid获取所属部门（小部门）
    findUserDept(params) {
        return http.request({
            url: '/api/blade-bip/mmr-plan-order/find-user-dept',
            method: 'GET',
            params,
        });
    },
};
