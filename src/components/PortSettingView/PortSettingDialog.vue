<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <div class="text-center text-h5 q-mt-md">
        {{ eqp.eqpName }}
      </div>
      <div class="q-ma-md">
        <q-btn label="포트추가" @click="portAdd">

        </q-btn>
      </div>
      <q-table :columns="tableData.columns" :rows="tableData.rows" class="q-ma-md" :loading="tableData.loading">
        <template v-slot:body-cell-delete="props">
          <q-td class="text-right">
            <q-btn flat icon="fas fa-trash" @click="deletePort(props.row)">

            </q-btn>
          </q-td>

        </template>
      </q-table>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">

import {QTableColumn, useDialogPluginComponent, useQuasar} from "quasar";
import {onMounted, PropType, reactive} from "vue";
import type {EqpResDto} from "@/Bis/Eqp/Dto/EqpResDto";
import {PortUseCase} from "@/Bis/Port/Domain/PortUseCase";
import type {PortResDto} from "@/Bis/Port/Dto/PortResDto";
import PortAddDialog from "@/components/PortSettingView/PortAddDialog.vue"

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
defineEmits([
  ...useDialogPluginComponent.emits
])

const props = defineProps({
  eqp: {type: Object as PropType<EqpResDto>, required: true},
})

let portUseCase = new PortUseCase();

onMounted(() => {
  loadPortInfo();
})

const tableData = reactive({
  loading: false,
  rows: [] as PortResDto[],
  columns: [
    {
      name: "portName",
      field: "portName",
      label: "포트 이름"
    },
    {
      name: "portNumber",
      field: "portNumber",
      label: "포트 번호"
    },
    {
      name: "fdcModuleName",
      field: "fdcModuleName",
      label: "fdc 모듈 이름"
    },
    {
      name: "delete",
      field: "delete",
      label: "삭제"
    }
  ] as any[]
})

function deletePort(port: PortResDto) {
  $q.dialog({
    message: "정말로 삭제 하시겠습니까?",
    ok: "삭제",
    cancel: true
  }).onOk(async ()=>{
    tableData.loading = true;
    await portUseCase.delete(port.idx);
    await loadPortInfo();
    tableData.loading = false;
  })
}

async function loadPortInfo() {
  tableData.rows = await portUseCase.getEqpPort({
    eqpId: props.eqp.eqpId
  });
}

const $q = useQuasar();

function portAdd() {
  $q.dialog({
    component: PortAddDialog,
    componentProps: {
      eqp: props.eqp
    }
  }).onOk(async()=>{
    tableData.loading = true;
    await loadPortInfo();
    tableData.loading = false;
  })
}


</script>

<style>
</style>
