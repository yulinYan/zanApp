<template>
  <view class="addform u-padding-25">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="外部入库">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view>
      <u-steps class="stepsStyle" :list="numList" :current="currentStep"></u-steps>
    </view>
    <view v-if="currentStep === 0" class="fromsifno">
      <u-form :model="maintForm" ref="maintForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="100" label="库位编号" class="from-item">
          <u-input v-model="maintForm.location" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="100" label="订单号" class="from-item scansty">
          <u-input v-model="maintForm.orderNo" placeholder="订单号" disabled placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" />
        </u-form-item>
      </u-form>
      <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">订单详情</u-divider>
      <view v-for="(item, index) of maintForm.orderInfo" :key="index" class="listy">
        <u-row>
          <u-col class="u-padding-top-26 u-padding-left-26" span="6">
            <view class="itemsty">
              物料代码：
              <view class="valuesty u-line-1">{{ item.logisticsProduct !== null?item.logisticsProduct.code:'' }}</view>
            </view>
            <view class="itemsty">
              物料数量：
              <view class="valuesty u-line-1">{{ item.materialCount }}</view>
            </view>
            <view class="itemsty">
              合格数量：
              <view class="valuesty u-line-1">
                <u-input v-model="item.storageCount" placeholder="输入合格数量" placeholderStyle="font-size:18rpx;" type="number" border :clearable="false" style="width: 90%;" />
              </view>
            </view>
          </u-col>
          <u-col class="u-padding-top-26  u-padding-left-26" span="6">
            <view class="itemsty">
              物料名称：
              <view class="valuesty u-line-1">{{ item.logisticsProduct !== null?item.logisticsProduct.name:'' }}</view>
            </view>
            <view class="itemsty">
              泛沃批次号：
              <view class="valuesty u-line-1">{{ item.fwBatch }}</view>
            </view>
            <view class="itemsty">
              来料批次号：
              <view class="valuesty u-line-1">
                <u-input v-model="item.providerBatch" placeholder="点击添加批次号" placeholderStyle="font-size:18rpx;" type="text" disabled :clearable="false" border style="width: 100%;" @click="handleClickBatch(item,index)" />
              </view>
            </view>
          </u-col>
        </u-row>
      </view>
      <u-button class="substy" @click="submit">提交</u-button>
    </view>
    <view v-if="currentStep === 1" class="fromsifno">
      <u-table border-color="#dfdfdf">
        <u-tr class="u-tr">
          <u-th class="u-th">物料代码</u-th>
          <u-th class="u-th">物料名称</u-th>
          <u-th class="u-th">单位</u-th>
          <u-th class="u-th">操作</u-th>
        </u-tr>
        <u-tr class="u-tr" v-for="(item,index) in maintForm.orderInfo" :key="index" :class="index % 2 === 0 ? 'fontsty' : 'fontsty linsty'">
          <u-td class="u-td">{{item.logisticsProduct.code}}</u-td>
          <u-td class="u-td">{{item.logisticsProduct.name}}</u-td>
          <u-td class="u-td">{{item.logisticsProduct.unit}}</u-td>
          <u-td class="u-td">
            <u-button type="primary" size="mini" ripple>打印标签</u-button>
          </u-td>
        </u-tr>
      </u-table>
      <u-button class="substy" @click="handleComplete">完成</u-button>
    </view>
    <u-toast ref="uToast"></u-toast>
    <!-- 编辑来料批次号弹框-->
    <u-modal v-if="batchModalShow" v-model="batchModalShow" class="batchModal" :show-confirm-button="false" :show-title="false">
      <view class="slot-content">
        <u-form :model="batchForm" ref="batchForm" label-width="145rpx" label-align="right">
          <u-form-item label="来料批次号:">
            <view style="width: 280rpx;">
              <u-input v-model="batchForm.providerBatch" size="mini" border="true" placeholder="请输入来料批次号" :clearable="false" />
            </view>
            <u-button class="addBtn" size="mini" @click="handleAddBatch">添加</u-button>
          </u-form-item>
          <u-form-item label="批次号合集:" class="formItemRight" style="align-items: baseline;">
            <u-tag v-for="item in providerBatchList" :key="item" :text="item" size="mini" closeable @close="handleDeleteBatch(item)" />
          </u-form-item>
        </u-form>
        <div class="footer">
          <u-button class="footerBtn" @click="handleCancel" size="mini">取消</u-button>
          <u-button class="footerBtn" type="primary" size="mini" @click="handleConfirm">确定</u-button>
        </div>
      </view>
    </u-modal>
	<u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import btns from '../../../components/btn'
