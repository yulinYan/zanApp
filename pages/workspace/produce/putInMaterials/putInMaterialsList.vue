<template>
  <view class="maintainlis u-padding-25">
    <scroll-view :scroll-top="0" scroll-y="true" class="contsty" @scrolltolower="getBottom">
      <view v-for="(item, index) of list" :key="index" class="listy" @click="clickGet(item)">
        <u-row>
          <u-col span="5" class="leftsty" @click="clickGet(item)">
            <view class="u-text-center u-margin-bottom-14 u-margin-top-20">
              <u-image src="/static/uview/modules/machine.png" mode="aspectFit" width="100%" height="160rpx"></u-image>
            </view>
          </u-col>
          <u-col class=" u-padding-left-26 rightsty" span="7" @click="clickGet(item)">
            <view class="itemsty">
              设备编号：
              <view class="valuesty u-line-1">{{ item.productDeviceCode }}</view>
            </view>
            <view class="itemstys">
              生产指令：
              <view class="valuesty u-line-1">{{ item.productCode }}</view>
            </view>
          </u-col>
        </u-row>
        <div class="subscript">待办</div>
      </view>
      <u-loadmore :status="status" font-size="20" />
    </scroll-view>
  </view>
</template>
<script>
export default {
  name: 'PutInMaterialsList', //投料--待完成任务
  data() {
    return {
      searchPopup: false,
      maintForm: {
        status: '0,1', // status:  0 待生产 1生产中
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
      this.maintForm.pageIndex = 1
      this.list = []
      this.getList()
    },
    getList() {
      let submitData = {
        status: this.maintForm.status,
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      }
      this.$u.get(this.apiUrl.getPlanList, submitData).then(res => {
        for (const item of res.data.list) {
          this.list.push(item)
        }
        this.total = res.data.total
        if (this.list.length >= this.total) this.status = 'nomore'
        else this.status = 'loadmore'
      })
    },
    /**
     * 监听'待领料列表'标签click事件
     * @param {Object} item
     */
    clickGet(item) {
      uni.setStorageSync('putInMaterialsList', JSON.stringify(item))
      const self = this
      this.$u.route({
        url: '/pages/workspace/produce/putInMaterials/addForms'
      })
      uni.$once('reflashlist', function (data) {
        if (data.result === 1) {
          self.pageIndex = 1
          self.list = []
          self.getList()
          self.$refs.uToast.show({
            title: '投料成功!',
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
    height: calc(100vh - 230rpx);
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
        line-height: 200rpx;
        background-color: #f0f1f6;
      }

      .rightsty {
        flex-direction: column;
        align-content: space-around;
      }

      .itemsty {
        width: 280rpx;
        font-size: 18rpx;
        color: #969696;
        margin-bottom: 24rpx;
        display: flex;
        justify-content: flex-start;
      }

      .itemstys {
        width: 280rpx;
        font-size: 18rpx;
        color: #969696;
        display: flex;
        justify-content: flex-start;
      }

      .valuesty {
        display: inline-block;
        margin-left: 15rpx;
        line-height: 21rpx;
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
