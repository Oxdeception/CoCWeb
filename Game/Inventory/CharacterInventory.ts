import { Inventory } from './Inventory';
import { ISerializable } from 'Engine/Utilities/ISerializable';
import { Character } from 'Game/Character/Character';
import { Item } from 'Game/Items/Item';
import { Weapon } from 'Game/Items/Weapons/Weapon';
import { Armor } from 'Game/Items/Armors/Armor';
import { IStatWithEffects, StatWithEffects } from 'Game/Character/Stats/Stat/StatWithEffects';
import { IEquipSlot, EquipSlot } from './EquipSlot';
import { IPiercingInventory, PiercingInventory } from './PiercingInventory';
import { EquipSlotList } from './EquipSlotList';
import { CockSock } from 'Game/Items/Misc/CockSock';
import { IItemStack } from './ItemStack';

export interface ICharInv {
    items: IItemStack[];
    gems: IStatWithEffects;
    weapon?: IEquipSlot;
    armor?: IEquipSlot;
    piercings: IPiercingInventory;
    cockSocks: IEquipSlot[];
    armorDescMod: string;
}

export class CharacterInventory implements ISerializable<ICharInv> {
    private char: Character;
    public readonly items: Inventory<Item>;
    public gemsStat: StatWithEffects;
    public readonly unarmedWeaponSlot: EquipSlot<Weapon>;
    public readonly equippedWeaponSlot: EquipSlot<Weapon>;
    public readonly noArmorSlot: EquipSlot<Armor>;
    public readonly equippedArmorSlot: EquipSlot<Armor>;
    public readonly piercings: PiercingInventory;
    public readonly cockSocks = new EquipSlotList<CockSock>();
    public armorDescMod: string;

    public constructor(character: Character, unarmedWeapon: Weapon, noArmor: Armor) {
        this.char = character;
        this.items = new Inventory<Item>();
        this.gemsStat = new StatWithEffects();
        this.unarmedWeaponSlot = new EquipSlot(character);
        this.unarmedWeaponSlot.equip(unarmedWeapon);
        this.equippedWeaponSlot = new EquipSlot(character);
        this.noArmorSlot = new EquipSlot(character);
        this.noArmorSlot.equip(noArmor);
        this.equippedArmorSlot = new EquipSlot(character);
        this.piercings = new PiercingInventory(character);
        this.armorDescMod = "";
        character.body.cocks.on('add', () => {
            this.cockSocks.add(new EquipSlot(character));
        });
        character.body.cocks.on('remove', (cock, index) => {
            this.cockSocks.remove(index);
        });
    }

    public get gems() { return this.gemsStat.value; }
    public set gems(num: number) { this.gemsStat.value = num; }

    public get weapon(): Weapon {
        return this.equippedWeaponSlot.item ? this.equippedWeaponSlot.item : this.unarmedWeaponSlot.item!;
    }

    public get armor(): Armor {
        return this.equippedArmorSlot.item ? this.equippedArmorSlot.item : this.noArmorSlot.item!;
    }

    public serialize(): ICharInv {
        const saveObj: ICharInv = {
            gems: this.gemsStat.serialize(),
            items: this.items.serialize(),
            piercings: this.piercings.serialize(),
            cockSocks: this.cockSocks.serialize(),
            armorDescMod: this.armorDescMod
        };
        const weapon = this.equippedWeaponSlot.serialize();
        const armor = this.equippedWeaponSlot.serialize();
        if (weapon) saveObj.weapon = weapon;
        if (armor) saveObj.armor = armor;
        return saveObj;
    }

    public deserialize(saveObject: ICharInv) {
        this.gemsStat.deserialize(saveObject.gems);
        this.items.deserialize(saveObject.items);
        if (saveObject.weapon)
            this.equippedWeaponSlot.deserialize(saveObject.weapon);
        if (saveObject.armor)
            this.equippedArmorSlot.deserialize(saveObject.armor);
        this.piercings.deserialize(saveObject.piercings);
        this.cockSocks.deserialize(saveObject.cockSocks, EquipSlot, this.char);
        this.armorDescMod = saveObject.armorDescMod;
    }
}
