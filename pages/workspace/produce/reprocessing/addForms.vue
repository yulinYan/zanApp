<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="二次加工">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="addform u-padding-25">
      <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">生产详情</u-divider>
      <view class="contelist contitem listy">
        <u-row v-if="itemInfo">
          <u-col class="u-padding-top-26 u-padding-left-26" span="6">
            <view class="itemsty">
              生产指令：
              <view class="valuesty u-line-1" style="width: 210rpx;line-height: 18rpx;">{{ itemInfo.productCode }}</view>
            </view>
            <view class="itemsty">
              预计开始时间：
              <view class="valuesty u-line-1" style="line-height: 18rpx;">{{ itemInfo.startTime && itemInfo.startTime.length> 10 ? itemInfo.startTime.substring(0,16):itemInfo.startTime }}</view>
            </view>
          </u-col>
          <u-col class="u-padding-top-26 u-padding-left-26" span="6">
            <view class="itemsty">
              零件名称：
              <view class="valuesty u-line-1" style="line-height: 18rpx;">{{ itemInfo.partsName }}</view>
            </view>
            <view class="itemsty">
              预计结束时间：
              <view class="valuesty u-line-1" style="line-height: 18rpx;">{{ itemInfo.endTime && itemInfo.endTime.length> 10 ? itemInfo.endTime.substring(0,16):itemInfo.endTime }}</view>
            </view>
          </u-col>
        </u-row>
      </view>
      <view v-if="type !== 4" class="u-padding-bottom-26">
        <u-row>
          <u-col span="8">
            <u-input :height="50" v-model="printNumber" type="text" :border="true" :disabled="true" placeholder-style="font-size: 18rpx; line-height: 40rpx" placeholder="请输入本箱生产数量" @click="openKeyNum()" />
          </u-col>
          <u-col class="u-padding-left-26" span="4">
            <u-button class="startsty" type="primary" size="mini" @click="printLable()">
              打印标签
            </u-button>
          </u-col>
        </u-row>
      </view>
      <u-divider v-if="type !== 4" :size="23" border-color="#969696" color="#006fe6" class="dividers">待检验</u-divider>
      <view v-if="type !== 4" class="contelist contitem u-margin-top-25 u-margin-bottom-25">
        <u-table border-color="#dfdfdf">
          <u-tr>
            <u-th :width="'70rpx'" class="heaertb">序号</u-th>
            <u-th class="heaertb">生产指令</u-th>
            <u-th class="heaertb">零件名称</u-th>
            <u-th :width="'70rpx'" class="heaertb">数量</u-th>
            <u-th :width="'140rpx'" class="heaertb">操作</u-th>
          </u-tr>
          <u-tr v-for="(tabs, ind) of contentsList" :key="ind" :class="ind%2 === 0 ? 'fontsty' : 'fontsty linsty'">
            <u-td :width="'70rpx'">
              {{ ind + 1 }}
            </u-td>
            <u-td class="u-line-1" style="width: 100%;">
              {{ tabs.productCode }}
            </u-td>
            <u-td>
              {{ tabs.partsName }}
            </u-td>
            <u-td :width="'70rpx'">
              {{ tabs.printNumber }}
            </u-td>
            <u-td :width="'140rpx'">
              <u-button class="startsty" type="primary" size="mini" @click="printLables()">
                补打标签
              </u-button>
            </u-td>
          </u-tr>
        </u-table>
      </view>
      <u-button v-if="contentsList.length > 0" class="substy u-margin-bottom-25" @click="bjsubmit">报检</u-button>
      <u-divider v-if="unList.length > 0" :size="23" border-color="#969696" color="#006fe6" class="dividers">已报检</u-divider>
      <view v-if="unList.length > 0" class="contelist contitem u-margin-top-25 u-margin-bottom-25">
        <u-table border-color="#dfdfdf">
          <u-tr>
            <u-th :width="'70rpx'" class="heaertb">序号</u-th>
            <u-th class="heaertb">生产指令</u-th>
            <u-th class="heaertb">零件名称</u-th>
            <u-th :width="'70rpx'" class="heaertb">数量</u-th>
          </u-tr>
          <u-tr v-for="(tabs, ind) of unList" :key="ind" :class="ind%2 === 0 ? 'fontsty' : 'fontsty linsty'">
            <u-td :width="'70rpx'">
              {{ ind + 1 }}
            </u-td>
            <u-td class="u-line-1" style="width: 100%;">
              {{ tabs.productCode }}
            </u-td>
            <u-td>
              {{ tabs.partsName }}
            </u-td>
            <u-td :width="'70rpx'">
              {{ tabs.printNumber }}
            </u-td>
          </u-tr>
        </u-table>
      </view>
      <u-button v-if="unList.length > 0 && type !== 4" class="substy" @click="submit">完成生产</u-button>
    </view>
    <u-toast ref="uToast"></u-toast>
    <u-keyboard ref="uKeyboard" :dot-enabled="false" mode="number" v-model="dataShow" @change="valChange" @backspace="backspace" @confirm="confirm" />
    <u-modal ref="uModal" v-model="show" :show-cancel-button="true" :show-title="true" @confirm="confirms" :content="'是否确认完成生产指令'">
    </u-modal>
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
        codeNum: '',
        newCodeNum: '',
        storeNum: '',
        oldStoreNum: '',
        newStoreNum: ''
      },
      show: false,
      dataShow: false,
      contentsList: [],
      unList: [],
      type: '',
      printNumber: '',
      itemInfo: null
    }
  },
  mounted() {
    const reprocessInfo = uni.getStorageSync('reprocessInfo')
    if (reprocessInfo) {
      this.itemInfo = JSON.parse(reprocessInfo)
      this.type = this.itemInfo.status
      this.findReworkRecordLists()
      this.findWareList()
      // uni.removeStorageSync('reprocessInfo')
    }
  },
  methods: {
    // 按键被点击(点击退格键不会触发此事件)
    valChange(val) {
      // 将每次按键的值拼接到value变量中，注意+=写法
      let value = this.printNumber + ''
      value += val
      this.printNumber = parseInt(value)
    },
    // 退格键被点击
    backspace() {
      // 删除value的最后一个字符
      let value = this.printNumber + ''
      if (value.length === 1) {
        value = '0'
      } else {
        if (value.length) value = value.substr(0, value.length - 1)
      }
      this.printNumber = parseInt(value)
    },
    confirm() {
      console.log(this.printNumber)
    },
    backPage() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashlist', {
        result: 0
      })
    },
    openKeyNum() {
      this.dataShow = true
    },
    findReworkRecordLists() {
      this.$u
        .get(this.apiUrl.findReworkRecordList, {
          planReworkId: this.itemInfo.id,
          pageNum: 1,
          pageSize: 999999
        })
        .then(res => {
          this.contentsList = []
          for (const item of res.data.list) {
            if (item.status !== 1) {
              this.contentsList.push({
                id: item.id,
                planReworkId: item.planReworkId,
                productCode: item.productOrder,
                partsCode: item.productCode,
                partsName: item.productName,
                printNumber: item.qualified
              })
            }
          }
        })
    },
    printLables() {},
    printLable() {
      if (!this.printNumber || this.printNumber < 1) {
        this.$refs.uToast.show({
          title: '请输入有效数量!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      this.$u
        .post(
          this.apiUrl.saveRework,
          JSON.stringify({
            planReworkId: this.itemInfo.id,
            qualified: this.printNumber
          })
        )
        .then(res => {
          if (res.code === 0) {
            this.printNumber = ''
            this.findReworkRecordLists()
          } else {
            this.$refs.uToast.show({
              title: res.msg,
              type: 'default',
              position: 'bottom'
            })
          }
        })
    },
    findWareList() {
      this.$u
        .get(this.apiUrl.findWareList, {
          productCode: this.itemInfo.productCode,
          pageNum: 1,
          pageSize: 999999
        })
        .then(res => {
          this.unList = []
          for (const item of res.data.list) {
            this.unList.push({
              productCode: item.productCode,
              partsCode: this.itemInfo.partsCode,
              partsName: this.itemInfo.partsName,
              printNumber: item.count
            })
          }
        })
    },
    bjsubmit() {
      const lis = []
      let count = 0
      for (const item of this.contentsList) {
        count = count + item.printNumber
        lis.push({
          planReworkId: item.planReworkId,
          qualified: item.printNumber,
          id: item.id
        })
      }
      this.$u
        .post(
          this.apiUrl.customsInspection,
          JSON.stringify({
            planMoldingId: this.itemInfo.id,
            productCode: this.itemInfo.partsCode,
            productId: this.itemInfo.productId,
            productName: this.itemInfo.partsName,
            productOrder: this.itemInfo.productCode,
            produceReworkRecords: lis,
            qualityStoreChecks: [
              {
                productDevicesId: this.itemInfo.productId,
                productCode: this.itemInfo.productCode,
                count: count,
                mouldNo: ''
              }
            ]
          })
        )
        .then(res => {
          if (res.code === 0) {
            this.findReworkRecordLists()
            this.findWareList()
          } else {
            this.$refs.uToast.show({
              title: res.msg,
              type: 'default',
              position: 'bottom'
            })
          }
        })
    },
    submit() {
      if (this.contentsList.length > 0) {
        this.$refs.uToast.show({
          title: '请先完成报检!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      this.show = true
    },
    confirms() {
      this.$u
        .post(
          this.apiUrl.endProduce,
          JSON.stringify({
            planMoldingId: this.itemInfo.id,
            productCode: this.itemInfo.partsCode,
            productId: this.itemInfo.productId,
            productName: this.itemInfo.partsName,
            productOrder: this.itemInfo.productCode
          })
        )
        .then(res => {
          if (res.code === 0) {
            this.$refs.uToast.show({
              title: '操作成功!',
              type: 'default',
              position: 'bottom'
            })
            this.show = false
            uni.navigateBack({
              delta: 1
            })
            uni.$emit('reflashlist', {
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
  .listy {
    background-color: #f5f6fa;
    border-radius: 5rpx;
    overflow: hidden;
    position: relative;
    margin-bottom: 25rpx;
    .fontsty {
      color: #006fe6;
      font-family: MicrosoftYaHei-Bold;
    }
    .namesty {
      color: #323232;
      font-family: MicrosoftYaHei-Bold;
    }
    .leftsty {
      height: 200rpx;
      background-color: #f0f1f6;
    }
    .itemsty {
      font-size: 18rpx;
      color: #969696;
      margin-bottom: 30rpx;
    }
    .btysty {
      margin-top: 30rpx;
      height: 105rpx;
      .startsty {
        width: 100%;
        height: 70rpx;
      }
    }
    .itemstys {
      font-size: 18rpx;
      color: #969696;
    }
    .valuesty {
      display: inline-block;
      margin-left: 15rpx;
      line-height: 18rpx;
      color: #323232;
    }
    .subscript {
      color: #fff;
      height: 30rpx;
      width: 100rpx;
      position: absolute;
      right: -30rpx;
      font-size: 18rpx;
      text-align: center;
      line-height: 30rpx;
      background-color: #ffb607;
      -moz-transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      -o-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
      top: 5rpx;
    }
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
    margin-top: 25rpx;
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
        height: 50rpx;
        line-height: 50rpx;
        position: relative;
      }
      ::v-deep .uni-input-input {
        font-size: 20rpx !important;
      }
      .viewsty {
        width: 50rpx;
        position: absolute;
        top: 10rpx;
        left: 10rpx;
      }
      .viewstyright {
        width: 50rpx;
        position: absolute;
        top: 10rpx;
        right: 10rpx;
      }
      .inputclass {
        font-size: 20rpx !important;
        line-height: 40rpx;
        text-align: left;
        height: 20rpx;
        width: 100rpx;
        position: absolute;
        top: 5px;
        left: 80rpx;
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