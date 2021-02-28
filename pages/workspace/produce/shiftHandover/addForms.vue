<template>
  <view class="addbt">
    <!-- <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="设备点检">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view> -->
    <view class="addform u-padding-25">
      <view style="margin-top: 24rpx;padding: 30rpx;">
        <u-form :model="maintForm" ref="uForm">
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" label-width="130" :border-bottom="false" label="接收人:" class="from-item scansty">
            <u-input v-model="maintForm.operateName" type="select" placeholder="请选择接收人" :border="border" @click="show = true" />
            <u-action-sheet :list="maintForm.list" v-model="show" @click="actionSheetCallback"></u-action-sheet>
          </u-form-item>
        </u-form>
      </view>
      <u-divider :size="3" border-color="#969696" color="#006fe6" class="dividers">交接事项</u-divider>
      <view class="contelist">
        <view v-for="(item, index) of contentsList" :key="index">
          <view class="contitem">
            <view class="fons">{{index+1}}</view>
            <u-input v-model="item.reason" :placeholder="'交接事项'" class="ressty" />
            <u-icon v-if="index === 0" name="plus-circle" @click="addItems"></u-icon>
            <u-icon v-if="index !== 0" name="minus-circle" @click="minusItems(index)"></u-icon>
          </view>
        </view>
      </view>
      <u-form :model="maintForm" ref="uForms">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="80" label="其他" class="from-item">
          <u-input type="textarea" v-model="maintForm.note" :placeholder="'请输入其他交接事项'" maxlength="100" />
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
        operateName: null,
        operateId: null,
        list: []
      },
      contentsList: [
        {
          reason: ''
        }
      ],
      show: false,
      border: true
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    /**
     * 点击添加
     */
    addItems() {
      this.contentsList.push({
        reason: ''
      })
    },
    /**
     * 点击减少
     */
    minusItems(index) {
      this.contentsList.splice(index, 1)
    },
    /**
     * 点击提交
     */
    submit() {
      let flag = false
      this.contentsList.forEach((item, index) => {
        if (item.reason.length === 0 || this.maintForm.operateId === null || this.maintForm.operateId.length === 0) {
          flag = true
        }
      })
      if (flag) {
        this.$refs.uToast.show({
          title: '检查未填写项填写!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      // var obj = this.contentsList.join()
      var arr = []
      this.contentsList.forEach(item => {
        arr.push(item.reason)
      })
      var obj = arr.toString()
      var params = {
        matters: obj,
        note: this.maintForm.note,
        operateUser: this.maintForm.operateId
      }
      this.$u.post(this.apiUrl.saveProduceShift, JSON.stringify(params)).then(res => {
        if (res.code === 0) {
          this.$refs.uToast.show({
            title: '提交成功',
            type: 'default',
            position: 'top'
          })
          this.maintForm = {
            operateName: null,
            operateId: null,
            list: this.maintForm.list
          }
          this.contentsList = [
            {
              reason: ''
            }
          ]
          this.show = false
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
     * 获取人员列表
     */
    getUserList() {
      var self = this
      self.maintForm.list = []
      this.$u.get(this.apiUrl.e2cUrl + this.apiUrl.getUserList).then(res => {
        for (const item of res.data) {
          var obj = {
            text: item.name,
            value: item.id
          }
          self.maintForm.list.push(obj)
        }
      })
    },
    /**
     * 点击人员下拉框选择人员
     */
    actionSheetCallback(index) {
      this.maintForm.operateName = this.maintForm.list[index].text
      this.maintForm.operateId = this.maintForm.list[index].value
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
    ::v-deep .uni-input-input,
    .uni-input-placeholder {
      line-height: 63rpx;
      color: #969696;
      font-size: 20rpx;
      padding-left: 10rpx;
      width: calc(100% - 20rpx);
    }
    ::v-deep .uni-textarea-compute,
    .uni-textarea-line,
    .uni-textarea-placeholder {
      line-height: 63rpx;
      color: #969696;
      font-size: 20rpx;
      padding-left: 10rpx;
      width: calc(100% - 20rpx);
    }
    ::v-deep .u-input__right-icon__item {
      margin-right: 10rpx;
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
        width: 80rpx;
        float: left;
        padding-top: 11rpx;
        text-align: center;
      }
      ::v-deep .u-icon__icon {
        font-size: 30rpx !important;
      }
    }

    .checksty {
      float: left;
      height: 45rpx !important;
      margin-left: 5rpx;
    }

    .ressty {
      float: left;
      width: 80%;
      background: #f6f6f6 !important;

      ::v-deep .u-input__input {
        min-height: 45rpx !important;
        height: 45rpx !important;
        font-size: 20rpx !important;
      }

      ::v-deep .uni-input-input {
        padding-left: 10rpx;
        padding-right: 10rpx;
      }
      ::v-deep .uni-input-input,
      .uni-input-placeholder {
        line-height: 63rpx;
        color: #969696;
        font-size: 20rpx;
        padding-left: 10rpx;
        padding-right: 10rpx;
        width: calc(100% - 20rpx);
      }
    }
    // .ressty::placeholder {
    //   line-height: 63rpx;
    //   color: #969696;
    //   font-size: 20rpx;
    //   padding-left: 10rpx;
    //   padding-right: 10rpx;
    //   width: calc(100% - 20rpx);
    // }

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
  ::v-deep .uni-scroll-view-content {
    overflow: hidden;
  }
  .scansty {
    ::v-deep .uni-scroll-view-content {
      max-height: 520rpx;
      overflow: auto;
      // padding-bottom: 100rpx;
      margin-bottom: 100rpx;
    }
    ::v-deep .u-actionsheet-cancel {
      position: fixed;
      bottom: 0;
      width: 100%;
      border-top: 10px solid #eaeaec;
    }
    ::v-deep .u-gab {
      background-color: transparent;
    }
  }
}
</style>
