<template>
  <view class="addbt">
    <view class="addform u-padding-25">
      <scroll-view :scroll-top="0" scroll-y="true" class="contsty">
        <u-form :model="maintForm" ref="uForm">
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="130" label="库位编号" class="from-item scansty">
            <u-input v-model="maintForm.scanDevicesCode" placeholder="扫描库位编号" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 50rpx)" maxlength="50" @blur="finishScans" />
            <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan('onShelfLocationScan')" />
          </u-form-item>
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="130" label="物料代码" class="from-item scansty">
            <u-input v-model="maintForm.scanMouldCode" type="text" placeholder="扫描物料代码" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @blur="finishScan" />
            <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan('onShelfMaterialScan')" />
          </u-form-item>
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="130" label="物料名称" class="from-item scansty">
            <u-input v-model="maintForm.name" type="text" :disabled="true" placeholder="扫描物料名称" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @confirm="addRequest" />
          </u-form-item>
        </u-form>
        <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">货物详情</u-divider>
        <u-table>
          <u-tr class="u-tr">
            <u-th class="u-th">物料代码</u-th>
            <u-th class="u-th">物料名称</u-th>
            <u-th class="u-th" width="60rpx">单位</u-th>
            <u-th class="u-th">数量</u-th>
            <u-th class="u-th" width="60rpx">删除</u-th>
            <!-- <u-th class="u-th">操作</u-th> -->
          </u-tr>
          <u-tr class="u-tr" v-for="(item,index) in tableList" :key="index" :class="index % 2 === 0 ? 'fontsty' : 'fontsty linsty'">
            <u-td class="u-td">{{item.productCode}}</u-td>
            <u-td class="u-td u-line-1">{{item.productName}}</u-td>
            <u-td class="u-td" width="60rpx">{{item.unit}}</u-td>
            <u-td class="u-td">{{item.storageCount}}</u-td>
            <u-td class="u-td" width="60rpx">
              <u-icon name="trash" size="29.5" @click="handleCelete(index)"></u-icon>
            </u-td>
            <!-- <u-td class="u-td"> 打印二维码 </u-td> -->
          </u-tr>
        </u-table>
      </scroll-view>
      <u-button class="substy" @click="submit">上架</u-button>
    </view>
    <view>
      <u-toast ref="uToast"></u-toast>
    </view>
    <u-popup v-model="showCount" mode="center" border-radius="14" closeable class="uPopup">
      <view style="margin-top: 24rpx;padding: 30rpx;">
        <u-form :model="maintForm" ref="uForm">
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" label-width="130" :border-bottom="false" label="请输入数量:" class="from-item scansty">
            <u-input v-model="maintForm.count" type="number"></u-input>
          </u-form-item>
        </u-form>
        <u-button class="substy" @click="sureCount">确定</u-button>
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
        storageLocationId: 1,
        id: 16,
        scanDevicesCode: '', //库位编号
        scanMouldCode: '', //物料代码
        name: '', //物料名称
        materialInfo: {}, //扫码 根据物料编号查询物料信息
        count: '' //物料数量
      },
      obj: {}, //物料信息
      submitParams: [],
      mouldCodeUUID: '',
      tableList: [],
      showCount: false
    }
  },
  mounted() {},
  methods: {
    /**
     *  点击 上架
     * */
    submit() {
      /**
       * 点击提交前要验证库位编号是否已经扫描到
       * */
      if (this.maintForm.scanDevicesCode !== null && this.maintForm.scanDevicesCode.length > 0) {
        var params = {
          storageLocationId: this.maintForm.storageLocationId,
          // storageLocationId: this.maintForm.scanDevicesCode,
          logisticsUpHouseDetails: this.submitParams
        }
        this.$u.post(this.apiUrl.addupHouse, JSON.stringify(params)).then(res => {
          if (res.code === 0) {
            this.maintForm = {
              scanDevicesCode: '', //库位编号
              scanMouldCode: '', //物料代码
              name: '' //物料名称
            }
            this.submitParams = []
            this.tableList = []
            this.$refs.uToast.show({
              title: '上架成功',
              type: 'success',
              position: 'top'
            })
          } else {
            this.$refs.uToast.show({
              title: res.msg,
              type: 'default',
              position: 'bottom'
            })
          }
        })
      } else {
        this.$refs.uToast.show({
          title: '请先扫描库位编号',
          type: 'default',
          position: 'bottom'
        })
      }
    },
    finishScans(result) {
      this.$u.get(this.apiUrl.appUrl + this.apiUrl.findStorageLocationList, { pageNum: 1, pageSize: 999999 }).then(res => {
        let id = 0
        for (const item of res.data.list) {
          if (item.name === result) {
            id = item.id
            break
          }
        }
        if (id === 0) {
          this.$refs.uToast.show({
            title: '库位不存在!',
            type: 'default'
          })
          this.maintForm.scanDevicesCode = ''
        } else {
          this.maintForm.storageLocationId = id
          this.maintForm.scanDevicesCode = result
        }
      })
    },
    /**
     * 点击 扫描
     * */
    scan(val) {
      let self = this
      uni.setStorageSync('scan_type', val)
      uni.$once(val, function (data) {
        if (val === 'onShelfLocationScan') {
          //onShelfLocationScan 是库位扫描 唯一
          self.finishScans(data.result)
        } else if (val === 'onShelfMaterialScan') {
          //onShelfMaterialScan 是物料扫描 唯一
          // self.maintForm.scanMouldCode = data.result
          self.mouldCodeUUID = data.result.split('&')[0]
          // self.maintForm.id = data.result
          self.$u.get(self.apiUrl.appUrl + self.apiUrl.scanGetProductDetail, { id: self.mouldCodeUUID }).then(res => {
            if (res.data) {
              console.log(JSON.stringify(res.data))
              self.obj = res.data
              // self.maintForm.id = this.obj
              self.maintForm.scanMouldCode = self.obj.productCode

              /**
               * 扫描成功后拿到物料编码 去查询物料名称
               * 物料名称赋值给输入框后延迟一秒调用添加接口
               * 添加接口调用成功之后调用表格数据接口
               * */
              let isHaved = self.submitParams.find(item => {
                //定义一个index,index接收我们找到的全部数据
                return item.storageDetailId == self.mouldCodeUUID
                //当我们里面循环的值和我们要找的值相等的时候返回
              })
              if (isHaved) {
                self.$refs.uToast.show({
                  title: '该物料已存在,如要修改请先删除',
                  type: 'default',
                  position: 'bottom'
                })
              } else {
                self.finishScan()
              }
            } else {
              self.$refs.uToast.show({
                title: '物料编码有误!',
                type: 'default'
              })
            }
          })
        }
      })
      this.$u.route({
        url: '/pages/components/scan/index', //'/pages/workspace/equipment/index'
        params: {
          type: val
        }
      })
    },
    /**
     * 完成物料扫描或者完成物料添加  扫描时完成 后面去掉
     * */
    addRequest() {
      this.finishScan()
    },
    /**
     * 填写物料代码或者
     */
    finishScan() {
      if (this.maintForm.scanMouldCode && this.maintForm.scanMouldCode.length > 0) {
        this.$u
          .get(this.apiUrl.getProductDetailByScanUp, {
            id: this.mouldCodeUUID
          })
          .then(res => {
            if (res.code === 0) {
              if (res.data == null) {
                this.$refs.uToast.show({
                  title: '无对应物料',
                  type: 'default',
                  position: 'bottom'
                })
              }
              this.materialInfo = res.data
              this.maintForm.count = res.data.storageCount
              this.showCount = true
            } else {
              this.$refs.uToast.show({
                title: res.msg,
                type: 'default',
                position: 'bottom'
              })
            }
          })
      }
    },
    /**
     * 点击填入数量确定按钮
     * */
    sureCount() {
      if (this.maintForm.count === 0 || this.maintForm.count === null) {
        this.$refs.uToast.show({
          title: '请检查不合格项',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      let isHaved = this.submitParams.find(item => {
        //定义一个isHaved,isHaved接收我们找到的全部数据
        // return item.storageDetailId == this.maintForm.id
        return item.storageDetailId == this.mouldCodeUUID
        //当我们里面循环的值和我们要找的值相等的时候返回
      })
      if (isHaved) {
        this.$refs.uToast.show({
          title: '该物料已存在,如要修改请先删除',
          type: 'default',
          position: 'bottom'
        })
        this.showCount = false
        return
      } else {
        var tableList = {}
        var tableData = {}
        this.maintForm.name = this.materialInfo.productName
        tableList.batch = this.materialInfo.fwBatch
        tableList.productDate = this.materialInfo.productDate
        tableList.storageCount = this.maintForm.count
        tableList.storageDetailId = this.materialInfo.id

        tableData.storageLocationId = this.materialInfo.id
        tableData.productName = this.materialInfo.productName
        tableData.productCode = this.materialInfo.productCode
        tableData.storageCount = this.maintForm.count
        tableData.unit = this.materialInfo.unit
        this.submitParams.push(tableList)
        this.tableList.push(tableData)
        this.showCount = false
      }
    },
    /**
     *删除
     * */
    handleCelete(index) {
      this.tableList.splice(index, 1)
      this.submitParams.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.addform {
  width: 100%;
  height: calc(100vh - 122rpx);
  overflow: auto;
  position: relative;
  .contsty {
    height: calc(100vh - 375rpx);
    overflow: auto;
    .iconsty {
      position: absolute;
      z-index: 999;
      right: 40rpx;
      line-height: 63rpx;
      height: 63rpx;
    }
    .scansty {
      ::v-deep .uni-input-input {
        padding-left: 25rpx !important;
        padding-right: 75rpx !important;
        width: calc(100% - 100rpx) !important;
        line-height: 63rpx !important;
      }
      ::v-deep .u-input__right-icon {
        padding-right: 75rpx !important;
        height: 63rpx;
        line-height: 1 !important;
      }
    }
    .from-item {
      font-size: 23rpx;
      padding: 0px;
      height: 63rpx;
      line-height: 63rpx;
      margin-bottom: 25rpx;

      ::v-deep .u-form-item--right__content {
        background-color: #f6f6f6;
        line-height: 63rpx !important;
      }
      ::v-deep .u-input__input {
        font-size: 23rpx;
        min-height: 63rpx !important;
        line-height: 63rpx;
        vertical-align: center;
      }
      ::v-deep .uni-input-input {
        padding-left: 25rpx;
        padding-right: 25rpx;
        width: calc(100% - 50rpx);
        line-height: 63rpx !important;
      }
      .u-demo-result-line {
        width: 100%;
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
    }
    .linsty {
      background-color: #fafafa;
    }
    .u-table {
      margin-top: 20rpx;

      .u-th {
        font-weight: normal;
        font-size: 23rpx !important;
        line-height: 50rpx;
        height: 50rpx;
        color: #006fe6;
        height: 50rpx;
        line-height: 50rpx;
        background-color: #fafafa;
      }
      .u-td {
        font-size: 23rpx !important;
        line-height: 50rpx;
        height: 50rpx;
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
    margin-top: 40rpx;
  }

  ::v-deep .u-icon__icon {
    margin: 0 auto;
  }
}
.uPopup {
  ::v-deep .u-close--top-right {
    top: 10rpx !important;
    right: 20rpx !important;
  }
  ::v-deep .uni-input-placeholder {
    font-size: 23rpx;
  }
  ::v-deep .uni-input-input {
    border: 0.625rpx solid #ccc;
    border-radius: 4rpx;
    height: 40rpx;
    width: 300rpx;
  }
  .substy {
    height: 69rpx;
    font-size: 23rpx;
    border-color: #ffffff;
    background-color: #006fe6;
    border-radius: 6rpx;
    color: #fff;
    margin-top: 40rpx;
  }
}
</style>