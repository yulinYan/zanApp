<template>
  <view class="maintainlis u-padding-25">
    <scroll-view :scroll-top="0" scroll-y="true" class="contsty" @scrolltolower="getBottom">
      <view v-for="(item, index) of list" :key="index" class="listy" @click="clickGet(item)">
        <view class="listyImg">
          <!-- <img src="../../../../static/uview/andon/PDAandeng-gongyi.png" alt=""> -->
          <u-image class="listyImgSon" width="23rpx" height="23rpx" :src="item.iconName"></u-image>
        </view>
        <view>{{item.name}}</view>
      </view>
      <u-loadmore :status="status" font-size="20" color="#d2d2d2" />
    </scroll-view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>
<script>
export default {
  name: 'RepairList', //设备维修列表--未完成任务记录
  data() {
    return {
      list: [
        { name: '生产', classify: 'product', id: 3, iconName: '/static/uview/andon/PDAandeng-shengchan.png' },
        { name: '质量', classify: 'quilty', id: 4, iconName: '/static/uview/andon/PDAandeng-zhiliang.png' },
        { name: '物料', classify: 'material', id: 6, iconName: '/static/uview/andon/PDAandeng-wuliao.png' },
        { name: '模具', classify: 'mould', id: 2, iconName: '/static/uview/andon/PDAandeng-moju.png' },
        { name: '设备', classify: 'devices', id: 1, iconName: '/static/uview/andon/PDAandeng-shebei.png' },
        { name: '工艺', classify: 'technology', id: 5, iconName: '/static/uview/andon/PDAandeng-gongyi.png' },
        { name: '人员', classify: 'person', id: 7, iconName: '/static/uview/andon/PDAandeng-renyuan.png' },
        { name: '其他', classify: 'other', id: 8, iconName: '/static/uview/andon/PDAandeng-qita.png' }
      ],
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
     * 获取数据请求
     */
    getList() {
      // let searchObj = {
      //   pageNum: this.pageIndex,
      //   pageSize: this.pageSize
      // }
      // this.$u.get(this.apiUrl.getRepais, searchObj).then(res => {
      //   this.list = res.data.list
      //   this.total = res.data.total
      //   if (this.list.length >= this.total) this.status = 'nomore'
      //   else this.status = 'loadmore'
      // })
    },
    clickGet(item) {
      uni.setStorageSync('andonInfo', JSON.stringify(item))
      let self = this
      uni.$emit('showRepairInfo', {
        result: 0
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
      border-right: none;
    }

    ::v-deep .u-input__input {
      font-size: 23rpx;
      min-height: 63rpx !important;
      border: solid 1px #dfdfdf;
      border-left: none;
    }
    .custom-style {
      border: 0px;
      border: none;
      width: 100rpx;
      color: #006fe6;
      height: 63rpx;
      font-size: 23rpx;
      background-color: #f5f6fa;
      image {
        width: 30px;
        height: 30px;
      }
    }
  }

  .contsty {
    height: calc(100vh - 295rpx);
    overflow: auto;
    ::v-deep .uni-scroll-view-content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
    .listy {
      height: 175rpx;
      width: 45%;
      background-color: #f5f6fa;
      border-radius: 5rpx;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 25rpx;
      color: #006fe6;
      font-size: 23rpx;
      .listyImg {
        .listyImgSon {
          margin: 0px 10rpx;
          img {
            display: block;
            margin-top: 4rpx;
          }
        }
      }
    }
    ::v-deep .u-line {
      border-bottom: 1px solid #cccccc;
    }
  }
  .textColor1 {
    color: #006fe6 !important;
  }
  .textColor2 {
    color: #f62447 !important;
  }
  .btnOpt {
    width: 100%;
    position: absolute;
    bottom: 24px;

    .btnOptChild {
      text-align: center !important;

      .submitBtn {
        color: #ffffff;
        background-color: #006fe6;
        border-radius: 8px;
      }

      .resetBtn {
        border-radius: 8px;
        border: solid 1px #006fe6;
      }
    }
  }
}
</style>