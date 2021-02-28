<template>
  <view class="equips">
    <view class="headersty">
      <u-navbar :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="设备">
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
          image: '/static/uview/modules/fenceng1.png',
          url: '/pages/workspace/audits/audits/index',
          power: '/auditPlanImplement/auditPlanImplement',
          name: '分层审核'
        },
        {
          image: '/static/uview/modules/wentiguanli1.png',
          url: '/pages/workspace/audits/questions/index',
          power: '/questionManage/questionManage',
          name: '问题整改'
        }
      ]
    }
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
    }
  }
}
</script>
<style lang="scss" scoped>
.equips {
  width: 100%;
  height: 100%;
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