<template>
  <view class="addform u-padding-25">
    <view class="headersty">
      <u-navbar :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="外部入库详情">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="fromsifno">
      <u-form :model="maintForm" ref="maintForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="订单号" class="from-item scansty">
          <u-input v-model="maintForm.orderNo" placeholder="订单号" disabled placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" />
        </u-form-item>
        <!--        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="库位编号" class="from-item">
          <u-input v-model="maintForm.location" disabled placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)"/>
        </u-form-item> -->
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="入库人" class="from-item scansty">
          <u-input v-model="maintForm.executeUser" disabled placeholder="暂无入库人" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="入库时间" class="from-item scansty">
          <u-input v-model="maintForm.executeTime" disabled placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" />
        </u-form-item>
      </u-form>
      <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">订单详情</u-divider>
      <view v-for="(item, index) of maintForm.orderInfo" :key="index" class="listy">
        <u-row>
          <u-col class="u-padding-top-26 u-padding-left-26" span="6">
            <view class="itemsty">
              物料代码：
              <view class="valuesty u-line-1">{{ item.logisticsProduct.code }}</view>
            </view>
            <view class="itemsty">
              来料批次号：
              <view class="valuesty u-line-1">{{ item.providerBatch }}</view>
            </view>
            <view class="itemsty">
              单位：
              <view class="valuesty u-line-1">{{ item.logisticsProduct.unit }}</view>
            </view>
            <view class="itemsty">
              物料数量：
              <view class="valuesty u-line-1">{{ item.storageCount }}</view>
            </view>
          </u-col>
          <u-col class="u-padding-top-26  u-padding-left-26" span="6">
            <view class="itemsty">
              物料名称：
              <view class="valuesty u-line-1">{{ item.logisticsProduct.name }}</view>
            </view>
            <view class="itemsty">
              泛沃批次号：
              <view class="valuesty u-line-1">{{ item.fwBatch }}</view>
            </view>
            <view class="itemsty">
              规格：
              <view class="valuesty u-line-1">{{ item.logisticsProduct.specs }}</view>
            </view>
            <view class="itemsty" style="text-align: left;">
              <u-button class="subscript" type="primary">打印标签</u-button>
            </view>
          </u-col>
        </u-row>
      </view>
      <u-button class="substy" @click="handleClose">关闭</u-button>
      <u-toast ref="uToast"></u-toast>
    </view>
  </view>
</template>

<script>
import btns from '../../../components/btn'
export default {
  name: 'FormsDetail', //生产入库详情
  components: {
    btns
  },
  data() {
    return {
      checkedPass: false,
      current: 0,
      isScan: true,
      maintForm: {
		id:'',
        orderNo: '',
        location: '暂存区',
        executeUser: '',
        executeTime: '',
        orderInfo: []
      }
    }
  },
  mounted() {
    const warehousingOut = uni.getStorageSync('warehousingOut')
    if (warehousingOut) {
      this.isScan = false
      const warehousingInfo = JSON.parse(warehousingOut)
      this.maintForm.orderNo = warehousingInfo.orderNo
      if (warehousingInfo.user) {
        this.maintForm.executeUser = warehousingInfo.user.name
      }
	  this.maintForm.id = warehousingInfo.id
      this.maintForm.executeUser = null
      this.maintForm.executeTime = warehousingInfo.executeTime
      this.maintForm.location = '暂存区'
      uni.removeStorageSync('warehousingOut')
      this.getMaterialsByOrderNo()
    }
  },
  methods: {
    /**
     * 按照订单号查询物料信息
     */
    getMaterialsByOrderNo() {
      this.$u
        .get(this.apiUrl.findListLogisticsByOrderNo, {
          storeHouseId: this.maintForm.id
        })
        .then(res => {
          if (res.code === 0) {
            this.maintForm.orderInfo = res.data
            if (res.data.length === 0) {
              this.$refs.uToast.show({
                title: '订单号无效!',
                type: 'default',
                position: 'bottom'
              })
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
     * 监听 "关闭"按钮click事件
     */
    handleClose() {
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
    // height: calc(100vh - 325rpx);
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

        ::v-deep uni-input {
          min-height: 0 !important;
          height: 35rpx !important;
        }
        ::v-deep .uni-input-input {
          font-size: 18rpx;
          width: 200rpx;
          float: left;
        }
        ::v-deep .u-input__input {
          min-height: 0 !important;
        }
      }

      .valuesty {
        display: inline-block;
        width: 180rpx;
        line-height: 1;
        color: #323232;
      }

      .subscript {
        width: 60%;
        font-size: 20rpx;
        height: 35rpx;
        border-color: #ffffff;
        border-radius: 6rpx;
        color: #fff;
      }

      .u-btn {
        margin: 0;
      }
    }
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
    .dividers {
      width: 100%;
      margin-bottom: 30rpx !important;
      :first-child {
        width: 10% !important;
      }

      :last-child {
        width: calc(90% - 95rpx) !important;
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
    margin-bottom: 69rpx;
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
