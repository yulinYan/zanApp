<template>
  <view class="modules">
    <view class="headersty">
      <u-navbar :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="生产">
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
      gridList: [
        {
          image: '/static/uview/modules/picking.png',
          url: '/pages/workspace/produce/receiveMaterials/index',
          power: '/produce/receiveMaterials',
          name: '领料'
        },
        {
          image: '/static/uview/modules/feeding.png',
          url: '/pages/workspace/produce/putInMaterials/index',
          power: '/produce/putInMaterials',
          name: '投料'
        },
        {
          image: '/static/uview/modules/secondary-processing.png',
          url: '/pages/workspace/produce/reprocessing/index',
          power: '/produce/reprocessing',
          name: '二次加工'
        },
        {
          image: '/static/uview/modules/arrange-staff.png',
          url: '/pages/workspace/produce/arrangeStaff/index',
          power: '/produce/arrangeStaff',
          name: '安排员工'
        },
        {
          image: '/static/uview/modules/shift-handover.png',
          url: '/pages/workspace/produce/shiftHandover/index',
          power: '/produce/shiftHandover',
          name: '换班交接'
        },
        {
          image: '/static/uview/modules/drying-time.png',
          url: '/pages/workspace/produce/dryingTime/index',
          power: '/produce/dryingTime',
          name: '烘料时长'
        }
      ]
    }
  },
  created() {
    for (let i = 0; i < this.gridList.length; i++) {
      if (!this.hasPermission(this.gridList[i].power)) {
        // if (this.hasPermission(this.gridList[i].power)) {
        this.gridList.splice(i, 1)
        i--
      }
    }
  },
  methods: {
    itemClick(index) {
      this.$u.route({
        url: this.gridList[index].url
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.modules {
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