export default {
  name: 'AddForms', //外部入库
  components: {
    btns
  },
  data() {
    return {
      checkedPass: false,
      current: 0,
      currentStep: 0,
      isScan: true,
      batchModalShow: false, // 是否显示编辑来料批次号弹框
      numList: [
        {
          name: '绑定来料批次号'
        },
        {
          name: '打印条码'
        }
      ],
      batchForm: {
        providerBatch: ''
      },
      editListIndex: null, // 当前编辑的物料数据下标
      providerBatchList: [], // 输入的来料批次号合集
      maintForm: {
		  id:'',
        orderNo: '',
        location: '暂存区',
        orderInfo: []
      }
    }
  },
  mounted() {
    const warehousingOut = uni.getStorageSync('warehousingOut')
    if (warehousingOut) {
      this.isScan = false
      const warehousingInfo = JSON.parse(warehousingOut)
      this.maintForm.id = warehousingInfo.id
	  this.maintForm.orderNo = warehousingInfo.orderNo
      this.maintForm.location = '暂存区'
      uni.removeStorageSync('warehousingOut')
      this.getMaterialsByOrderNo()
    }
  },
  methods: {
    /**
     * 按照订单号查询物料信息
     */
    getMaterialsByOrderNo() {
      this.$u
        .get(this.apiUrl.findListLogisticsByOrderNo, {
          storeHouseId: this.maintForm.id
        })
        .then(res => {
          if (res.code === 0) {
            this.maintForm.orderInfo = res.data
            if (res.data.length === 0) {
              this.$refs.uToast.show({
                title: '没有订单详情!',
                type: 'default',
                position: 'bottom'
              })
            }
          } else {
            this.$refs.uToast.show({
              title: res.msg,
              type: 'default',
              position: 'bottom'
            })
          }
        })
    },
    /**
     * 监听"提交"按钮click事件
     */
    submit() {
      const orderNo = this.maintForm.orderNo.trim().toString()
      if (orderNo.length === 0 && this.maintForm.orderInfo.length === 0) {
        this.$refs.uToast.show({
          title: '订单号无效!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      const newList = []
      const errorList = []
      this.maintForm.orderInfo.map(item => {
        newList.push({
          id: item.id,
          storageLocationId: 0,// 暂存区
          productId: item.productId,
          orderDetailId: item.orderDetailId,
          storeHouseId: item.storeHouseId,
          storageCount: item.storageCount, // 合格数量
          providerBatch: item.providerBatch // 来料批次号
        })
        if (item.storageCount == '' || item.storageCount * 1 <= 0 || item.storageCount * 1 > item.materialCount * 1 || item.providerBatch === null || item.providerBatch.length === 0) {
          errorList.push(item.logisticsProduct.name)
        }
      })
      if (errorList.length > 0) {
        this.$refs.uToast.show({
          title: '物料:[ ' + errorList.toString() + ' ]合格数量或来料批次号异常!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      this.$u.post(this.apiUrl.setBatchBound, JSON.stringify(newList)).then(res => {
        if (res.code === 0) {
          this.$refs.uToast.show({
            title: '绑定批次号成功!',
            type: 'default',
            position: 'bottom'
          })
          this.currentStep = 1
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: 'default',
            position: 'bottom'
          })
        }
      })
    },
    backPage() {
      uni.navigateBack({
        delta: 1
      })
    },
    /**
     * 监听"完成"按钮
     */
    handleComplete() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashlist', {
        result: 1
      })
    },
    /**
     * 列表--来料批次号input框click事件
     * @param {Object} item  物料对象
     * @param {Number} index 选中的数据的下标
     */
    handleClickBatch(item, index) {
      this.editListIndex = index
      let newValue = item.providerBatch
      if (newValue === null || newValue.length === 0) {
        this.providerBatchList = []
      } else {
        this.providerBatchList = newValue.split(',')
      }
      this.batchModalShow = true
    },
    /**
     * 监听"来料批次号"tag标签close事件
     * @param {String} val 选中的批次号
     */
    handleDeleteBatch(val) {
      let nFindindex = this.providerBatchList.findIndex(item => {
        return item === val
      })
      if (nFindindex != -1) {
        this.providerBatchList.splice(nFindindex, 1)
      }
    },
    /**
     * 监听"来料批次号"添加标签click事件
     * @param {String} val 选中的批次号
     */
    handleAddBatch() {
      let newBatch = this.batchForm.providerBatch.toString().trim()
      if (newBatch.length === 0) {
        this.$refs.uToast.show({
          title: '请输入批次号!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      let nFindindex = this.providerBatchList.findIndex(item => {
        return item === newBatch
      })
      if (nFindindex != -1) {
        this.$refs.uToast.show({
          title: '输入的批次号已存在!',
          type: 'default',
          position: 'bottom'
        })
      } else {
        this.providerBatchList.push(newBatch)
        this.batchForm.providerBatch = ''
      }
    },
    /**
     * 监听 编辑来料批次号弹框 "取消"按钮click事件
     */
    handleCancel() {
      this.batchForm.providerBatch = ''
      this.batchModalShow = false
    },
    /**
     * 监听 编辑来料批次号弹框 "确定"按钮click事件
     */
    handleConfirm() {
      if (this.providerBatchList.length === 0) {
        this.$refs.uToast.show({
          title: '批次号不能为空!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      this.maintForm.orderInfo[this.editListIndex].providerBatch = this.providerBatchList.toString()
      this.batchForm.providerBatch = ''
      this.batchModalShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.addform {
  width: 100%;
  .stepsStyle {
    font-size: 20rpx;
    margin-bottom: 30rpx;
  }
  .fromsifno {
    width: 100%;
    // height: calc(100vh - 187.8rpx);
    .listy {
      background-color: #f5f6fa;
      border-radius: 5rpx;
      overflow: hidden;
      position: relative;
      margin-bottom: 25rpx;

      .itemsty {
        font-size: 23rpx;
        color: #969696;
        margin-bottom: 30rpx;
        display: flex;
        justify-content: left;
        align-items: center;
        ::v-deep uni-input {
          min-height: 0 !important;
          height: 36rpx !important;
          line-height: 36rpx !important;
        }
        ::v-deep .uni-input-input {
          font-size: 18rpx;
          width: 200rpx;
          line-height: 36rpx !important;
          float: left;
        }
        ::v-deep .u-input__input {
          min-height: 0 !important;
        }
        ::v-deep .uni-input-placeholder {
          color: #969696 !important;
          font-size: 18rpx !important;
          line-height: 36rpx !important;
        }
      }

      .valuesty {
        display: inline-block;
        width: 170rpx;
        margin-left: 2rpx;
        line-height: 1;
        color: #323232;
      }

      .subscript {
        width: 60%;
        font-size: 20rpx;
        height: 36rpx;
        line-height: 36rpx;
        border-color: #ffffff;
        border-radius: 6rpx;
        color: #fff;
      }

      .u-btn {
        margin: 0;
      }
    }
    .substy {
      margin-top: 69rpx;
      margin-bottom: 69rpx;
      height: 69rpx;
      font-size: 23rpx;
      border-color: #ffffff;
      background-color: #006fe6;
      border-radius: 6rpx;
      color: #fff;
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
    .dividers {
      width: 100%;
      margin-bottom: 30rpx !important;

      :first-child {
        width: 10% !important;
      }

      :last-child {
        width: calc(90% - 95rpx) !important;
      }
    }
  }

  ::v-deep .uni-input-placeholder {
    line-height: 63rpx;
  }

  .tabsty {
    border-bottom: 1px solid #dfdfdf;
    margin-bottom: 25rpx;
  }

  .getRadio {
    ::v-deep .u-radio__label {
      margin-right: 10rpx;
    }
  }

  .checksty {
    height: 45vh;
    overflow: auto;
    text-align: center;
    padding-top: 25rpx;
    padding-bottom: 25rpx;
    width: 70vw;
    margin-left: 15vw;
    font-size: 20rpx;
  }

  .btnclose {
    color: #323232;
    font-size: 28rpx;
    padding-top: 10rpx;
    padding-left: 10rpx;
  }

  .succclose {
    color: #006fe6;
    font-size: 28rpx;
    padding-top: 10rpx;
    padding-right: 10rpx;
    text-align: right;
  }

  .titlesty {
    font-size: 22rpx;
    color: #006fe6;
    text-align: center;
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

  .from-uploaditem {
    font-size: 23rpx;
    padding: 0px;
    line-height: 63rpx;
    margin-bottom: 25rpx;

    .namesty {
      margin-right: 15rpx;
    }

    ::v-deep .u-delete-icon {
      width: 30rpx;
      height: 30rpx;
    }

    ::v-deep .u-add-wrap {
      font-size: 20rpx;
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

    ::v-deep .u-input__right-icon {
      padding-right: 25rpx;
    }

    .u-demo-result-line {
      width: 100%;
    }

    .iconsty {
      position: absolute;
      z-index: 999;
      right: 50rpx;
      line-height: 63rpx;
      height: 63rpx;
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
  .batchModal {
    .u-form {
      padding: 20rpx 20rpx;
      ::v-deep uni-input {
        width: 200rpx !important;
        min-height: 0 !important;
        height: 36rpx !important;
        line-height: 36rpx !important;
      }
      ::v-deep .uni-input-input {
        font-size: 18rpx;

        line-height: 36rpx !important;
      }
      ::v-deep .u-input__input {
        min-height: 0 !important;
      }
      ::v-deep .uni-input-placeholder {
        color: #969696 !important;
        font-size: 18rpx !important;
        line-height: 36rpx !important;
      }
      .u-form-item {
        font-size: 23rpx;
        color: #969696;
        padding: 10px 0;
        .u-tag {
          margin: 0 10px 10px 0;
        }
        .addBtn {
          height: 36rpx;
          line-height: 36rpx !important;
        }
      }
      .u-border-bottom:after {
        border: none;
      }
    }
    .footer {
      display: flex;
      padding-bottom: 50rpx;
      .footerBtn {
        width: 40% !important;
        height: 48rpx;
        line-height: 48rpx;
      }
    }
    ::v-deep .u-form-item--right__content__slot {
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: flex-start !important;
    }
  }
}
</style>
