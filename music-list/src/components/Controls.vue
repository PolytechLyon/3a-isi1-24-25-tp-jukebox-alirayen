<template>
    <div class="controls">
      <p>Choose a track to start playing.</p>
      <fieldset class="repeat-options">
        <legend>Playback Options</legend>
        <label>
          <input type="radio" name="repeat" value="all" :checked="playbackMode === 'all'" @change="$emit('update:playbackMode', 'all')"> Loop All
        </label>
        <label>
          <input type="radio" name="repeat" value="single" :checked="playbackMode === 'single'" @change="$emit('update:playbackMode', 'single')"> Loop Current
        </label>
        <label>
          <input type="radio" name="repeat" value="off" :checked="playbackMode === 'off'" @change="$emit('update:playbackMode', 'off')"> No Loop
        </label>
      </fieldset>
      <div v-if="activeTrack" class="now-playing">
        <p>Playing: <strong>{{ activeTrack }}</strong></p>
      </div>
      <div class="player-buttons">
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
    playbackMode: String,
    isPlaying: Boolean,
    currentTime: Number,
    totalDuration: Number,
    activeTrack: String,
  });
  
  const emit = defineEmits(['update:playbackMode', 'controlPlayback', 'adjustProgress']);
  
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
  .controls {
    margin-bottom: 20px;
  }
  
  .player-buttons {
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