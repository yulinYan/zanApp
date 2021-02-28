<template>
  <view class="worksty">
    <view class="headersty">
      <u-navbar :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="消息">
      </u-navbar>
    </view>
    <view class="u-padding-left-35 u-padding-right-35">

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
  methods: {}
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
  }
}
</style>