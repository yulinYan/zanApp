<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="移库任务">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="addform u-padding-25">
      <u-form v-if="type === 0" :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="物料代码" class="from-item scansty">
          <u-input v-model="maintForm.newCodeNum" placeholder="扫描物料代码" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" @blur="blurForm()" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan(1)" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="新库位编号" class="from-item scansty">
          <u-input v-model="maintForm.newStoreNum" placeholder="扫描库位编号" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" @blur="blurForm()" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan(2)" />
        </u-form-item>
      </u-form>
      <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">系统记录</u-divider>
      <view class="contelist contitem">
        <u-table border-color="#dfdfdf">
          <u-tr>
            <u-th class="heaertb">物料代码</u-th>
            <u-th class="heaertb">原库位</u-th>
            <u-th class="heaertb">新库位</u-th>
            <u-th :width="'70rpx'" class="heaertb">数量</u-th>
            <u-th class="heaertb">状态</u-th>
          </u-tr>
          <u-tr v-for="(tabs, ind) of contentsList" :key="ind" :class="ind%2 === 0 ? 'fontsty' : 'fontsty linsty'">
            <u-td>
              {{ tabs.productCode }}
            </u-td>
            <u-td>
              {{ tabs.oldLoactionName }}
            </u-td>
            <u-td>
              {{ tabs.newLoactionName }}
            </u-td>
            <u-td :width="'70rpx'">
              {{ tabs.storageCount }}
            </u-td>
            <u-td>
              {{ tabs.status === 0 ? '未完成' : '已完成' }}
            </u-td>
          </u-tr>
        </u-table>
      </view>
      <u-button v-if="type === 0" class="substy" @click="submit">提交</u-button>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import btns from '../../../components/btn'
export default {
  components: {
    btns
  },
  data() {
    return {
      maintForm: {
        codeNum: '',
        newCodeNum: '',
        storeNum: '',
        oldStoreNum: '',
        newStoreNum: ''
      },
      dataShow: false,
      contentsList: [],
      type: '',
      itemInfo: null
    }
  },
  mounted() {
    const moveInfo = uni.getStorageSync('moveInfo')
    if (moveInfo) {
      this.itemInfo = JSON.parse(moveInfo)
      this.type = this.itemInfo.status
      uni.removeStorageSync('moveInfo')
      for (const item of this.itemInfo.logisticsMoveHouseDetailsList) {
        var data = JSON.parse(JSON.stringify(item))
        data.status = this.itemInfo.status
        this.contentsList.push(data)
      }
    }
  },
  methods: {
    showDate() {
      this.dataShow = true
    },
    cancel() {
      this.dataShow = false
    },
    blurForm() {
      for (let i = 0; i < this.contentsList.length; i++) {
        if (this.maintForm.codeNum === this.contentsList[i].storageDetailId + '' && this.maintForm.newStoreNum === this.contentsList[i].newLoactionCode) {
          this.contentsList[i].status = 1
          break
        }
      }
    },
    scan(type) {
      let self = this
      const names = type === 1 ? 'newMoveCodes' : 'newMoveStore'
      uni.setStorageSync('scan_type', names)
      uni.$once(names, function (data) {
        if (type === 1) {
          if (data.result.indexOf('&') > -1) {
            const types = data.result.split('&')
            self.$u.get(self.apiUrl.appUrl + self.apiUrl.scanGetProductDetail, { id: types[0] }).then(res => {
              if (res.data) {
                self.maintForm.codeNum = types[0]
                self.maintForm.newCodeNum = res.data.productCode
              } else {
                this.$refs.uToast.show({
                  title: '物料编码有误!',
                  type: 'default'
                })
              }
            })
          } else {
            this.$refs.uToast.show({
              title: '物料编码有误!',
              type: 'default'
            })
          }
        } else {
          self.maintForm.newStoreNum = data.result
        }
        self.blurForm()
      })
      this.$u.route({
        url: '/pages/components/scan/index', //'/pages/workspace/equipment/index'
        params: {
          type: names
        }
      })
    },
    backPage() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashmoveslist', {
        result: 0
      })
    },
    submit() {
      let flag = false
      for (const item of this.contentsList) {
        if (item.status !== 1) {
          flag = true
          break
        }
      }
      if (flag) {
        this.$refs.uToast.show({
          title: '未完成状态无法移库!',
          type: 'default'
        })
        return
      }
      this.$u
        .get(this.apiUrl.updateMoveHouseStatus, {
          id: this.itemInfo.id
        })
        .then(res => {
          if (res.code === 0) {
            uni.navigateBack({
              delta: 1
            })
            uni.$emit('reflashmoveslist', {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.addform {
  width: 100%;
  height: calc(100vh - 122rpx);
  overflow: auto;
  .iconsty {
    position: absolute;
    z-index: 999;
    right: 50rpx;
    line-height: 63rpx;
    height: 63rpx;
  }
  .scansty {
    ::v-deep .uni-input-input {
      padding-left: 25rpx !important;
      padding-right: 75rpx !important;
      width: calc(100% - 100rpx) !important;
    }
    ::v-deep .u-input__right-icon {
      padding-right: 75rpx !important;
      line-height: 63rpx;
      height: 63rpx;
    }
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
        width: calc(100% - 420rpx);
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
      height: 50rpx;
      line-height: 50rpx;
      background-color: #fafafa;
    }
    .fontsty {
      ::v-deep .u-td {
        font-size: 20rpx !important;
        height: 50rpx;
        line-height: 50rpx;
        position: relative;
      }
      ::v-deep .uni-input-input {
        font-size: 20rpx !important;
      }
      .viewsty {
        width: 50rpx;
        position: absolute;
        top: 10rpx;
        left: 10rpx;
      }
      .viewstyright {
        width: 50rpx;
        position: absolute;
        top: 10rpx;
        right: 10rpx;
      }
      .inputclass {
        font-size: 20rpx !important;
        line-height: 40rpx;
        text-align: left;
        height: 20rpx;
        width: 100rpx;
        position: absolute;
        top: 5px;
        left: 80rpx;
      }
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
}
</style>