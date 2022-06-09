<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-input label="설비 ID" v-model="eqpData.id" class="q-ml-md q-mr-md">

      </q-input>
      <q-input label="설비 이름" v-model="eqpData.name" class="q-ml-md  q-mr-md">

      </q-input>

      <q-card-actions align="right">
        <q-btn color="primary" label="추가" @click="onOKClick" :loading="eqpData.loading"/>
        <q-btn color="primary" label="취소" @click="onDialogCancel"/>
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {EqpUseCase} from "@/Bis/Eqp/Domain/EqpUseCase";
import {reactive} from "vue";

defineEmits([
  ...useDialogPluginComponent.emits
])
const $q = useQuasar();
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

async function onOKClick() {
  let eqpUseCase = new EqpUseCase();

  if (eqpData.id && eqpData.name) {
    eqpData.loading = true;
    await eqpUseCase.save({
      eqpId: eqpData.id,
      eqpName: eqpData.name,
    })
    eqpData.loading = false;
    onDialogOK()
  } else {
    $q.dialog({
      message: "빈공간을 채워주세요"
    })
  }

}

const eqpData = reactive({
  id: "" as string,
  name: "" as string,
  loading: false
})

</script>

<style>
</style>
