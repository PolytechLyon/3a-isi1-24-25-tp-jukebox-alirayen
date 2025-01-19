<template>
    <div class="audio-player">
      <div class="controls">
        <p v-if="activeTrack">Playing: <strong>{{ activeTrack }}</strong></p>
        <button @click="controlPlayback">{{ isPlaying ? 'Pause' : 'Start' }}</button>
        <div class="timeline" @click="adjustProgress">
          <div class="current-progress" :style="{ width: `${(currentTime / totalDuration) * 100}%` }"></div>
        </div>
        <span>{{ formatTime(currentTime) }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    activeTrack: String,
    isPlaying: Boolean,
    currentTime: Number,
    totalDuration: Number,
  });
  
  const emit = defineEmits(['controlPlayback', 'adjustProgress']);
  
  const controlPlayback = () => {
    emit('controlPlayback');
  };
  
  const adjustProgress = (event) => {
    emit('adjustProgress', event);
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  </script>
  
  <style scoped>
  .audio-player {
    margin-bottom: 20px;
  }
  
  .controls {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .timeline {
    flex: 1;
    height: 8px;
    background-color: #ccc;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .current-progress {
    height: 100%;
    background-color: #007bff;
    width: 0;
  }
  </style>