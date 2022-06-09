<template>
  <q-page>
    <div style="min-height: inherit">
      <div class="q-ma-md row  items-center">
        <q-input :model-value="search.from" readonly dense label="검색 시작(08:00:00)" style="max-width: 90px">
          <q-popup-proxy>
            <q-date mask="YYYY-MM-DD" v-model="search.from">

            </q-date>
          </q-popup-proxy>
        </q-input>
        <div class="q-ma-md">
          ~
        </div>
        <q-input :model-value="search.to" readonly dense label="검색 종료(07:59:59)" style="max-width: 90px">
          <q-popup-proxy>
            <q-date mask="YYYY-MM-DD" v-model="search.to">

            </q-date>
          </q-popup-proxy>
        </q-input>
        <div class="q-ml-md" style="min-width: 100px">
          <q-select label="설비" dense autocomplete="eqpName"
                    clearable
                    v-model="search.selectEqp"
                    :options="search.eqpList" :loading="search.selectLoading"
                    option-label="eqpName" >

          </q-select>
        </div>
        <q-btn class="q-ml-md" icon="fas fa-search" flat :loading="search.loading" @click="search.searchClick">

        </q-btn>
      </div>
      <div class="q-ma-md text-h5">
        점유율 = {{occupationRatio}} %
      </div>
      <div class="q-ma-md">
        <OccupationGantt ref="gantt">

        </OccupationGantt>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import {onMounted, reactive, ref} from "vue";
import {DateTime} from "luxon";
import type {EqpResDto} from "@/Bis/Eqp/Dto/EqpResDto";
import {EqpUseCase} from "@/Bis/Eqp/Domain/EqpUseCase";
import OccupationGantt from "@/components/OccupationAnalytics/OccupationGantt.vue"
import EqpEventTrxUseCase from "@/Bis/EqpEventTrxUseCase/Domain/EqpEventTrxUseCase";
import {PortUseCase} from "@/Bis/Port/Domain/PortUseCase";
import {OccupationAnalyticsPortResDto} from "@/components/OccupationAnalytics/Dto/OccupationAnalyticsPortResDto";

const eqpUseCase = new EqpUseCase();
const gantt = ref<InstanceType<typeof OccupationGantt>|null>(null);

const eqpEventTrxUseCase = new EqpEventTrxUseCase();

const postUseCase = new PortUseCase();

const occupationRatio = ref("");

const search = reactive({
  from: DateTime.now().minus({day: 1}).toFormat("yyyy-MM-dd"),
  to: DateTime.now().toFormat("yyyy-MM-dd"),
  eqpList: [] as EqpResDto[],
  selectEqp: null as EqpResDto|null,
  selectLoading: false,
  loading: false,

  async searchClick(){
    search.loading = true;
    let portResDtos = await postUseCase.getEqpPort({
      eqpId: search.selectEqp!.eqpId
    });

    const ports = [] as OccupationAnalyticsPortResDto[];

    let searchStartTime = DateTime.fromFormat(`${search.from}T08:00:00`,"yyyy-MM-dd'T'HH:mm:ss")
    let searchEndTime = DateTime.fromFormat(`${search.to}T07:59:59`,"yyyy-MM-dd'T'HH:mm:ss")

    await Promise.all(portResDtos.map(async (port)=>{
      let eqpEventTrxPpResDtos = await eqpEventTrxUseCase.getEventList({
        moduleName: port.fdcModuleName,
        searchStartTime: searchStartTime.toFormat("yyyy-MM-dd'T'HH:mm:ss"),
        searchEndTime: searchEndTime.toFormat("yyyy-MM-dd'T'HH:mm:ss")
      });
      ports.push({
        port: port,
        eqpEventTrxPpResDtoList: eqpEventTrxPpResDtos,
        occupationTimeList: []
      })
    }))

    ports.sort((a, b) => {
      return a.port.portNumber - b.port.portNumber
    })

    let portOccupationSecs = searchEndTime.diff(searchStartTime,"seconds").seconds;
    let portOccupationSecsArray = Array(portOccupationSecs).fill(0)

    ports.forEach(port=>{
      let beforeStep = 0;
      let startFlag = false;
      let startTime = "";
      let eqpEventTrxPpResDtoList = port.eqpEventTrxPpResDtoList;
      for(let i=0;i<eqpEventTrxPpResDtoList.length;i++){
        let currentStep = eqpEventTrxPpResDtoList[i].stepId;
        if((currentStep == 1) && (beforeStep != 1)){
          startFlag = true;
          startTime = eqpEventTrxPpResDtoList[i].idxEqpEventTrxPpPk.eventDtts
        } else if( startFlag && currentStep == 3 ){
          const startDateTime = DateTime.fromFormat(startTime,"yyyy-MM-dd'T'HH:mm:ss.S");
          const endDateTime = DateTime.fromFormat(eqpEventTrxPpResDtoList[i].idxEqpEventTrxPpPk.eventDtts,"yyyy-MM-dd'T'HH:mm:ss.S");
          startFlag = false;
          startTime = "";
          port.occupationTimeList.push({
            startTime: startDateTime,
            endTime: endDateTime,
            durationSec : Math.round(endDateTime.diff(startDateTime,"seconds").seconds)
          })
          let offsetStart = Math.round(startDateTime.diff(searchStartTime,"seconds").seconds);
          let offsetEnd = Math.round(endDateTime.diff(searchStartTime,"seconds").seconds);
          for(let j=offsetStart;j<=offsetEnd;j++){
            portOccupationSecsArray[j] = portOccupationSecsArray[j]+1
          }
        } else if(startFlag && currentStep == 0){
          startFlag = false;
          startTime = "";
        }
        beforeStep = currentStep;
      }
    })

    let totalOccupationSec = 0
    portOccupationSecsArray.forEach(x=>{
      totalOccupationSec += x
    });

    let totalAllTotalOccupationSec = portOccupationSecs * portResDtos.length

    occupationRatio.value = ((totalOccupationSec/totalAllTotalOccupationSec)*100).toFixed(2)

    gantt.value!.loadChartItem(ports,{
      from: searchStartTime,
      to: searchEndTime
    })

    search.loading = false;
  }
})

function isNotRunStep(){

}

onMounted(async ()=>{
  console.log("search");
  search.selectLoading = true;
  let eqpResDtos = await eqpUseCase.getList();
  search.eqpList = eqpResDtos;
  if(eqpResDtos.length > 0){
    search.selectEqp = eqpResDtos[0]
  }
  search.selectLoading = false;
})


</script>

<style>
</style>
