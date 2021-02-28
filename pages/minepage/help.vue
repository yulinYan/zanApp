<template>
  <view class="worksty">
    <view class="headersty">
      <u-navbar :title-color="'#323232'" :back-icon-color="'#323232'" :back-text="'返回'" :back-icon-name="'arrow-leftward'" :back-icon-size="34" :is-fixed="true" :is-back="true" :background="{background: '#fff'}" title="帮助">
        <view class="navbar-right" slot="right">
          <btns />
        </view>
      </u-navbar>
    </view>
    <view class="u-padding-left-35 u-padding-right-35" style="color: #323232">
      <view class="u-font-20 tent">
        FineWorld基于AndroidH5开发，适用于泛沃注塑生产车​​间使用。
      </view>
      <view class="u-font-20 tent">
        涵盖物流到生产到质量所有流程的任务执行，功能包括分段审核，设备，模具，物流，生产.
      </view>
      <view class="u-font-32" style="color: #000">
        设备
      </view>
      <view class="u-font-20">
        1.设备保养
      </view>
      <view class="u-font-20 tent">
        在PC端MES中通过添加设备，建立设备维护内容和计划，系统根据计划自动生成维护任务，在当前APP中，可以查看到维护任务的消息通知以及任务，通过确认和执行维护任务完成设备的维护信息记录。
      </view>
      <view class="u-font-20">
        2.设备维修
      </view>
      <view class="u-font-20 tent">
        当设备故障触发安灯（包括自动和手动）时，可通过APP扫描设备二维码，提交维修申请。
        申请后，相关人员可以对该设备的故障信息做出相应的维修方案；
        维修人员查看确认任务，领取需更换的备品备件，最后完成维修任务的执行操作，记录维修信息。
      </view>
      <view class="u-font-32" style="color: #000">
        模具
      </view>
      <view class="u-font-20">
        1.模具保养
      </view>
      <view class="u-font-20 tent">
        在PC端MES中通过添加模具，建立模具维护内容和计划，系统根据计划自动生成维护任务，也可根据生产计划执行情况自动生成维护任务，在当前APP中，可以查看到维护任务的消息通知以及任务，通过确认和执行保养任务完成设备的保养信息记录。
      </view>
      <view class="u-font-20">
        2.模具维修
      </view>
      <view class="u-font-20 tent">
        当模具故障触发（包括自动和手动）安灯时，可通过APP扫描模具二维码，提交维修申请。
        申请后，相关人员可以为此模具的故障信息做出相应的维修方案；
        维修人员查看确认任务，领取需更换的备品备件，最后完成维修任务的执行操作，记录维修信息。
      </view>
      <view class="u-font-20">
        3.模具出入库
      </view>
      <view class="u-font-20 tent">
        模具的出入库任务由PC端手动创建或通过生产指令自动触发，移库任务由PC端手动触发。在APP端对出入库移库任务进行操作，扫描库位和模具信息，完成模具的出入库操作。
      </view>
      <view class="u-font-20">
        4.模具的使用
      </view>
      <view class="u-font-20 tent">
        模具的使用包括上模和下模两种，通过产前保养，生产指令完成等动作自动触发模具的上下模任务，在APP端通过进入任务扫描设备和模具二维码信息完成上下模操作，并记录操作信息。
      </view>
      <view class="u-font-32" style="color: #000">
        物流
      </view>
      <view class="u-font-20 tent">
        物流包括入库（外购，生产），出库（车间领料，外部出库），确认收货，上架，下架，移库，退库等功能。
      </view>
      <view class="u-font-20">
        1.确认收货
      </view>
      <view class="u-font-20 tent">
        通过ERP的采购单，委外生产入库单，其他入库单形成确认收货任务，当货物到达库房后，通过确认采购单和实际货物信息确认实际收货信息并形成来料检验任务。
      </view>
      <view class="u-font-20">
        2.外购入库
      </view>
      <view class="u-font-20 tent">
        当来料料检验合格完成后自动生成外购入库任务，通过APP执行入库任务完成入库，放入暂存区。
      </view>
      <view class="u-font-20">
        3.生产入库
      </view>
      <view class="u-font-20 tent">
        生产入库任务由手动触发，生产部门在PC端创建入库任务，将货物推至仓库，仓库人员通过任务核实实际入库信息，确认完成入库，并置于暂存区。
      </view>
      <view class="u-font-20">
        4.上架
      </view>
      <view class="u-font-20 tent">
        对暂存区的外购和生产入库的物料放入仓位，通过扫描库位二维码，物料二维码信息，数量完成上架
      </view>
      <view class="u-font-20">
        5.下架
      </view>
      <view class="u-font-20 tent">
        在出库前对物料进行下架操作，扫描库位，扫描物料信息，完成下架操作
      </view>
      <view class="u-font-20">
        6.生产出库
      </view>
      <view class="u-font-20 tent">
        ERP通过下发领料单，系统自动生产出库任务，物流人员根据出库信息，找到相应的物料，扫描二维码，如需拆包的重新打印二维码标签贴在领取物料包装上。
      </view>
      <view class="u-font-20">
        7.外部出库
      </view>
      <view class="u-font-20 tent">
        每日在PC端建立当天发货计划，完成后根据发货计划生成出库任务，任务以客户为单位。当客户所需物料全部如数出库后，任务关闭。到次日8点自动关闭全部任务，重新手动增加次日的发货计划。
      </view>
      <view class="u-font-20">
        8.盘库
      </view>
      <view class="u-font-20 tent">
        盘点任务由手动定期创建，在PC端创建盘点任务，可指定部分仓位信息。然后在APP端执行盘点任务，扫描库位，插入出系统内部存储的物料信息和数量，核实实际物料，不符的填充真实信息。关闭APP重新打开进入后，存储上次盘点记录，继续盘点。完成后在PC端可查看盘点结果详情。
      </view>
      <view class="u-font-20">
        9.移库
      </view>
      <view class="u-font-20 tent">
        移库操作可通过上架，下架完成移库操作，也将PC端建立移库任务，指定移入的库位，在APP端扫描物料和新库位信息，完成移库。
      </view>
      <view class="u-font-20">
        10.退库
      </view>
      <view class="u-font-20 tent">
        当生产部门完成生产指令后，有剩余的物料信息，在PC端建立退料任务。由物流部门确认实际收到退料信息，完成退料入库，并加入暂存区，随后通过上架完成放入仓位。
      </view>
      <view class="u-font-32" style="color: #000">
        分级审核
      </view>
      <view class="u-font-20 tent">
        在PC端建立分层审核项目，表单，计划，系统根据计划和审核人生成审核任务，在APP中执行分段审核任务，提交后，系统判断有不合格项目时，根据不合格项目自动生成问题整改数据，也可以手动在PC端提交整改问题信息。
      </view>
      <view class="u-font-20 tent">
        在PC端和APP都可查看问题信息，整改后，提交完成任务并上传整改后照片
      </view>
      <view class="u-font-32" style="color: #000">
        生产
      </view>
      <view class="u-font-20">
        1.领料
      </view>
      <view class="u-font-20 tent">
        生产物流人员可以查看当天的领料单信息，当任务状态为已出库时，到物流仓库确认领料单和实际物料信息，完成领料任务。
      </view>
      <view class="u-font-20">
        2.投料
      </view>
      <view class="u-font-20 tent">
        领料完成后，根据生产指令生成投料任务，扫描设备二维码和物料二维码，并输入投入数量，完成投料任务。
      </view>
      <view class="u-font-20">
        3.烘料
      </view>
      <view class="u-font-20 tent">
        投料完成后，开机烘料，根据实际情况取样检验率，如不合格，在APP上扫描设备，输入增加烘料时长。到达烘料时长后，大屏提示烘料完成请检验通知消息。
      </view>
      <view class="u-font-20">
        4.安排员工
      </view>
      <view class="u-font-20 tent">
        烘料完成后，领班调试机器并生产首件报检，检验合格后，由领班在APP中扫描设备，指定操作人员。
      </view>
      <view class="u-font-20">
        5.交接班
      </view>
      <view class="u-font-20 tent">
        每班下班时，领班需要通过APP完成下一班的交接任务，选择交际人，填写交接事项完成交接。
      </view>
      <view class="u-font-20">
        6.二次加工
      </view>
      <view class="u-font-20 tent">
        展示二次加工的生产计划，点击第一个生产指令开始生产，满箱后输入该箱数量打印二维码标签并粘贴，并生成一条数据。点击报检，自动生成入库检验任务。合格后，封箱。
      </view>
    </view>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>
<script>
import btns from '../components/btn/index'
export default {
  components: {
    btns
  },
  data() {
    return {
      machineForm: {
        account: '',
        pwd: ''
      }
    }
  },
  onLoad() {
    // #ifdef APP-PLUS
    // #endif
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.tent {
  text-indent: 40rpx;
  padding-top: 10rpx;
  line-height: 30rpx;
}
.worksty {
  width: 100vw;
  height: calc(100vh - 100px);
  .bacak {
    width: 100%;
    height: calc(100vh - 180rpx);
    background-image: url('/static/beijing-gongzuotai.png');
    background-position: top;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .u-grid-item {
      background: transparent !important;
    }
  }
  .grid-text {
    margin-top: 15rpx;
  }
}
</style>