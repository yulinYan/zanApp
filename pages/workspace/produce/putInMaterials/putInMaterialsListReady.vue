<template>
  <view class="maintainlis u-padding-25">
    <scroll-view :scroll-top="0" scroll-y="true" class="contsty" @scrolltolower="getBottom">
      <view v-for="(item, index) of list" :key="index" class="listy" @click="clickGet(item)">
        <u-row>
          <u-col span="5" class="leftsty" @click="clickGet(item)">
            <view class="u-text-center u-margin-bottom-14 u-margin-top-14">
              <u-image :src="'/static/uview/modules/machine.png'" mode="aspectFit" width="100%" height="80rpx"></u-image>
            </view>
            <view class="u-font-23 u-text-center u-margin-bottom-16 namesty">设备编号</view>
            <view class="u-font-23 u-text-center fontsty u-margin-bottom-26 u-line-1">{{ item.productDevicesCode }}</view>
          </u-col>
          <u-col class="u-padding-top-26 u-padding-bottom-26 u-padding-left-26" span="7" @click="clickGet(item)">
            <view class="itemsty">
              任务单号：
              <view class="valuesty u-line-1" style="width: 235rpx;line-height: 21rpx;"> {{ item.feedNo }} </view>
            </view>
            <view class="itemsty">
              生产指令：
              <view class="valuesty u-line-1" style="width: 235rpx;line-height: 21rpx;">{{ item.productOrder }}</view>
            </view>
            <view class="itemstys">
              投料时间：
              <view class="valuesty u-line-1" style="width: 235rpx;line-height: 21rpx;">{{ item.createTime }}</view>
            </view>
          </u-col>
        </u-row>
        <div class="subscript">
          完成
        </div>
      </view>
      <u-loadmore :status="status" font-size="20" />
    </scroll-view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>
<script>
export default {
  name: 'PutInMaterialsList', //投料--待完成任务
  data() {
    return {
      searchPopup: false,
      maintForm: {
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
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      }
      this.$u.get(this.apiUrl.findPutInMaterialsList, submitData).then(res => {
        this.list = res.data.list
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
      uni.setStorageSync('putInMaterials', JSON.stringify(item))
      const self = this
      this.$u.route({
        url: '/pages/workspace/produce/putInMaterials/formsDetail'
      })
      uni.$once('reflashlist', function (data) {
        self.pageIndex = 1
        self.list = []
        self.getList()
        self.$refs.uToast.show({
          title: '领料成功!',
          type: 'default',
          position: 'bottom'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.maintainlis {
  width: 100%;
  .contsty {
    height: calc(100vh - 245rpx);
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
