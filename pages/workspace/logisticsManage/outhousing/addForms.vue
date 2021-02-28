<template>
	<view class="addform u-padding-25">
		<view class="headersty">
			<u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'"
			 :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}"
			 title="物料出库">
				<view class="navbar-right" slot="right">
					<btns />
				</view>
			</u-navbar>
		</view>
		<view class="tabsty">
			<u-tabs :bold="false" :list="tablist" :current="currTabs" :is-scroll="false" :bar-height="2" :height="60" :font-size="20"
			 inactive-color="#969696" active-color="#006fe6" bg-color="#fff"></u-tabs>
		</view>
		<!--内部出库-->
		<view v-if="currTabs === 0">
			<view>
				<u-steps class="stepsStyle" :list="numList" :current="currentStep"></u-steps>
			</view>
			<!--内部出库  第1步：绑定来料批次号-->
			<view v-if="currentStep === 0" class="fromsifno">
				<u-form :model="maintForm" ref="maintForm">
					<u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="120"
					 label="物料编号" class="from-item scansty">
						<u-input v-model="maintForm.showProductCode" placeholder="扫一扫物料编号" disabled placeholder-style="color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 120rpx)"
						 maxlength="50"/>
						<u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scanOrderNo()" />
					</u-form-item>
				</u-form>
				<u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers" @click="handleChangeShow(1)">{{outDetailTitle}}</u-divider>
				<view v-show="outDetail" v-for="(item, index) of outDetailList" :key="index" class="listy">
					<u-row>
						<u-col class="u-padding-top-26 u-padding-left-26" span="6">
							<view class="itemsty">
								物料代码：
								<view class="valuesty u-line-1">{{ item.productCode }}</view>
							</view>
							<view class="itemsty">
								物料名称：
								<view class="valuesty u-line-1">{{ item.productName }}</view>
							</view>
							<view class="itemsty">
								生产指令：
								<view class="valuesty u-line-1">{{ item.productOrder }}</view>
							</view>
						</u-col>
						<u-col class="u-padding-top-26  u-padding-left-26" span="6">
							<view class="itemsty">
								单位：
								<view class="valuesty u-line-1">{{ item.unit }}</view>
							</view>
							<view class="itemsty">
								应出数量：
								<view class="valuesty u-line-1">{{ item.applyCount }}</view>
							</view>
							<view class="itemsty">
								实出数量：
								<view class="valuesty u-line-1">{{ (item.storageCount == null || item.storageCount ==0)?0:item.storageCount }}</view>
							</view>
						</u-col>
					</u-row>
				</view>
				<u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers" @click="handleChangeShow(2)">{{scanedDetailTitle}}</u-divider>
				<view v-show="scanedDetail" v-for="(item, index) of detailList" :key="index" class="listy">
					<u-row>
						<u-col class="u-padding-top-26 u-padding-left-26" span="6">
							<view class="itemsty">
								物料代码：
								<view class="valuesty u-line-1">{{ item.productCode }}</view>
							</view>
							<view class="itemsty">
								物料名称：
								<view class="valuesty u-line-1">{{ item.productName }}</view>
							</view>
							<view class="itemsty">
								应出数量：
								<view class="valuesty u-line-1">{{ item.applyCount }}</view>
							</view>
							<view class="itemsty">
								实出数量：
								<view class="valuesty u-line-1">{{ item.outCount }}</view>
							</view>
						</u-col>
						<u-col class="u-padding-top-26  u-padding-left-26" span="6">
							<view class="itemsty">
								库位编号：
								<view class="valuesty u-line-1">{{ item.storageCode }}</view>
							</view>
							<view class="itemsty">
								批次号：
								<view class="valuesty u-line-1">{{ item.batch }}</view>
							</view>
							<view class="itemsty">
								单位：
								<view class="valuesty u-line-1">{{ item.unit }}</view>
							</view>
							<view class="itemsty" style="text-align: left;">
								<u-button class="subscript" type="error" @click="handleDelete(index)">删除</u-button>
							</view>
						</u-col>
					</u-row>
				</view>
				<u-button class="substy" @click="submit">提交</u-button>
			</view>
			<!--内部出库  第2步：打印条码-->
			<view v-if="currentStep === 1" class="fromsifno">
				<u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">物料详情</u-divider>
				<view v-for="(item, index) of detailList" :key="index" class="listy">
					<u-row>
						<u-col class="u-padding-top-26 u-padding-left-26" span="6">
							<view class="itemsty">
								物料代码：
								<view class="valuesty u-line-1">{{ item.productCode }}</view>
							</view>
							<view class="itemsty">
								物料名称：
								<view class="valuesty u-line-1">{{ item.productName }}</view>
							</view>
							<view class="itemsty">
								应出数量：
								<view class="valuesty u-line-1">{{ item.applyCount }}</view>
							</view>
							<view class="itemsty">
								实出数量：
								<view class="valuesty u-line-1">{{ item.outCount }}</view>
							</view>
						</u-col>
						<u-col class="u-padding-top-26  u-padding-left-26" span="6">
							<view class="itemsty">
								库位编号：
								<view class="valuesty u-line-1">{{ item.storageCode }}</view>
							</view>
							<view class="itemsty">
								批次号：
								<view class="valuesty u-line-1">{{ item.batch }}</view>
							</view>
							<view class="itemsty">
								单位：
								<view class="valuesty u-line-1">{{ item.unit }}</view>
							</view>
							<view class="itemsty" style="text-align: left;">
								<u-button class="subscript" type="error">打印标签</u-button>
							</view>
						</u-col>
					</u-row>
				</view>
				<u-button class="substy" @click="handleComplete">完成</u-button>
			</view>
		</view>
		<!--外部出库-->
		<view v-if="currTabs === 1" class="fromsifno">
			<u-form :model="maintForm" ref="maintForm">
				<u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="120"
				 label="物料编号" class="from-item scansty">
					<u-input v-model="maintForm.showProductCode" placeholder="扫一扫物料编号" disabled placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 120rpx)"
					 maxlength="30"/>
					<u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scanOrderNoOut()" />
				</u-form-item>
			</u-form>
			<u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">物料详情</u-divider>
			<view v-for="(item, index) of detailList" :key="index" class="listy">
				<u-row>
					<u-col class="u-padding-top-26 u-padding-left-26" span="6">
						<view class="itemsty">
							物料代码：
							<view class="valuesty u-line-1">{{ item.productCode }}</view>
						</view>
						<view class="itemsty">
							应出数量：
							<view class="valuesty u-line-1">{{ item.planCount }}</view>
						</view>
						<view class="itemsty">
							实出数量：
							<view class="valuesty u-line-1" :style="{ color: item.planCount<item.partsCount ? '#fa3534' : '#323232' }">{{ item.partsCount }}</view>
							<!-- <u-input v-model="item.outCount" type="number" :disabled="true" placeholderStyle="font-size:18rpx;" :clearable="false" border style="width: 200rpx;font-size: 17rpx;" /> -->
						</view>
					</u-col>
					<u-col class="u-padding-top-26  u-padding-left-26" span="6">
						<view class="itemsty">
							物料名称：
							<view class="valuesty u-line-1">{{ item.productName }}</view>
						</view>
						<view class="itemsty">
							单位：
							<view class="valuesty u-line-1">{{ item.unit }}</view>
						</view>
						<view class="itemsty" style="text-align: left;">
							&nbsp;
							<!-- <u-button class="subscript" type="error" @click="handleDelete(index)">删除</u-button> -->
						</view>
					</u-col>
				</u-row>
			</view>
			<u-button class="substy" @click="submitOut">提交</u-button>
		</view>
		<u-toast ref="uToast"></u-toast>
		<!-- 内部出库--扫描物料编号后弹框-->
		<u-modal v-if="scanShow" v-model="scanShow" class="productModal" :show-confirm-button="false" :show-title="false">
			<view class="slot-content">
				<u-form :model="scanForm" ref="scanForm" label-width="185rpx" label-align="right">
					<u-form-item label="库位编号:">
						{{ scanForm.storageCode }}
					</u-form-item>
					<u-form-item label="物料编号:">
						{{ scanForm.productCode }}
					</u-form-item>
					<u-form-item label="供应商批次号:">
						<view style="height:36rpx;line-height:36rpx;width: 300rpx;">
							<u-input v-model="scanForm.providerBatch" type="select" border="true" @click="isShowSelect = true" />
						</view>
						<u-action-sheet :list="batchList" v-model="isShowSelect" @click="actionSheetCallback"></u-action-sheet>
					</u-form-item>
					<u-form-item label="库存:">
						{{ scanForm.showStorageCount }}
					</u-form-item>
					<u-form-item label="应出数量:">
						{{ scanForm.showApplyCount }}
					</u-form-item>
					<u-form-item label="实出数量:">
						<view style="width: 300rpx;">
							<u-input v-model="scanForm.outCount" type="number" :clearable="false" border="true" placeholder="请输入实出数量" />
						</view>
					</u-form-item>
				</u-form>
				<div class="footer">
					<u-button class="footerBtn" @click="handleCancel" size="mini">取消</u-button>
					<u-button class="footerBtn" type="primary" size="mini" @click="handleConfirm">确定</u-button>
				</div>
			</view>
		</u-modal>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import btns from '../../../components/btn'
	export default {
		name: 'AddForms', //外部入库
		components: {
			btns
		},
		data() {
			return {
				tablist: [{
						name: '内部出库'
					},
					{
						name: '外部出库'
					}
				],
				outDetail: true,
				outDetailTitle: '∧ 出库物料详情',
				scanedDetail: true,
				scanedDetailTitle: '∧ 已扫码物料详情',
				scanShow: false,
				checkedPass: false,
				currTabs: 0,
				current: 0,
				currentStep: 0,
				isScan: true,
				numList: [{
					name: '出库'
				}, {
					name: '打印条码'
				}],
				maintForm: {
					showProductId:'', // 物料id
					showProductCode:'',// 物料编号
					qrCode: '',
					location: '暂存区',
					orderInfo: []
				},
				batchList: [], // 物料批次号
				oldDetailList: [], // 原始物料详情
				newDetailList: [],
				detailList: [], // 物料详情
				outDetailList: [], // 出库物料详情
				isShowSelect: false,
				scanForm: {
					outDetailId: null,
					storageCode: '', //库位编号
					productCode: '',
					productName: null,
					providerBatch: null, //批次号
					applyCount: null, //应出数量
					showApplyCount: null, //应出数量
					outCount: null, // 实处数量
					unit: null
				}
			}
		},
		mounted() {
			const sOuthousing = uni.getStorageSync('outhousing')
			if (sOuthousing) {
				this.isScan = false
				const outhousing = JSON.parse(sOuthousing)
				uni.removeStorageSync('outhousing')
				var newArray = []
				outhousing.logisticsOutHouseDetailList.map(item => {
					newArray.push({
						id: item.id,
						productCode: item.logisticsProduct.code,
						productName: item.logisticsProduct.name,
						applyCount: item.applyCount, //应出数量
						outCount: item.storageCount, // 实出数量
						unit: item.logisticsProduct.unit
					})
				})
				if (outhousing.houseType * 1 === 1) { // 生产出库
					this.currTabs = 0
					this.getOutHouseById2(outhousing.id)
				} else { // 非生产出库
					this.oldDetailList = [...newArray]
					this.currTabs = 1
					//this.maintForm.orderInfo = outhousing.logisticsOutHouseDetailList
					this.getOutHouseById(outhousing.id)
				}
				this.maintForm.id = outhousing.id
			}
		},
		methods: {
			/**
			 * 监听u-divider组件click事件
			 */
			handleChangeShow(type) {
				if (type === 1) {
					this.outDetail = !this.outDetail
					if (!this.outDetail) {
						this.outDetailTitle = '∨ 出库物料详情'
					} else {
						this.outDetailTitle = '∧ 出库物料详情'
					}
				} else {
					this.scanedDetail = !this.scanedDetail
					if (!this.scanedDetail) {
						this.scanedDetailTitle = '∨ 已扫码物料详情'
					} else {
						this.scanedDetailTitle = '∧ 已扫码物料详情'
					}
				}
			},
			/**
			 * 查询生产出库物料
			 */
			getOutHouseById2(id) {
				this.$u
					.get(this.apiUrl.findDetailByOutHouseId, {
						outHouseId: id
					})
					.then(res => {
						this.outDetailList = []
						if (res.code === 0 && res.data.length > 0) {
							this.outDetailList = res.data
							this.oldDetailList = [...res.data]
						}
					})
			},
			/**
			 * 按照uuid查询物料信息
			 * @param {Object} uuid
			 * @param {Object} type 1 内部出库；2 外部出库
			 */
			getMaterialsByUUID(uuid,type) {
				this.$u
					.get(this.apiUrl.appUrl + this.apiUrl.scanGetProductDetail, { id: uuid })
					.then(res => {
						var resData = res
						if (resData.code === 0) {
							this.maintForm.showProductId = resData.data.productId
							this.maintForm.showProductCode = resData.data.productCode
							if(type === 1){
								this.getMaterialsByQrCode()
							}else{
								this.getMaterialsByQrCodeOut()
							}
						} else {
							this.$refs.uToast.show({
								title: res.msg,
								type: 'default',
								position: 'bottom'
							})
						}
					})
			},
			/**
			 * 查询非生产出库物料
			 */
			getOutHouseById(id) {
				this.$u
					.get(this.apiUrl.findByOutHouseId, {
						outHouseId: id
					})
					.then(res => {
						this.detailList = []
						for (const item of res.data) {
							var data = JSON.parse(JSON.stringify(item))
							let partsCount = 0
							for (const items of item.logisticsOutHouseDetails) {
								partsCount = partsCount + items.storageCount
							}
							data.partsCount = partsCount
							this.detailList.push(data)
						}
					})
			},
			/**
			 * 按照二维码(物料编号)查询物料信息--内部出库
			 */
			getMaterialsByQrCode() {
				this.$u
					.get(this.apiUrl.findByQrCode, {
						qrCode: this.maintForm.showProductId,
						outHouseId: this.maintForm.id,
						type: 0
					})
					.then(res => {
						var resData = res
						if (resData.code === 0) {
							this.optQrCodeAfterData(resData)
						} else {
							this.$refs.uToast.show({
								title: res.msg,
								type: 'default',
								position: 'bottom'
							})
						}
					})
			},
			/**
			 * 按照二维码(物料编号)查询物料信息--外部出库
			 */
			getMaterialsByQrCodeOut() {
				this.$u
					.get(this.apiUrl.findByQrCode, {
						qrCode: this.maintForm.showProductId,
						outHouseId: this.maintForm.id,
						type: 1
					})
					.then(res => {
						var resData = res
						if (resData.code === 0) {
							this.optQrCodeAfterData(resData)
						} else {
							this.$refs.uToast.show({
								title: res.msg,
								type: 'default',
								position: 'bottom'
							})
						}
					})
			},
			/**
			 * 处理扫码后返回的数据
			 */
			optQrCodeAfterData(resData) {
				if (resData.data === null) {
					this.$refs.uToast.show({
						title: '该物料二维码异常,没有查询到数据!',
						type: 'default',
						position: 'bottom'
					})
					return
				}
				this.scanForm.outDetailId = resData.data.outDetailId
				this.scanForm.storageCode = resData.data.storageCode //库位编号
				this.scanForm.productCode = resData.data.productCode
				this.scanForm.productName = resData.data.productName
				this.scanForm.productId = resData.data.productId
				this.scanForm.applyCount = resData.data.applyCount // 应出数量
				this.scanForm.unit = resData.data.unit
				let batch = resData.data.providerBatch
				if (this.currTabs === 0) { // 内部出库
					if (batch === null || batch.length === 0) {
						this.$refs.uToast.show({
							title: '该物料批次号为空，无法出库!',
							type: 'default',
							position: 'bottom'
						})
						return
					}
					let newBatchList = batch.split(',')
					let newList = []
					newBatchList.map(item => {
						newList.push({
							text: item
						})
					})
					this.batchList = newList
					this.scanForm.providerBatch = newList[0].text //批次号
				}
				if (this.currTabs == 1) { // 外部出库
					var nFindIndex = this.detailList.findIndex(item => {
						return item.id === resData.data.deliveryPlanId
					})
					var findPlanId = this.detailList[nFindIndex].logisticsOutHouseDetails.findIndex(item => {
						return item.storageDetailId === resData.data.id
					})
					if (findPlanId !== -1) {
						this.$refs.uToast.show({
							title: '该物料已被添加!',
							type: 'default',
							position: 'bottom'
						})
						return
					}
					if (nFindIndex !== -1) {
						var value = {
							applyCount: resData.data.storageCount,
							fwBatch: resData.data.fwBatch,
							note: '',
							outHouseId: this.maintForm.id,
							storageCount: resData.data.storageCount,
							storageDetailId: resData.data.id,
							storageLocationId: resData.data.storageId
						}
						if (this.detailList[nFindIndex].partsCount + resData.data.storageCount > this.detailList[nFindIndex].planCount) {
							this.$refs.uToast.show({
								title: '扫描物料库存超出应出数量,无法添加!',
								type: 'default',
								position: 'bottom'
							})
						} else {
							this.detailList[nFindIndex].partsCount = this.detailList[nFindIndex].partsCount + resData.data.storageCount
							this.detailList[nFindIndex].logisticsOutHouseDetails.push(value)
						}
					} else {
						this.$refs.uToast.show({
							title: '出库单中没有该物料!',
							type: 'default',
							position: 'bottom'
						})
					}
				} else {
					// 内部出库
					let outCountTotal = 0 // 同一物料实出数量统计
					let findIndex = -1
					this.outDetailList.map((item, index) => {
						if (item.productCode === resData.data.productCode) {
							findIndex = index
						}
					})
					let newStorageCount = this.outDetailList[findIndex].storageCount == null ? 0 : this.outDetailList[findIndex].storageCount *
						1
					let outTotal = this.outDetailList[findIndex].applyCount * 1 - newStorageCount * 1
					if (findIndex != -1 && outTotal <= 0) {
						this.$refs.uToast.show({
							title: '该物料已全部出库!',
							type: 'default',
							position: 'bottom'
						})
						return
					}
					this.detailList.map(item => {
						if (item.productCode === resData.data.productCode) {
							outCountTotal += item.outCount * 1
						}
					})
					this.scanForm.storageCount = resData.data.storageCount * 1
					this.scanForm.showStorageCount = resData.data.storageCount * 1 - outCountTotal
					this.scanForm.id = resData.data.id
					this.scanForm.storageId = resData.data.storageId
					this.scanForm.showApplyCount = outTotal - outCountTotal // 应出数量
					this.scanForm.outCount = outTotal - outCountTotal // 实出数量
					this.scanShow = true
				}
			},
			/**
			 * 监听"提交"按钮click事件--内部出库
			 */
			submit() {
				if (this.detailList.length === 0) {
					this.$refs.uToast.show({
						title: '物料详情不能为空!',
						type: 'default',
						position: 'bottom'
					})
					return
				}
				let materialsData = []
				this.outDetailList.map(item => {
					let findIndex4 = this.detailList.findIndex(item4 => {
						return item.productCode === item4.productCode
					})
					if (findIndex4 === -1) {
						let newObj = {
							applyCount: item.applyCount,
							fwBatch: item.fwBatch,
							logisticsOutSubpackages: [],
							outHouseId: this.maintForm.id,
							productOrder: item.productOrder,
							storageCount: 0,
							storageDetailId: null,
							pickingOrderId: item.id,
							storageLocationId: 0
						}
						materialsData.push(newObj)
					} else {
						this.detailList.map(item2 => {
							if (item.productCode === item2.productCode) {
								let findIndex = materialsData.findIndex(item3 => {
									return item2.id == item3.storageDetailId
								})
								let newObject = {
									batch: item2.batch,
									outCount: item2.outCount,
									productCode: item2.productCode,
									productId: item2.productId,
									productName: item2.productName,
									unit: item2.unit
								}
								if (findIndex === -1) {
									let newObj = {
										applyCount: item.applyCount,
										fwBatch: item.fwBatch,
										logisticsOutSubpackages: [],
										outHouseId: this.maintForm.id,
										productOrder: item.productOrder,
										storageCount: 0,
										storageDetailId: null,
										pickingOrderId: item.id,
										storageLocationId: 0
									}
									newObj.storageCount += item2.outCount * 1
									newObj.storageDetailId = item2.id
									newObj.storageLocationId = item2.storageId
									newObj.logisticsOutSubpackages.push(newObject)
									materialsData.push(newObj)
								} else {
									materialsData[findIndex].storageCount += item2.outCount * 1
									materialsData[findIndex].storageDetailId = item2.id
									materialsData[findIndex].storageLocationId = item2.storageId
									materialsData[findIndex].logisticsOutSubpackages.push(newObject)
								}
							}
						})
					}
				})
				var submitData = {
					data: materialsData,
					id: this.maintForm.id
				}
				this.$u.post(this.apiUrl.saveOutSubPack, JSON.stringify(submitData)).then(res => {
					if (res.code === 0) {
						this.$refs.uToast.show({
							title: '出库成功!',
							type: 'default',
							position: 'bottom'
						})
						this.currentStep = 1
					} else if (res.code === 1000) {
						this.$refs.uToast.show({
							title: res.msg,
							type: 'default',
							position: 'bottom'
						})
					} else {
						this.$refs.uToast.show({
							title: res.msg,
							type: 'default',
							position: 'bottom'
						})
					}
				})
			},
			/**
			 * 监听"提交"按钮click事件--外部出库
			 */
			submitOut() {
				if (this.detailList.length === 0) {
					this.$refs.uToast.show({
						title: '物料详情不能为空!',
						type: 'default',
						position: 'bottom'
					})
					return
				}
				var submitData = {
					id: this.maintForm.id,
					data: this.detailList
				}
				this.$u.post(this.apiUrl.saveOutHouseDetail, JSON.stringify(submitData)).then(res => {
					if (res.code === 0) {
						this.$refs.uToast.show({
							title: '出库成功!',
							type: 'default',
							position: 'bottom'
						})
						this.handleComplete()
					} else if (res.code === 1000) {
						this.$refs.uToast.show({
							title: '出库失败:' + res.msg,
							type: 'default',
							position: 'bottom'
						})
					} else {
						this.$refs.uToast.show({
							title: res.msg,
							type: 'default',
							position: 'bottom'
						})
					}
				})
			},
			backPage() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 监听"完成"按钮
			 */
			handleComplete() {
				uni.navigateBack({
					delta: 1
				})
				uni.$emit('reflashlist', {
					result: 1
				})
			},
			/**
			 * 监听"订单号"click事件--扫码--内部出库
			 */
			scanOrderNo() {
				uni.setStorageSync('scan_type', 'getOuthousingNoScan')
				let self = this
				uni.$once('getOuthousingNoScan', data => {
					let uuid = data.result.split('&')[0]
					//扫描后被回调
					self.maintForm.qrCode = uuid
					self.getMaterialsByUUID(uuid,1)// 按照uuid查询物料信息
				})
				this.$u.route({
					url: '/pages/components/scan/index',
					params: {
						type: 'getOuthousingNoScan'
					}
				})
			},
			/**
			 * 监听"订单号"click事件--扫码--外部出库
			 */
			scanOrderNoOut() {
				uni.setStorageSync('scan_type', 'getOuthousingNoScan')
				let self = this
				uni.$once('getOuthousingNoScan', data => {
					let uuid = data.result.split('&')[0]
					//扫描后被回调
					self.maintForm.qrCode = uuid
					self.getMaterialsByUUID(uuid,2)// 按照uuid查询物料信息
				})
				this.$u.route({
					url: '/pages/components/scan/index',
					params: {
						type: 'getOuthousingNoScan'
					}
				})
			},
			/**
			 * 扫码后弹框
			 * 监听"确定"按钮click事件
			 */
			handleConfirm() {
				let newOutCount = this.scanForm.outCount.toString().trim()
				if (newOutCount.length === 0 || newOutCount * 1 == 0) {
					this.$refs.uToast.show({
						title: '请输入实出数量!',
						type: 'default',
						position: 'bottom'
					})
					return
				} else if (newOutCount * 1 > this.scanForm.showStorageCount) {
					this.$refs.uToast.show({
						title: '实出数量不能超过库存量!',
						type: 'default',
						position: 'bottom'
					})
					return
				} else if (newOutCount * 1 > this.scanForm.showApplyCount) {
					this.$refs.uToast.show({
						title: '实出数量不能超过应出数量!',
						type: 'default',
						position: 'bottom'
					})
					return
				}
				let oDetail = {
					storageCode: this.scanForm.storageCode, // 库位编号
					batch: this.scanForm.providerBatch, // 批次号
					outCount: this.scanForm.outCount, // 实出数量
					outDetailId: this.scanForm.outDetailId,
					productCode: this.scanForm.productCode,
					productName: this.scanForm.productName,
					unit: this.scanForm.unit,
					id: this.scanForm.id,
					storageId: this.scanForm.storageId,
					productId: this.scanForm.productId,
					applyCount: this.scanForm.applyCount // 应出数量
				}
				let nFindIndex = this.oldDetailList.findIndex(item => {
					return item.productCode === oDetail.productCode
				})
				if (nFindIndex !== -1) {
					let nOutCountTotal = 0 // 实出数量总计
					let nApplyCountTotal = 0 // 应出数量总计
					this.detailList.map(item => {
						if (item.productCode === oDetail.productCode) {
							nOutCountTotal += item.outCount * 1
							nApplyCountTotal += item.applyCount * 1
						}
					})
					if (nOutCountTotal > nApplyCountTotal) {
						this.$refs.uToast.show({
							title: '实出数量不能超过应出数量!',
							type: 'default',
							position: 'bottom'
						})
					}
				} else {
					this.$refs.uToast.show({
						title: '出库单中没有该物料!',
						type: 'default',
						position: 'bottom'
					})
					return
				}
				this.detailList.push(oDetail)
				this.scanShow = false
			},
			/**
			 * 监听"删除"按钮click事件
			 * @param {Number} index 数组
			 */
			handleDelete(index) {
				this.detailList.splice(index, 1)
				if (this.currTabs === 1) {
					// 外部出库
					this.newDetailList = JSON.parse(JSON.stringify(this.detailList))
				}
			},
			/**
			 * 监听"取消"按钮click事件
			 */
			handleCancel() {
				this.scanShow = false
			},
			/**
			 * 监听u-actionSheet组件click事件
			 * @param {number} index 选中的下标
			 */
			actionSheetCallback(index) {
				this.scanForm.providerBatch = this.batchList[index].text
			}
		}
	}
