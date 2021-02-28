<template>
  <view class="mines">
    <view class="headersty">
      <u-navbar title-color="#323232" back-icon-color="#ffffff" :is-fixed="true" :is-back="false" :background="{background: '#fff'}" title="我的">
      </u-navbar>
    </view>
    <!-- <view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
      <view class="u-m-r-10">
        <u-avatar :src="pic" size="100"></u-avatar>
      </view>
      <view class="u-flex-1">
        <view class="u-font-32 u-p-b-20">用户名</view>
        <view class="u-font-20 u-tips-color">{{ loginUser.name }}</view>
      </view>
    </view> -->
    <view class="u-m-t-20 borsty">
      <u-cell-group>
        <u-cell-item icon="question-circle" title="帮助" @click="jumpHelp()"></u-cell-item>
      </u-cell-group>
    </view>
    <u-button type="error" class="inputsty u-margin-top-65" @click="logout()">退出</u-button>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pic: '/static/uview/template_select.png',
      isFixed: true,
      loginUser: {
        createTime: '',
        email: '',
        factory: '',
        group: '',
        id: '',
        isAdmin: '',
        loginName: '',
        name: '',
        orgId: '',
        password: '',
        phone: '',
        roleIds: '',
        status: '',
        tbLoginname: '',
        tbPassword: '',
        tenantId: ''
      },
      machineForm: {
        account: '',
        pwd: ''
      }
    }
  },
  created() {
    this.loginUser = JSON.parse(uni.getStorageSync('loginUser'))
  },
  methods: {
    logout() {
      this.$u.get(this.apiUrl.padLogout, {}).then(res => {
        if (res.code === 0) {
          uni.removeStorageSync('loginUser')
          uni.removeStorageSync('token')
          uni.removeStorageSync('loginUser')
          this.$u.route({
            url: '/pages/login/index'
          })
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: 'default'
          })
        }
      })
    },
    jumpHelp() {
      this.$u.route({
        url: '/pages/minepage/help'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mines {
  width: 100%;
  height: 100%;
  page {
    background-color: #ededed;
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
  .borsty {
    border-top: 1px solid #969696;
    border-bottom: 1px solid #969696;
  }
  .camera {
    width: 54px;
    height: 44px;

    &:active {
      background-color: #ededed;
    }
  }
  .user-box {
    background-color: #fff;
  }
}
</style>