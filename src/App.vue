<template>
  <div class="app-shell">
    <header class="topbar">
      <h1>Horse Racing</h1>
      <Controls />
    </header>

    <main class="main-grid">
      <section class="panel horse-panel">
        <HorseList />
      </section>
      <section class="panel track-panel">
        <RaceTrack />
      </section>
      <section class="panel side-panel">
        <div class="side-block">
          <RoundProgram />
        </div>
        <div class="side-block">
          <RaceResults />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import Controls from './components/Controls.vue';
import HorseList from './components/HorseList.vue';
import RaceTrack from './components/RaceTrack.vue';
import RoundProgram from './components/RoundProgram.vue';
import RaceResults from './components/RaceResults.vue';

export default {
  name: 'App',
  components: {
    Controls,
    HorseList,
    RaceTrack,
    RoundProgram,
    RaceResults,
  },
};
</script>

<style scoped>
.topbar {
  background: #d0746f;
  color: #1f2937;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid #9a5d58;
}

h1 {
  font-size: 22px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.main-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 3fr 6fr 3fr;
  gap: 10px;
}

.panel {
  border: 1px solid #9a9a9a;
  background: #f1f1f1;
  padding: 8px;
  height: calc(100vh - 140px);
  overflow: visible;
}

.horse-panel {
  background: #ffffff;
}

.track-panel {
  background: #d6d6d6;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: visible;
}

.side-block {
  background: #ffffff;
  border: 1px solid #9a9a9a;
  flex: 1;
  min-height: 0;
  padding: 0;
  overflow: auto;
}
</style>
