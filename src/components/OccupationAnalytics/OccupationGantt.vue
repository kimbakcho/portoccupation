<template>
  <div style="position: relative">
    <div>
      <q-slider :min="1" :max="25" v-model="chartItem.zoomValue" @change="chartItem.onZoomChange">

      </q-slider>
    </div>
    <div id="gantt">

    </div>
    <GanttElastic :options="options" :tasks="tasks" v-if="tasks.length > 0 && !chartData.loading">
      <template v-slot:header>
        <GanttElasticHeader2></GanttElasticHeader2>
      </template>
    </GanttElastic>

    <!--    <div class="gstc-wrapper" ref="gstcElement">-->

    <!--    </div>-->
    <div v-if="chartData.loading" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%)">
      <q-circular-progress indeterminate size="50px">

      </q-circular-progress>
    </div>
  </div>
</template>


<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {PortUseCase} from "@/Bis/Port/Domain/PortUseCase";

import {OccupationAnalyticsPortResDto} from "@/components/OccupationAnalytics/Dto/OccupationAnalyticsPortResDto";
import {OccupationSearch} from "@/components/OccupationAnalytics/Dto/OccupationSearch";
import {GanttElastic, GanttElasticHeader2} from "gantt-elastic-wrapvue3"
import "gantt-elastic-wrapvue3/dist/style.css"
import {DateTime} from "luxon";

defineExpose({
  loadChartItem,
})


const portUseCase = new PortUseCase();


const chartItem = reactive({
  zoomValue: 16,
  onZoomChange() {
    state.update('config.chart.time.zoom', (currentZoom: number) => {
      return chartItem.zoomValue
    })
  }
})
let chartData = reactive({
  loading: false
})
let options = reactive({
  locale: {
    name: 'ko',
    weekdays: '일_월_화_수_목_금_토'.split(
        '_'
    ),
    weekdaysShort: '일_월_화_수_목_금_토'.split('_'),
    weekdaysMin: '일_월_화_수_목_금_토'.split('_'),
    months: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split(
        '_'
    ),
    monthsShort: '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
    weekStart: 1
  },
  scope:{
    before: 0,
    after: 0,
  },
  times:{
    timeZoom: 4,
  },
  taskList: {
    columns: [
      {
        id: 1,
        label: '포트번호',
        value: 'portNumber',
        width: 80
      },
      {
        id: 2,
        label: '포트이름',
        value: 'portName',
        width: 200,
      },
    ]
  }
})
let tasks = ref<any[]>([
])


let state: any;

async function loadChartItem(resDto: OccupationAnalyticsPortResDto[], searchReqDto: OccupationSearch) {
  chartData.loading = true

  const taskItems = [] as any[];

  resDto.forEach(x => {
    let taskItem = {
      id: x.port.portNumber,
      portNumber: `${x.port.portNumber}`,
      portName: `${x.port.portName}`,
      type: 'multiple',
      subTask: [] as any[]
    }

    x.occupationTimeList.forEach(occ => {
      taskItem.subTask.push({
        id: `${x.port.portNumber}_${occ.startTime.toMillis()}`,
        start: occ.startTime.toMillis(),
        duration: occ.endTime.toMillis() - occ.startTime.toMillis(),
        type: "task",
        style: {}
      })
    })

    taskItems.push(taskItem)
  })
  tasks.value = taskItems;
  chartData.loading = false
}

function getDate(hours: any) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const timeStamp = new Date(`${currentYear}-${currentMonth}-${currentDay} 00:00:00`).getTime();
  return new Date(timeStamp + hours * 60 * 60 * 1000).getTime();
}

</script>

<style scope>
.gstc-wrapper {
  max-width: 1500px;
}
</style>
