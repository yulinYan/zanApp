<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="模具保养">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view v-if="status !== '2' && status !== '3'" class="addform u-padding-25">
      <view class="tabsty">
        <u-tabs :bold="false" :list="tablist" :current="current" :is-scroll="false" :bar-height="2" :height="60" :font-size="20" inactive-color="#969696" active-color="#006fe6" bg-color="#fff" @change="changeTab"></u-tabs>
      </view>
      <u-form v-if="current !== 2" :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具编号" class="from-item">
          <u-input v-model="maintForm.matchNumber" :disabled="true" placeholder="扫描模具编号" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具名称" class="from-item">
          <u-input v-model="maintForm.matchName" :disabled="true" placeholder="模具名称" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
      </u-form>
      <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="开始时间" class="from-item">
        <u-input v-if="status === '0'" v-model="maintForm.starttime" type="select" placeholder="开始时间" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @click="showCalendar = true" />
        <u-input v-if="status !== '0'" v-model="maintForm.starttime" type="select" placeholder="开始时间" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
      </u-form-item>
      <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="结束时间" class="from-item">
        <u-input v-if="status === '0'" v-model="maintForm.endtime" type="select" placeholder="结束时间" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @click="showCalendar1 = true" />
        <u-input v-if="status !== '0'" v-model="maintForm.endtime" type="select" placeholder="结束时间" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
      </u-form-item>
      <u-divider v-if="current !== 2" :size="23" border-color="#969696" color="#006fe6" class="dividers">保养内容</u-divider>
      <view v-if="current !== 2" class="contelist">
        <view v-for="(item, index) of contentsList" :key="index">
          <view class="contitem">
            <!-- <view class="fons">{{ item.name }}</view>
            <u-input v-if="!item.checked" v-model="item.reason" :placeholder="'不合格原因'" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 20rpx; paddingLeft: 10rpx;paddingRight: 10rpx; width: calc(100% - 20rpx)}" maxlength="20" class="ressty" />
            <u-checkbox v-model="item.checked" :size="23" shape="square" class="checksty">
              <view style="font-size: 20rpx">{{ item.checked ? '合格' : '不合格' }}</view>
            </u-checkbox> -->
            <u-row :justify="'between'">
              <u-col span="6">
                <view class="fons">
                  {{ item.name }}
                  <view style="float:right">
                    <view class="filesty" @click="findFile(item)">查看指导书</view>
                  </view>
                </view>
              </u-col>
              <u-col v-if="(current === 0 && status !== '0') || current !== 0" span="2">
                <u-checkbox v-model="item.checked" :size="23" :disabled="status === '0'" shape="square" class="checksty">
                  <view style="font-size: 20rpx">{{ item.checked ? '合格' : '不合格' }}</view>
                </u-checkbox>
              </u-col>
              <u-col span="4">
                <u-input v-if="!item.checked" v-model="item.reason" :placeholder="'不合格原因'" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 20rpx; paddingLeft: 10rpx;paddingRight: 10rpx; width: calc(100% - 20rpx)}" maxlength="20" class="ressty" />
              </u-col>
            </u-row>
          </view>
          <!-- <view v-if="item.header.length !== 0" class="contitem">
            <u-table border-color="#dfdfdf">
              <u-tr>
                <u-th v-for="(tabs, ind) of item.header" :key="ind" class="heaertb">{{ tabs['value'+ind] }}</u-th>
              </u-tr>
              <u-tr v-for="(tabs, ind) of item.forms" :key="ind" :class="ind%2 === 0 ? '' : 'linsty'">
                <u-td v-for="(values, indobj) of Object.keys(tabs)" :key="indobj">
                  <u-input v-model="tabs['value'+indobj]" :placeholder="''" maxlength="20" class="tbinput" />
                </u-td>
              </u-tr>
            </u-table>
          </view> -->
        </view>
      </view>
      <u-form v-if="current !== 2" :model="maintForm" ref="uForms">
        <u-form-item v-if="status === '4'" :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="保养照片" class="from-uploaditem">
          <u-upload ref="uUpload" :action="uploadUrl" :form-data="{'isAdd':true}" :max-size="200*1024*1024" max-count="1" width="110" height="110" @on-remove="onRemove" @on-success="successUpload"></u-upload>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="备注" class="from-item">
          <u-input v-model="maintForm.remark" :placeholder="''" maxlength="50" />
        </u-form-item>
      </u-form>
      <u-button class="substy" @click="submit">{{ status === '4' ? '提交' : '领取' }}</u-button>
      <u-picker v-model="showCalendar" :cancel-color="'#323232'" :confirm-color="'#006fe6'" mode="time" :params="params" @confirm="confirm"></u-picker>
      <u-picker v-model="showCalendar1" :cancel-color="'#323232'" :confirm-color="'#006fe6'" mode="time" :params="params" @confirm="confirms"></u-picker>
    </view>
    <view v-if="status === '2' || status === '3'" class="addform u-padding-25">
      <view class="tabsty">
        <u-tabs :bold="false" :list="tablist" :current="current" :is-scroll="false" :bar-height="2" :height="60" :font-size="20" inactive-color="#969696" active-color="#006fe6" bg-color="#fff" @change="changeTab"></u-tabs>
      </view>
      <u-form v-if="current !== 2" :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具编号" class="from-item">
          <u-input v-model="maintForm.matchNumber" :disabled="true" placeholder="扫描模具编号" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具名称" class="from-item">
          <u-input v-model="maintForm.matchName" :disabled="true" placeholder="模具名称" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="开始时间" class="from-item">
          <u-input v-if="status === '0'" v-model="maintForm.starttime" type="select" placeholder="开始时间" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @click="showCalendar = true" />
          <u-input v-if="status !== '0'" v-model="maintForm.starttime" type="select" placeholder="开始时间" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="结束时间" class="from-item">
          <u-input v-if="status === '0'" v-model="maintForm.endtime" type="select" placeholder="结束时间" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @click="showCalendar1 = true" />
          <u-input v-if="status !== '0'" v-model="maintForm.endtime" type="select" placeholder="结束时间" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
      </u-form>
      <!-- <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="完成时间" class="from-item">
        <u-input v-model="maintForm.endtime" :disabled="true" type="select" placeholder="完成时间" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
      </u-form-item> -->
      <u-divider v-if="current !== 2" :size="23" border-color="#969696" color="#006fe6" class="dividers">保养内容</u-divider>
      <view v-if="current !== 2" class="contelist">
        <view v-for="(item, index) of contentsList" :key="index">
          <view class="contitem">
            <!-- <view class="fons">{{ item.name }}</view>
            <u-input v-if="!item.checked" v-model="item.reason" :disabled="true" :placeholder="'不合格原因'" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 20rpx; paddingLeft: 10rpx;paddingRight: 10rpx; width: calc(100% - 20rpx)}" maxlength="20" class="ressty" />
            <u-checkbox v-model="item.checked" :size="23" :disabled="true" shape="square" class="checksty">
              <view style="font-size: 20rpx">{{ item.checked ? '合格' : '不合格' }}</view>
            </u-checkbox> -->
            <u-row :justify="'between'">
              <u-col span="6">
                <view class="fons">
                  {{ item.name }}
                  <view style="float:right">
                    <view class="filesty" @click="findFile(item)">查看指导书</view>
                  </view>
                </view>
              </u-col>
              <u-col span="2">
                <u-checkbox v-model="item.checked" :size="23" :disabled="true" shape="square" class="checksty">
                  <view style="font-size: 20rpx">{{ item.checked ? '合格' : '不合格' }}</view>
                </u-checkbox>
              </u-col>
              <u-col span="4">
                <u-input v-if="!item.checked" v-model="item.reason" :disabled="true" :placeholder="'不合格原因'" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 20rpx; paddingLeft: 10rpx;paddingRight: 10rpx; width: calc(100% - 20rpx)}" maxlength="20" class="ressty" />
              </u-col>
            </u-row>
          </view>
        </view>
      </view>
      <u-form v-if="current !== 2" :model="maintForm" ref="uForms">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="保养照片" class="from-uploaditem">
          <u-image style="width: 110rpx; height: 110rpx;margin-right: 15rpx" :src="imageUrl" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="备注" class="from-item">
          <u-input v-model="maintForm.remark" :disabled="true" :placeholder="''" maxlength="50" />
        </u-form-item>
      </u-form>
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
      tablist: [
        {
          name: '定期保养'
        },
        {
          name: '产前保养'
        },
        {
          name: '在线保养'
        },
        {
          name: '产后保养'
        }
      ],
      current: 0,
      showCalendar: false,
      showCalendar1: false,
      params: { year: true, month: true, day: true, hour: true, minute: true },
      maintForm: {
        matchNumber: '',
        matchName: '',
        dateValue: '',
        starttime: '',
        endtime: '',
        remark: ''
      },
      defaultTime: '',
      dataShow: false,
      contentsList: [],
      fileList: [],
      uploadUrl: this.apiUrl.appUrl + this.apiUrl.uploadFile,
      imageUrl: '',
      itemInfo: null,
      status: ''
    }
  },
  mounted() {
    const maintainInfo = uni.getStorageSync('maintainInfo')
    if (maintainInfo) {
      this.itemInfo = JSON.parse(maintainInfo)
      uni.removeStorageSync('maintainInfo')
      if (this.itemInfo.keepType === 1) {
        this.current = 0
      } else if (this.itemInfo.keepType === 2) {
        this.current = 1
      } else if (this.itemInfo.keepType === 4) {
        this.current = 3
      } else {
        this.current = 2
      }
      this.status = this.itemInfo.status
      if (this.itemInfo.status === '2' || this.itemInfo.status === '4' || this.itemInfo.status === '3') {
        this.maintForm.starttime = this.itemInfo.startTime
        this.maintForm.endtime = this.itemInfo.endTime
        if (this.itemInfo.status === '3') {
          this.maintForm.remark = this.itemInfo.note
          this.imageUrl = this.apiUrl.appUrl + this.itemInfo.path.replace(/\\/g, '/')
        }
      }
      this.maintForm.matchNumber = this.itemInfo.mouldCode
      this.maintForm.matchName = this.itemInfo.mouldName
      // uni.removeStorageSync('maintainInfo')
      this.contentsList = []
      for (const item of this.itemInfo.mouldKeepItem) {
        var data = {
          name: item.name,
          checked: true,
          keepItemId: item.id,
          webPath: item.webPath,
          reason: ''
        }
        for (const plans of this.itemInfo.planExecuteRecords) {
          if (plans.keepItemId === item.id) {
            data.checked = plans.keepItemResult === '1'
            data.reason = plans.reason
            break
          }
        }
        this.contentsList.push(data)
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
      this.maintForm.starttime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute
    },
    changeTab(index) {
      // this.current = index
    },
    confirms(e) {
      this.maintForm.endtime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute
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
      uni.$emit('reflashmouldsMainlist', {
        result: 0
      })
    },
    submit() {
      if (!this.maintForm.matchNumber || this.maintForm.matchNumber.length === 0) {
        this.$refs.uToast.show({
          title: '设备编号不能为空!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      if (this.maintForm.starttime.length === 0) {
        this.$refs.uToast.show({
          title: '开始时间不能为空!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      if (this.maintForm.endtime.length === 0) {
        this.$refs.uToast.show({
          title: '结束时间不能为空!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      const startdata = new Date(this.maintForm.starttime)
      const enddata = new Date(this.maintForm.endtime)
      if (startdata.getTime() > enddata.getTime()) {
        this.$refs.uToast.show({
          title: '结束时间不能小于开始时间!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      // if (this.maintForm.dateValue.length === 0) {
      //   this.$refs.uToast.show({
      //     title: '请选择预计结束时间!',
      //     type: 'default',
      //     position: 'bottom'
      //   })
      //   return
      // }
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
          keepItemResult: item.checked ? '1' : '0',
          keepTaskId: this.itemInfo.id,
          reason: item.checked ? '' : item.reason
        }
        if (!item.checked && item.reason.length === 0) {
          flag = true
          break
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
          this.apiUrl.taskExplainMouldTask,
          JSON.stringify({
            id: this.itemInfo.id,
            note: this.maintForm.remark,
            planExecuteRecords: this.status === '0' ? [] : lis,
            status: this.status === '4' ? 3 : 4,
            keepType: this.itemInfo.keepType,
            injectionMoldingId: this.itemInfo.injectionMoldingId,
            mouldId: this.itemInfo.mouldId,
            keepPhoto: this.status === '4' ? this.fileList[0].dataId : null,
            startTime: this.maintForm.starttime,
            endTime: this.maintForm.endtime
          })
        )
        .then(res => {
          if (res.code === 0) {
            uni.navigateBack({
              delta: 1
            })
            uni.$emit('reflashmouldsMainlist', {
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
  .tabsty {
    border-bottom: 1px solid #dfdfdf;
    margin-bottom: 25rpx;
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