<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="问题">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="addform u-padding-25">
      <u-form :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="发起人" class="from-item">
          <u-input v-model="maintForm.createrUser" :disabled="true" placeholder="发起人" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题" class="from-item">
          <u-input v-model="maintForm.question" :disabled="true" placeholder="问题" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题描述" class="from-item">
          <u-input v-model="maintForm.contents" :disabled="true" placeholder="问题描述" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="责任人" class="from-item">
          <u-input v-model="maintForm.peoples" :disabled="true" placeholder="责任人" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="照片" class="from-uploaditem">
          <u-image style="width: 110rpx; height: 110rpx;margin-right: 15rpx" :src="maintForm.fileid" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="处理结论" class="from-item">
          <u-input v-model="maintForm.result" :disabled="status === 1" placeholder="处理结论" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item v-if="status !== 1" :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="处理后照片" class="from-uploaditem">
          <u-upload ref="uUpload" :action="uploadUrl" :form-data="{'isAdd':true}" :max-size="200*1024*1024" max-count="1" width="110" height="110" @on-remove="onRemove" @on-success="successUpload"></u-upload>
        </u-form-item>
        <u-form-item v-if="status === 1" :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="照片" class="from-uploaditem">
          <u-image style="width: 110rpx; height: 110rpx;margin-right: 15rpx" :src="maintForm.aftfileid" />
        </u-form-item>
      </u-form>
      <u-button v-if="status !== 1" class="substy" @click="submit">提交</u-button>
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
        createrUser: '',
        question: '',
        peoples: '',
        contents: '',
        fileid: '',
        aftfileid: '',
        result: ''
      },
      fileList: [],
      uploadUrl: this.apiUrl.appUrl + this.apiUrl.uploadFile,
      defaultTime: '',
      dataShow: false,
      contentsList: [],
      status: 0,
      itemInfo: null
    }
  },
  mounted() {
    const questionInfo = uni.getStorageSync('questionInfo')
    if (questionInfo) {
      uni.removeStorageSync('questionInfo')
      this.itemInfo = JSON.parse(questionInfo)
      this.status = this.itemInfo.status
      this.maintForm = {
        createrUser: this.itemInfo.createUserName,
        question: this.itemInfo.question,
        peoples: this.itemInfo.dutyUserName,
        contents: this.itemInfo.questionDesc,
        fileid: this.itemInfo.createFile ? this.apiUrl.appUrl + this.itemInfo.createFile.replace(/\\/g, '/') : '',
        aftfileid: this.itemInfo.dealFile ? this.apiUrl.appUrl + this.itemInfo.dealFile.replace(/\\/g, '/') : '',
        result: this.itemInfo.dealResult ? this.itemInfo.dealResult : ''
      }
      console.log(this.maintForm)
    }
  },
  methods: {
    backPage() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashAuditlist', {
        result: 0
      })
    },
    onRemove(index, lists) {
      console.log(index, lists)
      this.fileList.splice(index, 1)
    },
    successUpload(data, index, lists, name) {
      console.log(data)
      this.fileList.push(data.data)
    },
    submit() {
      if (!this.maintForm.result) {
        this.$refs.uToast.show({
          title: '请填写处理结论!',
          type: 'default'
        })
        return
      }
      if (!this.fileList.length === 0) {
        this.$refs.uToast.show({
          title: '请上传处理后照片!',
          type: 'default'
        })
        return
      }
      this.$u
        .post(
          this.apiUrl.questionSave,
          JSON.stringify({
            dealResult: this.maintForm.result,
            dealFile: this.fileList[0].webPath,
            status: 1,
            id: this.itemInfo.id
          })
        )
        .then(res => {
          if (res.code === 0) {
            uni.navigateBack({
              delta: 1
            })
            uni.$emit('reflashAuditlist', {
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
}
</style>