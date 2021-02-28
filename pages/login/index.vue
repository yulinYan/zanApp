<template>
  <view class="loginsty u-flex u-col-center u-row-center">
    <view class="contensty">
      <view class="u-flex u-row-center">
        <u-image width="275rpx" height="54rpx" :src="lightImg"></u-image>
      </view>
      <view class="u-flex u-row-center">
        <view class="u-font-28 fontsty u-margin-top-45">MES平台</view>
      </view>
      <u-form :model="machineForm" ref="uForm">
        <u-form-item :border-bottom="false" label="">
          <u-icon name="account" size="28" color="#969696" class="u-abso iconsty" />
          <u-input v-model="machineForm.account" :type="'text'" placeholder-style="font-size: 23rpx; text-align: left;line-height: 77rpx" :border="true" :border-color="'#fff'" :input-align="'left'" :height="77" :auto-height="false" :maxlength="50" :placeholder="'请输入用户账号'" class="inpbg inputsty" />
        </u-form-item>
        <u-form-item :border-bottom="false" label="" class="u-margin-top-65">
          <u-icon name="lock" size="28" color="#969696" class="u-abso iconstys" />
          <u-input v-model="machineForm.pwd" :type="'password'" placeholder-style="font-size: 23rpx; text-align: left;line-height: 77rpx" :border="true" :border-color="'#fff'" :input-align="'left'" :height="77" :auto-height="false" :maxlength="50" :placeholder="'请输入登录密码'" class="inpbg inputsty" @confirm="submitForm()" />
        </u-form-item>
      </u-form>
      <u-button class="inputsty btns u-margin-top-65" @click="submitForm">立即登录</u-button>
      <u-toast ref="uToast" />
    </view>
  </view>
</template>
<script>
import md5Libs from 'uview-ui/libs/function/md5'
export default {
  data() {
    return {
      lightImg: '/static/logo-noText.png',
      machineForm: {
        account: '',
        pwd: ''
      }
    }
  },
  created() {
    const token = uni.getStorageSync('token')
    if (token) {
      this.$u.route({
        type: 'reLaunch',
        url: '/pages/workspace/index'
      })
    }
  },
  methods: {
    // submitForms() {
    //   plus.push.createMessage('uniapp消息一条', 'fsldkfjs', {
    // 	  title: '您有一条新消息'
    //   })
    // },
    submitForm() {
      if (this.machineForm.account.length === 0) {
        this.$refs.uToast.show({
          title: '请输入用户账号!',
          type: 'default'
        })
        return
      }
      if (this.machineForm.pwd.length === 0) {
        this.$refs.uToast.show({
          title: '请输入密码!',
          type: 'default'
        })
        return
      }
      // this.$u.route({
      //   type: 'reLaunch',
      //   url: '/pages/workspace/index'
      // })
      this.$u.post(this.apiUrl.login, { loginName: this.machineForm.account, password: md5Libs.md5(this.machineForm.pwd) }).then(res => {
        if (res.code === 0) {
          uni.setStorageSync('loginInfo', JSON.stringify(this.machineForm))
          uni.setStorageSync('token', res.data.token)
          uni.setStorageSync('operationAuthority', JSON.stringify(res.data.permissions.codes))
          uni.setStorageSync('loginUser', JSON.stringify(res.data.loginUser))
          this.$u.route({
            type: 'reLaunch',
            url: '/pages/workspace/index'
          })
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: 'default'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.loginsty {
  width: 100vw;
  height: 100vh;
  text-align: center;
  background-image: url('/static/beijing-denglu.png');
  background-position: top;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  ::v-deep .u-hairline-border[data-v-6e15e680]:after {
    border: 0rpx;
  }
  ::v-deep .u-form-item {
    padding: 0rpx;
  }
}
.inputsty {
  border-radius: 10rpx;
  margin-right: 90rpx !important;
  margin-left: 90rpx !important;
  padding: 0rpx 50rpx !important;
  ::v-deep .uni-input-input {
    font-size: 22rpx;
  }
}
.inpbg {
  background: #fff;
}
.btns {
  font-size: 22rpx;
  height: 77rpx;
  line-height: 77rpx;
  color: #fff;
  border: 0rpx;
  background-image: linear-gradient(270deg, #19eae3 0%, #177bf0 100%), linear-gradient(#006fe6, #006fe6);
  background-color: transparent;
}
.fontsty {
  font-weight: bold;
  margin-bottom: 110rpx !important;
  color: #fff;
}
.contensty {
  width: 100%;
}
.iconsty {
  margin-left: 105rpx !important;
  z-index: 99;
  height: 77rpx;
  line-height: 77rpx;
  right: none !important;
}
.iconstys {
  margin-left: 105rpx !important;
  z-index: 99;
  height: 77rpx;
  line-height: 77rpx;
}
</style>