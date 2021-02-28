<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="模具使用">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="addform u-padding-25">
      <view class="tabsty">
        <u-tabs :bold="false" :list="tablist" :current="current" :is-scroll="false" :bar-height="2" :height="60" :font-size="20" inactive-color="#969696" active-color="#006fe6" bg-color="#fff" @change="changeTab"></u-tabs>
      </view>
      <u-form :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="机台编号" class="from-item">
          <u-input v-model="maintForm.devicesCode" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="机台编号" class="from-item">
          <u-input v-model="maintForm.scanDevicesCode" placeholder="扫描机台编号" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan('devicesCodeScan')" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="生产指令" class="from-item">
          <u-input v-model="maintForm.productCode" placeholder="生产指令" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具编号" class="from-item">
          <u-input v-model="maintForm.mouldCode" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具编号" class="from-item">
          <u-input v-model="maintForm.scanMouldCode" placeholder="扫描模具编号" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan('mouldCodeScan')" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="验证结果" class="from-item">
          <!-- <u-input v-model="maintForm.remark" placeholder="验证结果" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)"
					 maxlength="50" /> -->
          <view v-if='flag1==true && flag2==true' style="padding-left:30rpx ;"> 验证通过 </view>
          <view v-if="flag1==false || flag2==false">验证不通过</view>
        </u-form-item>
        <u-form-item v-if="current !== 0" :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模尾照片">
          <!-- u-input v-model="maintForm.remark" :placeholder="''" maxlength="50" /> -->
          <u-upload ref="uUpload" :action="uploadUrl" :form-data="{'isAdd':true}" :max-size="200*1024*1024" max-count="4" :show-progress=false width="110" height="110" @on-remove="onRemove" @on-success="successUpload"></u-upload>
        </u-form-item>
      </u-form>
      <u-button class="substy" :class=" (flag1==false || flag2==false)?'btnDisable':'' " @click="submit" :disabled=" flag1==false || flag2==false ">提交</u-button>
    </view>
    <view>
      <u-toast ref="uToast"></u-toast>
    </view>
  </view>
  <!-- </view> -->
</template>

