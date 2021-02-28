<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="退库">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view style="text-align: center;">物料单号：{{houseNo}}</view>
    <view class="addform u-padding-25">
      <scroll-view :scroll-top="0" scroll-y="true" class="contsty" @scrolltolower="getBottom">
        <view v-for="(item, index) of list" :key="index" class="listy">
          <u-row>
            <u-col class="u-padding-top-26 u-padding-left-26" span="6">
              <view class="itemsty">
                物料代码：
                <view class="valuesty u-line-1" style="width: 200rpx;">{{ item.code }}</view>
              </view>
              <view class="itemsty">
                物料名称：
                <view class="valuesty u-line-1" style="width: 200rpx;">{{ item.productName }}</view>
              </view>
              <view class="itemsty">
                物料数量：
                <u-input v-model="item.storageCount" type="text" border placeholder-style="font-size: 23rpx;" style="width: 200rpx;font-size: 23rpx;" :disabled="!btnType" />
                <!-- <u-input v-if="btnType" v-model="item.applyCount" type="text" border placeholder-style="font-size: 23rpx;" style="width: 200rpx;font-size: 23rpx;" /> -->
              </view>
            </u-col>
            <u-col class="u-padding-top-26  u-padding-left-26" span="6">
              <view class="itemsty">
                单位：
                <view class="valuesty u-line-1" style="width: 200rpx;">{{ item.unit }}</view>
              </view>
              <view class="itemsty">
                批次号：
                <view class="valuesty u-line-1" style="width: 200rpx;">{{ item.fwBatch }}</view>
              </view>
              <view class="itemsty" style="text-align: left">
                <u-button class="valuesty subscript" @click="print(item)">补打标签</u-button>
              </view>
            </u-col>
          </u-row>
        </view>
        <u-loadmore :status="status" font-size="20" />
      </scroll-view>
      <u-button v-if="btnType" class="substy" @click="submit">退库</u-button>
    </view>
    <u-mask :show="show">
      <view class="warp">
        <view class="rect" @tap.stop>
          <view class="desc">
            <u-icon name='info-circle-fill' size="25" style="color: #E6A23C;margin-right: 10rpx;"></u-icon>
            确认标签完整并退库！
          </view>
          <view class="btnBox">
            <u-button class="cancelBtn" @click="show = false">取消</u-button>
            <u-button class="saveBtn" @click="saveDown">确定退库</u-button>
          </view>
        </view>
      </view>
    </u-mask>
    <view>
      <u-toast ref="uToast"></u-toast>
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
      list: [
        // { mouldCode: '上模', productCode: '10P0001' },
        // { mouldCode: 'sdadsds', productCode: '10P0001' }
      ],
      show: false,
      fileList: [],
      imageId: [],
      contentsList: [],
      btnType: false,
      itemInfo: null, //代办任务列表传过来的值
      // itemReadyInfo: null, //历史人物列表传过来的值
      status: 'loadmore',
      houseNo: null,
      pageIndex: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    //获取localStorage中传递的数据
    const maintainInfo = uni.getStorageSync('outsideInfo')
    const outSideListReady = uni.getStorageSync('outsidesListreadyInfo')
    if (maintainInfo) {
      this.itemInfo = JSON.parse(maintainInfo)
      uni.removeStorageSync('outsideInfo')
      this.btnType = true
    }
    if (outSideListReady) {
      this.itemInfo = JSON.parse(outSideListReady)
      uni.removeStorageSync('outsidesListreadyInfo')
      this.btnType = false
    }
    // this.$nextTick(function () {
    this.getList()
    // })
  },
  methods: {
    /**
     * 点击退库
     */
    submit() {
      this.show = true
    },
    getList() {
      // debugger
      this.$u
        .get(this.apiUrl.logisticsBackHouseDetailsList, {
          id: this.itemInfo.id
          // id: 1
          // pageNum: this.pageIndex,
          // pageSize: this.pageSize
        })
        .then(res => {
          for (const item of res.data.logisticsBackHouseDetails) {
            this.list.push(item)
          }
          this.houseNo = res.data.houseNo
          // this.total = res.data.total
          // if (this.list.length >= this.total) this.status = 'nomore'
          // else this.status = 'loading'
        })
    },
    /**
     * 下拉加载
     */
    getBottom(e) {
      if (this.list.length >= this.total || this.status === 'loading') return
      this.status = 'loading'
      this.pageIndex = ++this.pageIndex
      setTimeout(() => {
        this.getList()
      }, 1000)
    },
    /**
     * 点击打印
     */
    print(item) {
      console.log('打印:')
    },
    /**
     *
     */
    saveDown() {
      var arrList = this.list
      // arrList.forEach((item, index) => {
      //   item.storageCount = this.list[index].applyCount
      // })
      console.log(arrList)
      var params = {}
      params = {
        id: this.itemInfo.id,
        logisticsBackHouseDetails: arrList
      }
      this.$u.post(this.apiUrl.cancellingStocks, JSON.stringify(params)).then(res => {
        if (res.code === 0) {
          this.show = false
          uni.navigateBack({
            delta: 1
          })
          uni.$emit('reflashlistOut', {
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
    },
    backPage() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashlist', {
        result: 0
      })
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

    .substy {
      height: 69rpx;
      font-size: 23rpx;
      border-color: #ffffff;
      background-color: #006fe6;
      border-radius: 6rpx;
      color: #fff;
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

        .itemsty {
          font-size: 23rpx;
          color: #969696;
          margin-bottom: 30rpx;
          display: flex;
          justify-content: left;
          align-items: center;
          ::v-deep uni-input {
            min-height: 0 !important;
            height: 36rpx !important;
            line-height: 36rpx !important;
          }

          ::v-deep .uni-input-input {
            font-size: 23rpx;
            width: 200rpx;
            // height: 50%;
            line-height: 36rpx !important;
            float: left;
          }

          ::v-deep .u-input__input {
            min-height: 0 !important;
          }
        }

        .valuesty {
          display: inline-block;
          margin-left: 2rpx;
          line-height: 1;
          color: #323232;
        }

        .subscript {
          /* height: 30rpx;*/
          width: 60%;
          font-size: 23rpx;
          height: 36rpx;
          line-height: 36rpx;
          border-color: #ffffff;
          background-color: #006fe6;
          border-radius: 6rpx;
          color: #fff;
        }

        .u-btn {
          margin: 0;
        }
      }
    }
  }

  .warp {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .rect {
    width: 70%;
    /* height: 25%; */
    background-color: #fff;
    padding: 40rpx 20rpx;
    .desc {
      font-size: 23rpx;
      margin-bottom: 50rpx;
    }
    .btnBox {
      display: flex;
      margin-bottom: 30rpx;
      .cancelBtn {
        width: 35%;
        background-color: #006fe6;
        color: #fff;
        font-size: 23rpx;
        height: 10%;
        line-height: 2 !important;
      }

      .saveBtn {
        width: 35%;
        background-color: #006fe6;
        color: #fff;
        font-size: 23rpx;
        height: 10%;
        line-height: 2 !important;
      }
    }
  }
}
</style>