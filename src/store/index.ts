import { configureStore } from '@reduxjs/toolkit'
import gameReducer from './gameStore/game.slice'
import { gameMiddleware } from './gameStore/game.middleware'

export const store = configureStore({
  reducer: {
    game: gameReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gameMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch