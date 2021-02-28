<template>
  <view class="addbt">
    <view class="addform u-padding-25">
      <view style="margin-top: 24rpx;padding: 30rpx;">
        <u-form :model="maintForm" ref="uForm">
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="130" label="设备" class="from-item scansty">
            <u-input v-model="maintForm.planMoldingId" placeholder="输入或扫描生产指令" maxlength="50" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" @blur="blur" />
            <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan" />
          </u-form-item>
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="130" label="增加时长" class="from-item scansty">
            <u-input v-model="maintForm.addTime" type="number" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @confirm="addRequest" />
          </u-form-item>
        </u-form>
      </view>
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
        planMoldingId: '',
        addTime: 0
      },
      border: true,
      planMoldingId: ''
    }
  },
  mounted() {},
  methods: {
    /**
     * 点击提交
     */
    submit() {
      let flag = false
      if (this.planMoldingId.length === 0 || this.maintForm.addTime === null) {
        flag = true
      }
      if (flag) {
        this.$refs.uToast.show({
          title: '检查未填写项填写!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      var params = {
        addTime: this.maintForm.addTime,
        planMoldingId: this.planMoldingId
      }
      this.$u.post(this.apiUrl.saveDryingTime, JSON.stringify(params)).then(res => {
        if (res.code === 0) {
          this.$refs.uToast.show({
            title: '提交成功',
            type: 'default',
            position: 'top'
          })
          this.maintForm = {
            planMoldingId: null,
            addTime: 0
          }
          this.planMoldingId = ''
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
     * 点击 扫描
     * */
    scan(val) {
      let self = this
      uni.setStorageSync('scan_type', val)
      uni.$once(val, function (data) {
        //onShelfLocationScan 是库位扫描 唯一
        self.maintForm.planMoldingId = data.result
        self.blur()
      })
      this.$u.route({
        url: '/pages/components/scan/index', //'/pages/workspace/equipment/index'
        params: {
          type: val
        }
      })
    },
    blur() {
      this.$u.get(this.apiUrl.getPlanList, { productDeviceCode: this.maintForm.planMoldingId, status: 0 }).then(res => {
        if (res.data.list.length > 0) {
          this.planMoldingId = res.data.list[0].id
        } else {
          this.$refs.uToast.show({
            title: '未查到任务，请重新扫描或者更换生产指令',
            type: 'default',
            position: 'bottom'
          })
          this.maintForm.planMoldingId = ''
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
  position: relative;

  .from-item {
    font-size: 23rpx;
    padding: 0px;
    height: 63rpx;
    line-height: 63rpx;
    margin-bottom: 25rpx;

    ::v-deep .u-form-item--right__content {
      background-color: #f6f6f6;
      line-height: 63rpx !important;
    }
    ::v-deep .u-input__input {
      font-size: 23rpx;
      min-height: 63rpx !important;
      line-height: 63rpx;
      vertical-align: center;
    }
    ::v-deep .uni-input-input {
      padding-left: 25rpx;
      padding-right: 25rpx;
      width: calc(100% - 50rpx);
      line-height: 63rpx !important;
    }
    .u-demo-result-line {
      width: 100%;
    }
  }
  .scansty {
    ::v-deep .uni-input-input {
      padding-left: 25rpx !important;
      padding-right: 75rpx !important;
      width: calc(100% - 100rpx) !important;
      line-height: 63rpx !important;
    }
    ::v-deep .u-input__right-icon {
      padding-right: 75rpx !important;
      height: 63rpx;
      line-height: 1 !important;
    }
    .u-abso {
      right: 75rpx;
    }
  }
  .scansty::placeholder {
    line-height: 63rpx;
    color: #969696;
    font-size: 23rpx;
    padding-left: 25rpx;
    padding-right: 75rpx;
    width: calc(100% - 50rpx);
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
