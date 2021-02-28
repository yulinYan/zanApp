<template>
  <view class="addform u-padding-25">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="出入库">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="tabsty">
      <u-tabs :bold="false" :list="tablist" :current="current" :is-scroll="false" :bar-height="2" :height="60" :font-size="20" inactive-color="#969696" active-color="#006fe6" bg-color="#fff"></u-tabs>
    </view>
    <view class="fromsifno">
      <!--入库-->
      <u-form v-if="current === 0" :model="maintForm" ref="maintForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具编号" class="from-item">
          <u-input v-model="maintForm.mouldCode" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" placeholder="模具编号" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具条码" class="from-item scansty">
          <u-input v-model="maintForm.mouldNo" placeholder="输入或扫一扫模具条码" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" @blur="checkMouldCode" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scanMouldCode()" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="库位编号" class="from-item">
          <u-input v-model="maintForm.nowLocation" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" placeholder="模具编号" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="库位条码" class="from-item scansty">
          <u-input v-model="maintForm.nowLocationNo" placeholder="输入或扫一扫库位条码" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" @blur="checkNowLocationCode(0)" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scanNowLocationCode()" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="匹配验证" class="from-item scansty">
          <u-tag :text="!checkedPass?'不匹配':'匹配'" :closeable="false" :type="!checkedPass?'error':'success'" />
        </u-form-item>
      </u-form>
      <!--出库-->
      <u-form v-if="current === 1" :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具编号" class="from-item">
          <u-input v-model="maintForm.mouldCode" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" placeholder="模具编号" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具条码" class="from-item scansty">
          <u-input v-model="maintForm.mouldNo" placeholder="输入或扫一扫模具条码" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" @blur="checkMouldCode()" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scanMouldCode()" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="库位编号" class="from-item">
          <u-input v-model="maintForm.nowLocation" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" placeholder="模具编号" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="匹配验证" class="from-item scansty">
          <u-tag :text="!checkedPass?'不匹配':'匹配'" :closeable="false" :type="!checkedPass?'error':'success'" />
        </u-form-item>
      </u-form>
      <!--移库-->
      <u-form v-if="current === 2" :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具编号" class="from-item">
          <u-input v-model="maintForm.mouldCode" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" placeholder="模具编号" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具条码" class="from-item scansty">
          <u-input v-model="maintForm.mouldNo" placeholder="输入或扫一扫模具条码" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" @blur="checkMouldCode()" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scanMouldCode()" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="旧库位编号" class="from-item">
          <u-input v-model="maintForm.oldLocation" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" placeholder="模具编号" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="新库位编号" class="from-item">
          <u-input v-model="maintForm.nowLocation" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" placeholder="模具编号" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="新库位条码" class="from-item scansty">
          <u-input v-model="maintForm.nowLocationNo" placeholder="输入或扫一扫库位条码" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" @blur="checkNowLocationCode(1)" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scanNowLocationCode()" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="匹配验证" class="from-item scansty">
          <u-tag :text="!checkedPass?'不匹配':'匹配'" :closeable="false" :type="!checkedPass?'error':'success'" />
        </u-form-item>
      </u-form>
      <u-button :class="!checkedPass?'substyDisable':'substy'" :disabled="!checkedPass" @click="submit">提交</u-button>
      <u-toast ref="uToast"></u-toast>
    </view>
  </view>
</template>

