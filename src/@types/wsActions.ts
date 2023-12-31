import { Game } from "../store/gameStore/game.slice";

export enum WSAction {
    RegisterUser,
    UserRegistred
}

export type WSPayloadTypes = {
    [WSAction.RegisterUser]: {
        room: string;
        name: string;
    },
    [WSAction.UserRegistred]: {
        game: Game;
    }
}