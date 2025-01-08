<script setup>

import { useTodoList } from "../composables/useTodoList.js";
import TodoItem from "./TodoItem.vue";

const { items } = useTodoList();

</script>

<template>
  <ol v-for="(title, index) in items" :key="index">
    <todo-item :title :index />
  </ol>
</template>

<style scoped>

</style>