<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="上架详情">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="addform u-padding-25">
      <view class="listy">
        <u-row>
          <u-col class="u-padding-top-26 u-padding-left-26" span="12">
            <view v-if="itemInfo !== null" class="itemsty">
              上架人：
              <view class="valuesty u-line-1">{{ itemInfo.createUserName }}</view>
            </view>
            <view class="itemsty">
              上架时间：
              <view class="valuesty u-line-1">{{ createTime }}</view>
            </view>
          </u-col>
        </u-row>
        <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">货物详情</u-divider>
        <u-table>
          <u-tr class="u-tr">
            <u-th class="u-th">物料代码</u-th>
            <u-th class="u-th" width="160rpx">物料名称</u-th>
            <u-th class="u-th" width="60rpx">单位</u-th>
            <u-th class="u-th" width="110rpx">物料数量</u-th>
            <u-th class="u-th">操作</u-th>
          </u-tr>
          <u-tr class="u-tr" v-for="(item, index) in list" :key="item.id" :class="index % 2 === 0 ? 'fontsty' : 'fontsty linsty'">
            <u-td class="u-td">{{item.code}}</u-td>
            <u-td class="u-td u-line-1" width="160rpx">{{item.productName}}</u-td>
            <u-td class="u-td" width="60rpx">{{item.unit}}</u-td>
            <u-td class="u-td" width="110rpx">{{item.storageCount}}</u-td>
            <u-td class="u-td"> 打印二维码 </u-td>
          </u-tr>
        </u-table>
      </view>
    </view>
    <view>
      <!-- <u-toast ref="uToast"></u-toast> -->
    </view>
  </view>
  <!-- </view> -->
</template>

<script>
import btns from '../../../components/btn'
export default {
  components: {
    btns
  },
  data() {
    return {
      list: [],
      itemInfo: null, //代办任务列表传过来的值
      status: 'loadmore',
      createTime: '',
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    //获取localStorage中传递的数据
    const maintainInfo = uni.getStorageSync('onShelfInfo')
    if (maintainInfo) {
      this.itemInfo = JSON.parse(maintainInfo)
      uni.removeStorageSync('onShelfInfo')
    }
    this.getList()
  },
  methods: {
    /**
     * 点击返回
     */
    submit() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashlistOnshelf', {
        result: 1
      })
    },
    getList() {
      // debugger
      this.$u
        .get(this.apiUrl.getUpDetailList, {
          id: this.itemInfo.id
          // id: 6
          // pageNum: this.pageIndex,
          // pageSize: this.pageSize
        })
        .then(res => {
          for (const item of res.data.logisticsUpHouseDetails) {
            this.list.push(item)
          }
          this.createTime = res.data.createTime
        })
    },
    backPage() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashlistOnshelf', {
        result: 0
      })
    },
    /**
     * 下拉加载
     */
    getBottom(e) {
      // if (this.list.length >= this.total) return
      // this.status = 'loading'
      // this.pageIndex = ++this.pageIndex
      // setTimeout(() => {
      //   this.getList()
      // }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.addbt {
  .addform {
    width: 100%;
    height: calc(100vh - 122rpx);
    overflow: auto;

    .u-row {
      display: -webkit-box;
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
    .substy {
      height: 69rpx;
      font-size: 23rpx;
      border-color: #ffffff;
      background-color: #006fe6;
      border-radius: 6rpx;
      color: #fff;
    }

    .listy {
      // background-color: #f5f6fa;
      border-radius: 5rpx;
      overflow: hidden;
      position: relative;
      margin-bottom: 25rpx;

      .itemsty {
        font-size: 23rpx;
        color: #969696;
        margin-bottom: 30rpx;
        display: flex;
        justify-content: left;
      }

      .valuesty {
        display: inline-block;
        margin-left: 2rpx;
        color: #323232;
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
      }
      .linsty {
        background-color: #fafafa;
      }
      .u-btn {
        margin: 0;
      }
      .u-table {
        margin-top: 20rpx;

        .u-th {
          font-weight: normal;
          font-size: 23rpx !important;
          line-height: 50rpx;
          height: 50rpx;
          color: #006fe6;
          background-color: #fafafa;
        }
        .u-td {
          font-size: 23rpx !important;
          line-height: 50rpx;
          height: 50rpx;
        }
      }
    }
  }
}
</style>