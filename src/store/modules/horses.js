const COLOR_PALETTE = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#fb7185',
  '#fbbf24',
  '#fde047',
  '#34d399',
  '#60a5fa',
  '#c084fc',
];

const NAME_POOL = [
  'Meteor Dash',
  'Thunderstride',
  'Crimson Bolt',
  'Silver Comet',
  'Midnight Flash',
  'Azure Drift',
  'Emerald Gale',
  'Scarlet Fury',
  'Golden Echo',
  'Cobalt Sprint',
  'Amber Burst',
  'Violet Surge',
  'Ruby Blaze',
  'Indigo Charge',
  'Sunflare',
  'Frostwind',
  'Shadow Mane',
  'Blaze Runner',
  'Ironclad',
  'Wildflower',
];

const randomCondition = () => Math.floor(Math.random() * 100) + 1; // 1-100 inclusive

const buildHorse = (index) => ({
  id: `horse-${index + 1}`,
  name: NAME_POOL[index] || `Horse ${index + 1}`,
  color: COLOR_PALETTE[index],
  condition: randomCondition(),
});

const generateHorsePool = () => COLOR_PALETTE.map((_, index) => buildHorse(index));

export default {
  namespaced: true,
  state: () => ({
    all: [],
  }),
  getters: {
    pool: (state) => state.all,
    byId: (state) => (id) => state.all.find((horse) => horse.id === id),
    hasPool: (state) => state.all.length === COLOR_PALETTE.length,
  },
  mutations: {
    SET_HORSES(state, horses) {
      state.all = horses;
    },
    CLEAR_HORSES(state) {
      state.all = [];
    },
  },
  actions: {
    generateHorses({ commit }) {
      // Generates a fresh pool of 20 horses with unique colors and randomized condition scores.
      const horses = generateHorsePool();
      commit('SET_HORSES', horses);
    },
    resetHorses({ commit }) {
      commit('CLEAR_HORSES');
    },
  },
};
