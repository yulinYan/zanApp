<template>
  <view class="maintains">
    <view class="headersty">
      <u-navbar :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="二次加工">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view>
      <view class="u-flex tabbs u-padding-left-65 u-padding-right-65 u-padding-top-25">
        <!-- <u-button :class="active === 0 ? 'actives' : ''" :hair-line="false" class="custom-style" @click="tabbs(0)">设备保养</u-button> -->
        <u-button :class="active === 1 ? 'actives' : ''" :hair-line="false" class="custom-style" @click="tabbs(1)">生产指令</u-button>
        <u-button :class="active === 2 ? 'actives' : ''" :hair-line="false" class="custom-style" @click="tabbs(2)">已完成生产指令</u-button>
      </view>
      <view class="bodys">
        <!-- <addForms v-if="active === 0" /> -->
        <reprocessList v-if="active === 1" />
        <reprocessListready v-if="active === 2" />
      </view>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>
<script>
import btns from '../../../components/btn'
import reprocessList from './reprocessList'
import reprocessListready from './reprocessListready'
export default {
  components: {
    btns,
    reprocessList,
    reprocessListready
  },
  data() {
    return {
      active: 1
    }
  },
  created() {},
  methods: {
    tabbs(index) {
      this.active = index
    }
  }
}
</script>
<style lang="scss" scoped>
.maintains {
  width: 100%;
  height: 100%;
  .tabbs {
    width: 100%;
    .custom-style {
      width: 280rpx;
      height: 50rpx;
      font-size: 23rpx;
      box-shadow: 0px 18px 20px 0px rgba(234, 233, 240, 0.8);
      border-color: #ffffff;
      background-color: #ffffff;
      border-radius: 6rpx;
      color: #323232;
    }
    .actives {
      color: #ffffff !important;
      background-color: #006fe6 !important;
    }
    .bodys {
      width: 100%;
      height: 100%;
    }
  }
}
</style>