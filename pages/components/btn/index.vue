<template>
  <view>
    <!-- <view class="message-box right-item" @click="getMsg()">
      <u-icon name="bell-fill" size="34" color="#006fe6"></u-icon>
      <u-badge size="mini" :is-dot="true" :offset="[18, 18]"></u-badge>
    </view> -->
    <view class="dot-box right-item" @click="scan()">
      <u-icon name="scan" size="34" color="#006fe6"></u-icon>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type: 'scan-listener',
      result: ''
    }
  },
  methods: {
    scan() {
      let self = this
      uni.setStorageSync('scan_type', this.type)
      uni.$once(this.type, function (data) {
        uni.setStorageSync('scan_result', data.result)
        this.$u.route({
          url: '/pages/components/scan/result'
        })
      })
      // uni.setStorageSync('scan_result', '00db9b45-a5e0-435e-9a8d-d6e61e2ecc50&product')
      this.$u.route({
        url: '/pages/components/scan/index'
      })
    },
    getMsg() {
      this.$u.route({
        url: '/pages/minepage/message'
      })
    }
  }
}
</script>

<style>
</style>