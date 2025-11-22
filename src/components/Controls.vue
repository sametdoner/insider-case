<template>
  <div class="controls">
    <button
      class="primary"
      type="button"
      :disabled="isRaceRunning"
      @click="handleGenerate"
    >
      {{ generateLabel }}
    </button>
    <button
      class="secondary"
      type="button"
      :disabled="startDisabled"
      @click="handleStart"
    >
      Start Race
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Controls',
  computed: {
    ...mapGetters('ui', ['isProgramGenerated', 'isRaceRunning']),
    generateLabel() {
      return this.isProgramGenerated ? 'Regenerate Program' : 'Generate Program';
    },
    startDisabled() {
      return !this.isProgramGenerated || this.isRaceRunning;
    },
  },
  methods: {
    ...mapActions(['generateProgram', 'startRaces']),
    handleGenerate() {
      this.generateProgram();
    },
    handleStart() {
      this.startRaces();
    },
  },
};
</script>

<style scoped>
.controls {
  display: flex;
  gap: 10px;
}

button {
  border: 1px solid #555;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;
  background: linear-gradient(180deg, #e4e4e4, #cfcfcf);
  color: #1f2937;
}

button:active {
  transform: translateY(1px);
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  box-shadow: none;
}

.primary {
  background: linear-gradient(180deg, #e4e4e4, #cfcfcf);
}

.secondary {
  background: linear-gradient(180deg, #e4e4e4, #cfcfcf);
}
</style>
