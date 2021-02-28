<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="设备点检">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="addform u-padding-25">
      <u-form :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="120" label="机台编号:" class="from-item">
          <u-input v-model="maintForm.productDevices" placeholder="机台编号" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="20" disabled />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="120" label="生产指令:" class="from-item">
          <u-input v-model="maintForm.productCode" :placeholder="'输入生产指令'" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="20" class="ressty" disabled />
        </u-form-item>
      </u-form>
      <u-divider :size="3" border-color="#969696" color="#006fe6" class="dividers">点检内容</u-divider>
      <view class="contelist">
        <view v-for="(item, index) of contentsList" :key="index">
          <view class="contitem">
            <view class="fons">{{ item.checkItemName }}</view>
            <u-checkbox v-model="item.checked" :size="23" shape="square" class="checksty"></u-checkbox>
            <u-input v-if="!item.checked" v-model="item.reason" :placeholder="'不合格原因'" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 20rpx; paddingLeft: 10rpx;paddingRight: 10rpx; width: calc(100% - 20rpx)" maxlength="20" class="ressty" />
          </view>
        </view>
      </view>
      <u-form :model="maintForm" ref="uForms">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="120" label="补充" class="from-item">
          <u-input type="textarea" v-model="maintForm.note" :placeholder="'请输入补充类容'" placeholder-style="line-height: 63rpx;paddingLeft:10rpx" maxlength="150" />
        </u-form-item>
      </u-form>
      <u-button class="substy" @click="submit">提交</u-button>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import btns from '../../../components/btn'
export default {
  components: {
    btns
  },
  data() {
    return {
      maintForm: {
        productDevices: '',
        productCode: '',
        note: '',
        checkDetailList: []
      },
      contentsList: [
        {
          name: '换弹簧',
          checked: true,
          reason: ''
        },
        {
          name: '安全扣',
          checked: true,
          reason: ''
        },
        {
          name: '排气',
          checked: true,
          reason: ''
        }
      ],
      params: {
        checkDetailList: [
          {
            id: 0,
            checkItemResult: 0,
            reason: 'string'
          }
        ],
        note: 'string',
        id: 0,
        status: 1
      }
    }
  },
  mounted() {
    this.getStorageInfo()
  },
  methods: {
    getStorageInfo() {
      let spotCheckInfo = JSON.parse(uni.getStorageSync('spotCheckInfo'))
      console.log(spotCheckInfo)
      if (spotCheckInfo) {
        this.maintForm.productDevices = spotCheckInfo.productDevices
        this.maintForm.productCode = spotCheckInfo.productCode
        this.params.id = spotCheckInfo.id
        this.contentsList = []
        uni.removeStorageSync('spotCheckInfo')
        for (const item of spotCheckInfo.checkDetailList) {
          var data = item
          data.checked = item.checkItemResult === 0
          this.contentsList.push(data)
        }
        uni.removeStorageSync('spotCheckInfo')
      }
      // this.maintForm.productDevices = spotCheckInfo.productDevices
      // this.maintForm.productCode = spotCheckInfo.productCode
    },
    submit() {
      console.log(this.contentsList)
      this.params.note = this.maintForm.note
      let flag = false
      // for (const (item,index) of contentsList)
      this.contentsList.forEach((item, index) => {
        if (!item.checked && item.reason.length === 0) {
          this.params.checkDetailList[index].id = item.id
          this.params.checkDetailList[index].reason = item.reason
          if (item.checked) {
            this.params.checkDetailList[index].checkItemResult = 0
          } else {
            this.params.checkDetailList[index].checkItemResult = 1
          }
          flag = true
          return
        }
      })
      if (flag) {
        this.$refs.uToast.show({
          title: '检查不合格项填写不合格理由!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      // console.log(this.params)
      this.$u.post(this.apiUrl.saveSpotCheck, JSON.stringify(this.params)).then(res => {
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
    },
    backPage() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashlist', {
        result: 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addform {
  width: 100%;
  height: calc(100vh - 171rpx);
  overflow: auto;
  margin-top: 20rpx;

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
        width: calc(100% - 580rpx);
        float: left;
        padding-top: 11rpx;
      }
    }

    .checksty {
      float: left;
      height: 45rpx !important;
      margin-left: 5rpx;
    }

    .ressty {
      float: left;
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
    height: 69rpx;
    font-size: 23rpx;
    border-color: #ffffff;
    background-color: #006fe6;
    border-radius: 6rpx;
    color: #fff;
    margin-top: 48rpx;
  }

  ::v-deep .uni-textarea-textarea {
    padding-left: 25rpx;
  }
}
</style>
