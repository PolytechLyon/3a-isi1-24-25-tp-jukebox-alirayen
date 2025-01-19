<template>
    <section class="track-list">
      <h2>Track List</h2>
      <ul>
        <li v-for="(item, idx) in tracks" :key="idx" :class="{ active: playingIndex === idx, invalid: item.invalid }">
          {{ item.title }}
          <div class="actions">
            <button @click="$emit('startTrack', idx)" :disabled="item.invalid">Play</button>
            <button @click="$emit('removeTrack', idx)">Remove</button>
          </div>
        </li>
      </ul>
      <p v-if="tracks.length === 0">Your track list is empty. Add some tracks!</p>
    </section>
  </template>
  
  <script setup>
  const props = defineProps({
    tracks: Array,
    playingIndex: Number,
  });
  </script>
  
  <style scoped>
  .track-list ul {
    list-style: none;
    padding: 0;
  }
  
  .track-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    margin-bottom: 10px;
    padding: 8px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .track-list .active {
    font-weight: bold;
    color: #007bff;
  }
  
  .track-list .invalid {
    text-decoration: line-through;
    color: #e57373;
  }
  
  .track-list .actions button {
    padding: 8px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .track-list .actions button:hover {
    background-color: #0056b3;
  }
  </style>