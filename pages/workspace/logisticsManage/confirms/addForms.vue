<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="确认收货">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="addform u-padding-25">
      <u-form :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="任务单号" class="from-item">
          <u-input v-model="maintForm.codeNum" :disabled="true" placeholder="物料代码" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="30" />
        </u-form-item>
      </u-form>
      <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">任务列表</u-divider>
      <view class="contelist contitem">
        <u-table border-color="#dfdfdf">
          <u-tr>
            <u-th class="heaertb">物料代码</u-th>
            <u-th class="heaertb">物料名称</u-th>
            <u-th :width="'70rpx'" class="heaertb">单位</u-th>
            <u-th :width="'200rpx'" class="heaertb">采购/实收数量</u-th>
          </u-tr>
          <u-tr v-for="(tabs, ind) of contentsList" :key="ind" :class="ind%2 === 0 ? 'fontsty' : 'fontsty linsty'">
            <u-td>
              {{ tabs.productCode }}
            </u-td>
            <u-td>
              {{ tabs.productName }}
            </u-td>
            <u-td :width="'70rpx'">
              {{ tabs.productUnit ? tabs.productUnit : '无' }}
            </u-td>
            <u-td :width="'200rpx'">
              <view style="display: inline-block;height: 25rpx">&nbsp;</view>
              <view v-if="type === 1" class="viewsty1">
                {{ tabs.buyCount }}/{{ tabs.receiveCount }}
              </view>
              <view v-if="type === 0" class="viewsty">
                {{ tabs.buyCount }}/
              </view>
              <view v-if="type === 0" class="inputclass">
                <u-input v-if="setIndex !== ind || !dataShow" :height="18" placeholder-style="font-size: 18rpx; line-height: 40rpx" placeholder="数量" v-model="tabs.receiveCount" type="text" :border="true" :disabled="true" @click="openKeyNum(ind)" />
                <u-input v-if="setIndex === ind && dataShow" :height="18" v-model="setNum" type="text" :border="true" :disabled="true" />
              </view>
            </u-td>
          </u-tr>
        </u-table>
      </view>
      <u-button v-if="type===0" class="substy" @click="submit">提交</u-button>
    </view>
    <u-keyboard ref="uKeyboard" :dot-enabled="false" mode="number" v-model="dataShow" @change="valChange" @backspace="backspace" @confirm="confirm" />
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
        codeNum: ''
      },
      setNum: '',
      setIndex: -1,
      dataShow: false,
      contentsList: [],
      type: 0,
      itemInfo: null
    }
  },
  mounted() {
    const takeInfo = uni.getStorageSync('takeInfo')
    if (takeInfo) {
      this.itemInfo = JSON.parse(takeInfo)
      this.type = this.itemInfo.status
      this.maintForm.codeNum = this.itemInfo.taskNo
      this.contentsList = this.itemInfo.takeOrderDetailList
      uni.removeStorageSync('takeInfo')
    }
  },
  methods: {
    openKeyNum(index) {
      this.setIndex = index
      this.setNum = (this.contentsList[index].receiveCount !== null && this.contentsList[index].receiveCount !== undefined ? this.contentsList[index].receiveCount : 0) + ''
      this.dataShow = true
    },
    // 按键被点击(点击退格键不会触发此事件)
    valChange(val) {
      // 将每次按键的值拼接到value变量中，注意+=写法
      let value = this.setNum + ''
      value += val
      this.setNum = parseInt(value)
      const values = this.contentsList[index].receiveCount !== null && this.contentsList[index].receiveCount !== undefined ? this.contentsList[index].receiveCount : 0
      if (parseInt(value) > values) {
        this.setNum = values
      }
    },
    // 退格键被点击
    backspace() {
      // 删除value的最后一个字符
      let value = this.setNum + ''
      if (value.length === 1) {
        value = '0'
      } else {
        if (value.length) value = value.substr(0, value.length - 1)
      }
      this.setNum = parseInt(value)
    },
    confirm() {
      this.contentsList[this.setIndex].receiveCount = this.setNum
    },
    backPage() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashConfirmslist', {
        result: 0
      })
    },
    submit() {
      let list = []
      let flag = false
      for (const item of this.contentsList) {
        if (!item.receiveCount) {
          flag = true
          break
        }
        var data = {
          batchNo: item.batchNo,
          buyCount: item.buyCount,
          id: item.id,
          productCode: item.productCode,
          productName: item.productName,
          productId: item.productId,
          receiveCount: item.receiveCount,
          takeOrderId: item.takeOrderId
        }
        list.push(data)
      }
      if (flag) {
        this.$refs.uToast.show({
          title: '未填写收货数量!',
          type: 'default'
        })
        return
      }
      this.$u
        .post(
          this.apiUrl.updateTake,
          JSON.stringify({
            taskNo: this.itemInfo.taskNo,
            id: this.itemInfo.id,
            takeOrderDetailList: list
          })
        )
        .then(res => {
          if (res.code === 0) {
            uni.navigateBack({
              delta: 1
            })
            uni.$emit('reflashConfirmslist', {
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
  .iconsty {
    position: absolute;
    z-index: 999;
    right: 50rpx;
    line-height: 63rpx;
    height: 63rpx;
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
      height: 50rpx;
      line-height: 50rpx;
      background-color: #fafafa;
    }
    .fontsty {
      ::v-deep .u-td {
        font-size: 20rpx !important;
        position: relative;
        height: 50rpx;
        line-height: 50rpx;
      }
      ::v-deep .uni-input-input {
        font-size: 20rpx !important;
      }
      .viewsty {
        width: 50rpx;
        position: absolute;
        top: 0rpx;
        left: 10rpx;
      }
      .viewsty1 {
        width: 100%;
        position: absolute;
        top: 0rpx;
        left: 0;
      }
      .inputclass {
        font-size: 20rpx !important;
        line-height: 40rpx;
        width: 100rpx;
        position: absolute;
        top: 5px;
        left: 80rpx;
        ::v-deep .u-input {
          height: 40rpx !important;
        }
      }
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