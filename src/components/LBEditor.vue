<template>
  <div class="lb-editor">

    <div class="preview-area page-layout">
      <div class="preview-content" v-for="track in tracks" :class="{[track.trackName]:true}">{{ track.trackName.toUpperCase() }} TRACK</div>
      <div class="preview-content default-content">Default content will sit here</div>
    </div>

    <div class="configurator">
      <p>Configure your layout breakouts! Tracks are ordered from outermost to innermost. The outermost track will always span full width. It's important that track maximum widths should decrease as you move in.</p>

      <div>
        <label for="minimumContentPadding">
          Minimum Content Padding:
          <input type="text" id="minimumContentPadding" v-model="minimumContentPadding">
        </label>
      </div>

      <ul class="track-definitions">
        <li v-for="track in tracks" class="track-def">
          <label>
            Track Name:
            <input type="text" v-model="track.trackName">
          </label>

          <label>
            Max Width:
            <input type="text" v-model="track.maxWidth">
          </label>

          <label>
            <input type="radio" name="defaultTrack" :value="track.trackName" v-model="defaultTrack">
            is Default Track
          </label>

          <button class="remove-track-btn" @click="removeTrack(track)">Delete Track</button>

          <span class="ordering-buttons">
            <button class="move-up-btn" @click="moveTrackUp(track)">Up</button>
            <button class="move-down-btn"@click="moveTrackDown(track);">Down</button>
          </span>
        </li>
      </ul>
        
        <div class="new-track">
          <label>
            Add a new track: 
            <input type="text" id="newTrackName" v-model="newTrackName" placeholder="Track Name" />
          </label>
          <button class="add-track-btn" @click="addTrack()">Add</button>
        </div>
      </div>
    

    <div class="code-area">
      <code>
        <pre>
          {{ lb.generateCSS() }}
        </pre>
      </code>
    </div>

    
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { LayoutBreakout } from '../scripts/layoutbreakouts';



const minimumContentPadding = ref('0px');
const tracks = ref([
  {
    trackName: 'full',
    maxWidth: '1fr',
  },
  {
    trackName: 'popout',
    maxWidth: '1400px'
  },
  {
    trackName: 'content',
    maxWidth: '1060px'
  },
  {
    trackName: 'inset-content',
    maxWidth: '840px'
  }
]);
const defaultTrack = ref('content');

const sheet = new CSSStyleSheet();
document.adoptedStyleSheets = [sheet];

const lb = computed( () => {
  return new LayoutBreakout( minimumContentPadding.value, tracks.value, defaultTrack.value );
});

watch( lb, () => {
  sheet.replaceSync( `${lb.value.generateCSS()}` );
});


const newTrackName = ref('');

function addTrack() {
  if (newTrackName.value) {
    tracks.value.push({
      trackName: newTrackName.value,
      maxWidth: '1fr'
    });
    newTrackName.value = '';
  }
}

function removeTrack(track) {
  const index = tracks.value.indexOf(track);
  tracks.value.splice(index, 1);
}

function moveTrackUp(track) {
  const index = tracks.value.indexOf(track);
  if (index > 0) {
    const temp = tracks.value[index];
    tracks.value[index] = tracks.value[index - 1];
    tracks.value[index - 1] = temp;
  }
}

function moveTrackDown(track) {
  const index = tracks.value.indexOf(track);
  if (index < tracks.value.length - 1) {
    const temp = tracks.value[index];
    tracks.value[index] = tracks.value[index + 1];
    tracks.value[index + 1] = temp;
  }
}

onMounted( () => {
  minimumContentPadding.value = '20px';
});

</script>

<style lang='scss'>

.configurator {
  padding:2rem;
}

.preview-area {
  margin-block: 2rem;
}

.preview-content {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 10px;
}

.code-area {
  background:Black;
  color:White;
  padding:40px;
}

</style>