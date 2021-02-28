<template>
  <view class="maintainlis u-padding-25">
    <!-- <u-form :model="maintForm" ref="uForm">
      <u-form-item :leftIconStyle="{color: '#969696', fontSize: '23rpx'}" left-icon="search" label-width="25" label-position="left" label="" class="searchsty">
        <u-input v-model="maintForm.devicesCode" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx" placeholder="请输入设备编号搜索" type="text" />
        <u-button slot="right" :hair-line="false" class="custom-style" size="mini" @click="searchByKey()">查询</u-button>
      </u-form-item>
    </u-form> -->
    <scroll-view :scroll-top="0" scroll-y="true" class="contsty" @scrolltolower="getBottom">
      <view v-for="(item, index) of list" :key="index" class="listy" @click="clickGet(item)">
        <u-row>
          <u-col span="4" class="leftsty" @click="clickGet(item)">
            <view class="u-text-center u-margin-bottom-14 u-margin-top-26">
              <u-image :src="item.imagePath" mode="aspectFit" height="44rpx"></u-image>
            </view>
            <!-- <view class="u-font-23 u-text-center u-margin-bottom-16 namesty">保养工单号</view> -->
            <view class="u-font-23 u-text-center fontsty u-margin-bottom-26">NO.{{item.productDevicesName}}</view>
          </u-col>
          <u-col class="u-padding-top-26 u-padding-bottom-26 u-padding-left-26" span="8" @click="clickGet(item)">
            <view class="itemsty">
              生产指令：
              <view class="valuesty">{{item.productCode}}</view>
            </view>
            <view class="itemsty">
              产品名称：
              <view class="valuesty">{{item.partsName}}</view>
            </view>
            <view class="itemsty">
              发货时间
              <view class="valuesty">{{item.deliverTime}}</view>
            </view>
          </u-col>
        </u-row>
        <div class="subscript">
          待办
        </div>
      </view>
      <u-loadmore :status="status" />
    </scroll-view>
    <u-popup v-model="showCount" mode="center" border-radius="14" closeable class="uPopup">
      <view style="margin-top: 24rpx;padding: 30rpx;">
        <u-form :model="maintForm" ref="uForm">
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" label-width="130" :border-bottom="false" label="生产指令:" class="from-item scansty">
            <u-input v-model="maintForm.productCode" type="text" placeholder="请输入生产指令" disabled></u-input>
          </u-form-item>
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" label-width="130" :border-bottom="false" label="指派员工:" class="from-item scansty ">
            <!-- <u-select v-model="show" :list="maintForm.list" placeholder="请选择指派员工" @confirm="confirm"></u-select> -->
            <u-input v-model="maintForm.operateName" type="select" placeholder="请选择指派员工" :border="border" @click="show = true" />
            <u-action-sheet :list="maintForm.list" v-model="show" @click="actionSheetCallback"></u-action-sheet>
          </u-form-item>
        </u-form>
        <u-button class="substy" @click="sureCount">确定</u-button>
      </view>
    </u-popup>
    <view>
      <u-toast ref="uToast"></u-toast>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      maintForm: {
        devicesCode: '',
        productCode: '',
        operateName: null,
        operateId: null,
        list: [
          {
            value: '1',
            text: '江'
          },
          {
            value: '2',
            text: '湖'
          }
        ]
      },
      border: true,
      list: [],
      station: 0, //0 是查询待检点项目   1是查询已完成
      devicesCode: '',
      pageIndex: 1,
      pageSize: 10,
      status: 'loadmore',
      total: 0,
      showCount: false,
      show: false,
      planMoldingId: '' //任务id
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    searchByKey() {
      this.list = []
      this.pageIndex = 1
      this.pageSize = this.pageSize
      this.getList()
    },
    getList() {
      this.$u
        .get(this.apiUrl.getPlanList, {
          // devicesCode: this.maintForm.devicesCode,
          status: this.station,
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        })
        .then(res => {
          for (const item of res.data.list) {
            this.list.push(item)
          }
          this.total = res.data.total
          if (this.list.length >= this.total) this.status = 'nomore'
          else this.status = 'loadmore'
        })
    },
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

    getBottom(e) {
      if (this.list.length >= this.total || this.status === 'loading') return
      this.status = 'loading'
      this.pageIndex = ++this.pageIndex
      setTimeout(() => {
        this.getList()
      }, 1000)
    },
    /**
     * 点击人员下拉框选择人员
     */
    actionSheetCallback(index) {
      this.maintForm.operateName = this.maintForm.list[index].text
      this.maintForm.operateId = this.maintForm.list[index].value
    },
    /**
     * 点击每条任务 弹出编辑框
     */
    clickGet(item) {
      this.showCount = true
      this.maintForm.productCode = item.productCode
      this.planMoldingId = item.id
      this.getUserList()
    },
    /**
     * 点击确定 提交安排
     */
    sureCount() {
      if (this.maintForm.operateId) {
        this.$u
          .post(this.apiUrl.saveProduceDuty, {
            operateUser: this.maintForm.operateId,
            productOrder: this.maintForm.productCode,
            planMoldingId: this.planMoldingId
          })
          .then(res => {
            if (res.code === 0) {
              this.$refs.uToast.show({
                title: '指派成功',
                type: 'success',
                position: 'top'
              })
              this.showCount = false
              this.list = []
              this.pageIndex = 1
              this.getList()
            } else {
              this.$refs.uToast.show({
                title: res.msg,
                type: 'default',
                position: 'bottom'
              })
            }
          })
      } else {
        this.$refs.uToast.show({
          title: '请前选择指派人员',
          type: 'default',
          position: 'bottom'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.maintainlis {
  width: 100%;
  .searchsty {
    background: #fff;
    border-radius: 3rpx;
    font-size: 23rpx;
    border: solid 1px #dfdfdf;
    padding: 0px;
    line-height: 63rpx;
    margin-bottom: 32rpx;
    ::v-deep .u-form-item--left__content {
      padding-left: 13rpx;
    }
    ::v-deep .u-input__input {
      font-size: 23rpx;
      min-height: 63rpx !important;
    }
    .custom-style {
      border: 0px;
      border-left: 1px solid #dfdfdf;
      width: 120rpx;
      color: #006fe6;
      height: 63rpx;
      font-size: 23rpx;
      background-color: #f5f6fa;
    }
  }
  .contsty {
    height: calc(100vh - 295rpx);
    overflow: auto;
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
        line-height: 50rpx;
        background-color: #f0f1f6;
      }
      .itemsty {
        font-size: 18rpx;
        color: #969696;
        margin-bottom: 30rpx;
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
  }
  .substy {
    background-color: #006fe6;
    color: #fff;
  }
  // ::v-deep .uni-scroll-view-content {
  //   overflow: auto;
  // }
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