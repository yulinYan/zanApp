<template>
  <view class="maintainlis u-padding-25">
    <u-form :model="maintForm" ref="uForm">
      <u-form-item label-width="25" label-position="left" label="" class="searchsty">
        <u-search v-model="maintForm.searchKey" shape="square" placeholder-style="color: #969696;fontSize: 23rpx" placeholder="请输入工单编号搜索" type="text" confirm-type="搜索" :show-action="false" @search="handleConfirmSearch"></u-search>
        <u-button slot="right" :hair-line="false" class="custom-style" size="mini" @click="searchFilter()">
          <image src="../../../../static/filter.png" alt="搜索"></image>
        </u-button>
      </u-form-item>
    </u-form>
    <scroll-view :scroll-top="0" scroll-y="true" class="contsty" @scrolltolower="getBottom">
      <view v-for="(item, index) of list" :key="index" class="listy">
        <u-row class="listRow">
          <view class="leftsty" @click="clickGet(item)">
            <view class="u-text-center u-margin-bottom-14 u-margin-top-26">
              <u-image :src="item.imagePath" mode="aspectFit" height="44rpx"></u-image>
            </view>
            <view class="u-font-23 u-text-center u-margin-bottom-16 namesty">维修工单号</view>
            <view class="u-font-23 u-text-center fontsty u-margin-bottom-26 u-line-1">{{ item.code }}</view>
          </view>
          <view class="centersty" @click="clickGet(item)">
            <!-- <view class="itemsty">
              <view class="valueKey">设备编号:</view>
              <view class="valuesty u-line-1">{{ item.productDevicesCode }}</view>
            </view> -->
            <view class="itemsty">
              <view class="valueKey">设备编号:</view>
              <view class="valuesty u-line-1">{{item.devicesName}}</view>
            </view>
            <view class="itemsty">
              <view class="valueKey">问题:</view>
              <view class="valuesty">{{item.questionName}}</view>
            </view>
            <view class="itemsty">
              <view class="valueKey">开始时间:</view>
              <view class="valuesty">{{item.startTime}}</view>
            </view>
          </view>
          <view class="rightsty" @click="clickGet(item)">
            <view class="itemsty">
              <view class="valueKey">优先级:</view>
              <view v-if="item.priority===0 || item.priority==='0'" class="valuesty u-line-1 textColor1">普通</view>
              <view v-else class="valuesty u-line-1 textColor2">优先</view>
            </view>
            <view class="itemsty">
              <view class="valueKey">维修方案:</view>
              <view class="valuesty">{{item.devicesRepairItemName}}</view>
            </view>
            <view class="itemsty">
              <view class="valueKey">问题描述:</view>
              <view class="valuesty">{{item.questionDesc}}</view>
            </view>
            <view class="itemsty">
              <view class="valueKey">完成时间:</view>
              <view class="valuesty">{{item.finishTime}}</view>
            </view>
          </view>
        </u-row>
        <div class="subscript">
          完成
        </div>
      </view>
      <u-loadmore :status="status" font-size="20" />
    </scroll-view>
    <!--筛选抽屉-->
    <u-popup v-model="searchPopup" mode="right" width="360px">
      <view class="formClass" style="margin: 24rpx;">
        <u-form :model="searchForm" ref="uSearchForm" label-position="top">
          <u-form-item label="优先级" prop="name">
            <u-radio-group v-if="radioVisble" shape="square" v-model="searchForm.priority" @change="radioGroupChange">
              <u-radio v-for="(item, index) in priorityList" :key="index" :name="item.value" :disabled="item.disabled">
                {{item.name}}
              </u-radio>
            </u-radio-group>
          </u-form-item>
        </u-form>
      </view>
      <u-row gutter="16" class="btnOpt">
        <u-col span="6" class="btnOptChild">
          <u-button class="submitBtn" size="mini" @click="handleSearch" style="width: 100%;">查询</u-button>
        </u-col>
        <u-col span="6" class="btnOptChild">
          <u-button class="resetBtn" size="mini" @click="handleReset" style="width: 100%;">重置</u-button>
        </u-col>
      </u-row>
    </u-popup>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>
