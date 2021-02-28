<template>
  <view class="maintainlis u-padding-25">
    <u-form :model="maintForm" ref="uForm">
      <u-form-item label-width="25" label-position="left" label="" class="searchsty">
        <u-search v-model="maintForm.mouldCode" shape="square" placeholder-style="color: #969696;fontSize: 23rpx" placeholder="请输入模具编号搜索" type="text" confirm-type="搜索" :show-action="false" @search="handleConfirmSearch"></u-search>
        <u-button slot="right" :hair-line="false" class="custom-style" size="mini" @click="searchFilter()">
          <image src="../../../../static/filter.png" alt="搜索"></image>
        </u-button>
      </u-form-item>
    </u-form>
    <scroll-view :scroll-top="0" scroll-y="true" class="contsty" @scrolltolower="getBottom">
      <view v-for="(item, index) of list" :key="index" class="listy" @click="clickGet(item)">
        <u-row>
          <u-col span="5" class="leftsty" @click="clickGet(item)">
            <view class="u-text-center u-margin-bottom-14 u-margin-top-26">
              <u-image :src="baseUrl+item.webPath" mode="aspectFit" width="100%" height="80rpx"></u-image>
            </view>
            <view class="u-font-23 u-text-center u-margin-bottom-16 namesty" v-if="item.operate === 0">任务类别:入库</view>
            <view class="u-font-23 u-text-center u-margin-bottom-16 namesty" v-else-if="item.operate === 1">任务类别:出库</view>
            <view class="u-font-23 u-text-center u-margin-bottom-16 namesty" v-else-if="item.operate === 2">任务类别:移库</view>
            <view class="u-font-23 u-text-center fontsty u-margin-bottom-26 u-line-1"></view>
          </u-col>
          <u-col class=" u-padding-left-26 rightsty" span="7" @click="clickGet(item)">
            <view class="itemsty">
              模具编号：
              <view class="valuesty u-line-1" style="width: 235rpx;line-height: 21rpx;">{{ item.mouldCode }}</view>
            </view>
            <view class="itemsty">
              模具名称：
              <view class="valuesty">{{ item.mouldName }}</view>
            </view>
            <view v-if="item.operate*1 === 2" class="itemsty">
              库位编号：
              <view class="valuesty">{{ item.oldLocation }}</view>
            </view>
            <view v-if="item.operate*1 !== 2" class="itemstys">
              库位编号：
              <view class="valuesty">{{ item.nowLocation }}</view>
            </view>
            <view class="itemstys" v-if="item.operate === 2">
              新库位编号：
              <view class="valuesty">{{ item.nowLocation }}</view>
            </view>
          </u-col>
        </u-row>
        <div class="subscript">待完成</div>
      </view>
      <u-loadmore :status="status" font-size="20" />
    </scroll-view>
    <!--筛选抽屉-->
    <u-popup v-model="searchPopup" mode="right" width="360px">
      <view class="formClass" style="padding: 24rpx;">
        <u-form :model="maintForm" ref="uSearchForm" label-position="top">
          <u-form-item label="任务类型" prop="name">
            <u-radio-group v-if="radioVisble" shape="square" v-model="maintForm.operate" @change="radioGroupChange">
              <u-radio v-for="(item, index) in operateList" :key="index" :name="item.value" :disabled="item.disabled">
                {{item.name}}
              </u-radio>
            </u-radio-group>
          </u-form-item>
        </u-form>
      </view>
      <u-row gutter="16" class="btnOpt">
        <u-col span="6" class="btnOptChild">
          <u-button class="submitBtn" size="mini" @click="handleSearch"  style="width: 100%;">查询</u-button>
        </u-col>
        <u-col span="6" class="btnOptChild">
          <u-button class="resetBtn" size="mini" @click="handleReset"  style="width: 100%;">重置</u-button>
        </u-col>
      </u-row>
    </u-popup>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>
<script>
export default {
  name: 'WarehousingList', //出入库--待完成任务
  data() {
    return {
      searchPopup: false,
      maintForm: {
        code: '',
        mouldCode: '',
        operate: null,
        mouldStatus: 0,
        pageIndex: 1,
        pageSize: 10
      },
      baseUrl: this.apiUrl.appUrl,
      list: [],
      pageIndex: 1,
      pageSize: 10,
      status: 'loadmore',
      total: 0,
      radioVisble: true,
      operateList: [
        {
          value: 0,
          name: '入库'
        },
        {
          value: 1,
          name: '出库'
        },
        {
          value: 2,
          name: '移库'
        }
      ]
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
     * 监听radioGroup组件change事件
     * @param {Object} e
     */
    radioGroupChange(e) {
      this.maintForm.operate = e
      this.radioVisble = false
      this.$nextTick(() => {
        this.radioVisble = true
      })
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
        code: '',
        mouldCode: this.maintForm.mouldCode.toString().trim(),
        operate: this.maintForm.operate,
        status: this.maintForm.mouldStatus,
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      }
      this.$u.get(this.apiUrl.findListMouldOptRecord, submitData).then(res => {
        for (const item of res.data.list) {
          this.list.push(item)
        }
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
      this.list = []
      this.pageIndex = 1
      this.getList()
      this.searchPopup = false
    },
    /**
     * 监听"重置"按钮click事件
     */
    handleReset() {
      this.$refs.uSearchForm.resetFields()
      this.maintForm.operate = null
      this.getList()
      this.searchPopup = false
    },
    /**
     * 监听'模具列表'标签click事件
     * @param {Object} item
     */
    clickGet(item) {
      uni.setStorageSync('warehousingInfo', JSON.stringify(item))
      let self = this
      uni.$once('reflashlist', function (data) {
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
        url: '/pages/workspace/moulds/warehousing/addForms'
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
        font-size: 18rpx;
        color: #969696;
        margin-bottom: 28rpx;
      }

      .itemstys {
        font-size: 18rpx;
        color: #969696;
      }

      .valuesty {
        display: inline-block;
        margin-left: 15rpx;
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
