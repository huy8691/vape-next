/**
 * @Copyright 2020, Exnodes. All Rights Reserved.
 * @date 2022/02/08 21:48
 */
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './rootReducer'
import rootSaga from './rootSaga'

//import sagas
const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: combineReducers({
    ...rootReducer,
  }),
  middleware: [sagaMiddleware],
})

sagaMiddleware.run(rootSaga)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
