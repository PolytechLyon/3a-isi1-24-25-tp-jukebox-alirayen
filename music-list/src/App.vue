<template>
  <div class="audio-player-app">
    <header>
      <h1>Audio Player</h1>
      <button @click="showPlaylistManager = !showPlaylistManager">
        {{ showPlaylistManager ? 'Back to Player' : 'Manage Playlists' }}
      </button>
    </header>

    <div v-if="showPlaylistManager" class="playlist-manager">
      <h2>Manage Playlists</h2>
      <ul>
        <li v-for="(playlist, index) in playlists" :key="index">
          {{ playlist.name }} ({{ playlist.tracks.length }} tracks)
          <button @click="selectPlaylist(index)">Select</button>
          <button @click="deletePlaylist(index)" :disabled="selectedPlaylistIndex === index">Delete</button>
        </li>
      </ul>
      <form @submit.prevent="createPlaylist">
        <input v-model="newPlaylistName" placeholder="New Playlist Name" />
        <button type="submit">Create</button>
      </form>
    </div>

    <div v-else>
      <div class="controls">
        <p>Choose a track to start playing.</p>
        <fieldset class="repeat-options">
          <legend>Playback Options</legend>
          <label>
            <input type="radio" name="repeat" value="all" v-model="playbackMode"> Loop All
          </label>
          <label>
            <input type="radio" name="repeat" value="single" v-model="playbackMode"> Loop Current
          </label>
          <label>
            <input type="radio" name="repeat" value="off" v-model="playbackMode"> No Loop
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

      <section class="track-list">
        <h2>Track List</h2>
        <ul>
          <li v-for="(item, idx) in tracks" :key="idx" :class="{ active: playingIndex === idx, invalid: item.invalid }">
            {{ item.title }}
            <div class="actions">
              <button @click="startTrack(idx)" :disabled="item.invalid">Play</button>
              <button @click="removeTrack(idx)">Remove</button>
            </div>
          </li>
        </ul>
        <p v-if="tracks.length === 0">Your track list is empty. Add some tracks!</p>
      </section>

      <section class="add-track">
        <h2>Add a Track</h2>
        <form @submit.prevent="addNewTrack">
          <label for="input-type">Track Source:</label>
          <select id="input-type" v-model="sourceType">
            <option value="link">Via URL</option>
            <option value="upload">Upload File</option>
          </select>
          <input v-if="sourceType === 'link'" type="text" placeholder="Enter track URL (must end with .mp3)">
          <input v-if="sourceType === 'upload'" type="file" ref="fileUploader">
          <button type="submit">{{ sourceType === 'link' ? 'Add Link' : 'Upload Track' }}</button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const showPlaylistManager = ref(false);
const playlists = ref(JSON.parse(localStorage.getItem('playlists')) || []);
const selectedPlaylistIndex = ref(localStorage.getItem('selectedPlaylistIndex') || 0);
const tracks = ref(playlists.value[selectedPlaylistIndex.value]?.tracks || []);
const sourceType = ref('link');
const fileUploader = ref(null);
const audioInstance = ref(new Audio());
const playingIndex = ref(-1);
const playbackMode = ref('all');
const activeTrack = ref('');
const isPlaying = ref(false);
const currentTime = ref(0);
const totalDuration = ref(0);
const newPlaylistName = ref('');

const validateTrack = (track, index) => {
  const audio = new Audio();
  audio.onerror = () => { tracks.value[index].invalid = true; };
  audio.onloadedmetadata = () => { tracks.value[index].invalid = false; };
  audio.src = track.url;
};

