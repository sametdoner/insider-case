import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import Vue from 'vue';
import Vuex from 'vuex';
import horsesModule from '../src/store/modules/horses';
import racesModule from '../src/store/modules/races';
import uiModule from '../src/store/modules/ui';
import { actions as rootActions } from '../src/store';

Vue.use(Vuex);

const makeStore = () =>
  new Vuex.Store({
    modules: {
      horses: { ...horsesModule },
      races: { ...racesModule },
      ui: { ...uiModule },
    },
    actions: { ...rootActions },
  });

describe('horse racing store', () => {
  let store;

  beforeEach(() => {
    store = makeStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('generateProgram builds horses and rounds with 10 horses each', async () => {
    await store.dispatch('generateProgram');

    const horses = store.getters['horses/pool'];
    expect(horses).toHaveLength(20);

    const rounds = store.getters['races/rounds'];
    expect(rounds).toHaveLength(6);
    rounds.forEach((round) => {
      expect(round.horses).toHaveLength(10);
      expect(new Set(round.horses).size).toBe(10);
    });

    expect(store.getters['ui/isProgramGenerated']).toBe(true);
  });

  it('runRound records placements in completion order', async () => {
    // Prepare a round with deterministic timings.
    await store.dispatch('races/seedRounds');
    store.commit('races/SET_ROUND_HORSES', {
      roundId: 'round-1',
      horses: ['fast', 'medium', 'slow'],
    });

    const horseLookup = {
      fast: { id: 'fast', condition: 100 },
      medium: { id: 'medium', condition: 50 },
      slow: { id: 'slow', condition: 10 },
    };

    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0); // remove randomness from duration
    vi.useFakeTimers();

    const runPromise = store.dispatch('races/runRound', {
      round: store.state.races.rounds[0],
      horseLookup,
    });

    await vi.runAllTimersAsync();
    await runPromise;

    randomSpy.mockRestore();

    const placements = store.getters['races/resultsByRound']['round-1'];
    expect(placements).toEqual(['fast', 'medium', 'slow']); // fastest condition finishes first
    const round = store.getters['races/roundById']('round-1');
    expect(round.status).toBe('finished');
  });
});
