<script>
export default {
  globalData: {
    username: '泛沃'
  },
  onLaunch() {
    // 扩展API加载完毕，现在可以正常调用扩展API
    plus.screen.lockOrientation('portrait-primary')
    // 监听点击消息事件
    plus.push.addEventListener(
      'click',
      function (msg) {
        console.log(msg)
        // 消息跳转
        // uni.reLaunch({
        //   url: '/pages/workspace/index'
        // })
      },
      false
    )
    // 监听在线消息事件
    plus.push.addEventListener(
      'receive',
      function (msg) {
        console.log(msg)
        if (msg.aps) {
          // Apple APNS message
          outSet('接收到在线APNS消息：')
        } else {
          outSet('接收到在线透传消息：')
        }
        console.log(msg)
      },
      false
    )

    // let main = plus.android.runtimeMainActivity()
    // //为了防止快速点按返回键导致程序退出重写quit方法改为隐藏至后台
    // plus.runtime.quit = function () {
    //   main.moveTaskToBack(false)
    // }
    // //重写toast方法如果内容为 ‘再次返回退出应用’ 就隐藏应用，其他正常toast
    // plus.nativeUI.toast = function (str) {
    //   if (str == '再次返回退出应用') {
    //     plus.runtime.quit()
    //   } else {
    //     uni.showToast({
    //       title: '再次返回退出应用',
    //       icon: 'none'
    //     })
    //   }
    // }
  }
}
</script>

<style lang="scss">
// 头部样式修改
uni-tabbar {
  .uni-tabbar {
    .uni-tabbar__bd {
      height: 100rpx !important;
    }
    .uni-tabbar__label {
      font-size: 18rpx !important;
    }
    .uni-tabbar__icon {
      width: 40rpx !important;
      height: 40rpx !important;
    }
  }
}
@import 'uview-ui/index.scss';
@import 'common/css/styles.scss';
/*每个页面公共css */
</style>