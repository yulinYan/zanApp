<template>
  <view class="addform u-padding-25">
    <view class="headersty">
      <u-navbar :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="出库详情">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="fromsifno">
      <u-form :model="maintForm" ref="maintForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="出库单号" class="from-item scansty">
          <u-input v-model="maintForm.houseNo" disabled placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="出库类型" class="from-item">
          <u-input v-model="maintForm.houseTypeName" disabled placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="执行人" class="from-item scansty">
          <u-input v-model="maintForm.executeUserName" disabled placeholder="暂无执行人" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="执行时间" class="from-item scansty">
          <u-input v-model="maintForm.executeTime" disabled placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" />
        </u-form-item>
      </u-form>
      <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">物料详情</u-divider>
      <view v-for="(item, index) of maintForm.orderInfo" :key="index" class="listy">
        <u-row>
          <u-col class="u-padding-top-26 u-padding-left-26" span="6">
            <view class="itemsty">
              物料代码：
              <view class="valuesty u-line-1">{{ item.productCode }}</view>
            </view>
            <view class="itemsty">
              物料名称：
              <view class="valuesty u-line-1">{{ item.productName }}</view>
            </view>
            <view class="itemsty">
              物料数量：
              <view class="valuesty u-line-1">{{ item.outCount }}</view>
            </view>
          </u-col>
          <u-col class="u-padding-top-26  u-padding-left-26" span="6">
            <view class="itemsty">
              单位：
              <view class="valuesty u-line-1">{{ item.unit }}</view>
            </view>
            <view class="itemsty">
              供应商批次号：
              <view class="valuesty u-line-1">{{ item.batch }}</view>
            </view>
            <view class="itemsty" style="text-align: left;">
              <u-button class="subscript">打印标签</u-button>
            </view>
          </u-col>
        </u-row>
      </view>
      <u-button class="substy" @click="handleClose">关闭</u-button>
      <u-toast ref="uToast"></u-toast>
    </view>
  </view>
</template>

<script>
import btns from '../../../components/btn'
export default {
  name: 'FormsDetail', //生产入库详情
  components: {
    btns
  },
  data() {
    return {
      checkedPass: false,
      current: 0,
      isScan: true,
      maintForm: {
        id: null,
        houseNo: null,
        houseType: null,
        houseTypeName: null,
        executeUser: null,
        executeTime: null,
        orderInfo: []
      },
      warehouseOutTypes: [
        {
          value: 0,
          name: '销售出库'
        },
        {
          value: 1,
          name: '生产出库'
        },
        {
          value: 2,
          name: '委外生产出库'
        },
        {
          value: 3,
          name: '其他出库'
        }
      ]
    }
  },
  mounted() {
    const newOuthousing = uni.getStorageSync('outhousing')
    if (newOuthousing) {
      this.isScan = false
      const outhousing = JSON.parse(newOuthousing)
      this.maintForm.id = outhousing.id
      this.maintForm.houseNo = outhousing.houseNo
      this.maintForm.houseType = outhousing.houseType
      uni.removeStorageSync('outhousing')
      let oFindHouseType = this.warehouseOutTypes.find(item => {
        return item.value === outhousing.houseType * 1
      })
      if (oFindHouseType !== undefined) {
        this.maintForm.houseTypeName = oFindHouseType.name
      }
      if (outhousing.user != null) {
        this.maintForm.executeUserName = outhousing.user.name
      } else {
        this.maintForm.executeUserName = ''
      }

      this.maintForm.executeTime = outhousing.executeTime
      uni.removeStorageSync('outhousing')
      if (outhousing.houseType * 1 !== 2) {
        //非委外生产出库
        this.getMaterialsByOutNo()
      } else {
        let newList = []
        outhousing.logisticsOutHouseDetailList.map(item => {
          newList.push({
            productCode: item.logisticsProduct.code,
            productName: item.logisticsProduct.name,
            outCount: item.storageCount,
            batch: item.logisticsProduct.providerBatch,
            unit: item.logisticsProduct.unit
          })
        })
        this.maintForm.orderInfo = [...newList]
      }
    }
  },
  methods: {
    /**
     * 按照出库单号查询物料信息--获取非委外生产出库
     */
    getMaterialsByOutNo() {
      this.$u
        .get(this.apiUrl.findOutSubpackage, {
          outHouseId: this.maintForm.id
        })
        .then(res => {
          if (res.code === 0) {
            this.maintForm.orderInfo = res.data
            if (res.data.length === 0) {
              this.$refs.uToast.show({
                title: '该出库单下没有数据!',
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
     * 监听 "关闭"按钮click事件
     */
    handleClose() {
      uni.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addform {
  width: 100%;

  .fromsifno {
    width: 100%;
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
	.dividers {
	  width: 100%;
		margin-bottom: 30rpx !important
	  :first-child {
	    width: 10% !important;
	  }
	
	  :last-child {
	    width: calc(90% - 95rpx) !important;
	  }
	}
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
			::v-deep uni-input{
				min-height: 0 !important;
				height: 36rpx !important;
				line-height: 36rpx !important;
			}
			::v-deep .uni-input-input{
				font-size: 18rpx;
				width:200rpx;
				line-height: 36rpx !important;
				float: left;
			}
			::v-deep .u-input__input{
				min-height: 0 !important;
			}
		}
		.valuesty {
			display: inline-block;
			width: 150rpx;
			line-height: 1;
			color: #323232;
		}
		.subscript {
			width: 60%;
			font-size: 20rpx;
			height: 36rpx;
			line-height: 36rpx;
			background-color: #006fe6;
			border-radius: 6rpx;
			color: #fff;
		}
		.u-btn {
			margin: 0;
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
	margin-top: 69rpx;
	margin-bottom: 69rpx;
    height: 69rpx;
    font-size: 23rpx;
    border-color: #ffffff;
    background-color: #006fe6;
    border-radius: 6rpx;
    color: #fff;
  }
}
</style>
