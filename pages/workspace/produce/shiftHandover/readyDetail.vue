<template>
  <view class="addbt">
    <view class="addform ">
      <view style="padding: 30rpx;">
        <!-- <u-form :model="maintForm" ref="uForm">
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" label-width="130" :border-bottom="false" label="接收人:" class="from-item scansty">
            <u-input v-model="maintForm.operateName" type="select" placeholder="请选择接收人" :border="border" />
          </u-form-item>
        </u-form> -->
        <view class="topView">
          <span>交接人：</span><span>{{shiftDetailInfo.createUserName}}</span>
        </view>
        <view class="topView">
          <span>接收人：</span><span>{{shiftDetailInfo.operateUserName}}</span>
        </view>
        <view class="topView">
          <span>交接时间：</span><span>{{shiftDetailInfo.createTime}}</span>
        </view>
      </view>
      <u-divider :size="3" border-color="#969696" color="#006fe6" class="dividers">交接事项</u-divider>
      <view v-for="(item,index) in shiftItems" :key="index" class="topView">
        <span>{{index+1}}：</span><span>{{item}}</span>
      </view>
      <view class="topView">
        <span>其他：</span><span>{{shiftDetailInfo.note}}</span>
      </view>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import UCol from '../../../../uview-ui/components/u-col/u-col.vue'
import btns from '../../../components/btn'
export default {
  components: {
    btns
  },

  data() {
    return {
      shiftDetailInfo: {},
      shiftItems: []
    }
  },
  mounted() {
    this.dataInit()
  },
  methods: {
    dataInit() {
      this.shiftDetailInfo = JSON.parse(uni.getStorageSync('shiftDetailInfo'))
      if (this.shiftDetailInfo) {
        uni.removeStorageSync('shiftDetailInfo')
        this.shiftItems = this.shiftDetailInfo.matters.split(',')
      }
      console.log(this.shiftItems)
    }
  }
}
</script>

<style lang="scss" scoped>
.addform {
  width: 100%;
  height: calc(100vh - 171rpx);
  overflow: auto;
  margin-top: 20rpx;

  .topView {
    margin: 23rpx;
  }
}
</style>
