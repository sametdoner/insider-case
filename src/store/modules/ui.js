export default {
  namespaced: true,
  state: () => ({
    currentRoundIndex: 0,
    isProgramGenerated: false,
    isRaceRunning: false,
  }),
  getters: {
    currentRoundIndex: (state) => state.currentRoundIndex,
    isProgramGenerated: (state) => state.isProgramGenerated,
    isRaceRunning: (state) => state.isRaceRunning,
  },
  mutations: {
    SET_PROGRAM_GENERATED(state, flag) {
      state.isProgramGenerated = flag;
    },
    SET_RACE_RUNNING(state, flag) {
      state.isRaceRunning = flag;
    },
    SET_CURRENT_ROUND_INDEX(state, index) {
      state.currentRoundIndex = index;
    },
  },
  actions: {
    setProgramGenerated({ commit }, flag) {
      commit('SET_PROGRAM_GENERATED', flag);
    },
    setRaceRunning({ commit }, flag) {
      commit('SET_RACE_RUNNING', flag);
    },
    setCurrentRoundIndex({ commit }, index) {
      commit('SET_CURRENT_ROUND_INDEX', index);
    },
  },
};
