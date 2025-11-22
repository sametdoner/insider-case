/* @vitest-environment jsdom */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import App from '../src/App.vue';
import { createStore } from '../src/store';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountApp = () => {
  const store = createStore();
  const wrapper = mount(App, {
    localVue,
    store,
    attachTo: document.body,
  });
  return { wrapper, store };
};

describe('app e2e flow', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it(
    'generates program, starts races, and renders first round results',
    async () => {
      vi.useFakeTimers();

      const { wrapper, store } = mountApp();

      await store.dispatch('generateProgram');
      await wrapper.vm.$nextTick();

      expect(store.getters['ui/isProgramGenerated']).toBe(true);
      const startPromise = store.dispatch('startRaces');
      await vi.runAllTimersAsync();
      await startPromise;
      await Promise.resolve();
      await wrapper.vm.$nextTick();

      const results = store.getters['races/resultsByRound']['round-1'];
      expect(results).toBeTruthy();
      expect(results.length).toBe(10);

      const firstTableRows = wrapper.findAll('.round-table tbody tr');
      expect(firstTableRows.length).toBeGreaterThanOrEqual(10);
    },
    20000,
  );
});
