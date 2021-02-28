<template>
  <view>
    <view class="headersty">
      <u-navbar :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="扫码结果">
      </u-navbar>
    </view>
    <view v-if="type === 1" class="u-padding-25">
      <view>编码: {{ code }}</view>
    </view>
    <view v-if="type === 0" class="u-padding-25">
      <view>物料代码: {{ obj.productCode }}</view>
      <view>物料名称: {{ obj.productName }}</view>
      <view>批次号: {{ obj.fwBatch }}</view>
      <view>物料单位: {{ obj.unit }}</view>
      <view>物料数量: {{ obj.storageCount }}</view>
    </view>
  </view>
</template>
<script>
var barcode = null
export default {
  data() {
    return {
      type: '',
      code: '',
      obj: {
        applyCount: '',
        beforeCount: '',
        deliveryPlanId: '',
        fwBatch: '',
        id: '',
        opreateDetailId: '',
        orderDetailId: '',
        outDetailId: '',
        productCode: '',
        productDate: '',
        productId: '',
        productName: '',
        providerBatch: '',
        providerName: '',
        storageCode: '',
        storageCount: '',
        storageDate: '',
        storageId: '',
        storageName: '',
        unit: ''
      }
    }
  },
  onLoad(d) {
    this.code = uni.getStorageSync('scan_result')
    if (this.code.indexOf('&') > -1) {
      const types = this.code.split('&')
      const id = types[0]
      const type = types[1]
      this.type = 0
      if (type === 'product') {
        this.$u.get(this.apiUrl.appUrl + this.apiUrl.scanGetProductDetail, { id: id }).then(res => {
          this.obj = res.data
        })
      }
    } else {
      this.type = 1
    }
  },
  methods: {}
}
</script>

<style scoped>
</style>
