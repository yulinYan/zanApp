<template>
  <view class="worksty">
    <view class="headersty">
      <u-navbar title-color="#323232" back-icon-color="#ffffff" :is-fixed="true" :is-back="false" :background="{background: '#fff'}" title="工作台">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="u-padding-left-35 u-padding-right-35 bacak">
      <u-grid :col="4" :border="false">
        <u-grid-item v-for="(item, index) in gridList" :index="index" :key="index" name="设备" @click="itemClick">
          <u-icon :name="item.image" :size="139"></u-icon>
          <view class="grid-text">{{ item.name }}</view>
        </u-grid-item>
      </u-grid>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>
<script>
import btns from '../components/btn/index'
export default {
  components: {
    btns
  },
  data() {
    return {
      type: 'scan-listener',
      result: '',
      gridList: [
        {
          image: '/static/uview/modules/fenceng1.png',
          url: '/pages/workspace/audits/index',
          name: '分层审核'
        },
        // {
        //   image: '/static/uview/modules/wentiguanli1.png',
        //   url: '/pages/workspace/equipment/index',
        //   name: '问题管理'
        // },
        // {
        //   image: '/static/uview/modules/zhiliang1.png',
        //   url: '/pages/workspace/equipment/index',
        //   name: '质量'
        // },
        {
          image: '/static/uview/modules/wuliu1.png',
          url: '/pages/workspace/logisticsManage/index',
          name: '物流'
        },
        {
          image: '/static/uview/modules/shebei1.png',
          url: '/pages/workspace/equipment/index',
          name: '设备'
        },
        {
          image: '/static/uview/modules/muju1.png',
          url: '/pages/workspace/moulds/index',
          name: '模具'
        },
        {
          image: '/static/uview/modules/shengchan1.png',
          url: '/pages/workspace/produce/index',
          name: '生产'
        },
        {
          image: '/static/uview/modules/andeng1.png',
          url: '/pages/workspace/andon/index',
          name: '安灯报警'
        }
      ],
      machineForm: {
        account: '',
        pwd: ''
      }
    }
  },
  onLoad() {
    // #ifdef APP-PLUS
    // #endif
  },
  created() {},
  methods: {
    itemClick(index) {
      console.log(index)
      this.$u.route({
        url: this.gridList[index].url
      })
    },
    scan() {
      let self = this
      uni.setStorageSync('scan_type', this.type)
      uni.$once(this.type, function (data) {
        self.list = []
        self.getList()
      })
    },
    equipments() {
      // 扫码
      // this.$u.route({
      //   url: '/pages/components/scan/index', //'/pages/workspace/equipment/index'
      //   params: {
      //     type: this.type
      //   }
      // })
      this.$u.route({
        url: '/pages/workspace/equipment/index'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.worksty {
  width: 100vw;
  height: calc(100vh - 100px);
  .bacak {
    width: 100%;
    height: calc(100vh - 180rpx);
    background-image: url('/static/beijing-gongzuotai.png');
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .u-grid-item {
      background: transparent !important;
    }
  }
  .grid-text {
    margin-top: 15rpx;
    color: #969696;
  }
}
</style>