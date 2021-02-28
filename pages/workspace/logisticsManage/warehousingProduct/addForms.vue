<template>
  <view class="addform u-padding-25">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="生产入库">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="fromsifno">
      <u-form :model="maintForm" ref="maintForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="库位编号" class="from-item">
          <u-input v-model="maintForm.location" :disabled="true" placeholder-style="line-height:63rpx;color:#969696;fontSize:23rpx;paddingLeft:25rpx;paddingRight 25rpx;width:calc(100% - 50rpx);" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="任务单号" class="from-item scansty">
          <u-input  v-model="maintForm.houseNo" placeholder="任务单号" disabled placeholder-style="line-height:63rpx;color:#969696;fontSize:23rpx;paddingLeft:25rpx;paddingRight 25rpx;width:calc(100% - 50rpx);" />
        </u-form-item>
        <u-table border-color="#dfdfdf">
          <u-tr class="u-tr">
            <u-th class="u-th" width="35%">物料代码</u-th>
            <u-th class="u-th" width="35%">物流名称</u-th>
            <u-th class="u-th" width="15%">单位</u-th>
            <u-th class="u-th" width="15%">数量</u-th>
          </u-tr>
          <u-tr class="u-tr" v-for="(item,index) in maintForm.orderInfo" :key="index" :class="index % 2 === 0 ? 'fontsty' : 'fontsty linsty'">
            <u-td class="u-td" width="35%">{{item.logisticsProduct.code}}</u-td>
            <u-td class="u-td" width="35%">{{item.logisticsProduct.name}}</u-td>
            <u-td class="u-td" width="15%">{{item.logisticsProduct.unit}}</u-td>
            <u-td class="u-td" width="15%">{{item.storageCount}}</u-td>
          </u-tr>
        </u-table>
      </u-form>
      <u-button class="substy" @click="submit">提交</u-button>
      <u-toast ref="uToast"></u-toast>
    </view>
  </view>
</template>

<script>
import btns from '../../../components/btn'
export default {
  name: 'AddForms', //生产入库
  components: {
    btns
  },
  data() {
    return {
      maintForm: {
		taskId:'',
        houseNo: '',
        storeHouseId: '',
        location: '暂存区',
        orderInfo: []
      }
    }
  },
  mounted() {
    const warehousingProduct = uni.getStorageSync('warehousingProduct')
    if (warehousingProduct) {
      const warehousingInfo = JSON.parse(warehousingProduct)
      this.maintForm.taskId = warehousingInfo.id
	  this.maintForm.houseNo = warehousingInfo.houseNo
      uni.removeStorageSync('warehousingProduct')
      this.getMaterialsByOrderNo()
    }
  },
  methods: {
    /**
     * 监听搜索框 search和blur事件
     */
    handleConfirmSearch() {
      this.getMaterialsByOrderNo()
    },
    /**
     * 按照订单号查询物料信息
     */
    getMaterialsByOrderNo() {
      this.$u
        .get(this.apiUrl.findListLogisticsByOrderNo, {
          storeHouseId: this.maintForm.taskId
        })
        .then(res => {
          if (res.code === 0) {
            if (res.data.length === 0) {
              this.$refs.uToast.show({
                title: '订单号无效!',
                type: 'default',
                position: 'bottom'
              })
              this.maintForm.orderInfo = []
            } else {
              this.maintForm.storeHouseId = res.data[0].storeHouseId
              this.maintForm.orderInfo = res.data
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
     * 监听"提交"按钮click事件
     */
    submit() {
      const houseNo = this.maintForm.houseNo.trim().toString()
      if (houseNo.length === 0 && this.maintForm.storeHouseId.toString().length === 0) {
        this.$refs.uToast.show({
          title: '订单号无效!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      this.$u
        .get(this.apiUrl.setStoreHouseIn, {
          storeHouseId: this.maintForm.storeHouseId
        })
        .then(res => {
          if (res.code === 0) {
            this.$refs.uToast.show({
              title: '生产入库成功!',
              type: 'default',
              position: 'bottom'
            })
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
    },
	backPage() {
	  uni.navigateBack({
	    delta: 1
	  })
	}
  }
}
</script>

<style lang="scss" scoped>
.addform {
  width: 100%;

  .fromsifno {
    width: 100%;
    height: calc(100vh - 120rpx);
    overflow: auto;
    .u-table {
      margin-top: 20rpx;

      .u-th {
        font-weight: normal;
        font-size: 23rpx !important;
        line-height: 50rpx;
        height: 50rpx;
        color: #006fe6;
        height: 50rpx;
        line-height: 50rpx;
        background-color: #fafafa;
      }
      .u-td {
        font-size: 23rpx !important;
        line-height: 50rpx;
        height: 50rpx;
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
      padding-left: 0 !important;
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
    ::v-deep .uni-input-placeholder {
      color: #969696 !important;
      font-size: 23rpx !important;
      line-height: 40rpx !important;
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
}
</style>
