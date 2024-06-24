import { UnknownAction, CaseReducerActions, Dispatch } from "@reduxjs/toolkit";
import { Dispatchers } from "types";

export function createDispatchers<T extends CaseReducerActions<any, any>>(
  actions: T
) {
  return function (dispatch: Dispatch<UnknownAction>): Dispatchers<T> {
    return Object.keys(actions).reduce(
      (dispatchers, key: keyof T): Dispatchers<T> => {
        dispatchers[key] = (...params: any[]) =>
          dispatch(
            (actions[key] as (...params: any[]) => any).call(null, ...params)
          );

        return dispatchers;
      },
      {} as Dispatchers<T>
    );
  };
}
