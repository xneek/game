import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getFromStorage } from '../../helpers/storageHelper';
import { gameStorageKey } from '../../const/storageKeys';
import { saveAsFile } from '../../helpers/downloadHelper';
import { speak } from '../../helpers/speachHelper';

export interface Player {
  id: string;
  name: string;
  photo: string;
  color: string;
}

export interface Step {
  id: string;
  name: string;
  img?: string;
  step?: number;
  rel?: number | 'start' | 'pass';
}

export interface Game {
  id: string;
  name: string;
  steps: Step[];
  roomId?: string;
}

export interface GameSettings {
  allowSkip: boolean;
  allowBack: boolean;
  diceMin: number;
  diceMax: number;
  diceSpinMs: number;
  diceShowMs: number;
  cardText: boolean;
  cardBg: boolean;
  speakCurrentCard: boolean;
}


export interface PlayerStatus {
  score: number;
  count: number;
  log: string[];
}

const defaultGameSettings: GameSettings = {
  allowSkip: true,
  allowBack: true,
  diceMin: 1,
  diceMax: 6,
  diceSpinMs: 1000,
  diceShowMs: 1000,
  cardText: true,
  cardBg: true,
  speakCurrentCard: true
}


export interface GameState {
  game: Game | null;
  startDate: number | null;
  players: Player[];
  winners: Array<Player& { date: number; count: number }>;
  currentPlayer: Player | null;
  playerStatus: Record<Player['id'], PlayerStatus>;
  currentDice: number;
  gameSettings: GameSettings;
}

const initPlayerStatus:PlayerStatus = { score: 1, count: 0, log: [] };

const initialState: GameState = getFromStorage(gameStorageKey) ? JSON.parse(getFromStorage(gameStorageKey) || '{}') : {
  game: null,
  startDate: null,
  players: [],
  winners: [],
  playerStatus: {},
  currentPlayer: null,
  currentDice: 0,
  gameSettings: defaultGameSettings
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    start: (state, action: PayloadAction<Game>) => {
      state.game = action.payload;
      state.startDate = new Date().getTime();
      state.playerStatus = state.players.reduce((a, v) => ({ ...a, [v.id]: initPlayerStatus }), {});
      state.currentPlayer = state.players[0];
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players.push(action.payload);
      if (state.startDate) {
        state.playerStatus[action.payload.id] = initPlayerStatus
      }
    },
    editPlayer: (state, action: PayloadAction<Partial<Player>>) => {
      state.players = state.players.map(p => p.id === action.payload.id ? {...p, ...action.payload} : p);
    },
    deletePlayer: (state, action: PayloadAction<Player['id']>) => {
        state.players = state.players.filter(p => p.id !== action.payload);
    },

    throwDice(state, action: PayloadAction<number>){
      state.currentDice = action.payload;
    },

    completeCurrent(state, action: PayloadAction<boolean | null>){
      if (!state.currentPlayer) {
          throw new Error('Has no current player')
      } 

      const currentPlayerId = state.currentPlayer['id'];
      const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
      let newScore = state.playerStatus[currentPlayerId].score + (state.currentDice * (action.payload ? 1 : action.payload === false ? -1 : 0));

      if (state.game && state.game.steps[newScore-1].step) {
        const st = state.game.steps[newScore-1].step ?? 0;
        newScore += st;
      }

      if (state.game && state.game.steps[newScore-1].rel) {
        if (state.game.steps[newScore-1].rel === 'start') {
          newScore = 1;
        } else if (typeof state.game.steps[newScore-1].rel === 'number')
          newScore = state.game.steps[newScore-1].rel as number;
      }
      
      if (newScore < 1) {
        state.playerStatus[currentPlayerId].score = 1;
      } else if (state.game?.steps && newScore > state.game?.steps.length - 1) {
        state.playerStatus[currentPlayerId].score = state.game?.steps.length;
      } else {
        state.playerStatus[currentPlayerId].score = newScore;
      }

      if (newScore === state.game?.steps.length && !state.winners.find(w => state.currentPlayer && w.id === state.currentPlayer.id)) {
        state.winners = [...state.winners, { ...state.currentPlayer, date: new Date().getTime(), count: state.playerStatus[currentPlayerId].count + 1}]
        speak('Победил ' + state.currentPlayer.name);
      }

      state.playerStatus[currentPlayerId].count++;
      state.currentPlayer = state.players[currentPlayerIndex + 1] ? state.players[currentPlayerIndex + 1] : state.players[0];
      state.currentDice = 0;
    },
    downloadStoreAsJSON(state) {
      const nameParts: Array<string | undefined> = [
        state.game?.name,
        new Date().toLocaleString(),
      ];
      const name =  nameParts.filter(Boolean).join('_');
      saveAsFile(`${name}.json` , state, { type:'application/json' })
    },
    importStoreFromJSON(state, action: PayloadAction<any>) {
      state = action.payload;
    },
    reset(state) {
      state = initialState;
    },
    updateGameSettings(state, action: PayloadAction<Partial<GameSettings>>) {
      state.gameSettings = { ...state.gameSettings, ...action.payload };
    },
  },
})

// Action creators are generated for each case reducer function
export const { start, addPlayer, deletePlayer, editPlayer, throwDice, completeCurrent, downloadStoreAsJSON, importStoreFromJSON, reset, updateGameSettings } = gameSlice.actions

export default gameSlice.reducer