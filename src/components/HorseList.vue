<template>
  <div class="section">
    <div class="table-title">Horse List (1 - 20)</div>
    <div v-if="horses.length" class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in horses" :key="horse.id">
            <td class="name-cell">{{ horse.name }}</td>
            <td class="cond-cell">{{ horse.condition }}</td>
            <td class="color-cell">
              <span class="swatch" :style="{ backgroundColor: horse.color }" />
              <span class="color-label">{{ horse.color }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="placeholder">Click Generate Program to build the 20-horse pool.</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HorseList',
  computed: {
    ...mapGetters('horses', { horses: 'pool' }),
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

.section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-title {
  background: #fbe26a;
  border: 1px solid #d1a300;
  padding: 8px 10px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 14px;
}

.table-wrapper {
  border: 1px solid #9a9a9a;
  border-top: none;
  overflow: auto;
  flex: 1;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

thead {
  background: #efefef;
  position: sticky;
  top: 0;
}

th, td {
  border: 1px solid #cfcfcf;
  padding: 8px 6px;
  text-align: left;
}

th {
  font-weight: 700;
}

.name-cell {
  font-weight: 600;
}

.cond-cell {
  text-align: center;
}

.color-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #555;
}

.color-label {
  font-size: 12px;
  color: #374151;
}
</style>
