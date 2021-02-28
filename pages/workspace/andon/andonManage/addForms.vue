<template>
  <view class="addform u-padding-25">
    <view class="fromsifno">
      <u-form :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="故障类型" class="from-item">
          <u-input v-model="maintForm.typeName" disabled placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" placeholder="暂无数据" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="故障名称" class="from-item">
          <u-input v-model="maintForm.priorityName" :select-open="priorityshow" type="select" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" placeholder="请选择优先级" @click="priorityshow = true" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="发生时间" class="from-item">
          <u-input v-model="maintForm.starttime" :placeholder="'选择时间'" type="select" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" @click="dataShow = true" />
        </u-form-item>

        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修前照片" class="from-uploaditem">
          <u-upload ref="uUpload" :action="uploadUrl" :form-data="{'isAdd':true}" :show-progress='false' :max-size="200*1024*1024" max-count="1" width="110" height="110" @on-remove="onRemove" @on-success="successUpload"></u-upload>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题描述" class="from-item">
          <u-input v-model="maintForm.questiondesc" placeholder="问题描述" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
      </u-form>
      <u-button class="substy" @click="submit">提交</u-button>
      <u-select mode="single-column" :list="priorityList" v-model="priorityshow" @confirm="selectPriorityNConfirm"></u-select>
      <u-picker :cancel-color="'#323232'" :confirm-color="'#006fe6'" v-model="dataShow" :params="params" @confirm="confirm" mode="time"></u-picker>
      <u-toast ref="uToast"></u-toast>
    </view>
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
      dataShow: false, // 时间下拉是否显示
      current: 0,
      priorityshow: false, //故障名称下拉选择是否显示
      params: { year: true, month: true, day: true, hour: true, minute: true, second: true },
      maintForm: {
        matchNumber: '',
        typeName: '',
        priorityName: '',
        questiondesc: '',
        starttime: null
      },
      uploadUrl: this.apiUrl.appUrl + this.apiUrl.uploadFile,
      priorityList: [], //故障名称
      fileList: [], // 维修前照片
      itemInfo: null
    }
  },
  mounted() {
    const andonInfo = uni.getStorageSync('andonInfo')
    if (andonInfo) {
      this.itemInfo = JSON.parse(andonInfo)
      this.maintForm.typeName = JSON.parse(andonInfo).name
      this.type = JSON.parse(andonInfo).id
    }
    this.getDevicesClassifys()
  },
  methods: {
    /**
     * 发起时间选择确定
     */
    confirm(e) {
      this.maintForm.starttime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute + ':' + e.second
    },
    /**
     * 故障名称列表获取
     */
    getDevicesClassifys() {
      this.$u.get(this.apiUrl.malfunctionName, { type: this.type }).then(res => {
        this.priorityList = []
        for (const item of res.data) {
          this.priorityList.push({
            label: item.name,
            value: item.id
          })
        }
      })
    },
    /**
     * 故障名称选择 下拉框点击事件
     */
    selectPriorityNConfirm(e) {
      this.maintForm.priorityName = e[0].label
      this.maintForm.priority = e[0].value
    },

    /**
     * 移除已选择照片
     */
    onRemove(index, lists) {
      this.fileList.splice(index, 1)
    },
    successUpload(data, index, lists, name) {
      this.fileList.push(data.data)
    },
    /**
     * 点击上报
     */
    submit() {
      if (this.fileList.length == 0) {
        this.$refs.uToast.show({
          title: '请上传维修前照片',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      if (this.maintForm.questiondesc.length == 0) {
        this.$refs.uToast.show({
          title: '请填写问题描述',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      if (this.maintForm.priority.length == 0) {
        this.$refs.uToast.show({
          title: '请选择故障名称',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      if (this.maintForm.starttime.length == 0) {
        this.$refs.uToast.show({
          title: '请选择发生时间',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      this.$u
        .post(this.apiUrl.addMalfunction, {
          id: this.fileList[0].dataId,
          content: this.maintForm.questiondesc,
          problemId: this.maintForm.priority,
          createTime: this.maintForm.starttime,
          source: 1
        })
        .then(res => {
          if (res.code === 0) {
            this.$refs.uToast.show({
              title: '上报成功',
              type: 'success',
              position: 'top'
            })
            uni.navigateBack({
              delta: 1
            })
            // uni.$emit('reflashandonLoglist', {
            //   result: 1
            // })
          } else {
            this.$refs.uToast.show({
              title: '上报失败' + res.msg,
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
  .fromsifno {
    width: 100%;
    height: calc(100vh - 325rpx);
    overflow: auto;
  }
  ::v-deep .uni-input-placeholder {
    line-height: 63rpx;
  }
  .tabsty {
    // border-bottom: 1px solid #dfdfdf;
    margin-bottom: 25rpx;
    ::v-deep .u-steps__item__text--row {
      font-size: 20rpx;
    }
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
}
</style>