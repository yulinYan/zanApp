<template>
  <view class="addform u-padding-25">
    <view class="headersty">
      <u-navbar :custom-back="backPage" :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="领料操作">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="fromsifno">
      <u-form :model="maintForm" ref="maintForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="120" label="任务单号" class="from-item">
          <u-input v-model="maintForm.houseNo" :disabled="true" placeholder-style="line-height:63rpx;color:#969696;fontSize:23rpx;paddingLeft:25rpx;paddingRight 25rpx;width:calc(100% - 50rpx);" />
        </u-form-item>
        <view v-for="(item, index) of maintForm.logisticsOutHouseDetailList" :key="index" class="listy">
          <u-row>
            <u-col class="u-padding-top-26 u-padding-left-26" span="6">
              <view class="itemsty">
                物料代码：
                <view class="valuesty u-line-1">{{ item.logisticsProduct!=null?item.logisticsProduct.code:'暂无数据' }}</view>
              </view>
              <view class="itemsty">
                物料数量：
                <view class="valuesty u-line-1">{{ item.applyCount }}</view>
              </view>
              <view class="itemsty">
                单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位：
                <view class="valuesty u-line-1">{{ item.logisticsProduct!=null?item.logisticsProduct.unit:'暂无数据' }}</view>
              </view>
            </u-col>
            <u-col class="u-padding-top-26  u-padding-left-26" span="6">
              <view class="itemsty">
                物&nbsp;&nbsp;料&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;称：
                <view class="valuesty u-line-1">{{ item.logisticsProduct!=null?item.logisticsProduct.name:'暂无数据' }}</view>
              </view>
              <view class="itemsty">
                泛&nbsp;沃&nbsp;批&nbsp;次&nbsp;号：
                <view class="valuesty u-line-1">{{ item.fwBatch }}</view>
              </view>
			  <view class="itemsty">
			    <view class="valuesty u-line-1"></view>
			  </view>
            </u-col>
          </u-row>
        </view>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="120" label="备注" class="from-item">
          <u-input v-model="maintForm.note" placeholder-style="line-height:63rpx;color:#969696;fontSize:23rpx;paddingLeft:25rpx;paddingRight 25rpx;width:calc(100% - 50rpx);" />
        </u-form-item>
      </u-form>
      <u-button class="substy" @click="submit">提交</u-button>
      <u-toast ref="uToast"></u-toast>
    </view>
  </view>
</template>

<script>
import btns from '../../../components/btn'
export default {
  name: 'AddForms', //领料
  components: {
    btns
  },
  data() {
    return {
      maintForm: {
        id: '',
        houseNo: '',
        note: '',
        logisticsOutHouseDetailList: []
      }
    }
  },
  mounted() {
    const receiveMaterialsList = uni.getStorageSync('receiveMaterialsList')
    if (receiveMaterialsList) {
      const warehousingInfo = JSON.parse(receiveMaterialsList)
      this.maintForm.id = warehousingInfo.id
      this.maintForm.houseNo = warehousingInfo.houseNo
	  if( warehousingInfo.status*1 === 0){ // 待出库状态
		  this.getOutHouseById(warehousingInfo.id)
	  }else{
		this.maintForm.logisticsOutHouseDetailList = warehousingInfo.logisticsOutHouseDetailList  
	  }
      uni.removeStorageSync('receiveMaterialsList')
    }
  },
  methods: {
    backPage() {
      uni.navigateBack({
        delta: 1
      })
      uni.$emit('reflashlist', {
        result: 0
      })
    },
	/**
	 * 查询生产出库物料--
	 * 当status=0  （待出库）状态时
	 */
	getOutHouseById(id) {
	  this.$u
	    .get(this.apiUrl.findDetailByOutHouseId, {
	      outHouseId: id
	    })
	    .then(res => {
	      this.maintForm.logisticsOutHouseDetailList = []
	      if (res.code === 0 && res.data.length > 0) {
			  let newList = []
			  res.data.map(item=>{
				 newList.push({
					 logisticsProduct:{
						code:item.productCode,
						unit:item.unit,
						name:item.productName,
						providerBatch:'',
						fwBatch:item.fwBatch,
					 },
					 applyCount:item.applyCount,
				 })
			  })
	        this.maintForm.logisticsOutHouseDetailList = newList
	      }else{
			  this.$refs.uToast.show({
			    title: '没有查询到物料信息，无法领料!',
			    type: 'default',
			    position: 'bottom'
			  })
			this.maintForm.logisticsOutHouseDetailList = []
		  }
	    })
	},
    /**
     * 监听"提交"按钮click事件
     */
    submit() {
      if (this.maintForm.logisticsOutHouseDetailList.length === 0) {
        this.$refs.uToast.show({
          title: '没有物流信息，无法领料!',
          type: 'default',
          position: 'bottom'
        })
        return
      }
      this.$u
        .post(
          this.apiUrl.saveReceiveMaterials,
          JSON.stringify({
            note: this.maintForm.note.toString().trim(),
            outHouseId: this.maintForm.id
          })
        )
        .then(res => {
          if (res.code === 0) {
            this.$refs.uToast.show({
              title: '领料成功!',
              type: 'default',
              position: 'bottom'
            })
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
	/**
	 * 监听 "返回"按钮click事件
	 */
	backPage(){
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
    height: calc(100vh - 120rpx);
    overflow: auto;
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
        width: 150rpx;
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
      padding-left: 0 !important;
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
    ::v-deep .uni-input-placeholder {
      color: #969696 !important;
      font-size: 23rpx !important;
      line-height: 40rpx !important;
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
    margin-top: 69rpx;
    height: 69rpx;
    font-size: 23rpx;
    border-color: #ffffff;
    background-color: #006fe6;
    border-radius: 6rpx;
    color: #fff;
  }
  .substyDisable {
    margin-top: 69rpx;
    height: 69rpx;
    font-size: 23rpx;
    border-color: #ffffff;
    background-color: #ccc;
    border-radius: 6rpx;
    color: #fff;
  }
}
</style>