const addNewTrack = () => {
  if (sourceType.value === 'link') {
    const urlInput = event.target.querySelector('input[type="text"]');
    const url = urlInput?.value.trim();
    if (url && url.endsWith('.mp3')) {
      const newTrack = { title: url.split('/').pop(), url, invalid: false };
      tracks.value.push(newTrack);
      validateTrack(newTrack, tracks.value.length - 1);
      urlInput.value = '';
      savePlaylists();
    } else {
      alert('Invalid URL. Please use a valid .mp3 link.');
    }
  } else if (sourceType.value === 'upload') {
    const file = fileUploader.value?.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      tracks.value.push({ title: file.name, url: fileURL, invalid: false });
    } else {
      alert('Please choose a valid audio file.');
    }
  }
};

const startTrack = (index) => {
  if (index >= 0 && index < tracks.value.length && !tracks.value[index].invalid) {
    playingIndex.value = index;
    activeTrack.value = tracks.value[index].title;
    audioInstance.value.src = tracks.value[index].url;
    audioInstance.value.play();
    isPlaying.value = true;
  }
};

const controlPlayback = () => {
  if (playingIndex.value === -1 && tracks.value.length > 0) {
    startTrack(0);
  } else {
    isPlaying.value ? audioInstance.value.pause() : audioInstance.value.play();
    isPlaying.value = !isPlaying.value;
  }
};

const removeTrack = (index) => {
  tracks.value.splice(index, 1);
  if (playingIndex.value === index) {
    audioInstance.value.pause();
    playingIndex.value = -1;
    activeTrack.value = '';
    isPlaying.value = false;
  }
  savePlaylists();
};

const adjustProgress = (event) => {
  const progressBar = event.target;
  const newPosition = event.offsetX / progressBar.offsetWidth;
  audioInstance.value.currentTime = newPosition * audioInstance.value.duration;
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const savePlaylists = () => {
  playlists.value[selectedPlaylistIndex.value].tracks = tracks.value;
  localStorage.setItem('playlists', JSON.stringify(playlists.value));
};

const createPlaylist = () => {
  if (newPlaylistName.value.trim()) {
    playlists.value.push({ name: newPlaylistName.value.trim(), tracks: [] });
    localStorage.setItem('playlists', JSON.stringify(playlists.value));
    newPlaylistName.value = '';
  }
};

const selectPlaylist = (index) => {
  selectedPlaylistIndex.value = index;
  localStorage.setItem('selectedPlaylistIndex', index);
  tracks.value = playlists.value[index].tracks;
  showPlaylistManager.value = false;
};

const deletePlaylist = (index) => {
  playlists.value.splice(index, 1);
  localStorage.setItem('playlists', JSON.stringify(playlists.value));
  if (selectedPlaylistIndex.value === index) {
    selectedPlaylistIndex.value = -1;
    localStorage.removeItem('selectedPlaylistIndex');
  }
};

onMounted(() => {
  audioInstance.value.addEventListener('timeupdate', () => {
    currentTime.value = audioInstance.value.currentTime;
    totalDuration.value = audioInstance.value.duration;
  });
  audioInstance.value.addEventListener('ended', () => {
    if (playbackMode.value === 'single') {
      audioInstance.value.currentTime = 0;
      audioInstance.value.play();
    } else if (playbackMode.value === 'all') {
      const nextTrack = (playingIndex.value + 1) % tracks.value.length;
      startTrack(nextTrack);
    } else {
      isPlaying.value = false;
    }
  });
});

watch(selectedPlaylistIndex, (newIndex) => {
  tracks.value = playlists.value[newIndex]?.tracks || [];
});
</script>

<style scoped>
.audio-player-app {
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  padding: 15px;
  border-radius: 8px;
  max-width: 700px;
  margin: auto;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

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
  border-radius: 4px;
  cursor: pointer;
}

.current-progress {
  height: 100%;
  background-color: #4caf50;
  width: 0;
}

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
  border-radius: 4px;
}

.track-list .active {
  font-weight: bold;
  color: #2196f3;
}

.track-list .invalid {
  text-decoration: line-through;
  color: #e57373;
}

button {
  padding: 8px 10px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #1976d2;
}
</style>