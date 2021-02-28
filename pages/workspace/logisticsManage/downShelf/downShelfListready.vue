<template>
  <view class="maintainlis u-padding-25">
    <u-form :model="maintForm" ref="uForm">
      <u-form-item :leftIconStyle="{color: '#969696', fontSize: '23rpx'}" left-icon="search" label-width="25" label-position="left" label="" class="searchsty">
        <u-input v-model="maintForm.searchKey" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx" placeholder="请输入库位编号" type="text" />
        <u-button slot="right" :hair-line="false" class="custom-style" size="mini" @click="searchByKey()">查询</u-button>
      </u-form-item>
    </u-form>
    <scroll-view :scroll-top="0" scroll-y="true" class="contsty" @scrolltolower="getBottom">
      <view v-for="(item, index) of list" :key="index" class="listy">
        <u-row>
          <u-col span="5" class="leftsty" @click="clickGet(item)">
            <view class="u-text-center u-margin-bottom-14 u-margin-top-45">
              <u-image :src="'/static/uview/modules/mould.png'" mode="aspectFit" width="100%" height="80rpx"></u-image>
            </view>
          </u-col>
          <u-col class="u-padding-top-26 u-padding-bottom-26 u-padding-left-26" span="7" @click="clickGet(item)">
            <view class="itemsty">
              库位编号：
              <view class="valuesty u-line-1" style="width: 235rpx;line-height: 21rpx;">{{ item.code }}</view>
            </view>
            <view class="itemsty">
              操作人：
              <view class="valuesty u-line-1" style="width: 235rpx;line-height: 21rpx;">{{ item.createUserName }}</view>
            </view>
            <view class="itemsty">
              操作时间：
              <view class="valuesty u-line-1" style="width: 235rpx;line-height: 21rpx;">{{ item.createTime }}</view>
            </view>
          </u-col>
        </u-row>
        <div class="subscript" @click="clickGet(item)">
          完成
        </div>
      </view>
      <u-loadmore :status="status" font-size="20" />
    </scroll-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      maintForm: {
        searchKey: ''
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
    getList() {
      this.$u
        .get(this.apiUrl.getDownList, {
          code: this.maintForm.searchKey,
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        })
        .then(res => {
          this.list = []
          for (const item of res.data.list) {
            this.list.push(item)
          }
          this.total = res.data.total
          if (this.list.length >= this.total) this.status = 'nomore'
          else this.status = 'loadmore'
        })
    },
    searchByKey() {
      this.list = []
      this.pageIndex = 1
      this.getList()
    },
    clickGet(item) {
      uni.setStorageSync('downShelfInfo', JSON.stringify(item))
      let self = this
      uni.$once('reflashlistDown', function (data) {
        if (data.result === 1) {
          self.pageIndex = 1
          self.list = []
          self.getList()
          self.$refs.uToast.show({
            title: '提交成功!',
            type: 'default',
            position: 'bottom'
          })
        }
      })
      this.$u.route({
        url: 'pages/workspace/logisticsManage/downShelf/addForms'
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
        height: 230rpx;
        background-color: #f0f1f6;
      }
      .itemsty {
        font-size: 18rpx;
        color: #969696;
        margin-bottom: 30rpx;
        display: flex;
        justify-content: center;
        // margin: 0 auto;
      }
      .itemstys {
        font-size: 18rpx;
        color: #969696;
        display: flex;
        justify-content: center;
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