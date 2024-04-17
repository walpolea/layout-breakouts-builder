<template>
  <div class="lb-editor">

    <div class="previews">
      <div class="preview-area page-layout">
        <h3 style="text-align:center;">Desktop / Full View</h3>
        <div class="preview-content" v-for="track in tracks" :class="{[track.trackName]:true}">
          <strong>{{ track.trackName.toUpperCase() }} TRACK</strong> 
          <span> ({{track.maxWidth}})</span>
        </div>
        <div class="preview-content default-content">Default content will sit in the <strong>{{ defaultTrack.toUpperCase() }}</strong> track.</div>
      </div>
      
      <div class="preview-area-mobile">
        <div class="page-layout" >
          <h3 style="text-align:center;">Responsive / Mobile View</h3>
          <div class="preview-content" v-for="track in tracks" :class="{[track.trackName]:true}">
            <strong>{{ track.trackName.toUpperCase() }} TRACK</strong> 
            <span> ({{track.maxWidth}})</span>
          </div>
          <div class="preview-content default-content">Default content will sit in the <strong>{{ defaultTrack.toUpperCase() }}</strong> track.</div>
        </div>
      </div>
    </div>
      
    <div class="configurator">
      <p>Configure your layout breakouts! Tracks are ordered from outermost to innermost. The outermost track will always span full width. It's important that track maximum widths should decrease as you move inward.</p>

      <div>
        <label for="minimumContentPadding">
          Minimum Content Padding (Default inline spacing between content and track edges):<br>
          <input type="text" id="minimumContentPadding" v-model="minimumContentPadding">
        </label>
      </div>

      <ul class="track-definitions" role="list">
        <li v-for="(track,i) in tracks" class="track-def">
          <label>
            <span style="min-width:130px;display:inline-block;">{{i === 0 ? "Outer Track" : i === tracks.length-1 ? "Inner Track" : "Middle Track"}}:</span>
            <input type="text" v-model="track.trackName">
          </label>

          <label>
            <template v-if="i === 0">
              <span style="max-width:374px;width:100%;display:inline-block;text-align: center;">Outer track is always <strong>1fr</strong></span>
            </template>
            <template v-else>
              Max Width:
              <input type="text" v-model="track.maxWidth">
            </template>
          </label>

          <button class="remove-track-btn" @click="removeTrack(track)">Delete Track</button>

          <span class="ordering-buttons">
            <button class="move-up-btn" @click="moveTrackUp(track)">Up</button>
            <button class="move-down-btn"@click="moveTrackDown(track);">Down</button>
          </span>

          <label>
            <input type="radio" name="defaultTrack" :value="track.trackName" v-model="defaultTrack">
            Default Track
          </label>
        </li>
      </ul>
        
        <div class="new-track">
          <label>
            Add a new track: 
            <input type="text" id="newTrackName" v-model="newTrackName" placeholder="Track Name" @keyup.enter="addTrack()" />
          </label>
          <button class="add-track-btn" @click="addTrack()" >Add</button>
        </div>
      </div>
    

    <div class="code-area">
      <button title="Copy CSS" class="copy-code-btn" @click="copy( lb.generateCSS() )">&lt;/&gt;</button>
      <code>
        <pre>{{ lb.generateCSS() }}</pre>
      </code>
    </div>

    
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { LayoutBreakout } from '../scripts/layoutbreakouts';
import { useClipboard } from '@vueuse/core';

const { text, copy, copied, isSupported } = useClipboard();


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
      maxWidth: tracks.value[tracks.value.length - 1].maxWidth
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
    const temp = tracks.value[index].trackName;
    tracks.value[index].trackName = tracks.value[index - 1].trackName;
    tracks.value[index - 1].trackName = temp;
  }
}

function moveTrackDown(track) {
  const index = tracks.value.indexOf(track);
  if (index < tracks.value.length - 1) {
    const temp = tracks.value[index].trackName;
    tracks.value[index].trackName = tracks.value[index + 1].trackName;
    tracks.value[index + 1].trackName = temp;
  }
}

onMounted( () => {
  minimumContentPadding.value = '2rem';
});

</script>

<style lang='scss'>

.configurator {
  padding:2rem;

  input[type="text"] {
    margin: 0 0.5rem 0 0;
    font-size: 1rem;
    font-weight:bold;
  }

  button {
    margin: 0 0.2rem;
    padding: 0.12rem 1rem;
    font-size: 0.75rem;
  }

  .track-definitions {
    list-style-type: none;
    padding: 0;
  }

  .track-def {
    
    & + .track-def {
      margin-top: 0.5rem;
    }
  }
}

.previews {
  display:grid;
  justify-items:center;
  width:100%;
}

.preview-area {
  margin-block: 2rem;
  width:100%;
}

.preview-area-mobile {
  width:380px;
  overflow:auto;
  border: 8px solid #d5d5d5;
  resize:horizontal;
}

.preview-content {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 10px;
}

.code-area {
  position:relative;
  background:Black;
  color:White;
  
  pre {
    padding:40px 40px;
    overflow:auto;
  }
}

.default-content {
  background-color: papayawhip;
  text-align:center;
}

.copy-code-btn {
  position:absolute;
  top:15px;
  right:15px;
  width:40px;
  height:40px;
  background:MidnightBlue;
  color:papayawhip;
  font-weight:bold;
  font-family: 'Courier New', Courier, monospace;
  border-radius:4px;
  border: 2px solid papayawhip;
  cursor:pointer;

  &:hover, &:active {
    background: papayawhip;
    color: midnightblue;
    border-color: midnightblue;
  }
}

</style>