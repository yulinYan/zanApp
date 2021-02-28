<template>
  <view class="maintainlis u-padding-25">
    <u-form :model="maintForm" ref="uForm">
      <u-form-item label-width="25" label-position="left" label="" class="searchsty">
        <u-search v-model="maintForm.orderNo" shape="square" placeholder="输入订单号搜索" type="text" confirm-type="搜索" :show-action="false" @search="handleConfirmSearch"></u-search>
      </u-form-item>
    </u-form>
    <scroll-view :scroll-top="0" scroll-y="true" class="contsty" @scrolltolower="getBottom">
      <view v-for="(item, index) of list" :key="index" class="listy">
        <u-row>
          <u-col span="5" class="leftsty" @click="clickGet(item)">
            <view class="u-text-center u-margin-bottom-14 u-margin-top-20">
              <u-image src="/static/uview/modules/machine.png" mode="aspectFit" width="100%" height="160rpx"></u-image>
            </view>
          </u-col>
          <u-col class=" u-padding-left-26 rightsty" span="7" @click="clickGet(item)">
            <view class="itemsty">
              源单单号：
              <view class="valuesty u-line-1">{{ item.houseNo }}</view>
            </view>
            <view class="itemstys">
              订单号：
              <view class="valuesty u-line-1">{{ item.orderNo }}</view>
            </view>
          </u-col>
        </u-row>
        <div class="subscript">完成</div>
      </view>
      <u-loadmore :status="status" font-size="20" />
    </scroll-view>
  </view>
</template>
<script>
export default {
  name: 'WarehousingOutListready', //外部入库--已完成任务
  data() {
    return {
      searchPopup: false,
      maintForm: {
        orderNo: '',
        houseType: '0,1,3', // 采购入库、委外生产入库、其他入库
        status: 1, // 已完成任务
        pageIndex: 1,
        pageSize: 10
      },
      list: [],
      pageIndex: 1,
      pageSize: 10,
      status: 'loadmore',
      total: 0
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getBottom(e) {
      if (this.list.length >= this.total || this.status === 'loading') return
      this.status = 'loading'
      this.pageIndex = ++this.pageIndex
      setTimeout(() => {
        this.getList()
      }, 1000)
    },
    /**
     * 监听搜索框 search事件
     */
    handleConfirmSearch() {
      this.pageIndex = 1
      this.list = []
      this.getList()
    },
    getList() {
      let submitData = {
        orderNo: this.maintForm.orderNo.toString().trim(),
        houseType: this.maintForm.houseType,
        status: this.maintForm.status,
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      }
      this.$u.get(this.apiUrl.findListLogistics, submitData).then(res => {
        for (const item of res.data.list) {
          this.list.push(item)
        }
        this.total = res.data.total
        if (this.list.length >= this.total) this.status = 'nomore'
        else this.status = 'loadmore'
      })
    },
    /**
     * 监听'生产入库列表'标签click事件
     * @param {Object} item
     */
    clickGet(item) {
      this.$u.route({
        url: '/pages/workspace/logisticsManage/warehousingOut/formsDetail'
      })
      uni.setStorageSync('warehousingOut', JSON.stringify(item))
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
    padding: 0px;
    line-height: 63rpx;
    margin-bottom: 32rpx;

    ::v-deep .u-form-item--left__content {
      padding-left: 13rpx;
      border: solid 1px #dfdfdf;
      border-right: none;
    }

    ::v-deep .u-input__input {
      font-size: 23rpx;
      min-height: 63rpx !important;
      border: solid 1px #dfdfdf;
      border-left: none;
    }
    ::v-deep .uni-input-placeholder {
      color: #969696 !important;
      font-size: 23rpx !important;
      line-height: 40rpx !important;
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
        height: 200rpx;
        background-color: #f0f1f6;
      }

      .rightsty {
        flex-direction: column;
        align-content: space-around;
      }

      .itemsty {
        width: 240rpx;
        font-size: 18rpx;
        color: #969696;
        margin-bottom: 24rpx;
        display: flex;
        justify-content: flex-start;
      }

      .itemstys {
        width: 240rpx;
        font-size: 18rpx;
        color: #969696;
        display: flex;
        justify-content: flex-start;
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
        background-color: #006fe6;
        -moz-transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
        top: 5rpx;
      }
    }
  }
}
</style>
