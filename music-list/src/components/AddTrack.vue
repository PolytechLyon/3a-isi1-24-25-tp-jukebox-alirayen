<template>
    <section class="add-track">
      <h2>Add a Track</h2>
      <form @submit.prevent="handleAddNewTrack">
        <label for="input-type">Track Source:</label>
        <select id="input-type" v-model="sourceType">
          <option value="link">Via URL</option>
          <option value="upload">Upload File</option>
        </select>
        <input v-if="sourceType === 'link'" type="text" v-model="trackUrl" placeholder="Enter track URL (must end with .mp3)" />
        <input v-if="sourceType === 'upload'" type="file" ref="fileUploader" />
        <button type="submit">{{ sourceType === 'link' ? 'Add Link' : 'Upload Track' }}</button>
      </form>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    addNewTrack: Function,
  });
  
  const sourceType = ref('link');
  const trackUrl = ref('');
  const fileUploader = ref(null);
  
  const handleAddNewTrack = () => {
    if (sourceType.value === 'link') {
      const url = trackUrl.value.trim();
      if (url && url.endsWith('.mp3')) {
        props.addNewTrack({ type: 'link', url });
        trackUrl.value = '';
      } else {
        alert('Invalid URL. Please use a valid .mp3 link.');
      }
    } else if (sourceType.value === 'upload') {
      const file = fileUploader.value?.files[0];
      if (file) {
        props.addNewTrack({ type: 'upload', file });
      } else {
        alert('Please choose a valid audio file.');
      }
    }
  };
  </script>
  
  <style scoped>
  .add-track {
    margin-top: 20px;
  }
  
  .add-track h2 {
    font-size: 1.5em;
    margin-bottom: 10px;
    color: var(--text-color);
  }
  
  .add-track form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .add-track label {
    font-weight: bold;
  }
  
  .add-track select,
  .add-track input[type="text"],
  .add-track input[type="file"],
  .add-track button {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .add-track button {
    background-color: #2196f3;
    color: white;
    cursor: pointer;
  }
  
  .add-track button:hover {
    background-color: #1976d2;
  }
  </style>