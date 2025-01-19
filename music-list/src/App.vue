<template>
  <div class="audio-player-app">
    <header>
      <h1>Audio Player</h1>
      <button @click="showPlaylistManager = !showPlaylistManager">
        {{ showPlaylistManager ? 'Back to Player' : 'Manage Playlists' }}
      </button>
    </header>

    <PlaylistManager v-if="showPlaylistManager" 
                     :playlists="playlists" 
                     :selectedPlaylistIndex="selectedPlaylistIndex" 
                     @selectPlaylist="selectPlaylist" 
                     @deletePlaylist="deletePlaylist" 
                     @createPlaylist="createPlaylist" 
                     :newPlaylistName="newPlaylistName"
                     @update:newPlaylistName="newPlaylistName = $event" />

    <div v-else>
      <Controls :playbackMode="playbackMode" 
                :isPlaying="isPlaying" 
                :currentTime="currentTime" 
                :totalDuration="totalDuration" 
                @controlPlayback="controlPlayback" 
                @adjustProgress="adjustProgress" 
                :activeTrack="activeTrack"
                @update:playbackMode="playbackMode = $event" />

      <TrackList :tracks="tracks" 
                 :playingIndex="playingIndex" 
                 @startTrack="startTrack" 
                 @removeTrack="removeTrack" />

      <AddTrack :addNewTrack="addNewTrack" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import PlaylistManager from './components/PlaylistManager.vue';
import Controls from './components/Controls.vue';
import TrackList from './components/TrackList.vue';
import AddTrack from './components/AddTrack.vue';

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

const addNewTrack = ({ type, url, file }) => {
  if (type === 'link') {
    if (url && url.endsWith('.mp3')) {
      const newTrack = { title: url.split('/').pop(), url, invalid: false };
      tracks.value.push(newTrack);
      validateTrack(newTrack, tracks.value.length - 1);
      savePlaylists();
    } else {
      alert('Invalid URL. Please use a valid .mp3 link.');
    }
  } else if (type === 'upload') {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      const newTrack = { title: file.name, url: fileURL, invalid: false };
      tracks.value.push(newTrack);
      validateTrack(newTrack, tracks.value.length - 1);
      savePlaylists();
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

header {
  text-align: center;
  margin-bottom: 20px;
}

header h1 {
  font-size: 2em;
  margin: 0;
}

header button {
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  background-color: #2196f3;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

header button:hover {
  background-color: #1976d2;
}
</style>