<script setup>

import { useTodoList } from "../composables/useTodoList.js";
import { ref, useTemplateRef, watchEffect } from "vue";

const {
  confirmEdit,
  cancelEdit,
  editedTitle,
  isEditing,
} = useTodoList();

const title = ref('');
const input = useTemplateRef('input');

function confirmEditItem() {
  confirmEdit(title.value);
}

function cancelEditItem() {
  cancelEdit();
}

function confirmOnEnter(event) {
  event.key === 'Enter' && confirmEditItem();
}

watchEffect(() => {
  title.value = editedTitle.value;
  input.value?.focus();
});

</script>

<template>
  <div v-if="isEditing">
    <input v-model="title" @keyup="confirmOnEnter" ref="input"/>
    <button @click="confirmEditItem">Confirm</button>
    <button @click="cancelEditItem">Cancel</button>
  </div>
</template>

<style scoped>

</style>