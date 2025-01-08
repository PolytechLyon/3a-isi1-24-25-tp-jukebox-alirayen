<script setup>

import { useTodoList } from "../composables/useTodoList.js";

const props = defineProps({
  title: String,
  index: Number,
});

const {
  remove,
  beginEdit,
} = useTodoList();

function removeItem() {
  remove(props.index);
}

function editItem() {
  beginEdit(props.index);
}

</script>

<template>
  <li>
    <span>{{ props.title }}</span>
    <button @click="removeItem">delete</button>
    <button @click="editItem">edit</button>
  </li>
</template>

<style scoped>
span {
  display: inline-block;
  width: 15em;
}

button {
  width: 4em;
  margin: 2px;
}
</style>