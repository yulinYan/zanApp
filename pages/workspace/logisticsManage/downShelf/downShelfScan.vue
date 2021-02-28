<template>
  <view class="addbt">
    <view class="addform u-padding-25">
      <scroll-view :scroll-top="0" scroll-y="true" class="contsty">
        <u-form :model="maintForm" ref="uForm">
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="130" label="库位编号" class="from-item">
            <u-input v-model="maintForm.scanDevicesCode" placeholder="扫描库位编号" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @blur="finishScans" />
            <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan('downShelfLocationScan')" />
          </u-form-item>
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="130" label="物料代码" class="from-item">
            <u-input v-model="maintForm.scanMouldCode" type="text" placeholder="扫描物料代码" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @blur="finishScan" />
            <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan('downShelfMaterialScan')" />
          </u-form-item>
          <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="130" label="物料名称" class="from-item">
            <u-input v-model="maintForm.name" type="text" :disabled="true" placeholder="扫描物料名称" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @confirm="addRequest" />
          </u-form-item>
        </u-form>
        <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">货物详情</u-divider>
        <u-table>
          <u-tr class="u-tr">
            <u-th class="u-th">物料代码</u-th>
            <u-th class="u-th u-line-1">物料名称</u-th>
            <u-th class="u-th" width="60rpx">单位</u-th>
            <u-th class="u-th">数量</u-th>
            <u-th class="u-th">删除</u-th>
          </u-tr>
          <u-tr class="u-tr" v-for="(item,index) in tableList" :key="index" :class="index % 2 === 0 ? 'fontsty' : 'fontsty linsty'">
            <u-td class="u-td">{{item.code}}</u-td>
            <u-td class="u-td u-line-1">{{item.name}}</u-td>
            <u-td class="u-td" width="60rpx">{{item.unit}}</u-td>
            <u-td class="u-td">{{item.storageCount}}</u-td>
            <u-td class="u-td ">
              <u-icon name="trash" size="29.375" @click="handleCelete(index)"></u-icon>
            </u-td>
          </u-tr>
        </u-table>
      </scroll-view>
      <u-button class="substy" @click="submit">下架</u-button>
    </view>
    <view>
      <u-toast ref="uToast"></u-toast>
    </view>
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
        storageLocationId: 16,
        id: 16,
        scanDevicesCode: '', //库位编号
        scanMouldCode: '', //物料代码
        name: '' //物料名称
      },
      mouldCodeUUID: '',
      submitParams: [],
      tableList: []
    }
  },
  mounted() {},
  methods: {
    /**
     *  点击 下架
     * */
    submit() {
      if (this.maintForm.scanDevicesCode !== null && this.maintForm.scanDevicesCode.length > 0) {
        var params = {
          storageLocationId: this.maintForm.storageLocationId,
          // storageLocationId: this.maintForm.scanDevicesCode,
          logisticsDownHouseDetails: this.submitParams
        }
        this.$u.post(this.apiUrl.addDownHouse, JSON.stringify(params)).then(res => {
          if (res.code === 0) {
            this.maintForm = {
              scanDevicesCode: '', //库位编号
              scanMouldCode: '', //物料代码
              name: '' //物料名称
            }
            this.submitParams = []
            this.tableList = []
            this.$refs.uToast.show({
              title: '下架成功',
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
     * 点击 扫描    扫描出来的数据是个字符串 后期进行数据处理
     * */
    scan(val) {
      let self = this
      uni.setStorageSync('scan_type', val)
      uni.$once(val, function (data) {
        if (val === 'downShelfLocationScan') {
          self.finishScans(data.result)
        } else if (val === 'downShelfMaterialScan') {
          // self.maintForm.scanMouldCode = data.result
          // self.maintForm.scanMouldCode = data.result
          self.maintForm.scanMouldCode = ''
          self.mouldCodeUUID = data.result.split('&')[0]
          // self.maintForm.id = data.result
          self.$u.get(self.apiUrl.appUrl + self.apiUrl.scanGetProductDetail, { id: self.mouldCodeUUID }).then(res => {
            self.obj = res.data
            // self.maintForm.id = this.obj
            if (self.obj.productCode) {
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
              self.maintForm.scanMouldCode = ''
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
     * 完成物料扫描或者完成物料添加
     * 完成物料扫描或者完成物料添加  扫描时完成 后面去掉
     * */
    addRequest() {
      console.log('添加完成')
      this.finishScan()
    },
    finishScan() {
      if (this.maintForm.scanMouldCode === '' || this.maintForm.scanMouldCode === null) {
        this.$refs.uToast.show({
          title: '请检查不合格项',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      let isHaved = this.submitParams.find(item => {
        //定义一个isHaved,isHaved接收我们找到的全部数据
        return item.storageDetailId == this.mouldCodeUUID
        //当我们里面循环的值和我们要找的值相等的时候返回
      })
      if (isHaved) {
        this.$refs.uToast.show({
          title: '该物料已存在,如要修改请先删除',
          type: 'default',
          position: 'bottom'
        })
        return
      } else {
        var tableList = {}
        var tableData = {}
        this.$u
          .get(this.apiUrl.getProductDetailByScan, {
            // id: this.maintForm.id
            id: this.mouldCodeUUID,
            storageLocationId: this.maintForm.storageLocationId
          })
          .then(res => {
            if (res.data) {
              this.maintForm.name = res.data.productName
              tableList.batch = res.data.fwBatch
              tableList.productDate = res.data.productDate
              tableList.storageCount = res.data.storageCount
              tableList.storageDetailId = res.data.id

              tableData.name = res.data.productName
              tableData.code = res.data.productCode
              tableData.storageCount = res.data.storageCount
              tableData.unit = res.data.unit
              this.submitParams.push(tableList)
              this.tableList.push(tableData)
            } else {
              this.maintForm.scanMouldCode = ''
              this.$refs.uToast.show({
                title: '无法库位查询到该物料',
                type: 'default',
                position: 'bottom'
              })
            }
          })
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
  .iconsty {
    position: absolute;
    z-index: 999;
    right: 40rpx;
    line-height: 63rpx;
    height: 63rpx;
  }
  .from-item {
    font-size: 23rpx;
    padding: 0px;
    line-height: 63rpx;
    margin-bottom: 25rpx;

    ::v-deep .u-form-item--right__content {
      background-color: #f6f6f6;
    }
    ::v-deep .u-input__right-icon {
      padding-right: 75rpx !important;
      height: 63rpx;
      line-height: 1 !important;
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
</style>