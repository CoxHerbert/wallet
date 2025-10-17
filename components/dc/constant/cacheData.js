import Api from '@/api/index';
import http from '@/http/api.js';

const getProcessModelList = (params) => {
    return new Promise((resolve, reject) => {
        http.request({
            url: '/api/blade-workflow/design/model/list',
            method: 'get',
            params,
        })
            .then((res) => {
                const { code, data } = res.data;
                if (code === 200) {
                    res.data.data.records = res.data.data.records.map((row) => {
                        return {
                            ...row,
                            id: row.modelKey,
                            id_: row.id,
                        };
                    });
                    resolve(res);
                } else {
                    reject(res);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export default {
    processModel: {
        // url: '/api/blade-bip/CrmCustomerArea/select-data',
        defaultLabel: 'modelKey',
        defaultLabelName: '模型key',
        title: '流程模型选择',
        placeholder: '请输入流程模型选择',
        submitTitle: '流程模型',
        dialogGet: getProcessModelList,
        column: [
            {
                label: '名称',
                prop: 'name',
            },
            {
                label: '版本',
                prop: 'version',
            },
            {
                label: 'key',
                prop: 'modelKey',
            },
            {
                label: 'serviceCallback',
                prop: 'serviceCallback',
            },
        ],
    },
    // 采购申请单
    purchaseRequest: {
        url: '/api/blade-bip/ScmPurchaseRequest/select-data',
        defaultLabel: 'no',
        defaultLabelName: '采购申请单',
        title: '采购申请单',
        placeholder: '请输入采购申请单',
        submitTitle: '采购申请单',
        dialogGet: Api.scm.application.getList,
        column: [
            {
                label: '组织',
                prop: 'orgId',
                dictData: 'SCMORG_LIST_CACHE',
                component: 'dc-dict',
            },
            {
                label: '采购订单编号',
                prop: 'no',
            },
            {
                label: '采购类型',
                prop: 'billtypeDict',
                dictData: 'DC_PURCHASE_REQUEST_DICT',
                component: 'dc-dict-key',
            },
            {
                label: '申请日期',
                prop: 'applicationDate',
            },
            {
                label: '申请人',
                prop: 'applicationUserId',
                component: 'dc-view',
                objectName: 'user',
            },
        ],
    },
    // 供应商
    scmSupplier: {
        url: '/api/blade-bip/ScmSupplier/select-data',
        defaultLabel: 'supplierName',
        defaultLabelName: '供应商',
        title: '供应商',
        placeholder: '请输入供应商',
        submitTitle: '供应商',
        dialogGet: Api.scm.supplier.getList,
        column: [
            {
                label: '供应商名称',
                prop: 'supplierName',
            },
            {
                label: '供应商编码',
                prop: 'supplierNo',
            },
            {
                label: '签约开始日期',
                prop: 'startDate',
            },
            {
                label: '签约结束日期',
                prop: 'endDate',
            },
        ],
    },
    // SIP创建，新增界面使用
    materialListByMtoNo: {
        url: '/api/blade-pda/common/material-search',
        defaultLabel: 'fname',
        defaultLabelName: '物料名称',
        title: '物料选择',
        placeholder: '请输入物料编码',
        submitTitle: '物料',
        dialogGet: Api.qms.sn.listByMtoNo,
        column: [
            {
                label: '专案号',
                prop: 'mtoNo',
            },
            {
                label: '物料名称',
                prop: 'fname',
                minWidth: 200,
                tooltip: true,
            },
            {
                label: '物料编码',
                prop: 'fnumber',
            },
            {
                label: '规格',
                prop: 'fspecification',
            },
        ],
    },
    SnCheckMaterial: {
        url: '/api/blade-pda/common/material-search',
        defaultLabel: 'fname',
        defaultLabelName: '物料',
        title: '物料选择',
        placeholder: '请输入物料名称查询选择',
        submitTitle: '物料',
        dialogGet: Api.qms.sn.getMaterialList,
        column: [
            {
                label: '物料名称',
                prop: 'fname',
                overHidden: true,
                search: true,
            },
            {
                label: '物料编码',
                prop: 'fnumber',
                overHidden: true,
                width: 90,
                search: true,
            },

            {
                label: '规格型号',
                prop: 'fspecification',
                overHidden: true,
            },
            {
                label: '组织编码',
                prop: 'fuseorgid',
                overHidden: true,
                search: false,
            },
            {
                label: '分组名称',
                prop: 'groupname',
                overHidden: true,
            },
        ],
    },
    // erp物料(执行单编辑专用)
    erpMeterial: {
        url: '/api/blade-bip/ScmMaterial/select-data',
        defaultLabel: 'fnumber',
        defaultLabelName: '物料编码',
        title: '物料选择',
        placeholder: '请输入物料编码查询选择',
        submitTitle: '物料选择',
        dialogGet: Api.pdp.erpSelect.materials,
        column: [
            {
                label: '物料名称',
                prop: 'fname',
                overHidden: true,
                search: true,
            },
            {
                label: '物料编码',
                prop: 'fnumber',
                overHidden: true,
                width: 90,
                search: true,
            },
            {
                label: '规格型号',
                prop: 'fspecification',
                overHidden: true,
            },
            {
                label: '组织',
                prop: 'fuseOrgId',
                overHidden: true,
                search: false,
            },
        ],
    },
    // scm物料
    scmMaterial: {
        url: '/api/blade-bip/ScmMaterial/select-data',
        defaultLabel: 'materialName',
        defaultLabelName: '物料',
        title: '物料选择',
        placeholder: '请输入物料名称查询选择',
        submitTitle: '物料',
        dialogGet: Api.scm.scmMaterial.getList,
        column: [
            {
                label: '物料名称',
                prop: 'materialName',
                overHidden: true,
                search: true,
            },
            {
                label: '物料编码',
                prop: 'materialNumber',
                overHidden: true,
                width: 90,
                search: true,
            },

            {
                label: '规格型号',
                prop: 'specification',
                overHidden: true,
            },
            {
                label: '品牌',
                prop: 'brand',
                overHidden: true,
                search: false,
            },
        ],
    },

    org: {
        url: '/api/blade-bip/org/select-data',
        defaultLabel: 'orgName',
        defaultLabelName: '组织',
        title: '组织选择',
        placeholder: '请输入组织名称查询选择',
        submitTitle: '组织',
        dialogGet: Api.pdp.deliverystartsubmit.list,
        column: [
            {
                label: '组织名称',
                prop: 'orgName',
            },
        ],
    },

    scmOrg: {
        url: '/api/blade-bip/ScmOrg/select-data',
        defaultLabel: 'orgName',
        defaultLabelName: 'scm组织',
        title: 'SCM组织选择',
        placeholder: '请输入组织名称查询选择',
        submitTitle: 'SCM组织',
        dialogGet: Api.scm.organization.getList,
        column: [
            {
                prop: 'orgName',
                label: '组织名称',
                type: 'rowText',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
            {
                prop: 'orgCode',
                label: '组织编码',
                type: 'rowText',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
        ],
    },

    projectSettingTemplate: {
        url: '/api/blade-bip/dc-pdp-func-user-config/select-data',
        defaultLabel: 'configName',
        defaultLabelName: '配置名称',
        title: '配置模板选择',
        placeholder: '请输入配置模板',
        submitTitle: '配置模板',
        dialogGet: Api.pdp.projectSetting.list,
        column: [
            {
                label: '配置名称',
                prop: 'configName',
            },
            {
                label: '配置编码',
                prop: 'configCode',
            },
            {
                label: '绑定角色',
                prop: 'bindField',
                dictData: 'DC_PMS_PROJECT_ROLE',
                multiple: true,
                component: 'dc-dict-key',
            },
        ],
    },

    machineConfig: {
        url: '/api/blade-bip/MachineConfig/select-data',
        defaultLabel: 'machineIp',
        defaultLabelName: '机台名称',
        title: '机台名称',
        placeholder: '请输入机台名称',
        submitTitle: '机台名称',
        dialogGet: Api.pdp.deliverystartsubmit.list,
        column: [
            {
                label: '机台名称',
                prop: 'machineName',
            },
        ],
    },
    // 可行性报告
    demandCode: {
        url: '/api/blade-bip/dc-fea/select-data',
        defaultLabel: 'feaName',
        defaultLabelName: '报告名称',
        title: '可行性报告选择',
        placeholder: '请输入报告名称查询选择',
        submitTitle: '可行新报告',
        dialogGet: Api.pdp.dcFea.list,
        column: [
            {
                label: '评估名称',
                prop: 'feaName',
            },
        ],
    },
    customer: {
        url: '/api/blade-bip/customer/select-data',
        defaultLabel: 'fullname',
        defaultLabelName: '客户名称',
        title: '商机选择',
        placeholder: '请输入客户名称查询选择',
        submitTitle: '客户',
        dialogGet: Api.crm.customer.getCustomerList,
        column: [
            {
                label: '客户名称',
                prop: 'fullname',
            },
        ],
    },
    cmSelector: {
        url: '/api/blade-bip/customer/select-data',
        defaultLabel: 'fullname',
        defaultLabelName: '厂商名称',
        title: 'CM厂商选择',
        placeholder: '请输入厂商名称查询选择',
        submitTitle: 'CM厂商',
        dialogGet: Api.crm.customer.getCustomerList,
        column: [
            {
                label: 'CM厂商名称',
                prop: 'fullname',
            },
            {
                label: 'CM厂商编码',
                prop: 'cmCode',
            },
        ],
    },

    user: {
        url: '/api/blade-bip/bip-blade-user/select-data',
        defaultLabel: 'realName',
        defaultLabelName: '姓名',
        title: '人员选择',
        placeholder: '请输入人员姓名查询选择',
        submitTitle: '用户',
        dialogGet: Api.system.user.getList,
        column: [
            {
                label: '姓名',
                prop: 'realName',
                type: 'rowText',
                search: true,
                searchRops: {
                    is: 'input',
                },
            },
            {
                label: '工号',
                prop: 'account',
                type: 'rowText',
                search: true,
                searchRops: {
                    is: 'input',
                },
            },
            {
                label: '岗位',
                prop: 'postName',
                type: 'rowText',
            },
            {
                label: '部门',
                prop: 'deptName',
                type: 'rowText',
            },
        ],
    },
    company: {
        url: '/api/blade-bip/LaborCompany/select-data',
        defaultLabel: 'name',
        defaultLabelName: '公司名称',
        title: '公司名称',
    },
    dept: {
        url: '/api/blade-bip/bip-blade-dept/select-data',
        defaultLabel: 'deptName',
        defaultLabelName: '部门名称',
        title: '部门选择',
        placeholder: '请输入部门名称查询选择',
        submitTitle: '部门',
        dialogGet: Api.system.dept.getList,
        column: [
            {
                label: '部门名称',
                prop: 'deptName',
            },
        ],
    },
    customerContact: {
        url: '/api/blade-bip/customer-contacts/select-data',
        defaultLabel: 'contactsName',
        defaultLabelName: '联系人姓名',
        title: '客户联系人选择',
        placeholder: '请输入客户联系人姓名查询选择',
        submitTitle: '客户联系人',
        dialogGet: Api.crm.customerContacts.list,
        dialogRemove: Api.crm.customerContacts.delete,
        dialogCreate: Api.crm.customerContacts.submit,
        dialogEdit: Api.crm.customerContacts.submit,
        column: [
            {
                label: '联系人姓名',
                prop: 'contactsName',
            },
            {
                label: '联系方式',
                prop: 'contactsPhoneNumber',
            },
            {
                label: '部门',
                prop: 'contactsDeptName',
            },
            {
                label: '职务',
                prop: 'contactsPost',
            },
        ],
    },
    foundry: {
        url: '/api/blade-bip/foundry/select-data',
        defaultLabel: 'foundryName',
        defaultLabelName: '代工厂名称',
        title: '代工厂选择',
        placeholder: '请输入代工厂名称查询选择',
        submitTitle: '代工厂',
        dialogGet: Api.crm.foundry.list,
        dialogRemove: Api.crm.foundry.remove,
        dialogCreate: Api.crm.foundry.submit,
        dialogEdit: Api.crm.foundry.submit,
        column: [
            {
                label: '代工厂',
                prop: 'foundryName',
            },
            {
                label: '代工说明',
                prop: 'foundryDesc',
            },
        ],
    },
    org: {
        url: '/api/blade-bip/org/select-data',
        defaultLabel: 'orgName',
        defaultLabelName: '组织名称',
        title: '组织名称选择',
        placeholder: '请输入组织名称查询选择',
        submitTitle: '组织',
    },
    processCorrelation: {
        url: '/api/blade-bip/process-correlation/select-data',
        defaultLabel: 'businessTypeName',
        defaultLabelName: '业务类型名称',
        title: '业务类型选择',
        placeholder: '请输入业务类型名称查询选择',
        submitTitle: '业务类型',
    },
    pmsFileManager: {
        url: '/api/blade-bip/pms-file-manager/select-data',
        defaultLabel: 'sourceFileName',
        defaultLabelName: '文件名称',
        title: '文件选择',
        placeholder: '请输入文件名称查询选择',
    },
    opps: {
        url: '/api/blade-bip/opps/select-data',
        defaultLabel: 'oppsName',
        defaultLabelName: '商机名称',
        title: '商机选择',
        placeholder: '请输入商机名称查询选择',
        submitTitle: '商机',
        dialogGet: Api.crm.opps.getOppsList,
        column: [
            {
                label: '商机名称',
                prop: 'oppsName',
            },
            {
                label: '商机状态',
                prop: 'oppsStatusId',
                dictData: 'DC_CRM_OPPS_STATUS',
                component: 'dc-dict',
            },
            {
                label: '商机级别',
                prop: 'oppsLevelId',
                dictData: 'DC_CRM_OPPS_LEVEL',
                component: 'dc-dict',
            },
            {
                label: '商机名称',
                prop: 'oppsName',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
            {
                label: '商机客户',
                prop: 'customerId',
                component: 'dc-view',
                objectName: 'customer',
            },
            {
                label: 'BD',
                prop: 'bdUserId',
                component: 'dc-view',
                objectName: 'user',
            },
            {
                label: 'TPM',
                prop: 'tpmUserId',
                component: 'dc-view',
                objectName: 'user',
            },
            {
                label: '登记时间',
                prop: 'createTime',
            },
            {
                label: '预计成交日期',
                prop: 'oppsExpectedTransactionDate',
            },
            {
                label: '登记人',
                prop: 'createUser',
                component: 'dc-view',
                objectName: 'user',
            },
            {
                label: '所属组织',
                prop: 'oppsOrgId',
                component: 'dc-view',
                objectName: 'org',
            },
        ],
    },
    project: {
        url: '/api/blade-bip/project/select-data',
        defaultLabel: 'projectName',
        defaultLabelName: '项目名称',
        title: '项目选择',
        placeholder: '请输入项目名称查询选择',
        submitTitle: '项目',
        dialogGet: Api.pdp.project.list,
        column: [
            {
                label: '项目名称',
                prop: 'projectName',
            },
        ],
    },
    projectDelivered: {
        url: '/api/blade-bip/project/select-data',
        defaultLabel: 'projectName',
        defaultLabelName: '项目名称',
        title: '项目选择',
        placeholder: '请输入项目名称查询选择',
        submitTitle: '项目',
        dialogGet: Api.pdp.project.findProjectDelivered,
        column: [
            {
                label: '项目名称',
                prop: 'projectName',
            },
        ],
    },

    projectConfig: {
        url: '/api/blade-bip/mmr-project-config/select-data',
        defaultLabel: 'projectName',
        defaultLabelName: '项目名称',
        title: '项目选择',
        placeholder: '请输入项目名称查询选择',
        submitTitle: '项目',
        dialogGet: Api.pdp.mmrProjectConfig.list,
        column: [
            {
                label: '项目名称',
                prop: 'projectName',
            },
            {
                label: '项目编码',
                prop: 'projectCode',
            },
        ],
    },
    /** 创建现场计划单>项目选择 */
    pdpProject: {
        url: '/api/blade-bip/project/select-data',
        defaultLabel: 'projectName',
        defaultLabelName: '项目名称',
        title: '项目选择',
        placeholder: '请输入项目名称查询选择',
        submitTitle: '项目',
        dialogGet: Api.pdp.project.findProjectVo, // Api.pdp.project.list,
        column: [
            {
                label: '项目名称',
                prop: 'projectName',
            },
            {
                label: '项目编码',
                prop: 'projectCode',
            },
            {
                label: '所属组织',
                prop: 'orgId',
                component: 'dc-view',
                objectName: 'org',
            },
            {
                label: '终端客户代码',
                prop: 'customerCode',
            },
            {
                label: '设备种类',
                prop: 'quipmentDictId',
                dictData: 'DC_PMS_PROJECT_QIOPMENT',
                // 有可能有多个
                multiple: true,
                component: 'dc-dict',
            },
        ],
    },

    erpFnumber: {
        url: '/api/blade-bip/dc-erp-warehouse-keeper/select-data',
        defaultLabel: 'erpFnumber',
        defaultLabelName: 'ERP人员',
        title: 'ERP人员选择',
        placeholder: '请输入ERP人员查询选择',
        submitTitle: 'ERP人员',
        dialogGet: Api.wms.erpStock.keeperList,
        column: [
            {
                label: '用户工号',
                prop: 'erpFnumber',
            },
            {
                label: '人员名称',
                prop: 'realName',
            },
        ],
    },

    erpRealName: {
        url: '/api/blade-bip/dc-erp-warehouse-keeper/select-data',
        defaultLabel: 'realName',
        defaultLabelName: 'ERP人员',
        title: 'ERP人员选择',
        placeholder: '请输入ERP人员查询选择',
        submitTitle: 'ERP人员',
        dialogGet: Api.wms.erpStock.keeperList,
        column: [
            {
                label: '用户工号',
                prop: 'erpFnumber',
            },
            {
                label: '人员名称',
                prop: 'realName',
            },
        ],
    },

    stationConfig: {
        url: '/api/blade-bip/mmr-station-config/select-data',
        defaultLabel: 'stationName',
        defaultLabelName: '驻地名称',
        title: '驻地选择',
        placeholder: '请输入驻地名称查询选择',
        submitTitle: '驻地',
        dialogGet: Api.pdp.mmrStationConfig.list,
        column: [
            {
                label: '驻地名称',
                prop: 'stationName',
            },
            {
                label: '驻地编码',
                prop: 'stationCode',
            },
        ],
    },

    planItem: {
        url: '/api/blade-bip/plan-item/select-data',
        defaultLabel: 'planName',
        defaultLabelName: '计划名称',
        title: '计划选择',
        placeholder: '请输入计划名称查询选择',
        submitTitle: '计划',
        dialogGet: Api.pdp.planItem.getPlanitemList,
        column: [
            {
                label: '计划',
                prop: 'planName',
            },
        ],
    },
    customerRlist: {
        url: '/api/blade-bip/customer-rlist/select-data',
        defaultLabel: 'rlistName',
        defaultLabelName: '客户需求名称',
        title: '客户需求选择',
        placeholder: '请输入客户需求名称查询选择',
        submitTitle: '客户需求',
        dialogGet: Api.crm.customerRlist.list,
        column: [
            {
                label: '需求编码',
                prop: 'rlistCode',
            },
            {
                label: '需求名称',
                prop: 'rlistName',
            },
            {
                label: '需求版本',
                prop: 'updateVersion',
            },
            {
                label: '客户',
                prop: 'customerName',
            },
            {
                label: '商机',
                prop: 'oppsName',
            },
        ],
    },
    deliveredItem: {
        url: '/api/blade-bip/delivered-item/select-data',
        defaultLabel: 'mtoNo',
        defaultLabelName: '专案号',
        title: '专案选择',
        placeholder: '请输入专案号查询选择',
        submitTitle: '专案',
        dialogGet: Api.pdp.deliverystartsubmit.list,
        column: [
            {
                label: '专案号',
                prop: 'mtoNo',
            },
            {
                label: '成品名称',
                prop: 'name',
            },
            {
                label: '成品码',
                prop: 'code',
            },
        ],
    },
    scmPurchaseOrder: {
        // url: '/api/blade-bip/ScmPurchaseOrder/list',
        defaultLabel: 'no',
        defaultLabelName: '采购订单',
        title: '采购订单选择',
        placeholder: '请输入订单编号查询选择',
        submitTitle: '采购订单',
        dialogGet: Api.scm.purchaseOrder.getList,
        column: [
            {
                label: '订单编号',
                prop: 'no',
            },
            {
                label: '流程状态',
                prop: 'processStatus',
            },
            {
                label: '采购日期',
                prop: 'purchaseDate',
            },
            {
                label: '采购员',
                prop: 'purchaserId',
                component: 'dc-view',
                objectName: 'user',
            },
        ],
    },
    // 根据供应商ID获取库存单明细行
    scmInStockDetailList: {
        defaultLabel: 'productName',
        defaultLabelName: '物料名称',
        title: '供应商库存单明细选择',
        placeholder: '请输入商品名称查询选择',
        submitTitle: '库存列表',
        dialogGet: Api.wms.warehouse.supperList,
        column: [
            {
                prop: 'productName',
                label: '物料名称',
            },
            {
                prop: 'productCode',
                label: '物料编码',
            },
            {
                prop: 'brand',
                label: '品牌',
            },
            {
                prop: 'productUnit',
                label: '库存单位',
            },
            {
                prop: 'productQty',
                label: '采购数量',
            },
            {
                prop: 'productSpec',
                label: '规格型号',
            },
        ],
    },
    warehouse: {
        url: '/api/blade-bip/dc-wms-warehouse/select-data',
        // url:'/blade-bip/dc-wms-warehouse/list',
        defaultLabel: 'warehouseName',
        defaultLabelName: '仓库',
        title: '仓库选择',
        placeholder: '请输入仓库名称查询选择',
        submitTitle: '仓库',
        dialogGet: Api.wms.warehouse.list,
        column: [
            {
                label: '仓库编号',
                prop: 'warehouseCode',
            },
            {
                label: '仓库名称',
                prop: 'warehouseName',
            },
            {
                label: '仓库类型',
                prop: 'stockType',
                dictData: 'DC_WMS_STOCK_TYPE',
                component: 'dc-dict-key',
            },
            {
                label: '仓库地址',
                prop: 'warehouseAddress',
            },
            {
                label: '区域',
                prop: 'warehouseRegion',
            },
            // {
            //   label: '联系方式',
            //   prop: 'warehouseContactPhone',
            // },
            {
                label: '仓库负责人',
                prop: 'warehouseSupervisor',
                component: 'dc-view',
                objectName: 'user',
            },
        ],
    },


    warehouseOut: {
        // url: '/api/blade-bip/dc-wms-warehouse/select-data',
        url:'/blade-bip/dc-wms-warehouse/list',
        defaultLabel: 'warehouseName',
        defaultLabelName: '仓库',
        title: '仓库选择',
        placeholder: '请输入仓库名称查询选择',
        submitTitle: '仓库',
        dialogGet: Api.wms.warehouse.list,
        column: [
            {
                label: '仓库编号',
                prop: 'warehouseCode',
            },
            {
                label: '仓库名称',
                prop: 'warehouseName',
            },
            // {
            //     label: '仓库类型',
            //     prop: 'stockType',
            //     dictData: 'DC_WMS_STOCK_TYPE',
            //     component: 'dc-dict-key',
            // },
            // {
            //     label: '仓库地址',
            //     prop: 'warehouseAddress',
            // },
            // {
            //     label: '区域',
            //     prop: 'warehouseRegion',
            // },
            // {
            //   label: '联系方式',
            //   prop: 'warehouseContactPhone',
            // },
            // {
            //     label: '仓库负责人',
            //     prop: 'warehouseSupervisor',
            //     component: 'dc-view',
            //     objectName: 'user',
            // },
        ],
    },
    warehouseLocation: {
        url: '/api/blade-bip/dc-wms-warehouse-location/select-data',
        defaultLabel: 'locationName',
        defaultLabelName: '库位',
        title: '库位选择',
        placeholder: '请输入库位名称查询选择',
        submitTitle: '库位',
        dialogGet: Api.wms.warehouseLocation.list,
        column: [
            {
                label: '仓库名称',
                prop: 'warehouseId',
                component: 'dc-view',
                objectName: 'warehouse',
            },
            {
                label: '库位名称',
                prop: 'locationName',
            },
            {
                label: '过道编号',
                prop: 'locationAisle',
            },
            {
                label: '货架编号',
                prop: 'locationRack',
            },
            {
                label: '层号',
                prop: 'locationLevel',
            },
            {
                label: '归属组织',
                prop: 'orgId',
                component: 'dc-view',
                objectName: 'org',
            },
        ],
    },

    warehouseCount: {
        url: '/api/blade-bip/dc-wms-product/select-data',
        defaultLabel: 'productName',
        defaultLabelName: '库存',
        title: '库存选择',
        placeholder: '请输入物料名称查询选择',
        submitTitle: '库存',
        dialogGet: Api.wms.common.list,
        column: [
            {
                label: '物料名称',
                prop: 'productName',
                objectName: 'productName',
            },
            {
                label: '物料编码',
                prop: 'productCode',
            },
            {
                label: '规格型号',
                prop: 'productSpec',
            },
            {
                label: '计划跟踪号',
                prop: 'mtoNo',
            },
            {
                label: '数量',
                prop: 'number',
            },
            {
                label: '单位',
                prop: 'unit',
            },
            {
                label: '仓库名称',
                prop: 'warehouseId',
                component: 'dc-view',
                objectName: 'warehouse',
            },
            {
                label: '库位编码',
                prop: 'locationId',
                component: 'dc-view',
                objectName: 'warehouseLocation',
            },
        ],
    },

    dcWmsProduct: {
        url: '/api/blade-bip/dc-wms-product/select-data',
        defaultLabel: 'productName',
        defaultLabelName: '产品名称',
        title: '产品选择',
        placeholder: '请输入产品名称查询选择',
        submitTitle: '产品',
        column: [
            {
                label: '产品名称',
                prop: 'productName',
            },
            {
                label: '归属组织',
                prop: 'orgId',
                component: 'dc-view',
                objectName: 'org',
            },
            {
                label: '库位名称',
                prop: 'locationId',
                component: 'dc-view',
                objectName: 'warehouseLocation',
            },
        ],
    },
    cargoOwner: {
        url: '/api/blade-bip/dc-wms-cargo-owner/select-data',
        defaultLabel: 'cargoOwnerName',
        defaultLabelName: '货主名称',
        title: '货主选择',
        placeholder: '请输入货主名称查询选择',
        submitTitle: '货主',
        dialogGet: Api.wms.cargoOwner.list,
        column: [
            {
                label: '货主名称',
                prop: 'cargoOwnerName',
            },
            {
                label: '货主编码',
                prop: 'cargoOwnerCode',
            },
            {
                label: '仓库名称',
                prop: 'warehouseId',
                component: 'dc-view',
                objectName: 'warehouse',
            },
            {
                label: '库位名称',
                prop: 'locationId',
                component: 'dc-view',
                objectName: 'warehouseLocation',
            },
            {
                label: '归属组织',
                prop: 'orgId',
                component: 'dc-view',
                objectName: 'org',
            },
        ],
    },
    mmrPlanOrder: {
        url: '/api/blade-bip/mmr-plan-order/select-data',
        defaultLabel: 'lineCode',
        defaultLabelName: '现场计划单',
        title: '现场计划单选择',
        placeholder: '请输入现场计划单查询选择',
        submitTitle: '现场计划单',
        dialogGet: Api.pdp.mmrPlanOrder.list,
        column: [
            {
                label: '计划单号',
                prop: 'lineCode',
                overHidden: true,
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
            {
                label: '客户产品',
                prop: 'customerProductName',
                overHidden: true,
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
            {
                label: '厂区',
                prop: 'customerName',
                overHidden: true,
                search: true,
            },
            {
                label: '创建人',
                prop: 'createUserName',
                overHidden: true,
                search: true,
            },
        ],
    },
    pdpCustomerArea: {
        url: '/api/blade-bip/CrmCustomerArea/select-data',
        defaultLabel: 'areaName',
        defaultLabelName: '厂区',
        title: '厂区选择',
        placeholder: '请输入厂区查询选择',
        submitTitle: '厂区',
        dialogGet: Api.crm.crmCustomerArea.list,
        dialogRemove: Api.crm.crmCustomerArea.remove,
        dialogCreate: Api.crm.crmCustomerArea.submit,
        dialogEdit: Api.crm.crmCustomerArea.submit,
        column: [
            // {
            //   label: '客户名称',
            //   prop: 'customerId',
            // },
            {
                label: '厂区编码',
                prop: 'factoryCode',
                rules: [
                    {
                        required: true,
                        message: '请输入厂区编码',
                        trigger: ['blur', 'change', 'update:modelValue'],
                    },
                ],
            },
            {
                label: '区域名称',
                prop: 'areaName',
                formProp: 'areaCode',
                formSlot: true,
                rules: [
                    {
                        required: true,
                        message: '请选择区域名称',
                        trigger: ['blur', 'change', 'update:modelValue'],
                    },
                ],
            },
            {
                label: '详细地址',
                prop: 'address',
                rules: [
                    {
                        required: true,
                        message: '请输入详细地址',
                        trigger: ['blur', 'change', 'update:modelValue'],
                    },
                ],
            },
        ],
    },
    CrmCustomerArea: {
        url: '/api/blade-bip/CrmCustomerArea/select-data',
        defaultLabel: 'areaName',
        defaultLabelName: '厂区',
        title: '厂区选择',
        placeholder: '请输入厂区查询选择',
        submitTitle: '厂区',
        dialogGet: Api.crm.crmCustomerArea.list,
        dialogRemove: Api.crm.crmCustomerArea.remove,
        dialogCreate: Api.crm.crmCustomerArea.submit,
        dialogEdit: Api.crm.crmCustomerArea.submit,
        column: [
            {
                label: '客户名称',
                prop: 'customerId',
            },
            {
                label: '厂区编码',
                prop: 'factoryCode',
            },
            {
                label: '区域名称',
                prop: 'areaName',
            },
            {
                label: '详细地址',
                prop: 'address',
            },
        ],
    },
    CompleteMtoNo: {
        url: '/api/blade-bip/delivered-item/select-data',
        defaultLabel: 'billNo',
        defaultLabelName: '专案号',
        title: '成品专案选择',
        placeholder: '请输入专案号查询选择',
        submitTitle: '专案',
        dialogGet: Api.erp.feign.list,
        column: [
            {
                label: '专案号',
                prop: 'billNo',
                search: true,
                type: 'input',
                searchProps: {
                    is: 'input',
                },
            },
            {
                label: '成品名称',
                prop: 'name',
            },
            {
                label: '成品码',
                prop: 'number',
            },
            {
                label: '项目名称',
                prop: 'projectName',
            },
        ],
    },
    WireBomList: {
        defaultLabel: 'bomNo',
        defaultLabelName: 'BOM编码',
        title: 'BOM选择',
        placeholder: '请输入BOM编码查询选择',
        submitTitle: 'BOM',
        dialogGet: Api.mps.wireBom.list,
        column: [
            {
                prop: 'bomNo',
                type: 'rowText',
                label: '编码',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
            {
                prop: 'name',
                type: 'rowText',
                label: '名称',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
            {
                prop: 'bomVersion',
                type: 'rowText',
                label: 'bom版本',
            },
            {
                prop: 'auditStatus',
                type: 'rowText',
                label: '审核状态',
            },
        ],
    },
    Material: {
        defaultLabel: 'fnumber',
        defaultLabelName: '物料名称',
        title: '物料选择',
        placeholder: '请输入物料名称查询选择',
        submitTitle: '物料',
        dialogGet: Api.common.getMaterialSearchV2,
        search: {
            config: {
                fuseorgid: {
                    label: '所属组织',
                    paramKey: 'fuseorgid',
                    type: 'dc-select',
                    props: {
                        objectName: 'org',
                        placeholder: '请选择',
                    },
                },
                FNUMBER: {
                    type: 'input',
                    label: '物料编码',
                    paramKey: 'FNUMBER',
                    placeholder: `请输入物料编码`,
                },
                FNAME: {
                    type: 'input',
                    label: '物料名称',
                    paramKey: 'FNAME',
                    placeholder: `请输入物料名称`,
                },
                FSPECIFICATION: {
                    type: 'input',
                    label: '规格型号',
                    paramKey: 'FSPECIFICATION',
                    placeholder: `请输入规格型号`,
                },
            },
            params: {
                fuseorgid: '100006',
                FNUMBER: '',
                FNAME: '',
                FSPECIFICATION: '',
            },
        },
        column: [
            {
                prop: 'fnumber',
                label: '物料编码',
            },
            {
                prop: 'fname',
                label: '物料名称',
            },
            {
                prop: 'fspecification',
                label: '规格型号',
            },
            {
                prop: 'groupname',
                label: '分组名称',
            },
        ],
    },
    wireExecute: {
        defaultLabel: 'no',
        defaultLabelName: '线材执行单号',
        title: '线材执行单选择',
        placeholder: '请输入线材执行单号查询选择',
        submitTitle: '线材执行单',
        dialogGet: Api.mps.wireExecute.list,
        column: [
            {
                prop: 'auditStatus',
                label: '审核状态',
                type: 'rowText',
            },
            {
                prop: 'no',
                label: '执行单号',
                type: 'rowText',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
            {
                prop: 'mtoNo',
                label: '专案号',
                type: 'rowText',
            },
            {
                prop: 'projectName',
                label: '项目名称',
                type: 'rowText',
            },
            {
                prop: 'bomNo',
                label: 'bom编码',
                type: 'rowText',
            },
            {
                prop: 'materialName',
                label: '物料编码',
                type: 'rowText',
            },
            {
                prop: 'materialName',
                label: '物料名称',
                type: 'rowText',
            },
            {
                prop: 'qty',
                label: '加工件数',
                type: 'rowText',
            },
            {
                prop: 'bomVersion',
                label: 'bom版本',
                type: 'rowText',
            },
        ],
    },
    exchangeRate: {
        url: '/api/blade-bip/dc-scm-exchange-rate/select-data',
        defaultLabel: 'currency',
        defaultLabelName: '币种',
        title: '汇率选择',
        placeholder: '请输入币种查询选择',
        submitTitle: '汇率',
        dialogGet: Api.scm.exchangeRate.list,
        column: [
            {
                prop: 'currency',
                label: '币种',
                type: 'dict',
                dictData: 'DC_SCM_EXCHANGE_RATE',
                search: true,
                component: 'dc-dict-key',
                searchProps: {
                    is: 'select',
                },
            },
            {
                prop: 'exchangeRate',
                label: '汇率',
                type: 'rowText',
            },
        ],
    },
    erpCustomer: {
        defaultLabel: 'customerFName',
        defaultLabelName: '客户名称',
        title: 'erp客户选择',
        placeholder: '请输入币种查询选择',
        submitTitle: '客户',
        dialogGet: Api.erp.pro.erpCustomer,
        column: [
            {
                prop: 'FOrgId',
                label: '组织',
                type: 'dc-view',
                objectName: 'org',
            },
            {
                prop: 'customerFName',
                label: '客户名称',
                type: 'rowText',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
            {
                prop: 'customerFNumber',
                label: '客户编码',
                type: 'rowText',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
        ],
    },
    erpProject: {
        defaultLabel: 'fName',
        defaultLabelName: '项目名称',
        title: '项目选择',
        placeholder: '请输入项目名称查询选择',
        submitTitle: '项目',
        dialogGet: Api.erp.pro.erpProject,
        column: [
            {
                prop: 'fName',
                label: '项目名称',
                type: 'rowText',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
            {
                prop: 'fNumber',
                label: '项目编码',
                type: 'rowText',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
        ],
    },
    erpSaleOrder: {
        defaultLabel: 'fName',
        defaultLabelName: '销售订单',
        title: '销售订单选择',
        placeholder: '请输入销售订单查询选择',
        submitTitle: '销售订单',
        dialogGet: Api.erp.pro.erpSaleOrder,
        column: [
            {
                prop: 'materialName',
                label: '物料名称',
                type: 'rowText',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
            {
                prop: 'materialNumber',
                label: '物料编码',
                type: 'rowText',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
            {
                prop: 'projectCode',
                label: '专案号',
                type: 'rowText',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
        ],
    },
    erpPrdMoMaterial: {
        defaultLabel: 'materialName',
        defaultLabelName: '物料名称',
        title: '专案物料选择',
        placeholder: '专案物料查询选择',
        dialogGet: Api.erp.material.list,
        column: [
            {
                label: '计划跟踪号',
                prop: 'motno',
                search: true,
                searchProps: {
                    is: 'input',
                },
            },
            {
                label: '物料编码',
                prop: 'materialCode',
                searchProps: {
                    is: 'input',
                },
            },
            {
                label: '物料名称',
                prop: 'materialName',
                searchProps: {
                    is: 'input',
                },
            },
            {
                label: '规格型号',
                prop: 'specification',
            },
            {
                label: '数量',
                prop: 'qty',
            },
        ],
    },
};
