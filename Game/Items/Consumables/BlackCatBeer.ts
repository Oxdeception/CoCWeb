import { Consumable } from './Consumable';
import { ConsumableName } from './ConsumableName';
import { Character } from 'Game/Character/Character';
import { ItemDesc } from '../ItemDesc';
import { blackCatBeerEffects } from 'Game/Scenes/Places/TelAdre/Niamh';

export class BlackCatBeer extends Consumable {
    public constructor() {
        super(ConsumableName.BlackCatBeer, new ItemDesc("BC Beer", "a mug of Black Cat Beer", "A capped mug containing an alcoholic drink secreted from the breasts of Niamh.  It smells tasty."), 1);
    }

    public use(character: Character) {
        blackCatBeerEffects(character);
    }
}