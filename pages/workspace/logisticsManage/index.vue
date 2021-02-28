<template>
  <view class="worksty">
    <view class="headersty">
      <u-navbar :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="物流管理">
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
import btns from '../../components/btn'
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
          image: '/static/uview/modules/logisticsproin.png',
          url: '/pages/workspace/logisticsManage/warehousingProduct/index',
          power: '/warehousingManage/warehousing',
          name: '生产入库'
        },
        {
          image: '/static/uview/modules/logisticsinout.png',
          url: '/pages/workspace/logisticsManage/warehousingOut/index',
          power: '/warehousingManage/warehousing',
          name: '外部入库'
        },
        {
          image: '/static/uview/modules/logisticsup.png',
          url: '/pages/workspace/logisticsManage/onShelf/index',
          power: '/upLowManage/upLowLog',
          name: '上架'
        },
        {
          image: '/static/uview/modules/logisticsdown.png',
          url: '/pages/workspace/logisticsManage/downShelf/index',
          power: '/upLowManage/upLowLog',
          name: '下架'
        },
        {
          image: '/static/uview/modules/logisticsout.png',
          url: '/pages/workspace/logisticsManage/outhousing/index',
          power: '/warehouseOutManage/warehouseOut',
          name: '出库'
        },
        {
          image: '/static/uview/modules/logisticsinto.png',
          url: '/pages/workspace/logisticsManage/inventory/index',
          power: '/inventoryManage/inventory',
          name: '盘库'
        },
        {
          image: '/static/uview/modules/logisticsconfirm.png',
          url: '/pages/workspace/logisticsManage/confirms/index',
          power: '/confirmHarvest/confirmHarvest',
          name: '确认收货'
        },
        {
          image: '/static/uview/modules/logisticsmove.png',
          url: '/pages/workspace/logisticsManage/moves/index',
          power: '/movesManage/moves',
          name: '移库'
        },
        {
          image: '/static/uview/modules/logisticsback.png',
          url: '/pages/workspace/logisticsManage/outsides/index',
          power: '/materialReturnManage/materialReturn',
          name: '退库'
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
  created() {
    for (let i = 0; i < this.gridList.length; i++) {
      if (!this.hasPermission(this.gridList[i].power)) {
        this.gridList.splice(i, 1)
        i--
      }
    }
  },
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
  height: 100vh;
  .bacak {
    width: 100%;
    height: calc(100vh - 120rpx);
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
  }
}
</style>