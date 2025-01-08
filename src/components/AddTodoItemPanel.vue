<script setup>

import { useTodoList } from "../composables/useTodoList.js";
import { ref, useTemplateRef, watchEffect } from "vue";

const title = ref('');
const input = useTemplateRef('input');
const {
  add,
  isEditing,
} = useTodoList();

function addTodoItem() {
  add(title.value);
  title.value = '';
}

function addOnEnter(event) {
  event.key === 'Enter' && addTodoItem();
}

watchEffect(() => {
  if (!isEditing.value) {
    input.value?.focus();
  }
});

</script>

<template>
  <div v-if="!isEditing">
    <input placeholder="Add a new todo item" @keyup="addOnEnter" v-model="title" ref="input"/>
    <button @click="addTodoItem">Add</button>
  </div>
</template>

<style scoped>

</style>