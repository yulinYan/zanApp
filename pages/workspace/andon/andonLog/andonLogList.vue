<template>
  <view class="maintainlis u-padding-25">
    <scroll-view :scroll-top="0" scroll-y="true" class="contsty" @scrolltolower="getBottom">
      <view v-for="(item, index) of list" :key="index" class="listy" @click="clickGet(item)">
        <u-row>
          <u-col class="u-padding-top-26 u-padding-bottom-26 u-padding-left-26" span="7" @click="clickGet(item)">
            <view class="itemsty">
              故障名称：
              <view class="valuesty u-line-1" style="width: 235rpx;line-height: 21rpx;">{{ item.content }}</view>
            </view>
            <view class="itemsty">
              故障来源：
              <view class="valuesty">{{item.source===0?'系统':item.source===1?'人工':'其他'}}</view>
            </view>
          </u-col>
        </u-row>
        <div class="subscript">
          <view class="itemstys">
            故障状态：
            <view class="valuesty">{{item.status==0?'未处理':item.status==1?'处理中':'已完成'}}</view>
          </view>
        </div>
      </view>
      <u-loadmore :status="status" font-size="20" />
    </scroll-view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>
<script>
export default {
  props: ['active'],
  watch: {
    active: function (newData, oldData) {
      this.activeTab = newData
      this.list = []
      this.getList()
    }
  },
  data() {
    return {
      maintForm: {
        searchKey: ''
      },
      list: [],
      pageIndex: 1,
      pageSize: 10,
      status: 'loadmore',
      total: 0,
      activeTab: 3
    }
  },
  mounted() {
    this.getList()
    this.activeTab = this.active
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
     * 获取故障列表
     */
    getList() {
      var params = {}
      if (this.active === 3) {
        params = {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        }
      } else {
        params = {
          status: this.active,
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        }
      }
      this.$u.get(this.apiUrl.andonLogList, params).then(res => {
        for (const item of res.data.list) {
          this.list.push(item)
        }
        this.total = res.data.total
        if (this.list.length >= this.total) this.status = 'nomore'
        else this.status = 'loadmore'
      })
    },
    clickGet(item) {
      var self = this
      uni.setStorageSync('andonListInfo', JSON.stringify(item))
      uni.$once('reflashandonLoglist', function (data) {
        if (data.result === 1) {
          self.pageIndex = 1
          self.list = []
          self.getList()
          this.$refs.uToast.show({
            title: '完成处理',
            type: 'success',
            position: 'top'
          })
        }
      })
      this.$u.route({
        url: '/pages/workspace/andon/andonLog/addForms'
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
        // display: flex;
        // align-items: center;
        color: #323232;
      }
      .subscript {
        color: #fff;
        height: 30rpx;
        // width: 100rpx;
        position: absolute;
        right: 20rpx;
        font-size: 18rpx;
        text-align: center;
        line-height: 30rpx;
        // background-color: #ffb607;
        top: 75rpx;
      }
    }
  }
}
</style>