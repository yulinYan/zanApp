const api_url = {
  login: '/login',
  appUrl: 'http://192.168.2.163:90/fw-web',
  e2cUrl: 'http://192.168.2.163:10081',
  // appUrl: 'http://68.79.46.194:90/fw-web',
  // e2cUrl: 'http://68.79.46.194:10081',
  padLogout: '/padLogout',
  getUnfinishedTask: '/devicesKeepTask/getUnfinishedTask', // PAD查看未完成保养任务
  keepTaskList: '/devicesKeepTask/findList', // 查看保养任务列表
  taskExplainTask: '/devicesKeepTask/explainTask',
  //Yan=====================================
  getSpotUnifinshedTask: '/devicesCheck/findList',//点检表单
  saveSpotCheck: '/devicesCheck/save',//保存点检
  findHistoryList: '/logisticsBackHouse/findHistoryList',//物流退库历史列表
  logisticsBackHouseList: '/logisticsBackHouse/findList',//退库待办任务列表
  logisticsBackHouseDetailsList: '/logisticsBackHouse/getBackHouseDetail',//退料页面列表   根据id查
  cancellingStocks: '/logisticsBackHouse/cancellingStocks',//物流执行退库
  mouldunUsedsList: '/mouldDevices/findListUseRecord',//模具未使用列表
  taskExplainUsedsTask: 'mouldDevices/saveUseRecord',//模具确认上下模
  getUpList: '/logisticsUpHouse/findUpList',//上架列表查询
  getDownList: '/logisticsUpHouse/findDownList',//下架列表查询
  getUpDetailList: '/logisticsUpHouse/getUpHouse',//上架列表查明细
  getDownDetailList: '/logisticsUpHouse/getDownHouse',//下架列表查明细
  addupHouse: '/logisticsUpHouse/upHouse',//新增上架
  addDownHouse: '/logisticsUpHouse/downHouse',//新增下架
  getProductDetailByScanUp: '/logisticsProduct/getUpProductDetail',//PAD扫码获取物料详情
  getProductDetailByScan: '/logisticsProduct/getDownProductDetail',//PAD扫码获取物料详情

  getUserList: '/user/findList',//生产 获取人员名单
  getPlanList: '/injectionMolding/findList',//获取计划列表
  getPlanFinshedList: '/produceDuty/findList',//获取已安排人员列表
  saveProduceDuty: '/produceDuty/save',//保存安排
  saveProduceShift: '/produceShift/save',//换班交接提交保存
  getShiftFinshedList: '/produceShift/findList',// 获取换班交接记录
  getDryingTimeList: '/produceBake/findList',// 获取烘料列表
  saveDryingTime: '/produceBake/save',//保存烘料时长设置

  //Yan====================================
  getRepais: '/devicesRepai/findList',//设备维修列表
  findDecicesClassifyList: '/devicesRepairItem/findDecicesList', // 查询设备类型
  findQuestionList: '/devicesProblem/findList', // 获取问题
  uploadFile: '/attachment/upload', // 上传文件
  storeFindList: '/productDevicesSpare/findList', // 备品备件列表
  saveRepari: '/devicesRepai/save',
  deviceList: '/productDevices/findList',
  repairList: '/devicesRepairItem/findList',
  mouldrepairList: '/mouldRepairItem/findList',
  getRepariInfo: '/devicesRepai/findList', // 获取维修详情
  makeRepariProject: '/devicesRepai/makeProject', // 维修制定
  repairTaskExecute: '/devicesRepai/repairTaskExecute', // 维修执行
  mouldKeepTaskList: '/mouldKeepTask/findList', //模具计划列表
  taskExplainMouldTask: '/mouldKeepTask/explainTask',// 模具计划执行
  getMouldRepais: '/mouldRepair/findList',//设备维修列表
  findListSpareInfo: '/mouldKeepTeam/getMouldCode',
  savemouldRepair: '/mouldRepair/save',
  makemouldProject: '/mouldRepair/makeProject',
  repairmouldTaskExecute: '/mouldRepair/repairTaskExecute',
  findListMouldSpareInfo: '/mouldStorage/findListSpareInfo',
  getRepairTask: '/devicesRepai/getTask',
  getMouldRepairTask: '/mouldRepair/getTask',
  getAuditList: '/auditTask/findList',
  getAuditInfo: '/auditTask/findTaskDetailsById',
  saveAuditTask: '/auditTask/exeTask',
  getQuestionList: '/auditQuestion/findList',
  questionSave: '/auditQuestion/save',
  //============模具使用情况=============
  findListMouldOptRecord: '/mouldHouse/findList',
  mouldOperateConfirm: '/mouldHouse/save',
  //============物流管理=============
  findListLogistics: '/logisticsStoreHouse/findList',
  findListLogisticsByOrderNo: '/logisticsStoreHouse/findByOrderNo',
  setStoreHouseIn: '/logisticsStoreHouse/storeHouseIn',
  setBatchBound: '/logisticsStoreHouse/batchBound',
  findListlogisticsOut: '/logisticsOutHouse/findList',
  findByQrCode: '/logisticsOutHouse/findByQrCode',
  saveOutSubPack: '/logisticsOutHouse/saveOutSubPack',
  saveOutHouseDetail: '/logisticsOutHouse/saveOutHouseDetail',
  findOutSubpackage: '/logisticsOutHouse/findOutSubpackage',
  findDetailByProductOrder: '/logisticsOutHouse/findDetailByProductOrder',
  findDetailByOutHouseId: '/logisticsPickingOrder/findByOutHouseId',
  findStorageLocationList: '/logisticsStorageHouse/findStorageLocationList',
  // 盘库/移库/确认收货
  findMoveList: '/logisticsMoveHouse/findList',
  findTakeList: '/logisticsTakeOrder/findList',
  updateTake: '/logisticsTakeOrder/update',
  findCheckList: '/logisticsCheckHouse/findList',
  checkHouseUpdate: '/logisticsCheckHouse/update',
  findStoragePorductList: '/logisticsCheckHouse/findStoragePorductList',
  findHouseDetailList: '/logisticsCheckHouse/findDetailList',
  updateMoveHouseStatus: '/logisticsMoveHouse/updateMoveHouseStatus',
  findDetailCheckHouseList: 'logisticsCheckHouse/findDetailList',
  //生产
  findReceiveMaterialsReadyList: '/logisticsPicking/findList',
  saveReceiveMaterials: '/logisticsPicking/save',
  findByOutHouseId: '/logisticsDeliveryPlan/findByOutHouseId',
  findPutInMaterialsList: '/produceFeeding/findList',
  savePutInMaterials: '/produceFeeding/save',
  getStorageCount: '/produceFeeding/getStorageCount',
  // 二次加工
  findReworkList: '/reworkInjection/findList',
  startProduce: '/produceReworkRecord/startProduce',
  customsInspection: '/produceReworkRecord/customsInspection',
  endProduce: '/produceReworkRecord/endProduce',
  saveRework: '/produceReworkRecord/save',
  findReworkRecordList: '/produceReworkRecord/findList',
  findWareList: '/qualityStoreCheck/findList',
  scanGetProductDetail: '/logisticsProduct/getProductDetail',
  //安灯
  andonLogList: '/warnException/findList', // 安灯记录列表查询
  malfunctionName: '/warnException/findProblem', //故障名称
  addMalfunction: '/warnException/save',//新增故障
  startDispose: '/warnException/startDispose',//开始处理
  endDispose: '/warnException/endDispose'
}
export default api_url