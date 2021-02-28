<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="投料操作">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="addform u-padding-25">
      <u-form :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="130" label="生产指令" class="from-item">
          <u-input v-model="maintForm.productOrder" type="text" :disabled="true" placeholder="生产指令" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @confirm="addRequest" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="130" label="设备编码" class="from-item scansty">
          <u-input v-model="maintForm.scanProductDevicesId" placeholder="输入或扫描设备编码" :clearable="false" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" @blur="handleInputBlur(1)" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan(1)" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="130" label="物料编码" class="from-item scansty">
          <u-input v-model="maintForm.scanMaterialsId" placeholder="扫描物料编码" :clearable="false" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" @blur="handleInputBlur(2)" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan(2)" />
        </u-form-item>
      </u-form>
      <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">物料详情</u-divider>
      <view class="contelist contitem">
        <u-table border-color="#dfdfdf">
          <u-tr>
            <u-th class="heaertb">物料代码</u-th>
            <u-th class="heaertb">物料名称</u-th>
            <u-th class="heaertb">数量</u-th>
          </u-tr>
          <u-tr v-for="(tabs, ind) of contentsList" :key="ind" :class="ind%2 === 0 ? 'fontsty' : 'fontsty linsty'">
            <u-td>
              {{ tabs.code }}
            </u-td>
            <u-td>
              {{ tabs.name }}
            </u-td>
            <u-td>
				<u-number-box v-model="tabs.storageCount" :min="1" :max="tabs.storageCount*1"></u-number-box>
              <!-- <u-input v-model="tabs.storageCount" type="number" :clearable="false" :border="true" placeholder="数量" style="min-height: 45rpx !important;line-height: 45rpx !important;border: none;font-size: 20rpx;" /> -->
            </u-td>
          </u-tr>
        </u-table>
      </view>
      <u-button class="substy" @click="handleSubmit">提交</u-button>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import btns from '../../../components/btn'
