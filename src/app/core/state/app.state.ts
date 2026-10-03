import { createAction, createReducer, createSelector, on, props } from '@ngrx/store';

export interface AppState {
  theme: 'light' | 'dark' | 'system';
  lastSearch: string;
  online: boolean;
}

export const initialAppState: AppState = { theme: 'system', lastSearch: '', online: true };

export const setTheme = createAction('[Preferences] Set Theme', props<{ theme: AppState['theme'] }>());
export const setLastSearch = createAction('[Search] Set Last Search', props<{ query: string }>());
export const setOnline = createAction('[System] Set Online', props<{ online: boolean }>());

export const appReducer = createReducer(
  initialAppState,
  on(setTheme, (state, action) => ({ ...state, theme: action.theme })),
  on(setLastSearch, (state, action) => ({ ...state, lastSearch: action.query })),
  on(setOnline, (state, action) => ({ ...state, online: action.online })),
);

export const selectAppState = (state: { app: AppState }) => state.app;
export const selectTheme = createSelector(selectAppState, state => state.theme);
export const selectLastSearch = createSelector(selectAppState, state => state.lastSearch);
export const selectOnline = createSelector(selectAppState, state => state.online);