</script>

<style lang="scss" scoped>
	.addform {
		width: 100%;

		.tabsty {
			border-bottom: 1px solid #dfdfdf;
			margin-bottom: 25rpx;
		}

		.stepsStyle {
			margin-bottom: 30rpx;
		}

		.fromsifno {
			width: 100%;
			height: calc(100vh - 325rpx);

			.listy {
				background-color: #f5f6fa;
				border-radius: 5rpx;
				overflow: hidden;
				position: relative;
				margin-bottom: 25rpx;

				.itemsty {
					font-size: 23rpx;
					color: #969696;
					margin-bottom: 30rpx;
					display: flex;
					justify-content: left;
					align-items: center;

					::v-deep uni-input {
						min-height: 0 !important;
						height: 36rpx !important;
						line-height: 36rpx !important;
					}

					::v-deep .uni-input-input {
						font-size: 23rpx;
						width: 200rpx;
						line-height: 36rpx !important;
						float: left;
					}

					::v-deep .u-input__input {
						min-height: 0 !important;
					}

					::v-deep .uni-input-placeholder {
						color: #969696 !important;
						font-size: 18rpx !important;
						line-height: 36rpx !important;
					}
				}

				.valuesty {
					display: inline-block;
					width: 200rpx;
					line-height: 1;
					color: #323232;
				}

				.subscript {
					width: 60%;
					font-size: 20rpx;
					height: 36rpx;
					line-height: 36rpx;
					border-color: #ffffff;
					border-radius: 6rpx;
					color: #fff;
				}

				.u-btn {
					margin: 0;
				}
			}
		}

		::v-deep .uni-input-placeholder {
			line-height: 63rpx;
		}

		.tabsty {
			border-bottom: 1px solid #dfdfdf;
			margin-bottom: 25rpx;
		}

		.getRadio {
			::v-deep .u-radio__label {
				margin-right: 10rpx;
			}
		}

		.checksty {
			height: 45vh;
			overflow: auto;
			text-align: center;
			padding-top: 25rpx;
			padding-bottom: 25rpx;
			width: 70vw;
			margin-left: 15vw;
			font-size: 20rpx;
		}

		.btnclose {
			color: #323232;
			font-size: 28rpx;
			padding-top: 10rpx;
			padding-left: 10rpx;
		}

		.succclose {
			color: #006fe6;
			font-size: 28rpx;
			padding-top: 10rpx;
			padding-right: 10rpx;
			text-align: right;
		}

		.titlesty {
			font-size: 22rpx;
			color: #006fe6;
			text-align: center;
		}

		.scansty {
			::v-deep .uni-input-input {
				padding-left: 25rpx !important;
				padding-right: 75rpx !important;
				width: calc(100% - 100rpx) !important;
			}

			::v-deep .u-input__right-icon {
				padding-right: 75rpx !important;
				line-height: 63rpx;
				height: 63rpx;
			}
		}

		.from-uploaditem {
			font-size: 23rpx;
			padding: 0px;
			line-height: 63rpx;
			margin-bottom: 25rpx;

			.namesty {
				margin-right: 15rpx;
			}

			::v-deep .u-delete-icon {
				width: 30rpx;
				height: 30rpx;
			}

			::v-deep .u-add-wrap {
				font-size: 20rpx;
			}
		}

		.from-item {
			font-size: 23rpx;
			padding: 0px;
			line-height: 63rpx;
			margin-bottom: 25rpx;

			::v-deep .u-form-item--right__content {
				background-color: #f6f6f6;
			}

			::v-deep .u-input__input {
				font-size: 23rpx;
				min-height: 63rpx !important;
			}

			::v-deep .uni-input-input {
				padding-left: 25rpx;
				padding-right: 25rpx;
				width: calc(100% - 50rpx);
			}

			::v-deep .u-input__right-icon {
				padding-right: 25rpx;
			}

			.u-demo-result-line {
				width: 100%;
			}

			.iconsty {
				position: absolute;
				z-index: 999;
				right: 50rpx;
				line-height: 63rpx;
				height: 63rpx;
			}
		}

		.dividers {
			width: 100%;
			margin-bottom: 30rpx !important;

			position: relative :first-child {
				width: 10% !important;
			}

			:last-child {
				width: calc(90% - 95rpx) !important;
			}

			span {
				color: #dadde2;
				font-size: 30px;
				position: absolute;
				top: 2rpx;
				right: -235rpx;
			}
		}

		.contelist {
			margin-top: 55rpx;
			margin-bottom: 25rpx;

			.contitem {
				width: 100%;
				font-size: 23rpx;
				min-height: 45rpx !important;
				margin-bottom: 10rpx;
				color: #323232;

				.fons {
					width: calc(100% - 380rpx);
					float: left;
					padding-top: 11rpx;
				}
			}

			.checksty {
				float: right;
				height: 45rpx !important;
			}

			.ressty {
				float: right;
				width: 300rpx;
				background: #f6f6f6 !important;

				::v-deep .u-input__input {
					min-height: 45rpx !important;
					height: 45rpx !important;
					font-size: 20rpx !important;
				}

				::v-deep .uni-input-input {
					padding-left: 10rpx;
					padding-right: 10rpx;
					width: calc(100% - 20rpx);
				}
			}

			.heaertb {
				font-size: 20rpx;
				font-weight: normal;
				color: #006fe6;
				background-color: #fafafa;
			}

			.linsty {
				background-color: #fafafa;
			}

			.tbinput {
				height: 35rpx;

				::v-deep .u-input__input {
					min-height: 35rpx !important;
					height: 35rpx !important;
					font-size: 20rpx !important;
				}
			}
		}

		.substy {
			margin-top: 69rpx;
			margin-bottom: 20rpx;
			height: 69rpx;
			font-size: 23rpx;
			border-color: #ffffff;
			background-color: #006fe6;
			border-radius: 6rpx;
			color: #fff;
		}

		.substyDisable {
			margin-top: 69rpx;
			height: 69rpx;
			font-size: 23rpx;
			border-color: #ffffff;
			background-color: #ccc;
			border-radius: 6rpx;
			color: #fff;
		}

		.productModal {
			.u-form {
				padding: 20rpx 20rpx;

				::v-deep uni-input {
					width: 200rpx !important;
					min-height: 0 !important;
					height: 36rpx !important;
					line-height: 36rpx !important;
				}

				::v-deep .uni-input-input {
					font-size: 18rpx;
					line-height: 36rpx !important;
				}

				::v-deep .u-input__input {
					min-height: 0 !important;
				}

				::v-deep .uni-input-placeholder {
					color: #969696 !important;
					font-size: 18rpx !important;
					line-height: 36rpx !important;
				}

				.u-form-item {
					font-size: 23rpx;
					color: #969696;
					padding: 10px 0;
				}

				.u-border-bottom:after {
					border: none;
				}
			}

			.footer {
				display: flex;
				padding-bottom: 50rpx;

				.footerBtn {
					width: 40% !important;
					height: 48rpx;
					line-height: 48rpx;
				}
			}

			::v-deep .u-form-item--right__content__slot {
				display: flex !important;
				flex-wrap: wrap !important;
				justify-content: flex-start !important;
			}
		}
	}
</style>
