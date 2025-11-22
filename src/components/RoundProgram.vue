<template>
  <div class="section">
    <div class="banner program-banner">Program</div>
    <div v-if="hasProgram" class="rounds">
      <article v-for="round in enrichedRounds" :key="round.id" class="round">
        <div class="round-title">
          {{ roundTitle(round.index, round.distance) }}
        </div>
        <table class="round-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(horse, idx) in round.horseDetails" :key="horse.id">
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
    <div v-else class="placeholder">Generate a program to assign 10 horses to each round.</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'RoundProgram',
  computed: {
    ...mapGetters('races', ['rounds']),
    ...mapGetters('horses', { horseById: 'byId' }),
    hasProgram() {
      return this.rounds.length > 0;
    },
    enrichedRounds() {
      return this.rounds.map((round, index) => ({
        ...round,
        index: index + 1,
        horseDetails: round.horses
          .map((horseId) => this.horseById(horseId))
          .filter(Boolean),
      }));
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
  padding: 0;
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

.program-banner {
  background: #6ea4e2;
  color: #ffffff;
  border: 1px solid #4678b4;
  margin-bottom: 6px;
}
</style>
