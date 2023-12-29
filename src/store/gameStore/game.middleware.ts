import { Action, AnyAction, Middleware, ThunkDispatch } from "@reduxjs/toolkit";
import { setToStorage } from "../../helpers/storageHelper";
import { gameStorageKey } from "../../const/storageKeys";

export const  gameMiddleware: Middleware<{}, unknown, ThunkDispatch<unknown, unknown, Action>> = (store) => (next) => (action) => {
  const result = next(action);
  setToStorage(gameStorageKey, JSON.stringify((store.getState() as any).game))
  return result;
};