<template>
  <view class="addform u-padding-25">
    <view class="headersty">
      <u-navbar :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="投料详情">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="fromsifno">
      <u-form :model="maintForm" ref="maintForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="140" label="设备编号" class="from-item scansty">
          <u-input v-model="maintForm.feedNo" disabled placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="140" label="生产指令" class="from-item">
          <u-input v-model="maintForm.productOrder" disabled placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="140" label="投料时间" class="from-item scansty">
          <u-input v-model="maintForm.createTime" disabled placeholder="暂无执行人" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="140" label="投料人" class="from-item scansty">
          <u-input v-model="maintForm.createUserName" disabled placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" />
        </u-form-item>
      </u-form>
      <u-divider :size="23" border-color="#969696" color="#006fe6" class="dividers">物料详情</u-divider>
      <u-table border-color="#dfdfdf">
        <u-tr class="u-tr">
          <u-th class="u-th">物料代码</u-th>
          <u-th class="u-th">物料名称</u-th>
          <u-th class="u-th">单位</u-th>
          <u-th class="u-th">物料数量</u-th>
        </u-tr>
        <u-tr class="u-tr" v-for="(item, index) in maintForm.produceFeedingDetails" :key="item.id" :class="index % 2 === 0 ? 'fontsty' : 'fontsty linsty'">
          <u-td class="u-td">{{item.code}}</u-td>
          <u-td class="u-td">{{item.name}}</u-td>
          <u-td class="u-td">{{item.unit}}</u-td>
          <u-td class="u-td">{{item.storageCount}}</u-td>
        </u-tr>
      </u-table>
      <u-button class="substy" @click="handleClose">关闭</u-button>
      <u-toast ref="uToast"></u-toast>
    </view>
  </view>
</template>

<script>
import btns from '../../../components/btn'
export default {
  name: 'FormsDetail', //投料详情
  components: {
    btns
  },
  data() {
    return {
      maintForm: {
        feedNo: null,
        productOrder: null,
        createTime: null,
        createUserName: null,
        produceFeedingDetails: []
      }
    }
  },
  mounted() {
    const putInMaterials = uni.getStorageSync('putInMaterials')
    if (putInMaterials) {
      this.maintForm = JSON.parse(putInMaterials)
      uni.removeStorageSync('putInMaterials')
    }
  },
  methods: {
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
		&:nth-child(1){
			width: 30%;
		}
		&:nth-child(2){
			width: 40%;
		}
		&:nth-child(3){
			width: 10%;
		}
		&:nth-child(4){
			width: 20%;
		}
	  }
	  .u-td {
	    font-size: 23rpx !important;
	    line-height: 50rpx;
	    height: 50rpx;
		&:nth-child(1){
			width: 30%;
		}
		&:nth-child(2){
			width: 40%;
		}
		&:nth-child(3){
			width: 10%;
		}
		&:nth-child(4){
			width: 20%;
		}
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
