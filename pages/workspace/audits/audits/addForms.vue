<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="审核">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="addform u-padding-25">
      <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">审核内容</u-divider>
      <view class="contelist">
        <view v-for="(item, index) of contentsList" :key="index">
          <view class="contitem">
            <u-row :justify="'between'">
              <u-col span="6">
                <view class="fons">{{ item.itemName }}</view>
              </u-col>
              <u-col span="6">
                <view style="float: right">
                  <u-button v-if="!item.checked" size="mini" type="primary" @click="setReason(item,index)">{{ status !== 1 ? '填写原因' : '查看原因' }}</u-button>
                </view>
                <u-checkbox v-model="item.checked" :size="23" :disabled="status === 1" shape="square" class="checksty">
                  <view style="font-size: 20rpx">{{ item.checked ? '合格' : '不合格' }}</view>
                </u-checkbox>
              </u-col>
            </u-row>
            <!-- <view style="float: right"> -->
            <!-- <u-input v-if="!item.checked" v-model="item.reason" :disabled="status === 1" :placeholder="'不合格原因'" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 20rpx; paddingLeft: 10rpx;paddingRight: 10rpx; width: calc(100% - 20rpx)}" maxlength="20" class="ressty" /> -->
            <!-- </view> -->
          </view>
        </view>
      </view>
      <u-button v-if="status !== 1" class="substy" @click="submit">提交</u-button>
    </view>
    <u-popup v-model="dataShow" mode="center" width="700rpx" height="390rpx" border-radius="5">
      <view class="headers">
        {{ status !== 1 ? '填写原因' : '查看原因' }}
      </view>
      <view class="bodys">
        <u-form :model="reasonItem" ref="uForm">
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题原因" class="from-item">
            <u-input v-model="reasonItem.reason" :disabled="status === 1" placeholder="问题原因" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
          </u-form-item>
          <u-form-item v-if="status !== 1" :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题照片" class="from-uploaditem">
            <u-upload ref="uUpload" :action="uploadUrl" :form-data="{'isAdd':true}" :max-size="200*1024*1024" max-count="1" width="110" height="110" @on-remove="onRemove" @on-success="successUpload"></u-upload>
          </u-form-item>
          <u-form-item v-if="status === 1" :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题照片" class="from-uploaditem">
            <u-image style="width: 110rpx; height: 110rpx;margin-right: 15rpx" :src="reasonItem.picture" />
          </u-form-item>
        </u-form>
      </view>
      <view class="footers">
        <u-row :justify="'between'">
          <u-col span="6" style="text-align:center">
            <u-button v-if="status !== 1" size="mini" type="primary" style="width:80%" @click="addReason()">确定</u-button>
          </u-col>
          <u-col span="6" style="text-align:center">
            <u-button size="mini" style="width:80%" @click="dataShow = false">取消</u-button>
          </u-col>
        </u-row>
      </view>
    </u-popup>
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
        matchNumber: '',
        dateValue: '',
        remark: ''
      },
      defaultTime: '',
      dataShow: false,
      contentsList: [],
      fileList: [],
      status: 0,
      uploadUrl: this.apiUrl.appUrl + this.apiUrl.uploadFile,
      reasonIndex: -1,
      reasonItem: {
        reason: '',
        picture: ''
      },
      itemInfo: null
    }
  },
  mounted() {
    const auditInfo = uni.getStorageSync('auditInfo')
    if (auditInfo) {
      uni.removeStorageSync('auditInfo')
      this.itemInfo = JSON.parse(auditInfo)
      this.status = this.itemInfo.taskStatus
      this.maintForm.matchNumber = this.itemInfo.devicesName
      // uni.removeStorageSync('maintainInfo')
      this.contentsList = []
      this.$u
        .get(this.apiUrl.getAuditInfo, {
          id: this.itemInfo.id,
          status: this.itemInfo.taskStatus
        })
        .then(res => {
          for (const item of res.data) {
            var data = {
              id: item.id,
              itemId: item.itemId,
              itemName: item.itemName,
              reason: item.reason ? item.reason : '',
              result: item.result === null || item.result === undefined ? '' : item.result,
              taskNo: item.taskNo,
              checked: item.result === null || item.result === undefined ? true : item.result === 1,
              picture: item.picture ? this.apiUrl.appUrl + item.picture.replace(/\\/g, '/') : ''
            }
            this.contentsList.push(data)
          }
        })
      console.log(this.contentsList)
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
    addReason() {
      if (!this.reasonItem.reason) {
        this.$refs.uToast.show({
          title: '请填写问题原因!',
          type: 'default'
        })
        return
      }
      if (this.fileList.length === 0) {
        this.$refs.uToast.show({
          title: '请上传问题照片!',
          type: 'default'
        })
        return
      }
      this.contentsList[this.reasonIndex].reason = this.reasonItem.reason
      this.contentsList[this.reasonIndex].picture = this.fileList[0].webPath
      this.dataShow = false
      console.log(this.contentsList)
    },
    setReason(item, index) {
      this.reasonIndex = index
      this.reasonItem = item
      this.fileList = []
      this.dataShow = true
    },
    submit() {
      let lis = []
      let flag = false
      for (const item of this.contentsList) {
        if (!item.checked && (item.reason.length === 0 || item.picture.length === 0)) {
          flag = true
          break
        }
        var data = {
          auditItemId: item.itemId,
          auditItemName: item.itemName,
          auditItemResult: item.checked ? '1' : '0',
          auditTaskId: this.itemInfo.id,
          reason: item.reason,
          picture: item.picture
        }
        lis.push(data)
      }
      if (flag) {
        this.$refs.uToast.show({
          title: '审核不合格项填写不合格理由!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      this.$u
        .post(
          this.apiUrl.saveAuditTask,
          JSON.stringify({
            id: this.itemInfo.id,
            auditItemDetailList: lis
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
        width: 100%;
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
.headers {
  width: 100%;
  text-align: left;
  line-height: 36rpx;
  font-size: 28rpx;
  padding: 10rpx 32rpx;
  border-bottom: 1px solid #969696;
}
.bodys {
  padding: 0rpx 32rpx;
}
.footers {
  border-top: 1px solid #969696;
  padding: 10rpx 32rpx;
  text-align: center;
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
</style>