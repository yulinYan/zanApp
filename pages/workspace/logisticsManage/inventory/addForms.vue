<template>
  <view class="addbt">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="盘库">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="addform u-padding-25">
      <u-form :model="maintForm" ref="uForm">
        <u-form-item v-if="type === 0" :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="库位编号" class="from-item scansty">
          <u-input v-model="maintForm.codeNum" placeholder="扫描库位编号" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" @blur="getResult()" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan()" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="备注" class="from-item scansty">
          <u-input v-model="maintForm.remark" :disabled="type === 1" placeholder="备注" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="350" />
        </u-form-item>
      </u-form>
      <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">系统记录</u-divider>
      <view class="u-margin-top-20">
        <u-row>
          <u-col span="6" class="u-flex u-font-23">
            已盘点库位: <view class="pdsty">{{ alreadyNum }}</view>
          </u-col>
          <u-col span="6" class="u-flex u-font-23" @click="openFind()">
            未盘点库位: <view class="pdsty">{{ allNum - alreadyNum }}</view>
          </u-col>
        </u-row>
      </view>
      <view class="contelist contitem">
        <u-table border-color="#dfdfdf">
          <u-tr>
            <u-th class="heaertb">库位</u-th>
            <u-th class="heaertb">物料代码</u-th>
            <u-th class="heaertb">物料名称</u-th>
            <u-th :width="'200rpx'" class="heaertb">系统/实际数量</u-th>
            <u-th :width="'120rpx'" class="heaertb">操作</u-th>
          </u-tr>
          <u-tr v-for="(tabs, ind) of contentsList" :key="ind" :class="ind%2 === 0 ? 'fontsty' : 'fontsty linsty'">
            <u-td class="u-line-1">
              {{ tabs.storageName }}
            </u-td>
            <u-td class="u-line-1">
              {{ tabs.productCode }}
            </u-td>
            <u-td class="u-line-1">
              {{ tabs.productName }}
            </u-td>
            <u-td :width="'200rpx'">
              <view style="display: inline-block;height: 25rpx">&nbsp;</view>
              <view v-if="type === 1 || tabs.checked" class="viewsty1">
                {{ tabs.storageCount }}/{{ tabs.storageCount }}
              </view>
              <view v-if="type === 0&&!tabs.checked" class="viewsty">
                {{ tabs.storageCount }}/
              </view>
              <view v-if="type === 0" class="inputclass">
                <u-input v-if="!tabs.checked && (setIndex !== ind || !dataShow)" :height="20" v-model="tabs.checkCount" type="text" :border="true" :disabled="true" placeholder-style="font-size: 18rpx; line-height: 40rpx" placeholder="数量" @click="openKeyNum(ind)" />
                <u-input v-if="!tabs.checked && setIndex === ind && dataShow" :height="20" v-model="setNum" type="text" :border="true" :disabled="true" />
              </view>
            </u-td>
            <u-td :width="'120rpx'">
              <u-switch v-if="type === 0" v-model="tabs.checked" :size="20" active-color="#19be6b" inactive-color="red" @change="getTabs()" />
              <view v-if="type === 0" class="viewstyright">
                {{ tabs.checked ? '正常' : '异常' }}
              </view>
              <view v-if="type === 1" style="display: inline-block;height: 25rpx">&nbsp;</view>
              <view v-if="type === 1" class="viewstyright1">
                {{ tabs.checked ? '正常' : '异常' }}
              </view>
            </u-td>
          </u-tr>
        </u-table>
      </view>
      <u-row v-if="type === 0">
        <u-col span="6">
          <u-button class="substy" style="background-color: #19be6b;" @click="submit(0)">保存</u-button>
        </u-col>
        <u-col span="6">
          <u-button class="substy" @click="submit(1)">提交</u-button>
        </u-col>
      </u-row>
    </view>
    <u-keyboard ref="uKeyboard" :dot-enabled="false" mode="number" v-model="dataShow" @change="valChange" @backspace="backspace" @confirm="confirm" />
    <u-toast ref="uToast"></u-toast>
    <u-popup v-model="showUnList" :closeable="true" :close-icon-pos="'top-right'" mode="bottom" length="50%">
      <view class="contelist contitem u-margin-top-80 u-margin-left-20 u-margin-right-20">
        <u-table border-color="#dfdfdf">
          <u-tr>
            <u-th class="heaertb">仓库</u-th>
            <u-th class="heaertb">库位</u-th>
          </u-tr>
          <u-tr v-for="(tabs, ind) of unList" :key="ind" :class="ind%2 === 0 ? 'fontsty' : 'fontsty linsty'">
            <u-td>
              {{ tabs.houseName }}
            </u-td>
            <u-td>
              {{ tabs.storageCode }}
            </u-td>
          </u-tr>
        </u-table>
      </view>
    </u-popup>
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
        remark: ''
      },
      showUnList: false,
      setNum: '',
      unList: [],
      setIndex: -1,
      dataShow: false,
      contentsList: [],
      addList: [],
      allNum: 0,
      alreadyNum: 0,
      checkmsNum: 0,
      type: 0,
      itemInfo: null
    }
  },
  mounted() {
    const inventoryInfo = uni.getStorageSync('inventoryInfo')
    if (inventoryInfo) {
      this.itemInfo = JSON.parse(inventoryInfo)
      uni.removeStorageSync('inventoryInfo')
      this.type = this.itemInfo.status
      this.allNum = this.itemInfo.checkHouseIds.split(',').length
      this.getInfoList()
      if (this.type === 0) {
        this.contentsList = []
        this.maintForm.remark = this.itemInfo.note
        this.$u
          .get(this.apiUrl.findDetailCheckHouseList, {
            checkHouseId: this.itemInfo.id
          })
          .then(res => {
            if (res.code === 0) {
              let obj = {}
              for (const item of res.data) {
                obj[item.storageId] = ''
                var data = JSON.parse(JSON.stringify(item))
                data.checked = data.checkResult === 0
                data.checkCount = data.checkCount ? data.checkCount : 0
                this.contentsList.push(data)
              }
              this.alreadyNum = Object.keys(obj).length
            }
          })
      } else {
        this.maintForm.remark = this.itemInfo.note
        this.alreadyNum = this.itemInfo.checkHouseIds.split(',').length
      }
    }
  },
  methods: {
    getTabs() {
      // this.setHistory()
    },
    openKeyNum(index) {
      this.setIndex = index
      this.setNum = this.contentsList[index].checkCount + ''
      this.dataShow = true
    },
    async getInfoList() {
      this.contentsList = []
      this.addList = []
      const ids = this.itemInfo.checkHouseIds.split(',')
      for (const id of ids) {
        await this.$u
          .get(this.apiUrl.findStoragePorductList, {
            locationId: id
          })
          .then(res => {
            if (res.code === 0) {
              if (res.data.length === 0) {
                this.allNum = this.allNum - 1
                if (this.type === 1) {
                  this.alreadyNum = this.alreadyNum - 1
                }
              }
              for (const item of res.data) {
                var data = JSON.parse(JSON.stringify(item))
                data.checked = true
                data.checkCount = data.checkCount ? data.checkCount : 0
                // if (parseInt(data.storageCount + '') > 0) {
                // }
                this.checkmsNum = this.checkmsNum + 1
                this.addList.push(data)
                if (this.type === 1) {
                  this.contentsList.push(data)
                }
              }
            }
          })
      }
      console.log(this.contentsList)
    },
    // 按键被点击(点击退格键不会触发此事件)
    valChange(val) {
      // 将每次按键的值拼接到value变量中，注意+=写法
      let value = this.setNum + ''
      value += val
      this.setNum = parseInt(value)
    },
    // 退格键被点击
    backspace() {
      // 删除value的最后一个字符
      let value = this.setNum + ''
      if (value.length === 1) {
        value = '0'
      } else {
        if (value.length) value = value.substr(0, value.length - 1)
      }
      this.setNum = parseInt(value)
    },
    confirm() {
      this.contentsList[this.setIndex].checkCount = this.setNum
      // this.setHistory()
    },
    openFind() {
      this.showUnList = true
      this.unList = []
      for (const item of this.addList) {
        let flag = true
        for (const items of this.contentsList) {
          if (item.storageCode === items.storageCode && items.productCode === item.productCode) {
            flag = false
            break
          }
        }
        if (flag) {
          this.unList.push(item)
        }
      }
      // uni.setStorageSync('jsonInventoryList', JSON.stringify(this.contentsList))
    },
    getResult() {
      let flags = false
      for (const item of this.addList) {
        if (item.storageCode === this.maintForm.codeNum) {
          let flag = true
          for (const items of this.contentsList) {
            if (items.storageCode === this.maintForm.codeNum && items.productCode === item.productCode) {
              flag = false
              this.$refs.uToast.show({
                title: '扫码库位已在列表中!',
                type: 'default',
                position: 'bottom'
              })
              break
            }
          }
          if (flag) {
            this.contentsList.push(item)
            flags = true
          }
        }
      }
      if (flags) {
        this.alreadyNum = this.alreadyNum + 1
      }
      // this.setHistory()
    },
    scan() {
      let self = this
      const names = 'inventoryNum'
      uni.setStorageSync('scan_type', names)
      uni.$once(names, function (data) {
        self.maintForm.codeNum = data.result
        self.getResult()
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
      uni.$emit('reflashInventorlist', {
        result: 0
      })
    },
    submit(type) {
      let lis = []
      let flag = false
      let kwObj = {}
      for (const item of this.contentsList) {
        kwObj[item.storageCode] = ''
        var data = {
          checkCount: item.checked ? item.storageCount : item.checkCount,
          checkResult: item.checked ? 0 : 1,
          productId: item.productId,
          storageCount: item.storageCount,
          storageId: item.storageId
        }
        lis.push(data)
      }
      if (type === 1) {
        if (this.checkmsNum - this.contentsList.length > 0) {
          this.$refs.uToast.show({
            title: '库位尚未盘点完成!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
      }
      this.$u
        .post(
          this.apiUrl.checkHouseUpdate,
          JSON.stringify({
            id: this.itemInfo.id,
            note: this.maintForm.remark,
            checkHouseDetailList: lis,
            status: type === 1 ? 1 : undefined
          })
        )
        .then(res => {
          if (res.code === 0) {
            uni.navigateBack({
              delta: 1
            })
            uni.$emit('reflashInventorlist', {
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
      position: relative;
      height: 50rpx;
      line-height: 50rpx;
    }
    ::v-deep .uni-input-input {
      font-size: 20rpx !important;
    }
    .viewsty {
      width: 50rpx;
      position: absolute;
      top: 0;
      left: 10rpx;
    }
    .viewsty1 {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .viewstyright {
      width: 50rpx;
      position: absolute;
      top: 0rpx;
      right: 10rpx;
    }
    .viewstyright1 {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0rpx;
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
      ::v-deep .u-input {
        height: 40rpx !important;
      }
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
.addform {
  width: 100%;
  height: calc(100vh - 122rpx);
  overflow: auto;
  .pdsty {
    padding-left: 5rpx;
    color: #006fe6;
  }
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