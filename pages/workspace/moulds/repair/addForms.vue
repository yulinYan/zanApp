<template>
  <view class="addform u-padding-25">
    <view class="tabsty">
      <u-steps v-if="current!==4" :list="tablist" :current="current" un-active-color="#969696" active-color="#006fe6" />
      <!-- <u-tabs v-if="current!==4" :bold="false" :list="tablist" :current="current" :is-scroll="false" :bar-height="2" :height="60" :font-size="20" inactive-color="#969696" active-color="#006fe6" bg-color="#fff" @change="changeTab"></u-tabs> -->
    </view>
    <view class="fromsifno">
      <u-form v-if="current === 0" :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具编号" class="from-item scansty">
          <u-input v-model="maintForm.matchNumber" placeholder="扫描模具编号" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="30" @blur="checkNumber()" />
          <u-icon name="scan" size="28" color="#006fe6" class="u-abso iconsty" @click="scan()" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具名称" class="from-item">
          <u-input v-model="maintForm.typeName" :disabled="true" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" placeholder="模具名称" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="优先级" class="from-item">
          <u-input v-model="maintForm.priorityName" :select-open="priorityshow" type="select" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" placeholder="请选择优先级" @click="priorityshow = true" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题" class="from-item">
          <u-input v-model="maintForm.questionName" :placeholder="'问题'" type="select" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @click="openQuestion()" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题描述" class="from-item">
          <u-input v-model="maintForm.questiondesc" placeholder="问题描述" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修前照片" class="from-uploaditem">
          <u-upload ref="uUpload" :action="uploadUrl" :form-data="{'isAdd':true}" :max-size="200*1024*1024" max-count="3" width="110" height="110" @on-remove="onRemove" @on-success="successUpload"></u-upload>
        </u-form-item>
      </u-form>
      <u-form v-if="current === 1" :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具编号" class="from-item scansty">
          <view class="u-padding-left-25">{{ maintForm.matchNumber }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具名称" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.typeName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="优先级" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.priorityName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.questionName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题描述" class="from-item">
          <u-input v-model="maintForm.questiondesc" :disabled="true" placeholder="问题描述" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修前照片" class="from-uploaditem">
          <u-image v-for="(item, index) of maintForm.beforeFile" :key="index" style="width: 110rpx; height: 110rpx;margin-right: 15rpx" :src="item" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修方案" class="from-item">
          <u-input v-model="maintForm.repariItemName" :placeholder="'维修方案'" type="select" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @click="openObjItem()" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="备品备件" class="from-uploaditem">
          <view style="width: 100%">
            <u-row v-for="(item, index) of sparePart" :key="index" class="u-margin-bottom-15">
              <u-col :span="12" class="u-flex">
                <view class="namesty">品名:</view>
                <view style="width: 210rpx;margin-right:5rpx">
                  <u-input v-model="item.machineName" :select-open="showMachine" :border="true" border-color="#969696" height="63" type="select" placeholder-style="color: #969696;fontSize: 23rpx;paddingLeft: 5rpx;paddingRight: 5rpx;width: calc(100% - 10rpx)" placeholder="请选择品名" @click="openshowMachine(index)" />
                </view>
                <u-radio-group v-model="item.status" class="getRadio" :size="22" @change="radioGroupChange()">
                  <u-radio v-for="(items, indexs) in changelist" :key="indexs" :name="items.value" icon-size="22" label-size="22">{{ items.name }}</u-radio>
                </u-radio-group>
                <u-icon v-if="index === 0" name="plus" color="#006fe6" @click="addBP()"></u-icon>
                <u-icon v-if="index !== 0" name="trash-fill" color="#fa3534" @click="deleteBP(index)"></u-icon>
              </u-col>
            </u-row>
          </view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="方案补充" class="from-item">
          <u-input v-model="maintForm.note" placeholder="方案补充" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修后评审" class="from-uploaditem">
          <u-radio-group v-if="maintForm.isReview !== -1" v-model="maintForm.isReview" :size="22" @change="radioGroupChangex()">
            <u-radio :name="1" icon-size="22" label-size="22">是</u-radio>
            <u-radio :name="0" icon-size="22" label-size="22">否</u-radio>
          </u-radio-group>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="预计耗时" class="from-item">
          <u-input v-model="maintForm.planHour" placeholder="预计耗时" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="5" />小时
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="上传附件" class="from-uploaditem">
          <u-row class="u-margin-bottom-15">
            <u-col :span="12">
              <u-upload ref="uUpload" :custom-btn="true" :show-upload-list="false" :action="uploadUrl" :form-data="{'isAdd':true}" :max-size="200*1024*1024" max-count="3" @on-success="successUpload">
                <view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
                  <u-icon name="arrow-upward" size="60" color="#c0c4cc" class="u-margin-left-20"></u-icon>
                  <view style="line-height: 20rpx;font-sizt:20rpx">上传文件</view>
                </view>
              </u-upload>
            </u-col>
            <u-col v-for="(item, index) in fileList" :key="index" class="u-margin-bottom-5" :span="12">
              {{ item.name }}{{ item.suffix }}<u-icon name="trash-fill" color="#fa3534" @click="deleteFile(index)"></u-icon>
            </u-col>
          </u-row>
        </u-form-item>
      </u-form>
      <u-form v-if="current === 2" :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具编号" class="from-item scansty">
          <view class="u-padding-left-25">{{ maintForm.matchNumber }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具名称" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.typeName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="优先级" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.priorityName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.questionName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题描述" class="from-item">
          <u-input v-model="maintForm.questiondesc" :disabled="true" placeholder="问题描述" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修前照片" class="from-uploaditem">
          <u-image v-for="(item, index) of maintForm.beforeFile" :key="index" style="width: 110rpx; height: 110rpx;margin-right: 15rpx" :src="item" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修方案" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.repariItemName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="方案补充" class="from-item">
          <u-input v-model="maintForm.note" placeholder="方案补充" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="附件" class="from-uploaditem">
          <u-row class="u-margin-bottom-15">
            <u-col v-for="(item, index) in maintForm.planFileList" :key="index" class="u-margin-bottom-5" :span="12" @click="downloadFile(index)">
              {{ item.name }}{{ item.suffix }}
            </u-col>
          </u-row>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="备品备件" class="from-uploaditem">
          <view style="width: 100%">
            <u-row v-for="(item, index) of sparePart" :key="index" class="u-margin-bottom-15">
              <u-col :span="12" class="u-flex">
                <view style="width: 210rpx;margin-right:5rpx">
                  <u-input v-model="item.machineName" :select-open="showMachine" :border="true" border-color="#969696" height="63" type="select" placeholder-style="color: #969696;fontSize: 23rpx;paddingLeft: 5rpx;paddingRight: 5rpx;width: calc(100% - 10rpx)" placeholder="品名" @click="openshowMachine(index)" />
                </view>
                <u-radio-group v-model="item.status" class="getRadio" :size="22" @change="radioGroupChanges()">
                  <u-radio v-for="(item, index) in changelist" :key="index" :name="item.value" icon-size="22" label-size="22">{{ item.name }}</u-radio>
                </u-radio-group>
                <u-input v-model="item.num" type="number" :border="true" border-color="#969696" :size="20" height="63" placeholder="数量" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;" style="width: 80rpx;margin-right:10rpx" maxlength="3" @input="checkNum(item)" />
                <u-icon v-if="index === 0" name="plus" color="#006fe6" @click="addBP()"></u-icon>
                <u-icon v-if="index !== 0" name="trash-fill" color="#fa3534" @click="deleteBP(index)"></u-icon>
              </u-col>
            </u-row>
          </view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="预计耗时" class="from-item">
          <u-input v-model="maintForm.planHour" type="number" placeholder="预计耗时" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 75rpx;width: calc(100% - 100rpx)" maxlength="5" />小时
        </u-form-item>
      </u-form>
      <u-form v-if="current === 3" :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具编号" class="from-item scansty">
          <view class="u-padding-left-25">{{ maintForm.matchNumber }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具名称" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.typeName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="优先级" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.priorityName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.questionName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题描述" class="from-item">
          <u-input v-model="maintForm.questiondesc" :disabled="true" placeholder="问题描述" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修前照片" class="from-uploaditem">
          <u-image v-for="(item, index) of maintForm.beforeFile" :key="index" style="width: 110rpx; height: 110rpx;margin-right: 15rpx" :src="item" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修方案" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.repariItemName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="方案补充" class="from-item">
          <u-input v-model="maintForm.note" placeholder="方案补充" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="上传附件" class="from-uploaditem">
          <u-row class="u-margin-bottom-15">
            <u-col v-for="(item, index) in maintForm.planFileList" :key="index" class="u-margin-bottom-5" :span="12" @click="downloadFile(index)">
              {{ item.name }}{{ item.suffix }}
            </u-col>
          </u-row>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="备品备件" class="from-uploaditem">
          <view style="width: 100%">
            <u-row v-for="(item, index) of sparePart" :key="index" class="u-margin-bottom-15">
              <u-col :span="12" class="u-flex">
                <view style="margin-right:5rpx">
                  品名:{{ item.machineName }} {{ item.status === '0' ? '维修' : '更换' }} 数量: {{ item.num }}
                </view>
              </u-col>
            </u-row>
          </view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="备注" class="from-item">
          <u-input v-model="maintForm.remark" placeholder="备注" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="型腔数" class="from-item">
          <u-input v-model="maintForm.cavityNumber" placeholder="型腔数" type="number" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="2" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修时间" class="from-item">
          <u-input v-model="maintForm.starttime" type="select" placeholder="维修开始时间" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @click="showCalendar = true" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修时间" class="from-item">
          <u-input v-model="maintForm.endtime" type="select" placeholder="维修结束时间" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" @click="showCalendar1 = true" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修后照片" class="from-uploaditem">
          <u-upload ref="uUpload" :action="uploadUrl" :form-data="{'isAdd':true}" :max-size="200*1024*1024" max-count="3" width="110" height="110" @on-remove="onRemove" @on-success="successUpload"></u-upload>
        </u-form-item>
      </u-form>
      <u-form v-if="current === 4" :model="maintForm" ref="uForm">
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具编号" class="from-item scansty">
          <view class="u-padding-left-25">{{ maintForm.matchNumber }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="模具名称" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.typeName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="优先级" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.priorityName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.questionName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="问题描述" class="from-item">
          <u-input v-model="maintForm.questiondesc" :disabled="true" placeholder="问题描述" placeholder-style="line-height: 63rpx;color: #969696;fontSize: 23rpx;paddingLeft: 25rpx;paddingRight: 25rpx;width: calc(100% - 50rpx)" maxlength="50" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修前照片" class="from-uploaditem">
          <u-image v-for="(item, index) of maintForm.beforeFile" :key="index" style="width: 110rpx; height: 110rpx;margin-right: 15rpx" :src="item" />
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修方案" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.repariItemName }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="方案补充" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.note }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="上传附件" class="from-uploaditem">
          <u-row class="u-margin-bottom-15">
            <u-col v-for="(item, index) in maintForm.planFileList" :key="index" class="u-margin-bottom-5" :span="12" @click="downloadFile(index)">
              {{ item.name }}{{ item.suffix }}
            </u-col>
          </u-row>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="备品备件" class="from-uploaditem">
          <view style="width: 100%">
            <u-row v-for="(item, index) of sparePart" :key="index" class="u-margin-bottom-15">
              <u-col :span="12" class="u-flex">
                <view style="margin-right:5rpx">
                  品名:{{ item.machineName }} {{ parseInt(item.status + '') === 1 ? '更换' : '维修'}} 数量： {{ item.num }}
                </view>
              </u-col>
            </u-row>
          </view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="备注" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.remark }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="型腔数" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.cavityNumber }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修开始时间" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.starttime }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修结束时间" class="from-item">
          <view class="u-padding-left-25">{{ maintForm.endtime }}</view>
        </u-form-item>
        <u-form-item :label-style="{fontSize: '23rpx'}" :label-position="'left'" :border-bottom="false" label-width="169" label="维修后照片" class="from-uploaditem">
          <u-image v-for="(item, index) of maintForm.afterFile" :key="index" style="width: 110rpx; height: 110rpx;margin-right: 15rpx" :src="item" />
        </u-form-item>
      </u-form>
      <u-button v-if="current !== 4" class="substy" @click="submit">提交</u-button>
      <u-select mode="single-column" :list="maintainObjList" v-model="typeShow" @confirm="selectTypeConfirm"></u-select>
      <u-select mode="single-column" :list="priorityList" v-model="priorityshow" @confirm="selectPriorityNConfirm"></u-select>
      <u-select mode="single-column" :list="machineList" v-model="showMachine" @confirm="selectMachineNConfirm"></u-select>
      <!-- <u-calendar v-model="showCalendar" mode="range" @change="changeCalendar">
      <view slot="tooltip">
        <view class="titlesty">
          请选择维修开始~结束时间
        </view>
      </view>
    </u-calendar> -->
      <u-picker v-model="showCalendar" :cancel-color="'#323232'" :confirm-color="'#006fe6'" mode="time" :params="params" @confirm="confirm"></u-picker>
      <u-picker v-model="showCalendar1" :cancel-color="'#323232'" :confirm-color="'#006fe6'" mode="time" :params="params" @confirm="confirms"></u-picker>
      <u-popup v-model="showquestoin" mode="bottom">
        <view>
          <u-row>
            <u-col span="6">
              <view class="btnclose" @click="showquestoin = false">取消</view>
            </u-col>
            <u-col span="6">
              <view class="succclose" :plain="false" size="small" @click="setSelect()">确认</view>
            </u-col>
          </u-row>
          <view class="checksty">
            <u-checkbox-group :wrap="true" @change="checkboxGroupChange">
              <u-checkbox v-model="item.checked" v-for="(item, index) in questionlist" :key="index" :name="index">{{item.name}}</u-checkbox>
            </u-checkbox-group>
          </view>
        </view>
      </u-popup>
      <u-popup v-model="showObjItem" mode="bottom">
        <view>
          <u-row>
            <u-col span="6">
              <view class="btnclose" @click="showObjItem = false">取消</view>
            </u-col>
            <u-col span="6">
              <view class="succclose" :plain="false" size="small" @click="setRepariSelect()">确认</view>
            </u-col>
          </u-row>
          <view class="checksty">
            <u-checkbox-group :wrap="true" @change="checkboxRepariGroupChange">
              <u-checkbox v-model="item.checked" v-for="(item, index) in productList" :key="index" :name="index">{{item.name}}</u-checkbox>
            </u-checkbox-group>
          </view>
        </view>
      </u-popup>
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
      tablist: [
        {
          name: '维修申请'
        },
        {
          name: '方案制定'
        },
        {
          name: '任务确认'
        },
        {
          name: '维修执行'
        }
      ],
      current: 0,
      typeShow: false,
      priorityshow: false,
      showquestoin: false,
      showMachine: false,
      showObjItem: false,
      showCalendar: false,
      showCalendar1: false,
      sparePart: [
        {
          machineName: '',
          machineValue: '',
          status: '1',
          num: 1
        }
      ],
      params: { year: true, month: true, day: true, hour: true, minute: true },
      maintForm: {
        id: '',
        matchNumber: '',
        cavityNumber: 1,
        type: '',
        typeName: '',
        priority: '',
        question: [],
        priorityName: '',
        questionName: '',
        questiondesc: '',
        isReview: 1,
        planHour: '',
        beforeFile: [],
        repairItem: [],
        repariItemName: '',
        note: '',
        planFileList: [],
        starttime: '',
        endtime: ''
      },
      selectIndexPriority: 0,
      uploadUrl: this.apiUrl.appUrl + this.apiUrl.uploadFile,
      maintainObjList: [],
      selectQuestonlist: [],
      selectRepairlist: [],
      machineList: [],
      questionlist: [],
      priorityList: [
        {
          value: 0,
          label: '普通'
        },
        {
          value: 1,
          label: '优先'
        }
      ],
      changelist: [
        {
          value: '1',
          name: '更换',
          checked: false,
          disabled: false
        },
        {
          value: '0',
          name: '维修',
          checked: false,
          disabled: false
        }
      ],
      codeList: [],
      fileList: [],
      productList: [],
      currentId: 0,
      itemInfo: null
    }
  },
  mounted() {
    console.log(this.apiUrl)
    // this.getDevicesClassifys()
    this.findDevicesLists()
    this.getStoreMachine()
    const repairInfo = uni.getStorageSync('repairInfo')
    if (repairInfo) {
      this.itemInfo = JSON.parse(repairInfo)
      this.currentId = this.itemInfo.id
      uni.removeStorageSync('repairInfo')
      this.getInfo()
    }
  },
  methods: {
    changeTab(index) {
      // this.current = index
    },
    checkNum(item) {
      console.log(item.num)
      if (parseInt(item.num + '') > 100) {
        item.num = 100
      } else if (parseInt(item.num + '') < 1) {
        item.num = 1
      } else {
        this.$nextTick(() => {
          item.num = parseFloat(item.num + '').toFixed(0)
        })
      }
    },
    checkNums() {
      if (parseInt(this.maintForm.cavityNumber + '') > 10) {
        this.maintForm.cavityNumber = 10
      } else if (parseInt(this.maintForm.cavityNumber + '') < 1) {
        this.maintForm.cavityNumber = 1
      } else {
        this.$nextTick(() => {
          this.maintForm.cavityNumber = parseFloat(this.maintForm.cavityNumber + '').toFixed(0)
        })
      }
    },
    confirm(e) {
      this.maintForm.starttime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute
    },
    confirms(e) {
      this.maintForm.endtime = e.year + '-' + e.month + '-' + e.day + ' ' + e.hour + ':' + e.minute
    },
    scan() {
      let self = this
      uni.setStorageSync('scan_type', 'getNumberByRepairMould')
      uni.$once('getNumberByRepairMould', function (data) {
        console.log(data)
        for (const item of self.codeList) {
          if (item.code === data.result) {
            self.maintForm.matchNumber = item.code
            self.maintForm.id = item.id
            self.maintForm.typeName = item.name
            break
          }
        }
        if (self.maintForm.id === '') {
          self.$refs.uToast.show({
            title: '模具编号不存在!',
            type: 'default',
            position: 'bottom'
          })
        }
      })
      this.$u.route({
        url: '/pages/components/scan/index', //'/pages/workspace/equipment/index'
        params: {
          type: 'getNumberByRepairMould'
        }
      })
    },
    checkNumber() {
      for (const item of this.codeList) {
        if (item.code === this.maintForm.matchNumber) {
          this.maintForm.matchNumber = item.code
          this.maintForm.id = item.id
          this.maintForm.typeName = item.name
          break
        }
      }
      if (this.maintForm.id === '') {
        this.$refs.uToast.show({
          title: '模具编号不存在!',
          type: 'default',
          position: 'bottom'
        })
      }
    },
    radioGroupChange() {
      const lis = this.changelist
      this.changelist = []
      this.$nextTick(() => {
        this.changelist = JSON.parse(JSON.stringify(lis))
      })
    },
    radioGroupChangex() {
      const isReview = this.maintForm.isReview
      this.maintForm.isReview = -1
      this.$nextTick(() => {
        this.maintForm.isReview = isReview
      })
    },
    radioGroupChanges() {
      const lis = this.changelist
      this.changelist = []
      this.$nextTick(() => {
        this.changelist = JSON.parse(JSON.stringify(lis))
      })
    },
    findDevicesLists() {
      this.$u.get(this.apiUrl.appUrl + this.apiUrl.findListSpareInfo, {}).then(res => {
        console.log(res.data)
        this.codeList = res.data
      })
    },
    downloadFile(index) {
      // uni.downloadFile({
      //   url: this.apiUrl.appUrl + '/attachment/downByPath?path=' + this.maintForm.planFileList[index].path, //仅为示例，并非真实的资源
      //   success: res => {
      //     if (res.statusCode === 200) {
      //       console.log('下载成功')
      //     }
      //   }
      // })
      // const webPath = this.maintForm.planFileList[index].webPath.replace(/\\/g, '/')
      const webPath = this.maintForm.planFileList[index].path.replace(/\\/g, '/')
      uni.downloadFile({
        url: this.apiUrl.appUrl + '/attachment/downByPath?path=' + webPath, //this.apiUrl.appUrl + webPath, //仅为示例，并非真实的资源
        success: res => {
          console.log(res)
          if (res.statusCode === 200) {
            this.$refs.uToast.show({
              title: '下载成功!您的文件临时存放在' + res.tempFilePath,
              type: 'default',
              position: 'bottom'
            })
          }
        }
      })
    },
    getDevicesClassifys() {
      this.$u.get(this.apiUrl.findDecicesClassifyList, {}).then(res => {
        this.maintainObjList = []
        for (const item of res.data) {
          this.maintainObjList.push({
            label: item.name,
            value: item.id
          })
        }
      })
    },
    getStoreMachine() {
      this.$u.get(this.apiUrl.findListMouldSpareInfo, {}).then(res => {
        this.machineList = []
        for (const item of res.data.list) {
          this.machineList.push({
            label: item.name,
            value: item.id
          })
        }
      })
    },
    getQuestions() {
      this.$u.get(this.apiUrl.findQuestionList, { type: 1, pageNum: 1, pageSize: 99999 }).then(res => {
        this.questionlist = []
        this.selectQuestonlist = []
        for (const item of res.data.list) {
          let flag = false
          for (const ite of this.maintForm.question) {
            if (ite === item.id) {
              flag = true
            }
          }
          var data = {
            id: item.id,
            name: item.name,
            checked: flag
          }
          if (flag) {
            this.selectQuestonlist.push(data)
          }
          this.questionlist.push(data)
        }
      })
    },
    openQuestion() {
      this.showquestoin = true
      this.getQuestions()
    },
    selectTypeConfirm(e) {
      this.maintForm.typeName = e[0].label
      this.maintForm.type = e[0].value
    },
    selectPriorityNConfirm(e) {
      this.maintForm.priorityName = e[0].label
      this.maintForm.priority = e[0].value
    },
    selectMachineNConfirm(e) {
      this.sparePart[this.selectIndexPriority].machineName = e[0].label
      this.sparePart[this.selectIndexPriority].machineValue = e[0].value
    },
    openshowMachine(index) {
      this.selectIndexPriority = index
      this.showMachine = true
    },
    checkboxGroupChange(e) {
      this.selectQuestonlist = []
      for (const item of e) {
        this.selectQuestonlist.push(this.questionlist[parseInt(item + '')])
      }
    },
    setSelect() {
      this.maintForm.question = []
      this.maintForm.questionName = ''
      for (const item of this.selectQuestonlist) {
        this.maintForm.question.push(item.id)
        if (this.maintForm.questionName) {
          this.maintForm.questionName = this.maintForm.questionName + ',' + item.name
        } else {
          this.maintForm.questionName = item.name
        }
      }
      this.showquestoin = false
    },
    onRemove(index, lists) {
      console.log(index, lists)
      this.fileList.splice(index, 1)
    },
    successUpload(data, index, lists, name) {
      console.log(data)
      this.fileList.push(data.data)
    },
    changeCalendar(e) {
      this.maintForm.times = e.startDate + '~' + e.endDate
    },
    openObjItem() {
      this.showObjItem = true
      this.getProductList()
    },
    checkboxRepariGroupChange(e) {
      this.selectRepairlist = []
      for (const item of e) {
        this.selectRepairlist.push(this.productList[parseInt(item + '')])
      }
    },
    setRepariSelect() {
      this.maintForm.repairItem = []
      this.maintForm.repariItemName = ''
      for (const item of this.selectRepairlist) {
        this.maintForm.repairItem.push(item.id)
        if (this.maintForm.repariItemName) {
          this.maintForm.repariItemName = this.maintForm.repariItemName + ',' + item.name
        } else {
          this.maintForm.repariItemName = item.name
        }
      }
      this.showObjItem = false
    },
    getProductList() {
      this.$u
        .get(this.apiUrl.mouldrepairList, {
          pageNum: 1,
          pageSize: 9999999
        })
        .then(res => {
          this.productList = []
          this.selectRepairlist = []
          for (const item of res.data.list) {
            let flag = false
            for (const ite of this.maintForm.repairItem) {
              if (ite === item.id) {
                flag = true
              }
            }
            var data = {
              id: item.id,
              name: item.name,
              checked: flag
            }
            if (flag) {
              this.selectRepairlist.push(data)
            }
            this.productList.push(data)
          }
          console.log(this.productList)
        })
    },
    addBP() {
      this.sparePart.push({
        machineName: '',
        machineValue: '',
        status: '1',
        num: 1
      })
    },
    deleteBP(index) {
      this.sparePart.splice(index, 1)
    },
    deleteFile(index) {
      this.fileList.splice(index, 1)
    },
    getInfo() {
      this.$u
        .get(this.apiUrl.getMouldRepais, {
          id: this.currentId
        })
        .then(res => {
          if (res.code === 0) {
            var beforefiles = res.data.list[0].beforeFile.replace(/\\/g, '/')
            const beforelis = beforefiles.split(',')
            const beforelist = []
            for (const item of beforelis) {
              beforelist.push(this.apiUrl.appUrl + item)
            }
            if (res.data.list[0].repairProjectStatus === 0) {
              this.current = 1
              this.maintForm = {
                matchNumber: res.data.list[0].mouldCode,
                typeName: res.data.list[0].mouldName,
                priority: parseInt(res.data.list[0].priority + ''),
                question: [],
                priorityName: res.data.list[0].priority === '1' || res.data.list[0].priority === 1 ? '优先' : '普通',
                questionName: res.data.list[0].questionName,
                questiondesc: res.data.list[0].questionDesc,
                isReview: '1',
                planHour: '',
                beforeFile: beforelist,
                repairItem: [],
                repariItemName: '',
                note: '',
                planFileList: [],
                starttime: '',
                endtime: ''
              }
            } else if (res.data.list[0].repairProjectStatus === 1 && res.data.list[0].taskReceived === 0) {
              this.current = 2
              this.sparePart = []
              if (res.data.list[0].mouldRepairSpareList) {
                for (const item of res.data.list[0].mouldRepairSpareList) {
                  this.sparePart.push({
                    machineValue: item.mouldSpareId,
                    machineName: item.mouldSpareName,
                    status: item.repairPlan + '',
                    num: 1
                  })
                }
              }
              if (this.sparePart.length === 0) {
                this.sparePart.push({
                  machineName: '',
                  machineValue: '',
                  status: '1',
                  num: 1
                })
              }
              this.maintForm = {
                matchNumber: res.data.list[0].mouldCode,
                typeName: res.data.list[0].mouldName,
                priority: parseInt(res.data.list[0].priority + ''),
                question: [],
                priorityName: res.data.list[0].priority === '1' || res.data.list[0].priority === 1 ? '优先' : '普通',
                questionName: res.data.list[0].questionName,
                questiondesc: res.data.list[0].questionDesc,
                isReview: res.data.list[0].isReview,
                planHour: res.data.list[0].planHour,
                beforeFile: beforelist,
                repairItem: res.data.list[0].repairTeamIds.split(','),
                repariItemName: res.data.list[0].repairTeamName,
                note: res.data.list[0].addPlan,
                planFileList: res.data.list[0].planFileList,
                starttime: '',
                endtime: ''
              }
              console.log(this.sparePart)
            } else if (res.data.list[0].repairTaskExeStatus === 0 && res.data.list[0].taskReceived === 1) {
              this.current = 3
              this.sparePart = []
              if (res.data.list[0].mouldRepairSpareList) {
                for (const item of res.data.list[0].mouldRepairSpareList) {
                  this.sparePart.push({
                    machineValue: item.mouldSpareId,
                    machineName: item.mouldSpareName,
                    status: item.repairPlan + '',
                    num: 1
                  })
                }
              }
              this.maintForm = {
                matchNumber: res.data.list[0].mouldCode,
                typeName: res.data.list[0].mouldName,
                priority: parseInt(res.data.list[0].priority + ''),
                question: [],
                priorityName: res.data.list[0].priority === '1' || res.data.list[0].priority === 1 ? '优先' : '普通',
                questionName: res.data.list[0].questionName,
                questiondesc: res.data.list[0].questionDesc,
                isReview: res.data.list[0].isReview,
                planHour: res.data.list[0].planHour,
                beforeFile: beforelist,
                repairItem: res.data.list[0].repairTeamIds.split(','),
                repariItemName: res.data.list[0].repairTeamName,
                note: res.data.list[0].addPlan,
                planFileList: res.data.list[0].planFileList,
                starttime: '',
                endtime: ''
              }
            } else if (res.data.list[0].repairProjectStatus === 1 && res.data.list[0].taskReceived === 1) {
              this.current = 4
              var afterfiles = res.data.list[0].afterFile.replace(/\\/g, '/')
              const afterlis = afterfiles.split(',')
              const afterlist = []
              for (const item of afterlis) {
                afterlist.push(this.apiUrl.appUrl + item)
              }
              this.sparePart = []
              if (res.data.list[0].mouldRepairSpareList) {
                for (const item of res.data.list[0].mouldRepairSpareList) {
                  this.sparePart.push({
                    machineValue: item.mouldSpareId,
                    machineName: item.mouldSpareName,
                    status: item.repairPlan + '',
                    num: 1
                  })
                }
              }
              console.log(res.data.list[0])
              this.maintForm = {
                matchNumber: res.data.list[0].mouldCode,
                typeName: res.data.list[0].mouldName,
                priority: parseInt(res.data.list[0].priority + ''),
                question: [],
                priorityName: res.data.list[0].priority === '1' || res.data.list[0].priority === 1 ? '优先' : '普通',
                questionName: res.data.list[0].questionName,
                questiondesc: res.data.list[0].questionDesc,
                isReview: res.data.list[0].isReview,
                planHour: res.data.list[0].planHour,
                beforeFile: beforelist,
                afterFile: afterlist,
                cavityNumber: res.data.list[0].cavityNumber,
                repairItem: res.data.list[0].repairTeamIds.split(','),
                repariItemName: res.data.list[0].repairTeamName,
                note: res.data.list[0].addPlan,
                planFileList: res.data.list[0].planFileList,
                starttime: res.data.list[0].startTime,
                endtime: res.data.list[0].finishTime,
                remark: res.data.list[0].note
              }
            } else {
              this.current = 0
            }
          }
        })
    },
    submit() {
      if (this.current === 0) {
        if (this.maintForm.matchNumber.length === 0) {
          this.$refs.uToast.show({
            title: '模具编号不能为空!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        // if (this.maintForm.type.length === 0) {
        //   this.$refs.uToast.show({
        //     title: '模具类型不能为空!',
        //     type: 'default',
        //     position: 'bottom'
        //   })
        //   return
        // }
        if (this.maintForm.priority.length === 0) {
          this.$refs.uToast.show({
            title: '优先级不能为空!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        if (this.maintForm.questionName.length === 0) {
          this.$refs.uToast.show({
            title: '问题不能为空!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        if (this.maintForm.questiondesc.length === 0) {
          this.$refs.uToast.show({
            title: '问题描述不能为空!',
            type: 'default',
            position: 'bottom'
          })
          return
        }

        if (this.fileList.length === 0) {
          this.$refs.uToast.show({
            title: '维修前照片不能为空!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        var str = ''
        var showStr = ''
        for (const item of this.fileList) {
          if (str) {
            str = str + ',' + item.webPath
            showStr = showStr + ',' + this.apiUrl.appUrl + item.webPath
          } else {
            str = item.webPath
            showStr = this.apiUrl.appUrl + item.webPath
          }
        }
        this.$u
          .post(
            this.apiUrl.savemouldRepair,
            JSON.stringify({
              mouldId: this.maintForm.id,
              mouldName: this.maintForm.typeName,
              question: this.maintForm.question.join(','),
              questionDesc: this.maintForm.questiondesc,
              priority: this.maintForm.priority,
              beforeFile: str
            })
          )
          .then(res => {
            if (res.code === 0) {
              showStr = showStr.replace(/\\/g, '/')
              this.maintForm.beforeFile = showStr.split(',')
              console.log(this.maintForm.beforeFile)
              this.$refs.uToast.show({
                title: '提交成功!',
                type: 'default',
                position: 'bottom'
              })
              this.current = 1
              this.currentId = res.data
              this.fileList = []
              // this.getInfo()
            } else {
              this.$refs.uToast.show({
                title: res.msg,
                type: 'default',
                position: 'bottom'
              })
            }
          })
      } else if (this.current === 1) {
        if (this.maintForm.repairItem.length === 0) {
          this.$refs.uToast.show({
            title: '维修方案不能为空!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        if (this.maintForm.planHour.length === 0) {
          this.$refs.uToast.show({
            title: '预计耗时不能为空!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        if (parseFloat(this.maintForm.planHour + '') + '' !== this.maintForm.planHour) {
          this.$refs.uToast.show({
            title: '预计耗时输入不正确!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        if (this.maintForm.planHour.indexOf('.') > -1) {
          const lis = this.maintForm.planHour.split('.')
          if (lis[1].length > 1) {
            this.$refs.uToast.show({
              title: '预计耗时小数点仅保留一位小数!',
              type: 'default',
              position: 'bottom'
            })
          }
        }
        const list = []
        for (const item of this.sparePart) {
          if ((item.machineValue + '').length > 0) {
            list.push({
              mouldRepairId: this.currentId,
              mouldSpareId: item.machineValue,
              repairPlan: parseInt(item.status + ''),
              useCount: 0
            })
          }
        }
        const filelis = []
        for (const item of this.fileList) {
          filelis.push(item.dataId)
        }
        this.$u
          .post(
            this.apiUrl.makemouldProject,
            JSON.stringify({
              id: this.currentId,
              repairTeamIds: this.maintForm.repairItem.join(','),
              isReview: this.maintForm.isReview,
              planHour: this.maintForm.planHour,
              mouldRepairSpareList: list,
              addPlan: this.maintForm.note,
              planFile: filelis.join(',')
            })
          )
          .then(res => {
            if (res.code === 0) {
              this.fileList = []
              this.$refs.uToast.show({
                title: '提交成功!',
                type: 'default',
                position: 'bottom'
              })
              this.current = 0
              this.fileList = []
              uni.$emit('showMouldRepairInfo', {
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
      } else if (this.current === 2) {
        if (this.maintForm.planHour.length === 0) {
          this.$refs.uToast.show({
            title: '预计耗时不能为空!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        const list = []
        for (const item of this.sparePart) {
          if ((item.machineValue + '').length > 0) {
            list.push({
              mouldRepairId: this.currentId,
              mouldSpareId: item.machineValue,
              repairPlan: item.status,
              useCount: item.num
            })
          }
        }
        this.$u
          .post(
            this.apiUrl.getMouldRepairTask,
            JSON.stringify({
              id: this.currentId,
              mouldRepairSpareList: list,
              planHour: this.maintForm.planHour
            })
          )
          .then(res => {
            if (res.code === 0) {
              this.$refs.uToast.show({
                title: '提交成功!',
                type: 'default',
                position: 'bottom'
              })
              this.current = 3
            } else {
              this.$refs.uToast.show({
                title: res.msg,
                type: 'default',
                position: 'bottom'
              })
            }
          })
      } else if (this.current === 3) {
        if (this.maintForm.starttime.length === 0) {
          this.$refs.uToast.show({
            title: '维修起始时间不能为空!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        if (this.maintForm.endtime.length === 0) {
          this.$refs.uToast.show({
            title: '维修结束时间不能为空!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        if ((this.maintForm.cavityNumber + '').length === 0) {
          this.$refs.uToast.show({
            title: '型腔数不能为空!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        if (this.maintForm.cavityNumber > 10 || this.maintForm.cavityNumber < 1) {
          this.$refs.uToast.show({
            title: '型腔数在1~10之间!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        const startdata = new Date(this.maintForm.starttime)
        const enddata = new Date(this.maintForm.endtime)
        if (startdata.getTime() > enddata.getTime()) {
          this.$refs.uToast.show({
            title: '维修结束时间不能小于维修起始时间!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        if (this.fileList.length === 0) {
          this.$refs.uToast.show({
            title: '维修后照片不能为空!',
            type: 'default',
            position: 'bottom'
          })
          return
        }
        const list = []
        for (const item of this.sparePart) {
          list.push({
            mouldRepairId: this.currentId,
            mouldSpareId: item.machineValue,
            repairPlan: item.status,
            useCount: item.num
          })
        }
        var str = ''
        var showStr = ''
        for (const item of this.fileList) {
          if (str) {
            str = str + ',' + item.webPath
            showStr = showStr + ',' + this.apiUrl.appUrl + item.webPath
          } else {
            str = item.webPath
            showStr = this.apiUrl.appUrl + item.webPath
          }
        }
        this.$u
          .post(
            this.apiUrl.repairmouldTaskExecute,
            JSON.stringify({
              id: this.currentId,
              startTime: this.maintForm.starttime,
              finishTime: this.maintForm.endtime,
              mouldRepairSpareList: list,
              mouldId: this.itemInfo.mouldId,
              note: this.maintForm.remark,
              isReview: this.maintForm.isReview,
              cavityNumber: this.maintForm.cavityNumber,
              afterFile: str
            })
          )
          .then(res => {
            if (res.code === 0) {
              this.$refs.uToast.show({
                title: '提交成功!',
                type: 'default',
                position: 'bottom'
              })
              this.current = 0
              this.currentId = 0
              this.maintForm = {
                id: '',
                matchNumber: '',
                type: '',
                typeName: '',
                priority: '',
                question: [],
                priorityName: '',
                questionName: '',
                questiondesc: '',
                isReview: 1,
                planHour: '',
                beforeFile: [],
                repairItem: [],
                repariItemName: '',
                note: '',
                planFileList: [],
                starttime: '',
                endtime: ''
              }
              uni.$emit('showMouldRepairInfo', {
                result: 2
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
}
</script>

<style lang="scss" scoped>
.addform {
  width: 100%;
  .fromsifno {
    width: 100%;
    height: calc(100vh - 325rpx);
    overflow: auto;
  }
  ::v-deep .uni-input-placeholder {
    line-height: 63rpx;
  }
  .tabsty {
    // border-bottom: 1px solid #dfdfdf;
    margin-bottom: 25rpx;
    ::v-deep .u-steps__item__text--row {
      font-size: 20rpx;
    }
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
    height: 69rpx;
    font-size: 23rpx;
    border-color: #ffffff;
    background-color: #006fe6;
    border-radius: 6rpx;
    color: #fff;
  }
}
</style>