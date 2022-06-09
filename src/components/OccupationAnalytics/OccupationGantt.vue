<template>
  <div style="position: relative">
    <div>
      <q-slider :min="1" :max="25" v-model="chartItem.zoomValue" @change="chartItem.onZoomChange">

      </q-slider>
    </div>
    <div class="gstc-wrapper" ref="gstcElement">

    </div>
    <div v-if="chartData.loading" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%)">
      <q-circular-progress indeterminate size="50px">

      </q-circular-progress>
    </div>
  </div>
</template>

<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {Plugin as ProgressBar} from "gantt-schedule-timeline-calendar/dist/plugins/progress-bar.esm.min.js"
import GSTC, {Config} from "gantt-schedule-timeline-calendar";
import type {OccupationGanttReqDto} from "@/components/OccupationAnalytics/Dto/OccupationGanttReqDto";
import {PortUseCase} from "@/Bis/Port/Domain/PortUseCase";
import "gantt-schedule-timeline-calendar/dist/style.css";
import {DateTime} from "luxon";
import {OccupationAnalyticsPortResDto} from "@/components/OccupationAnalytics/Dto/OccupationAnalyticsPortResDto";
import {OccupationSearch} from "@/components/OccupationAnalytics/Dto/OccupationSearch";

defineExpose({
  loadChartItem,
})

onMounted(() => {
  initGstc()
})

const portUseCase = new PortUseCase();

let gstcElement = ref(null);

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
let gstc;
let state: any;

function initGstc() {
  const gstcConfig = {
    licenseKey:
        "====BEGIN LICENSE KEY====\\nlOsvQU8RVa5suO1D3727f3Fg1askrU0g6SWcmqA9ZkLLMmwuvZajWk08vVMAgiIgxH2KE9R+Fs7eJ+bJrAssi9SogZXIugArWPNx4VSpSF2KvrnvIZrbRwvk+zxW+diSuDBG7wPu/ccLYdgh2ATDhYTOyk07igC40jPpTeCPHo1UkzjB9gmwGUTgdKymVJy7eA/ii9f5/iDYDyLpujZVrbIxhoXZYqueIcaHnOEqrQxDYz3uHmVFtKsSTkhxCiwlaqnqiFlvBsmXSLOK1UD9GCUngTmqgZoBE6zLDnEi1GbPo4isHjgjXQU6T14i5Ia4sVHO6a7/PmGS/GqVUK0zNw==||U2FsdGVkX1/s8uPeYWsfDKLd45t4ahxiV+4pSP+sxEF2JUYwIUZBZ1btes+HetXgnZ+lyLC08DxzE5fi3yrBq9j+LvZHHzQVcKFEc0ftPC8=\\nQ5trV2Rljn9vZ20eZdPFdQ4xrOpGn1OOX8suR/zJIBIA4FvZKz5uqLmb7iAWgRpbilynLs3YMn8dAV1Gf+Fjdvc4hE7Frygq8AQTfSr1VYQv0WcmKsB06G8ZS+Y1pkWuzJIptpacWt7xMNTijdGj4Kp1EvnRYXs6fP7pMBPaYTNenwlFR9vI10uXg9uFL4TXsiuSBbhbddaagcIZBj8AFHMZFMZUkKbPL3gooI/jMvSsnDD542po+3i4G1cQNn/jIsII2F42s8CFuUmpcWq9/uOISjF7Ab+5EowztnpA/mo1VEpQBtFhgSHOV2tWIxqLvaDg77nInZen8+eP7qRn7Q==\\n====END LICENSE KEY====",
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
      weekStart: 1,
    },
    list: {
      columns: {
        data: {
          [GSTC.api.GSTCID("id")]: {
            id: GSTC.api.GSTCID("id"),
            width: 150,
            data: ({row}) => {
              return row.port.portName
            },
            header: {
              content: "portName"
            }
          }
        }
      },
      rows: {},
    },
    chart: {
      items: {},
      time: {
        zoom: 16
      }
    },
  } as Config
  state = GSTC.api.stateFromConfig(gstcConfig);
  gstc = GSTC({
    element: gstcElement.value!,
    state
  })
}

async function loadChartItem(resDto: OccupationAnalyticsPortResDto[],searchReqDto: OccupationSearch) {
  chartData.loading = true

  const rows = {} as any;
  const ganttItem = {} as any;

  resDto.forEach(x => {
    const pPortName = GSTC.api.GSTCID(`${x.port.portName}`)
    rows[pPortName] = {
      id: pPortName,
      ...x
    }
    x.occupationTimeList.forEach(occ=>{
      let gantId = `${x.port.portName} ${occ.startTime.toFormat("yyyyMMddHHmmss")}`;
      ganttItem[gantId] = {
        id: gantId,
        rowId: pPortName,
        label: `${occ.startTime.toFormat("HH:mm:ss")}~${occ.endTime.toFormat("HH:mm:ss")}`,
        time: {
          start: occ.startTime.toMillis(),
          end: occ.endTime.toMillis()
        }
      }
    })

  })


  state.update('config.list.rows', (tempRow: any) => {
    return rows
  });
  state.update('config.chart.items', (tempItems: any) => {
    return ganttItem
  });
  state.update('config.chart.time.from', (fromDate: any)=>{
    return searchReqDto.from.toMillis()
  })
  state.update('config.chart.time.to', (fromDate: any)=>{
    return searchReqDto.to.toMillis()
  })
  chartData.loading = false
}
</script>

<style scope>
.gstc-wrapper{
  max-width: 1500px;
}
</style>
