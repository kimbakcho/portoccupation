<template>
  <q-page>
    <div style="min-height: inherit">
      <q-btn label="설비 추가" class="q-ma-md" @click="onEqpAdd">

      </q-btn>

      <q-table :columns="tableData.columns" :loading="tableData.loading" :rows="tableData.rows" class="q-ma-md">
        <template v-slot:body-cell-delete="props">
          <q-td class="text-right" @click="onDeleteEqp(props.row)">
            <q-btn icon="fas fa-trash" flat>

            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-portSetting="props">
          <q-td class="text-right">
            <q-btn icon="fas fa-cog" flat @click="portSettingDialog(props.row)">

            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import {QTableColumn, useQuasar} from 'quasar'
import EqpAddDialog from '@/components/PortSettingView/EqpAddDialog.vue'
import {onMounted, reactive} from "vue";
import type {EqpResDto} from "@/Bis/Eqp/Dto/EqpResDto";
import {EqpUseCase} from "@/Bis/Eqp/Domain/EqpUseCase";
import PortSettingDialog from "@/components/PortSettingView/PortSettingDialog.vue";
import type {PortResDto} from "@/Bis/Port/Dto/PortResDto";
const $q = useQuasar();

const tableData = reactive({
  loading: false,
  rows: [] as EqpResDto[],
  columns: [
    {
      name: "eqpId",
      label: "eqpId",
      field: "eqpId"
    },
    {
      name: "eqpName",
      label: "설비이름",
      field: "eqpName"
    },
    {
      name: "delete",
      label: "삭제",
      field: "delete"
    },
    {
      name: "portSetting",
      label: "포트설정",
      field: "portSetting"
    }
  ] as any[]
})
const eqpUseCase = new EqpUseCase();
async function eqpListLoad(){
  tableData.rows = await eqpUseCase.getList();
}
function portSettingDialog(props: PortResDto) {
  $q.dialog({
    component: PortSettingDialog,
    componentProps: {eqp: props}
  })
}
function onEqpAdd(){
  $q.dialog({
    component: EqpAddDialog
  }).onOk(async ()=>{
    tableData.loading = true;
    await eqpListLoad();
    tableData.loading = false;
  })
}
function onDeleteEqp(eqp: EqpResDto) {
  $q.dialog({
    message: "정말로 삭제 하시겠습니까?",
    ok: "삭제",
    cancel: true
  }).onOk(async ()=>{
    tableData.loading = true;
    await eqpUseCase.delete(eqp.eqpId);
    await eqpListLoad();
    tableData.loading = false;
  })
}
onMounted(()=>{
  eqpListLoad();
})

</script>

<style >
</style>
