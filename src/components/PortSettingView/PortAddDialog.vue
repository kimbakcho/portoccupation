<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-input v-model="portInfo.name" label="포트이름" class="q-ma-md">

      </q-input>
      <q-input v-model="portInfo.number" label="포트번호" class="q-ma-md" type="number">

      </q-input>
      <q-input v-model="portInfo.fdcModuleName" label="fdc 모듈 이름" class="q-ma-md">

      </q-input>
      <q-card-actions align="right">
        <q-btn color="primary" label="추가" @click="onOKClick" :loading="portInfo.loading"/>
        <q-btn color="primary" label="취소" @click="onDialogCancel"/>
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {useDialogPluginComponent, useQuasar} from "quasar";
import {PropType, reactive} from "vue";
import type {EqpResDto} from "@/Bis/Eqp/Dto/EqpResDto";
import {PortUseCase} from "@/Bis/Port/Domain/PortUseCase";

const props = defineProps({
  eqp: {type: Object as PropType<EqpResDto>, required: true},
})

defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const portUseCase = new PortUseCase();

async function onOKClick() {
  portInfo.loading = true;
  await portUseCase.save({
    eqpId: props.eqp.eqpId,
    portName: portInfo.name,
    portNumber: portInfo.number,
    fdcModuleName: portInfo.fdcModuleName
  })
  portInfo.loading = false;
  onDialogOK();
}
const portInfo = reactive({
  loading: false,
  name: "" as string,
  number: 0 as number,
  fdcModuleName: "" as string
})

</script>

<style >
</style>
