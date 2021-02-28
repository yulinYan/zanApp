<template>
  <view class="maintainlis u-padding-25">
    <u-form :model="maintForm" ref="uForm">
      <u-form-item :leftIconStyle="{color: '#969696', fontSize: '23rpx'}" label-width="25" label-position="left" label="" class="searchsty">
        <u-search v-model="maintForm.searchKey" shape="square" placeholder-style="color: #969696;fontSize: 23rpx" placeholder="请输入工单编号搜索" type="text" confirm-type="搜索" :show-action="false" @search="handleConfirmSearch"></u-search>
        <u-button slot="right" :hair-line="false" class="custom-style" size="mini" @click="searchFilter()">
          <image src="../../../../static/filter.png" alt="搜索"></image>
        </u-button>
      </u-form-item>
    </u-form>
    <scroll-view :scroll-top="0" scroll-y="true" class="contsty" @scrolltolower="getBottom">
      <view v-for="(item, index) of list" :key="index" class="listy">
        <u-row>
          <u-col span="4" class="leftsty" @click="clickGet(item)">
            <view class="u-text-center u-margin-bottom-14 u-margin-top-26">
              <u-image :src="item.imagePath" mode="aspectFit" height="44rpx"></u-image>
            </view>
            <view class="u-font-23 u-text-center u-margin-bottom-16 namesty">维修工单号</view>
            <view class="u-font-23 u-text-center fontsty u-margin-bottom-26 u-line-1">{{ item.code }}</view>
          </u-col>
          <u-col class="u-padding-top-26 u-padding-bottom-26 u-padding-left-26" span="4" @click="clickGet(item)">
            <view class="itemsty">
              模具编号：
              <view class="valuesty u-line-1">{{ item.mouldId }}</view>
            </view>
            <view class="itemsty">
              模具名称：
              <view class="valuesty" style="width: 90rpx;">{{item.mouldName}}</view>
            </view>
            <view class="itemsty">
              问题：
              <view class="valuesty" style="width: 90rpx;">{{item.questionName}}</view>
            </view>
            <view class="itemsty">
              开始时间：
              <view class="valuesty" style="width: 90rpx;">{{item.startTime}}</view>
            </view>
          </u-col>
          <u-col class="u-padding-top-26 u-padding-bottom-26 u-padding-left-26" span="4" @click="clickGet(item)">
            <view class="itemsty">
              优先级：
              <view class="valuesty u-line-1">{{ item.priority==="0"?"普通":"紧急" }}</view>
            </view>
            <view class="itemsty">
              维修方案：
              <view class="valuesty">{{item.devicesRepairItemName}}</view>
            </view>
            <view class="itemsty">
              问题描述：
              <view class="valuesty" style="width: 90rpx;">{{item.questionDesc}}</view>
            </view>
            <view class="itemsty">
              开始时间：
              <view class="valuesty" style="width: 90rpx;">{{item.finishTime}}</view>
            </view>
          </u-col>
        </u-row>
        <div class="subscript">
          完成
        </div>
      </view>
      <u-loadmore :status="status" font-size="20" />
    </scroll-view>
    <!--筛选抽屉-->
    <u-popup v-model="searchPopup" mode="right" width="360px">
      <view class="formClass" style="padding: 24rpx;">
        <u-form :model="searchForm" ref="uSearchFormForm" label-position="top">
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
  </view>
</template>
<script>
export default {
  name: 'RepairList', //模具维修列表--已完成任务记录
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
      this.$u.get(this.apiUrl.getMouldRepais, searchObj).then(res => {
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
      this.$refs.uSearchFormForm.resetFields()
      this.searchForm.priority = null
      this.getList()
      this.searchPopup = false
    },
    clickGet(item) {
      uni.setStorageSync('repairInfo', JSON.stringify(item))
      let self = this
      uni.$emit('showMouldRepairInfo', {
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
    height: calc(100vh - 320rpx);
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
        background-color: #f0f1f6;
        height: 257rpx;
        padding-top: 25rpx !important;
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
        color: #323232;
        vertical-align: text-bottom;
        overflow: hidden;
        line-height: 18rpx;
        text-overflow: ellipsis;
        white-space: nowrap;
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
