<template>
    <div class="playlist-manager">
      <h2>Manage Playlists</h2>
      <ul>
        <li v-for="(playlist, index) in playlists" :key="index">
          {{ playlist.name }} ({{ playlist.tracks.length }} tracks)
          <button @click="selectPlaylist(index)">Select</button>
          <button @click="deletePlaylist(index)" :disabled="selectedPlaylistIndex === index">Delete</button>
        </li>
      </ul>
      <form @submit.prevent="createPlaylist">
        <input :value="newPlaylistName" @input="$emit('update:newPlaylistName', $event.target.value)" placeholder="New Playlist Name" />
        <button type="submit">Create</button>
      </form>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    playlists: Array,
    selectedPlaylistIndex: Number,
    newPlaylistName: String,
  });
  
  const emit = defineEmits(['selectPlaylist', 'deletePlaylist', 'createPlaylist', 'update:newPlaylistName']);
  
  const selectPlaylist = (index) => {
    emit('selectPlaylist', index);
  };
  
  const deletePlaylist = (index) => {
    emit('deletePlaylist', index);
  };
  
  const createPlaylist = () => {
    if (props.newPlaylistName.trim()) {
      emit('createPlaylist');
    }
  };
  </script>
  
  <style scoped>
  .playlist-manager {
    margin-top: 20px;
  }
  
  .playlist-manager h2 {
    font-size: 1.5em;
    margin-bottom: 10px;
  }
  
  .playlist-manager ul {
    list-style: none;
    padding: 0;
  }
  
  .playlist-manager li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    margin-bottom: 10px;
    padding: 8px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .playlist-manager button {
    padding: 8px 10px;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .playlist-manager button:hover {
    background-color: #1976d2;
  }
  
  .playlist-manager form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .playlist-manager input {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  </style>