<script>
import btns from '../../../components/btn'
export default {
  components: {
    btns
  },
  data() {
    return {
      tablist: [
        {
          name: '上模'
        },
        {
          name: '下模'
        }
      ],
      flag1: true,
      flag2: true,
      uploadUrl: this.apiUrl.appUrl + this.apiUrl.uploadFile, //上传图片路径
      current: 0,
      maintForm: {
        mouldCode: '',
        scanMouldCode: '',
        devicesCode: '',
        scanDevicesCode: '',
        productCode: '', //生产指令
        remark: ''
      },
      fileList: [],
      imageId: [],
      contentsList: [],
      itemInfo: null
    }
  },
  mounted() {
    //获取localStorage中传递的数据
    const maintainInfo = uni.getStorageSync('mouldUsedsInfo')
    if (maintainInfo) {
      this.itemInfo = JSON.parse(maintainInfo)
      this.maintForm.mouldCode = this.itemInfo.mouldCode
      this.maintForm.devicesCode = this.itemInfo.devicesCode
      this.maintForm.productCode = this.itemInfo.productCode
      uni.removeStorageSync('mouldUsedsInfo')
      this.current = this.itemInfo.opreate * 1
    }
  },
  methods: {
    changeTab(index) {
      // this.current = index    放开之后就可以左右切换
    },
    /**
     * 删除上传图片
     * */
    onRemove(index, lists) {
      this.fileList.splice(index, 1)
      this.imageId.splice(index, 1)
    },
    /**
     * 上传图片
     * */
    successUpload(data, index, lists, name) {
      this.fileList.push(data.data)
      this.imageId.push(data.data.dataId)
    },

    submit() {
      var params = {}
      if (this.current == 0) {
        params = {
          id: this.itemInfo.id,
          status: 1
        }
      } else if (this.current == 1) {
        params = {
          id: this.itemInfo.id,
          status: 1,
          endFile: this.imageId.toString()
        }
      }
      this.$u.post(this.apiUrl.taskExplainUsedsTask, JSON.stringify(params)).then(res => {
        if (res.code === 0) {
          uni.navigateBack({
            delta: 1
          })
          uni.$emit('reflashlist', {
            result: 1
          })
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: 'default',
            position: 'bottom'
          })
        }
      })
    },
    scan(val) {
      let self = this
      uni.setStorageSync('scan_type', val)
      uni.$once(val, function (data) {
        // for (const item of self.codeList) {
        if (val === 'devicesCodeScan') {
          self.maintForm.scanDevicesCode = data.result
          if (self.maintForm.devicesCode == self.maintForm.scanDevicesCode) {
            self.flag1 = true
          } else {
            self.flag1 = false
          }
        } else if (val === 'mouldCodeScan') {
          self.maintForm.scanMouldCode = data.result
          if (self.maintForm.mouldCode == self.maintForm.scanMouldCode) {
            self.flag2 = true
          } else {
            self.flag2 = false
          }
        }
        // }
        // if (self.maintForm.id === '') {
        // 	self.$refs.uToast.show({
        // 		title: '模具编号不存在!',
        // 		type: 'default',
        // 		position: 'bottom'
        // 	})
        // }
      })
      this.$u.route({
        url: '/pages/components/scan/index', //'/pages/workspace/equipment/index'
        params: {
          type: val
        }
      })
    },
    backPage() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashlist', {
        result: 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addform {
  width: 100%;
  height: calc(100vh - 122rpx);
  overflow: auto;

  .tabsty {
    border-bottom: 1px solid #dfdfdf;
    margin-bottom: 25rpx;
  }

  .from-item {
    font-size: 23rpx;
    padding: 0px;
    line-height: 63rpx;
    margin-bottom: 25rpx;

    ::v-deep .u-form-item--right__content {
      background-color: #f6f6f6;
    }

    ::v-deep .u-input__input {
      font-size: 23rpx;
      min-height: 63rpx !important;
    }

    ::v-deep .uni-input-input {
      padding-left: 25rpx;
      padding-right: 25rpx;
      width: calc(100% - 50rpx);
    }

    .u-demo-result-line {
      width: 100%;
    }

    ::v-deep .u-icon--right {
      position: absolute;
      right: 38rpx;
    }
  }
  ::v-deep .u-add-tips {
    display: none;
  }
  ::v-deep .u-delete-icon {
    width: 25rpx;
    height: 25rpx;
  }
  .dividers {
    width: 100%;

    :first-child {
      width: 10% !important;
    }

    :last-child {
      width: calc(90% - 95rpx) !important;
    }
  }

  .contelist {
    margin-top: 55rpx;
    margin-bottom: 25rpx;

    .contitem {
      width: 100%;
      font-size: 23rpx;
      min-height: 45rpx !important;
      margin-bottom: 10rpx;
      color: #323232;

      .fons {
        width: calc(100% - 380rpx);
        float: left;
        padding-top: 11rpx;
      }
    }

    .checksty {
      float: right;
      height: 45rpx !important;
    }

    .ressty {
      float: right;
      width: 300rpx;
      background: #f6f6f6 !important;

      ::v-deep .u-input__input {
        min-height: 45rpx !important;
        height: 45rpx !important;
        font-size: 20rpx !important;
      }

      ::v-deep .uni-input-input {
        padding-left: 10rpx;
        padding-right: 10rpx;
        width: calc(100% - 20rpx);
      }
    }

    .heaertb {
      font-size: 20rpx;
      font-weight: normal;
      color: #006fe6;
      background-color: #fafafa;
    }

    .linsty {
      background-color: #fafafa;
    }

    .tbinput {
      height: 35rpx;

      ::v-deep .u-input__input {
        min-height: 35rpx !important;
        height: 35rpx !important;
        font-size: 20rpx !important;
      }
    }
  }

  .substy {
    height: 69rpx;
    font-size: 23rpx;
    border-color: #ffffff;
    background-color: #006fe6;
    border-radius: 6rpx;
    color: #fff;
  }
  .btnDisable {
    background-color: #969696;
  }
}
</style>