<script>
export default {
  name: 'RepairList', //设备维修列表--已完成任务记录
  data() {
    return {
      searchPopup: false,
      maintForm: {
        searchKey: ''
      },
      list: [],
      pageIndex: 1,
      pageSize: 10,
      status: 'loadmore',
      total: 0,
      searchForm: {
        //筛选中的表单
        priority: null
      },
      radioVisble: true,
      priorityList: [
        {
          value: 0,
          name: '普通'
        },
        {
          value: 1,
          name: '紧急'
        }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    /**
     * 监听radioGroup组件change事件
     * @param {Object} e
     */
    radioGroupChange(e) {
      this.priority = e
      this.radioVisble = false
      this.$nextTick(() => {
        this.radioVisble = true
      })
    },
    /**
     * 监听搜索框 search事件
     */
    handleConfirmSearch() {
      this.getList()
    },
    /**
     * 监听上滑滚动事件
     * @param {Object} e
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
     * 获取数据请求
     */
    getList() {
      let searchObj = {
        repairExeStatus: '1', //未完成
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      }
      if (this.searchForm.priority != null) {
        searchObj.priority = this.searchForm.priority
      }
      if (this.maintForm.searchKey.length > 0) {
        searchObj.code = this.maintForm.searchKey
      }
      this.$u.get(this.apiUrl.getRepais, searchObj).then(res => {
        this.list = res.data.list
        this.total = res.data.total
        if (this.list.length >= this.total) this.status = 'nomore'
        else this.status = 'loadmore'
      })
    },
    /**
     * 监听"筛选"按钮click事件
     */
    searchFilter() {
      this.searchPopup = true
    },
    /**
     * 监听"提交"按钮click事件
     */
    handleSearch() {
      this.getList()
      this.searchPopup = false
    },
    /**
     * 监听"重置"按钮click事件
     */
    handleReset() {
      this.$refs.uSearchForm.resetFields()
      this.searchForm.priority = null
      this.getList()
      this.searchPopup = false
    },
    clickGet(item) {
      uni.setStorageSync('repairInfo', JSON.stringify(item))
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
      border: solid 1px #dfdfdf;
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
      width: 100px;
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

    .listy {
      height: 175rpx;
      background-color: #f5f6fa;
      border-radius: 5rpx;
      overflow: hidden;
      position: relative;
      margin-bottom: 25rpx;
      .listRow {
        align-items: flex-start !important;
        justify-content: flex-start;
        .leftsty {
          background-color: #f0f1f6;
          width: 182.5rpx !important;
          height: 175rpx;
          .u-image {
            width: 43.75rpx;
            height: 41.25rpx;
          }
          .namesty {
            font-family: MicrosoftYaHei-Bold;
            font-size: 22.5rpx;
            color: #323232;
          }
          .fontsty {
            color: #006fe6;
            font-family: MicrosoftYaHei-Bold;
          }
        }
        .centersty {
          width: 217.5rpx !important;
          margin-left: 31.25rpx;
          padding: 15rpx 0 0;
          .itemsty {
            font-size: 18rpx;
            color: #969696;
            margin-bottom: 15.625rpx;
            .valueKey {
              width: 75.625rpx;
              font-size: 17.5rpx;
              color: #969696;
              display: inline-block;
            }
            .valuesty {
              width: 120rpx;
              display: inline-block;
              margin-left: 15rpx;
              line-height: 18rpx;
              color: #323232;
              vertical-align: text-bottom;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .rightsty {
          width: 236.875rpx !important;
          margin-left: 31.25rpx;
          padding: 15rpx 0 0;
          .itemsty {
            font-size: 18rpx;
            color: #969696;
            margin-bottom: 15.625rpx;
            .valueKey {
              width: 75.625rpx;
              font-size: 17.5rpx;
              color: #969696;
              display: inline-block;
            }
            .valuesty {
              width: 120rpx;
              display: inline-block;
              margin-left: 15rpx;
              color: #323232;
              vertical-align: text-bottom;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
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
