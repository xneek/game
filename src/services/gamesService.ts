import { data } from "../data/alka_original";
import { fantData } from "../data/fant";
import { Game, Step } from "../store/gameStore/game.slice";

export const getAvailableGames = (): Game[] => {
    const arr = [];

    arr.push({
        id: 'alka',
        name: 'Оригинальная игра 18+',
        steps: data.map((d, i) => {
            return {
                id: i.toString(),
                name: d.text,
                img: `images/${i+1}.png`,
                step: d.step,
                rel: d.rel
            } as Step
        })
    })
    arr.push({
        id: 'fant',
        name: 'Фанты',
        steps: fantData.map((d, i) => {
            return {
                id: i.toString(),
                name: d.text,
                img: `images/${i+1}.png`
            } as Step
        })
    })
    return arr;
}