<script>
import btns from '../../../components/btn'
export default {
  name: 'AddForms', //模具入库、出库、移库操作
  components: {
    btns
  },
  data() {
    return {
      tablist: [
        {
          name: '入库'
        },
        {
          name: '出库'
        },
        {
          name: '移库'
        }
      ],
      checkedPass: false,
      current: -1,
      maintForm: {
        id: 94,
        nowLocationId: 24,
        nowLocation: '22',
        mouldId: 51,
        mouldName: 'MP1405-818',
        mouldCode: 'MP1405-818',
        houseNo: 'MJ05000016',
        createUser: 5,
        createTime: '2021-01-14 09:40:59',
        operate: 2,
        oldLocationId: 9,
        oldLocation: 'sasa',
        executeTime: null,
        executeUser: null,
        createUserName: null,
        status: 0,
        webPath: null,
        injectionMoldingId: null,
        nowLocationNo: '',
        mouldNo: 'xxx'
      }
    }
  },
  mounted() {
    const warehousingInfo = uni.getStorageSync('warehousingInfo')
    if (warehousingInfo) {
      const json = JSON.parse(warehousingInfo)
      this.maintForm = {
        id: json.id,
        nowLocationId: json.nowLocationId,
        nowLocation: json.nowLocation,
        mouldId: json.mouldId,
        mouldName: json.mouldName,
        mouldCode: json.mouldCode,
        houseNo: json.houseNo,
        createUser: json.createUser,
        createTime: json.createTime,
        operate: json.operate,
        oldLocationId: json.oldLocationId,
        oldLocation: json.oldLocation,
        executeTime: json.executeTime,
        executeUser: json.executeUser,
        createUserName: json.createUserName,
        status: json.status,
        webPath: json.webPath,
        injectionMoldingId: json.injectionMoldingId,
        nowLocationNo: json.nowLocationNo,
        mouldNo: json.mouldNo
      }
      this.current = this.maintForm.operate
      if (this.maintForm.nowLocation * 1 === 0) {
        this.maintForm.nowLocation = '暂存区'
      }
      this.maintForm.nowLocationNo = '' //新库位条码
      this.maintForm.mouldNo = '' //模具条码
      uni.removeStorageSync('warehousingInfo')
    }
  },
  methods: {
    /**
     * 监听"模具条码"文本框blur事件
     */
    checkMouldCode() {
      let sNewData = this.maintForm.mouldNo.toString().trim()
      if (sNewData != this.maintForm.mouldCode.toString().trim()) {
        this.$refs.uToast.show({
          title: '模具条码与模具编号不符!',
          type: 'default',
          position: 'bottom'
        })
      }
      this.checkedNo()
    },
    /**
     * 监听"新库位条码"文本框blur事件
     * @param {Number} type 操作类型 0 =库位;1=新库位
     */
    checkNowLocationCode(type) {
      let sNewData = this.maintForm.nowLocationNo.toString().trim()
      if (sNewData != this.maintForm.nowLocation.toString().trim()) {
        let tipText = '新库位条码与新库位编号不符!'
        if (type === 0) {
          tipText = '库位条码与库位编号不符!'
        }
        this.$refs.uToast.show({
          title: tipText,
          type: 'default',
          position: 'bottom'
        })
      }
      this.checkedNo()
    },
    /**
     * 监听"提交"按钮click事件
     */
    submit() {
      const mouldNo = this.maintForm.mouldNo.toString().trim()
      const nowLocationNo = this.maintForm.nowLocationNo.toString().trim()
      let tipText = '新库位条码'
      if (mouldNo.length === 0) {
        this.$refs.uToast.show({
          title: '模具条码不能为空!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      if (this.current === 0) {
        //入库
        tipText = '库位条码'
      }
      if (this.current != 1 && nowLocationNo.length === 0) {
        this.$refs.uToast.show({
          title: tipText + '不能为空!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      this.$u
        .post(
          this.apiUrl.mouldOperateConfirm,
          JSON.stringify({
            id: this.maintForm.id
          })
        )
        .then(res => {
          if (res.code === 0) {
            this.$refs.uToast.show({
              title: '提交成功!',
              type: 'default',
              position: 'bottom'
            })
            uni.navigateBack({
              delta: 1
            })
            uni.$emit('reflashlist', {
              result: 1
            })
            // this.$u.route({
            //   url: '/pages/workspace/moulds/warehousing/index'
            // })
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
     * 监听"模具条码"click事件--扫码
     */
    scanMouldCode() {
      uni.setStorageSync('scan_type', 'getMouldCodeScan')
      uni.$once('getMouldCodeScan', data => {
        //扫描后被回调
        this.$nextTick(() => {
          this.maintForm.mouldNo = data.result
          this.checkedNo()
        })
      })
      this.$u.route({
        url: '/pages/components/scan/index', //'/pages/workspace/equipment/index'
        params: {
          type: 'getMouldCodeScan'
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
     * 监听"新库位条码"click事件--扫码
     */
    scanNowLocationCode() {
      uni.setStorageSync('scan_type', 'getNowLocationCodeScan')
      let self = this
      uni.$once('getNowLocationCodeScan', data => {
        //扫描后被回调
        self.maintForm.nowLocationNo = data.result
      })
      this.$u.route({
        url: '/pages/components/scan/index', //'/pages/workspace/equipment/index'
        params: {
          type: 'getNowLocationCodeScan'
        }
      })
    },
    /**
     * 匹配验证
     */
    checkedNo() {
      const mouldNo = this.maintForm.mouldNo.trim().toString()
      if (this.current === 0 || this.current === 2) {
        //入库和移库
        const nowLocationNo = this.maintForm.nowLocationNo.trim().toString()
        if (mouldNo === this.maintForm.mouldCode && nowLocationNo === this.maintForm.nowLocation) {
          this.checkedPass = true
        } else {
          this.checkedPass = false
        }
      } else {
        if (mouldNo === this.maintForm.mouldCode) {
          this.checkedPass = true
        } else {
          this.checkedPass = false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addform {
  width: 100%;

  .fromsifno {
    width: 100%;
    height: calc(100vh - 325rpx);
    overflow: auto;
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
    height: 69rpx;
    font-size: 23rpx;
    border-color: #ffffff;
    background-color: #006fe6;
    border-radius: 6rpx;
    color: #fff;
  }
  .substyDisable {
    height: 69rpx;
    font-size: 23rpx;
    border-color: #ffffff;
    background-color: #ccc;
    border-radius: 6rpx;
    color: #fff;
  }
}
</style>
