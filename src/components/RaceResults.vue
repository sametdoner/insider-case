<template>
  <div class="section">
    <div class="banner results-banner">Results</div>
    <div v-if="!hasProgram" class="placeholder">Generate and start races to see placements here.</div>

    <div v-else class="rounds">
      <article v-for="card in resultCards" :key="card.round.id" class="round">
        <div class="round-title">
          {{ roundTitle(card.index, card.round.distance) }}
        </div>
        <table class="round-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!card.horses.length">
              <td colspan="2" class="placeholder small">{{ waitingText(card.round.status) }}</td>
            </tr>
            <tr v-for="(horse, idx) in card.horses" :key="horse.id">
              <td class="pos">{{ idx + 1 }}</td>
              <td class="name-cell">
                <span class="dot" :style="{ backgroundColor: horse.color }" />
                {{ horse.name }}
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RaceResults',
  computed: {
    ...mapGetters('races', ['rounds', 'resultsByRound']),
    ...mapGetters('horses', { horseById: 'byId' }),
    hasProgram() {
      return this.rounds.length > 0;
    },
    resultCards() {
      return this.rounds.map((round, index) => {
        const placements = this.resultsByRound[round.id] || [];
        const horses = placements.map((horseId) => this.horseById(horseId)).filter(Boolean);
        return {
          index: index + 1,
          round,
          horses,
        };
      });
    },
  },
  methods: {
    roundTitle(index, distance) {
      const suffix = this.ordinalSuffix(index);
      return `${index}${suffix} Lap - ${distance}m`;
    },
    ordinalSuffix(n) {
      const j = n % 10;
      const k = n % 100;
      if (j === 1 && k !== 11) return 'st';
      if (j === 2 && k !== 12) return 'nd';
      if (j === 3 && k !== 13) return 'rd';
      return 'th';
    },
    formatStatus(status) {
      if (status === 'running') return 'In Progress';
      if (status === 'finished') return 'Finished';
      return 'Idle';
    },
    waitingText(status) {
      if (status === 'running') return 'Race in progress...';
      if (status === 'finished') return 'Awaiting recorded placements.';
      return 'Pending start.';
    },
  },
};
</script>

<style scoped>
.section-header {
  display: none;
}

.placeholder {
  color: #94a3b8;
  font-size: 14px;
  padding: 12px;
}

.rounds {
  display: grid;
  gap: 6px;
  max-height: none;
  overflow: visible;
}

.round {
  border: 1px solid #d0d0d0;
}

.round-title {
  background: #d06f63;
  color: #ffffff;
  padding: 6px 8px;
  font-weight: 700;
  font-size: 13px;
}

.round-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.round-table th,
.round-table td {
  border: 1px solid #cfcfcf;
  padding: 6px 8px;
  text-align: left;
}

.round-table thead {
  background: #efefef;
}

.pos {
  width: 52px;
  text-align: center;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  border: 1px solid #555;
}

.banner {
  text-align: center;
  padding: 8px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.results-banner {
  background: #8bc487;
  color: #1f2937;
  border: 1px solid #6a9466;
  margin-bottom: 6px;
}
</style>
