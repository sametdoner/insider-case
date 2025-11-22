<template>
  <div class="section">
    <header class="section-header">
      <h2>Race Track</h2>
      <p class="hint">Follow horses on the track; 10 lanes per round.</p>
    </header>
    <div v-if="!hasProgram" class="placeholder">Generate and start races to see the track.</div>

    <div v-else class="track-wrapper">
      <div class="lane-header">Lane</div>
      <div class="track">
        <div class="finish-line">
          <span>FINISH</span>
        </div>
        <div class="lanes" :key="activeRound && activeRound.id">
          <div v-for="lane in laneRows" :key="lane.number" class="lane">
            <div class="lane-number">{{ lane.number }}</div>
            <div class="lane-body">
              <div class="lane-dash" />
              <div
                v-if="lane.horse"
                class="horse-icon"
                :style="horseStyle(lane.progress, lane.duration)"
              >
                🐎
              </div>
            </div>
          </div>
          <div class="lap-label">{{ lapLabel }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RaceTrack',
  computed: {
    ...mapGetters('races', ['rounds', 'progressByRound']),
    ...mapGetters('ui', ['currentRoundIndex']),
    ...mapGetters('horses', { horseById: 'byId' }),
    hasProgram() {
      return this.rounds.length > 0;
    },
    activeRoundIndex() {
      return Math.min(this.currentRoundIndex || 0, this.rounds.length - 1);
    },
    activeRound() {
      return this.rounds[this.activeRoundIndex] || null;
    },
    activeProgress() {
      if (!this.activeRound) return {};
      return this.progressByRound[this.activeRound.id] || {};
    },
    laneRows() {
      const laneCount = 10;
      const horses = this.activeRound ? this.activeRound.horses : [];

      return Array.from({ length: laneCount }, (_, idx) => {
        const horseId = horses[idx];
        const horse = horseId ? this.horseById(horseId) : null;
        const progressEntry = horse
          ? this.activeProgress[horseId] || { progress: 0, duration: 800 }
          : { progress: 0, duration: 800 };

        return {
          number: idx + 1,
          horse,
          progress: progressEntry.progress || 0,
          duration: progressEntry.duration || 800,
        };
      });
    },
    lapLabel() {
      if (!this.activeRound) return 'Awaiting start';
      const lap = this.activeRoundIndex + 1;
      const suffix = this.ordinalSuffix(lap);
      return `${lap}${suffix} Lap - ${this.activeRound.distance}m`;
    },
  },
  methods: {
    ordinalSuffix(n) {
      const j = n % 10;
      const k = n % 100;
      if (j === 1 && k !== 11) return 'st';
      if (j === 2 && k !== 12) return 'nd';
      if (j === 3 && k !== 13) return 'rd';
      return 'th';
    },
    horseStyle(progress = 0, duration = 800) {
      const clamped = Math.min(100, Math.max(0, progress));
      return {
        left: `calc(${clamped}% - 14px)`,
        transition: `left ${duration}ms linear`,
      };
    },
  },
};
</script>

<style scoped>
.section-header {
  margin-bottom: 12px;
}

h2 {
  font-size: 18px;
}

.hint {
  color: #64748b;
  font-size: 13px;
  margin-top: 4px;
}

.placeholder {
  color: #94a3b8;
  font-size: 14px;
  padding: 12px 0;
}

.track-wrapper {
  border: 1px solid #9a9a9a;
  background: #d6d6d6;
  position: relative;
  height: calc(100% - 40px);
  min-height: 400px;
}

.lane-header {
  background: #9cc086;
  color: #1f2937;
  padding: 6px 10px;
  font-weight: 700;
  border-bottom: 1px solid #9a9a9a;
}

.track {
  position: relative;
  height: 100%;
}

.finish-line {
  position: absolute;
  right: 14px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #d34a3a;
}

.finish-line span {
  position: absolute;
  bottom: 10px;
  right: -26px;
  transform: rotate(-90deg);
  font-weight: 700;
  color: #d34a3a;
}

.lanes {
  position: absolute;
  inset: 0;
  padding: 4px 28px 32px 0;
  display: flex;
  flex-direction: column;
}

.lane {
  display: grid;
  grid-template-columns: 32px 1fr;
  align-items: stretch;
  flex: 1;
}

.lane-number {
  background: #4f7642;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #3f5f34;
  font-weight: 700;
}

.lane-body {
  position: relative;
  border-bottom: 1px dashed #555;
  min-height: 48px;
}

.lane:last-child .lane-body {
  border-bottom: none;
}

.lane-dash {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-top: 1px dashed #999;
}

.horse-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) scaleX(-1);
  font-size: 26px;
}

.lap-label {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 700;
  color: #d34a3a;
}

@media (max-width: 1200px) {
  .track-wrapper {
    height: 520px;
  }
}
</style>
