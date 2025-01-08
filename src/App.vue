<script setup>
import TodoList from "./components/TodoList.vue";
import AddTodoItemPanel from "./components/AddTodoItemPanel.vue";
import EditTodoItemPanel from "./components/EditTodoItemPanel.vue";
</script>

<template>
  <h1>Todo List</h1>
  <todo-list />
  <add-todo-item-panel />
  <edit-todo-item-panel />
</template>

<style scoped>

</style>
