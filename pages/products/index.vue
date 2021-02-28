<template>
  <view class="products">
    <view class="headersty">
      <u-navbar title-color="#323232" back-icon-color="#ffffff" :is-fixed="true" :is-back="false" :background="{background: '#fff'}" title="生产实况">
        <view class="navbar-right" slot="right">
          <view class="message-box right-item">
            <u-icon name="bell-fill" size="34" color="#006fe6"></u-icon>
            <u-badge size="mini" :is-dot="true" :offset="[18, 18]"></u-badge>
          </view>
          <view class="dot-box right-item">
            <u-icon name="scan" size="34" color="#006fe6"></u-icon>
          </view>
        </view>
      </u-navbar>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>
<script>
export default {
  data() {
    return {
      lightImg: '/static/logo-noText.png',
      isFixed: true,
      machineForm: {
        account: '',
        pwd: ''
      }
    }
  },
  created() {},
  methods: {
    submitForm() {}
  }
}
</script>
<style lang="scss" scoped>
.products {
  width: 100%;
  height: 100%;
}
</style>