export default {
  name: 'AddForms', // 投料操作
  components: {
    btns
  },
  data() {
    return {
      maintForm: {
        feedNo: '',
        produceFeedingDetails: [],
        productDevicesId: null,
        productOrder: '',
        scanMaterialsId: '',
        scanProductDevicesId: ''
      },
      contentsList: [],
      type: '',
      isBtnClick: true // 是否禁用
    }
  },
  mounted() {
    const putInMaterialsList = uni.getStorageSync('putInMaterialsList')
    if (putInMaterialsList) {
      let oPutInMaterialsList = JSON.parse(putInMaterialsList)
      this.maintForm.feedNo = oPutInMaterialsList.id
      this.maintForm.productDevicesId = oPutInMaterialsList.productDevicesId
      this.maintForm.productOrder = oPutInMaterialsList.productCode
      this.getMaterialsByProductOrder(oPutInMaterialsList.productCode)
      uni.removeStorageSync('putInMaterialsList')
    }
  },
  methods: {
    /**
     * 根据生产指令查询物料
     */
    getMaterialsByProductOrder(id) {
      this.$u
        .get(this.apiUrl.findDetailByProductOrder, {
          productOrder: id
        })
        .then(res => {
          let aData = res.data
          let aNewData = []
          if (aData.length > 0) {
            aData.map(item => {
              let newObj = {
                storageDetailId: item.storageDetailId,
                code: item.logisticsProduct?item.logisticsProduct.code:null,
                name: item.logisticsProduct?item.logisticsProduct.name:null,
                storageCount: 0
              }
              aNewData.push(newObj)
            })
          } else {
            this.isBtnClick = true
            this.$refs.uToast.show({
              title: '没有物料信息无法进行投料操作!',
              type: 'default'
            })
          }
          this.contentsList = aNewData
        })
    },
    /**
     * 按照 物料编号 查询物料信息
     * @param {Object} id
     */
    getMaterialsByCode(id) {
      this.$u
        .get(this.apiUrl.getStorageCount, {
          storageDetailId: id
        })
        .then(res => {
          if (res.code === 0) {
            this.optMaterialsData(res.data)
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
     * 处理物料数据
     * @param {Object} oMaterial 查询到的物料信息
     */
    optMaterialsData(oMaterial) {
      for (var i = 0; i < this.contentsList.length; i++) {
        if (this.contentsList[i].storageDetailId === oMaterial.storageDetailId) {
          let newCount = this.contentsList[i].storageCount === null ? oMaterial.storageCount * 1 : this.contentsList[i].storageCount * 1 + oMaterial.storageCount * 1
          this.contentsList[i].storageCount = newCount
        }
      }
    },
    /**
     * input blur事件
     * @param {Object} type type=1 扫设备编码; type=2 扫物料编码/
     */
    handleInputBlur(type) {
      if (type === 1) {
        if (this.maintForm.productDevicesId * 1 !== this.maintForm.scanProductDevicesId * 1) {
          this.$refs.uToast.show({
            title: '投料设备不匹配!',
            type: 'default'
          })
        }
      } else {
        if (this.maintForm.scanMaterialsId.toString().length > 0) {
          let nFind = this.contentsList.findIndex(item => {
            return item.storageDetailId === this.maintForm.scanMaterialsId * 1
          })
          if (nFind === -1) {
            this.$refs.uToast.show({
              title: '物料详情中不存在该物料!',
              type: 'default'
            })
            this.maintForm.scanMaterialsId = ''
          } else {
            this.getMaterialsByCode(this.maintForm.scanMaterialsId)
          }
        } else {
          this.maintForm.scanMaterialsId = ''
        }
      }
    },
    /**
     * 扫一扫 click事件
     * @param {Object} type
     */
    scan(type) {
      const names = type === 1 ? 'newScanDevice' : 'newScanMaterials'
      uni.setStorageSync('scan_type', names)
      let self = this
      uni.$once(names, function (data) {
        if (type === 1) {
          self.maintForm.scanProductDevicesId = data.result
        } else {
          self.maintForm.scanScanMaterialsId = data.result
        }
        self.handleInputBlur(type)
      })
      this.$u.route({
        url: '/pages/components/scan/index',
        params: {
          type: names
        }
      })
    },
    backPage() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashlist', {
        result: 0
      })
    },
    /**
     * 监听 提交 按钮 click事件
     */
    handleSubmit() {
      let scanTotal = 0
      let submitMaterial = []
      this.contentsList.map(item => {
        if (item.storageCount === null || item.storageCount == 0) {
          scanTotal++
        }
        let newObj = {
          storageCount: item.storageCount,
          storageDetailId: item.storageDetailId
        }
        submitMaterial.push(newObj)
      })
      if (this.contentsList.length === 0) {
        this.$refs.uToast.show({
          title: '没有物料信息无法提交!',
          type: 'default'
        })
        return
      } else if (this.maintForm.scanProductDevicesId.toString().length === 0) {
        this.$refs.uToast.show({
          title: '请先输入或扫描设备编码!',
          type: 'default'
        })
        return
      } else if (this.maintForm.productDevicesId * 1 !== this.maintForm.scanProductDevicesId * 1) {
        this.$refs.uToast.show({
          title: '投料设备不匹配,无法提交!',
          type: 'default'
        })
        return
      } else if (scanTotal >= this.contentsList.length) {
        this.$refs.uToast.show({
          title: '请扫描物料编码!',
          type: 'default'
        })
        return
      }
      let submitData = {
        feedNo: this.maintForm.feedNo,
        produceFeedingDetails: submitMaterial,
        productDevicesId: this.maintForm.productDevicesId,
        productOrder: this.maintForm.productOrder
      }
      this.$u.post(this.apiUrl.savePutInMaterials, JSON.stringify(submitData)).then(res => {
        if (res.code === 0) {
          uni.navigateBack({
            delta: 1
          })
          uni.$emit('reflashlist', {
            result: 1
          })
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: 'default',
            position: 'bottom'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addform {
  width: 100%;
  height: calc(100vh - 122rpx);
  overflow: auto;
  .iconsty {
    position: absolute;
    z-index: 999;
    right: 50rpx;
    line-height: 63rpx;
    height: 63rpx;
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

    .u-demo-result-line {
      width: 100%;
    }
  }
  .dividers {
    width: 100%;
    :first-child {
      width: 10% !important;
    }
    :last-child {
      width: calc(90% - 95rpx) !important;
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
        width: calc(100% - 420rpx);
        float: left;
        padding-top: 11rpx;
      }
      .u-table {
        margin-top: 20rpx;
        .u-th {
          font-weight: normal;
          font-size: 23rpx !important;
          line-height: 50rpx;
          height: 50rpx;
          color: #006fe6;
          background-color: #fafafa;
        }
        .u-td {
          font-size: 23rpx !important;
          line-height: 50rpx;
          height: 50rpx;
          ::v-deep .uni-input-placeholder {
            font-size: 18rpx !important;
          }
        }
      }
    }
    .heaertb {
      font-size: 20rpx;
      font-weight: normal;
      color: #006fe6;
      height: 50rpx;
      line-height: 50rpx;
      background-color: #fafafa;
    }
    .fontsty {
      ::v-deep .u-td {
        font-size: 20rpx !important;
        height: 50rpx;
        line-height: 50rpx;
        position: relative;
      }
      ::v-deep .uni-input-input {
        min-height: 45rpx !important;
        height: 45rpx !important;
        font-size: 20rpx !important;
      }
    }
    .linsty {
      background-color: #fafafa;
    }
  }

  .substy {
    height: 69rpx;
    font-size: 23rpx;
    border-color: #ffffff;
    background-color: #006fe6;
    border-radius: 6rpx;
    color: #fff;
  }
}
</style>