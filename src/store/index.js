import Vue from 'vue';
import Vuex from 'vuex';
import horses from './modules/horses';
import races from './modules/races';
import ui from './modules/ui';

Vue.use(Vuex);

export const actions = {
  async generateProgram({ dispatch, commit, getters }) {
    // Resets state and builds a fresh 6-round program with horse assignments.
    await dispatch('horses/generateHorses');
    await dispatch('races/seedRounds');

    const pool = getters['horses/pool'];
    await dispatch('races/assignRandomHorses', pool);

    commit('ui/SET_CURRENT_ROUND_INDEX', 0);
    commit('ui/SET_RACE_RUNNING', false);
    commit('ui/SET_PROGRAM_GENERATED', true);
  },
  async startRaces({ dispatch, commit, getters }) {
    const rounds = getters['races/rounds'];
    const pool = getters['horses/pool'];
    const alreadyRunning = getters['ui/isRaceRunning'];

    if (!rounds.length || !pool.length || alreadyRunning) return;

    commit('ui/SET_RACE_RUNNING', true);
    commit('ui/SET_CURRENT_ROUND_INDEX', 0);

    await dispatch('races/prepareForRace');

    const horseLookup = pool.reduce((acc, horse) => {
      acc[horse.id] = horse;
      return acc;
    }, {});

    for (let idx = 0; idx < rounds.length; idx += 1) {
      const currentRound = rounds[idx];
      commit('ui/SET_CURRENT_ROUND_INDEX', idx);
      // Runs a single round and waits for its animation and placements to finish.
      await dispatch('races/runRound', { round: currentRound, horseLookup });
    }

    commit('ui/SET_RACE_RUNNING', false);
  },
};

export const createStore = () =>
  new Vuex.Store({
    modules: {
      horses,
      races,
      ui,
    },
    actions,
  });

export default createStore();
