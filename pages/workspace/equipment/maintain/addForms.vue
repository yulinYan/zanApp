<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="设备保养">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view v-if="status !== '2' && status !== '3'" class="addform u-padding-25">
      <u-form :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="设备编号" class="from-item">
          <u-input v-model="maintForm.matchNumber" :disabled="true" placeholder="扫描设备编号" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="预计开始时间" class="from-item">
          <view v-if="status === '0'" class="u-demo-result-line u-padding-left-25 u-padding-right-25" @click="showDate(0)">
            <u-icon name="calendar" size="23" style="margin-right: 10rpx" /> {{ maintForm.dateValue }}
          </view>
          <view v-if="status !== '0'" class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            <u-icon name="calendar" size="23" style="margin-right: 10rpx" /> {{ maintForm.dateValue }}
          </view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="预计结束时间" class="from-item">
          <view v-if="status === '0'" class="u-demo-result-line u-padding-left-25 u-padding-right-25" @click="showDate(1)">
            <u-icon name="calendar" size="23" style="margin-right: 10rpx" /> {{ maintForm.dateValue1 }}
          </view>
          <view v-if="status !== '0'" class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            <u-icon name="calendar" size="23" style="margin-right: 10rpx" /> {{ maintForm.dateValue1 }}
          </view>
        </u-form-item>
      </u-form>
      <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">保养内容</u-divider>
      <view class="contelist">
        <view v-for="(item, index) of contentsList" :key="index">
          <view class="contitem">
            <u-row :justify="'between'">
              <u-col span="6">
                <view class="fons">
                  {{ item.name }}
                  <view style="float:right">
                    <view class="filesty" @click="findFile(item)">查看指导书</view>
                  </view>
                </view>
              </u-col>
              <u-col v-if="status !== '0'" span="2">
                <u-checkbox v-if="item.header.length === 0" v-model="item.checked" :size="23" :disabled="status === '0'" shape="square" class="checksty">
                  <view style="font-size: 20rpx">{{ item.checked ? '合格' : '不合格' }}</view>
                </u-checkbox>
              </u-col>
              <u-col span="4">
                <u-input v-if="item.header.length === 0 && !item.checked" v-model="item.reason" :placeholder="'不合格原因'" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 20rpx; paddingLeft: 10rpx;paddingRight: 10rpx; width: calc(100% - 20rpx)}" maxlength="20" class="ressty" />
              </u-col>
            </u-row>
          </view>
          <view v-if="item.header.length !== 0" class="contitem">
            <u-table border-color="#dfdfdf">
              <u-tr>
                <u-th v-for="(tabs, ind) of item.header" :key="ind" class="heaertb">{{ tabs['value'+ind] }}</u-th>
              </u-tr>
              <u-tr v-for="(tabs, ind) of item.forms" :key="ind">
                <u-td v-for="(values, indobj) of Object.keys(tabs)" :key="indobj">
                  <u-input v-model="tabs['value'+indobj]" :placeholder="''" :disabled="status === '0'" :border="true" maxlength="20" class="tbinput" />
                </u-td>
              </u-tr>
            </u-table>
          </view>
        </view>
      </view>
      <u-form :model="maintForm" ref="uForms">
        <u-form-item v-if="status !== '0'" :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="保养照片" class="from-uploaditem">
          <u-upload ref="uUpload" :action="uploadUrl" :header="{'Authorization': tokens }" :form-data="{'isAdd':true}" :max-size="200*1024*1024" max-count="1" width="110" height="110" @on-remove="onRemove" @on-success="successUpload"></u-upload>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="备注" class="from-item">
          <u-input v-model="maintForm.remark" :placeholder="''" maxlength="50" />
        </u-form-item>
      </u-form>
      <u-button class="substy" @click="submit">{{ status === '4' ? '提交' : '领取' }}</u-button>
    </view>
    <view v-if="status === '2' || status === '3'" class="addform u-padding-25">
      <u-form :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="设备编号" class="from-item">
          <u-input v-model="maintForm.matchNumber" :disabled="true" placeholder="扫描设备编号" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="完成时间" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            <u-icon name="calendar" size="23" style="margin-right: 10rpx" /> {{ maintForm.dateValue }}
          </view>
        </u-form-item>
      </u-form>
      <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">保养内容</u-divider>
      <view class="contelist">
        <view v-for="(item, index) of contentsList" :key="index">
          <view class="contitem">
            <u-row :justify="'between'">
              <u-col span="6">
                <view class="fons">
                  {{ item.name }}
                  <view style="float:right">
                    <view class="filesty" @click="findFile(item)">查看指导书</view>
                  </view>
                </view>
              </u-col>
              <u-col v-if="status !== '0'" span="2">
                <u-checkbox v-if="item.header.length === 0" v-model="item.checked" :disabled="true" :size="23" shape="square" class="checksty">
                  <view style="font-size: 20rpx">{{ item.checked ? '合格' : '不合格' }}</view>
                </u-checkbox>
              </u-col>
              <u-col span="4">
                <u-input v-if="item.header.length === 0 && !item.checked" v-model="item.reason" :disabled="true" :placeholder="'不合格原因'" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 20rpx; paddingLeft: 10rpx;paddingRight: 10rpx; width: calc(100% - 20rpx)}" maxlength="20" class="ressty" />
              </u-col>
            </u-row>
          </view>
          <view v-if="item.header.length !== 0" class="contitem">
            <u-table border-color="#dfdfdf">
              <u-tr>
                <u-th v-for="(tabs, ind) of item.header" :key="ind" class="heaertb">{{ tabs['value'+ind] }}</u-th>
              </u-tr>
              <u-tr v-for="(tabs, ind) of item.forms" :key="ind" :class="ind%2 === 0 ? '' : 'linsty'">
                <u-td v-for="(values, indobj) of Object.keys(tabs)" :key="indobj">
                  {{ tabs['value'+indobj] }}
                </u-td>
              </u-tr>
            </u-table>
          </view>
        </view>
      </view>
      <u-form :model="maintForm" ref="uForms">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="保养照片" class="from-uploaditem">
          <u-image style="width: 110rpx; height: 110rpx;margin-right: 15rpx" :src="imageUrl" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="备注" class="from-item">
          <u-input v-model="maintForm.remark" :disabled="true" :placeholder="''" maxlength="50" />
        </u-form-item>
      </u-form>
    </view>
    <u-picker :cancel-color="'#323232'" :confirm-color="'#006fe6'" :defaultTime="defaultTime" :start-year="2020" :end-year="endDate" v-model="dataShow" :params="params" @confirm="confirm" mode="time"></u-picker>
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
        dateValue1: '',
        remark: ''
      },
      type: 0,
      defaultTime: '',
      uploadUrl: this.apiUrl.appUrl + this.apiUrl.uploadFile,
      params: { year: true, month: true, day: true, hour: true, minute: true },
      dataShow: false,
      endDate: new Date().getFullYear() + 5,
      contentsList: [],
      tokens: uni.getStorageSync('token'),
      fileList: [],
      imageUrl: '',
      itemInfo: null,
      status: ''
    }
  },
  mounted() {
    console.log(this.endDate)
    const maintainInfo = uni.getStorageSync('maintainInfo')
    if (maintainInfo) {
      this.itemInfo = JSON.parse(maintainInfo)
      this.status = this.itemInfo.status
      this.maintForm.matchNumber = this.itemInfo.devicesName
      uni.removeStorageSync('maintainInfo')
      this.contentsList = []
      if (this.itemInfo.status === '2' || this.itemInfo.status === '3') {
        this.imageUrl = this.apiUrl.appUrl + this.itemInfo.path.replace(/\\/g, '/')
        console.log(this.imageUrl)
        this.maintForm.remark = this.itemInfo.note
        this.maintForm.dateValue1 = this.itemInfo.endTime
        this.maintForm.dateValue = this.itemInfo.startTime
        for (const item of this.itemInfo.devicesKeepItem) {
          let headers = []
          let froms = []
          if (item.lists.length !== 0 && item.lists[0].rows !== 0) {
            const lis = JSON.parse(item.lists[0].columns)
            const keys = Object.keys(lis)
            for (const key of keys) {
              var datas = {}
              datas[key] = lis[key]
              headers.push(datas)
            }
            for (let i = 0; i < item.lists[0].rows; i++) {
              var datas = {}
              for (const key of keys) {
                datas[key] = ''
              }
              froms.push(datas)
            }
          }
          let plans = null
          for (const plan of this.itemInfo.planExecuteRecords) {
            if (plan.keepItemId === item.id) {
              plans = plan
            }
          }
          var data = {
            name: item.name,
            checked: plans.keepItemResult === '1',
            header: headers,
            keepItemId: item.id,
            webPath: item.webPath,
            reason: plans.reason,
            forms: froms
          }
          this.contentsList.push(data)
        }
      } else {
        if (this.status === '4') {
          this.maintForm.dateValue1 = this.itemInfo.endTime
          this.maintForm.dateValue = this.itemInfo.startTime
        }
        for (const item of this.itemInfo.devicesKeepItem) {
          let headers = []
          let froms = []
          if (item.lists.length !== 0 && item.lists[0].rows !== 0) {
            const lis = JSON.parse(item.lists[0].columns)
            const keys = Object.keys(lis)
            for (const key of keys) {
              var datas = {}
              datas[key] = lis[key]
              headers.push(datas)
            }
            for (let i = 0; i < item.lists[0].rows; i++) {
              var datas = {}
              for (const key of keys) {
                datas[key] = ''
              }
              froms.push(datas)
            }
          }
          var data = {
            name: item.name,
            checked: true,
            header: headers,
            keepItemId: item.id,
            reason: '',
            forms: froms,
            webPath: item.webPath
          }
          this.contentsList.push(data)
        }
      }
      console.log(this.contentsList)
    }
  },
  methods: {
    showDate(type) {
      this.type = type
      this.dataShow = true
    },
    cancel() {
      this.dataShow = false
    },
    confirm(e) {
      if (this.type === 0) {
        this.maintForm.dateValue = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute
      } else {
        this.maintForm.dateValue1 = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute
      }
    },
    findFile(item) {
      // const webPath = item.webPath.replace(/\\/g, '/')
      const webPath = item.path.replace(/\\/g, '/')
      uni.downloadFile({
        url: this.apiUrl.appUrl + '/attachment/downByPath?path=' + webPath, //this.apiUrl.appUrl + webPath, //仅为示例，并非真实的资源
        success: res => {
          console.log(res)
          if (res.statusCode === 200) {
            var filePath = res.tempFilePath
            uni.openDocument({
              filePath: filePath,
              success: function (res) {
                console.log('打开文档成功')
              }
            })
          }
        }
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
    backPage() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashmaintainlist', {
        result: 0
      })
    },
    submit() {
      if (this.maintForm.matchNumber.length === 0) {
        this.$refs.uToast.show({
          title: '设备编号不能为空!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      if (this.maintForm.dateValue.length === 0) {
        this.$refs.uToast.show({
          title: '请选择预计开始时间!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      if (this.maintForm.dateValue1.length === 0) {
        this.$refs.uToast.show({
          title: '请选择预计结束时间!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      const startdata = new Date(this.maintForm.dateValue)
      const enddata = new Date(this.maintForm.dateValue1)
      if (startdata.getTime() > enddata.getTime()) {
        this.$refs.uToast.show({
          title: '预计结束时间不能小于预计开始时间!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      if (this.status === '4' && this.fileList.length === 0) {
        this.$refs.uToast.show({
          title: '请选择保养照片!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      let lis = []
      let flag = false
      for (const item of this.contentsList) {
        var data = {
          keepItemId: item.keepItemId,
          keepItemResult: '',
          keepTaskId: this.itemInfo.id,
          reason: ''
        }
        if (item.header.length === 0 && !item.checked && item.reason.length === 0) {
          flag = true
          break
        }
        if (item.header.length === 0) {
          data.keepItemResult = item.checked ? '1' : '0'
          data.reason = item.checked ? '' : item.reason
        } else {
          data.reason = ''
          data.keepItemResult = JSON.stringify(item.forms)
        }
        lis.push(data)
      }
      if (flag) {
        this.$refs.uToast.show({
          title: '检查不合格项填写不合格理由!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      this.$u
        .post(
          this.apiUrl.taskExplainTask,
          JSON.stringify({
            id: this.itemInfo.id,
            note: this.maintForm.remark,
            startTime: this.maintForm.dateValue,
            endTime: this.maintForm.dateValue1,
            status: this.status === '0' ? 4 : 3,
            keepPhoto: this.status === '0' ? null : this.fileList[0].dataId,
            planExecuteRecords: this.status === '0' ? [] : lis
          })
        )
        .then(res => {
          if (res.code === 0) {
            uni.navigateBack({
              delta: 1
            })
            uni.$emit('reflashmaintainlist', {
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
        height: 45rpx !important;
        padding-top: 7rpx;
      }
      .filesty {
        font-size: 23rpx;
        min-height: 45rpx !important;
        color: #006fe6;
        padding-top: 5rpx;
      }
      .inputsty {
        width: 150rpx;
        // float: right;
      }
    }
    .checksty {
      // float: right;
      height: 45rpx !important;
      ::v-deep .u-checkbox__label {
        margin-right: 0px;
      }
    }
    .ressty {
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
      height: 50rpx;
      line-height: 50rpx;
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