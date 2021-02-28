<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="安灯记录">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="addform u-padding-25">
      <u-form :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="故障类型" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            {{ maintForm.name }}
          </view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="故障名称" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            {{ maintForm.name }}
          </view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="报警来源" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            {{ maintForm.source==0?'系统':maintForm.source==1?'人工':'其他' }}
          </view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题描述" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            {{ maintForm.content }}
          </view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题照片" class="from-uploaditem">
          <u-image style="width: 110rpx; height: 110rpx;margin-right: 15rpx" :src="imageUrl" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="报警人" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            {{ maintForm.createUserName }}
          </view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="报警时间" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            {{ maintForm.createTime }}
          </view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="状态" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            {{ maintForm.status ===0?'未处理':maintForm.status ===1?'处理中':'已完成' }}
          </view>
        </u-form-item>
        <u-form-item v-if="maintForm.process" :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="升级阶段" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            {{ maintForm.process }}
          </view>
        </u-form-item>
        <u-form-item v-if="maintForm.dealUserName" :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="处理人" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            {{ maintForm.dealUserName }}
          </view>
        </u-form-item>
        <u-form-item v-if="maintForm.startTime" :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="开始处理时间" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            {{ maintForm.startTime }}
          </view>
        </u-form-item>
        <u-form-item v-if="maintForm.endTime" :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="完成处理时间" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            {{ maintForm.endTime }}
          </view>
        </u-form-item>
        <!-- <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="备注" class="from-item">
          <view class="u-demo-result-line u-padding-left-25 u-padding-right-25">
            {{ maintForm.remark }}
          </view>
        </u-form-item> -->
      </u-form>
      <u-button v-if="maintForm.status ===0" class="substy" @click="submitStart">开始处理</u-button>
      <u-button v-if="maintForm.status ===1" class="substy" @click="submitEnd">完成处理</u-button>
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
  props: ['active'],
  watch: {
    active: function (newData, oldData) {
      this.activeTab = newData
    }
  },
  data() {
    return {
      maintForm: {},
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
      activeTab: 3
    }
  },
  mounted() {
    this.initForm()
    this.activeTab = this.active
  },
  methods: {
    /**
     * 初始化列表的值
     */
    initForm() {
      const andonListInfo = uni.getStorageSync('andonListInfo')
      if (andonListInfo) {
        this.itemInfo = JSON.parse(andonListInfo)
        this.maintForm = this.itemInfo
        this.imageUrl = this.apiUrl.appUrl + this.itemInfo.webPath.replace(/\\/g, '/')
      }
    },
    /**
     * 开始处理
     */
    submitStart() {
      this.$u
        .post(
          this.apiUrl.startDispose,
          JSON.stringify({
            id: this.itemInfo.id
          })
        )
        .then(res => {
          if (res.code === 0) {
            this.$refs.uToast.show({
              title: '开始处理',
              type: 'success',
              position: 'top'
            })
            this.getList()
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
     * 完成处理
     */
    submitEnd() {
      this.$u
        .post(
          this.apiUrl.endDispose,
          JSON.stringify({
            id: this.itemInfo.id
          })
        )
        .then(res => {
          if (res.code === 0) {
            uni.navigateBack({
              delta: 1
            })
            uni.$emit('reflashandonLoglist', {
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
    /**
     * 开始时完成之后重新获取故障列表
     */
    getList() {
      this.$u
        .get(this.apiUrl.andonLogList, {
          status: 1, //
          pageNum: this.pageIndex,
          pageSize: 999999999
        })
        .then(res => {
          for (const item of res.data.list) {
            if (this.itemInfo.id === item.id) {
              uni.setStorageSync('andonListInfo', JSON.stringify(item))
              setTimeout(() => {
                this.initForm()
              }, 100)
              return
            }
          }
        })
    },
    /**
     * 返回
     */
    backPage() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashmaintainlist', {
        result: 0
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