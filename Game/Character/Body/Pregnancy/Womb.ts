import { IPregnancyEvent } from './IPregnancyEvent';
import { Pregnancy, PregnancyType, IPregnancy } from './Pregnancy';
import { ISerializable } from 'Engine/Utilities/ISerializable';
import { SortOption, FilterOption } from 'Engine/Utilities/List';
import { randInt } from 'Engine/Utilities/SMath';
import { Body } from '../Body';

export interface IWomb {
    pregnancy: IPregnancy;
}

export class Womb implements ISerializable<IWomb> {
    public static readonly LargestPregnancy: SortOption<Womb> = (a: Womb, b: Womb) => {
        return (a.pregnancy ? a.pregnancy.incubation : 0) - (b.pregnancy ? b.pregnancy.incubation : 0);
    }

    public static readonly SmallestPregnancy: SortOption<Womb> = (a: Womb, b: Womb) => {
        return (b.pregnancy ? b.pregnancy.incubation : 0) - (a.pregnancy ? a.pregnancy.incubation : 0);
    }

    public static readonly Pregnant: FilterOption<Womb> = (a: Womb) => {
        return a.isPregnant();
    }

    public static readonly NotPregnant: FilterOption<Womb> = (a: Womb) => {
        return !a.isPregnant();
    }

    public static PregnantWithType(type: PregnancyType): FilterOption<Womb> {
        return (a: Womb) => {
            return !!a.pregnancy && a.pregnancy.type === type;
        };
    }

    protected currentPregnancy?: Pregnancy;
    protected pregEvent?: IPregnancyEvent;
    protected body: Body;
    public constructor(body: Body) {
        this.body = body;
    }

    public get pregnancy(): Pregnancy | undefined {
        return this.currentPregnancy;
    }

    public isPregnant(): boolean {
        return !!this.pregnancy;
    }

    public canKnockUp(): boolean {
        return !this.pregnancy && this.body.vaginas.length > 0;
    }

    public knockUp(pregnancy: Pregnancy, event: IPregnancyEvent, virility: number = 100, guarantee?: boolean): void {
        if (guarantee || this.canKnockUp()) {

            if (guarantee || this.body.fertility > randInt(virility)) {
                this.currentPregnancy = pregnancy;
                this.pregEvent = event;
            }

            if (guarantee || this.body.fertility > randInt(virility))
                this.body.ovipositor.fertilizeEggs();
        }
    }

    public clear() {
        this.currentPregnancy = undefined;
    }

    public update() {
        if (this.currentPregnancy) {
            this.currentPregnancy.incubation -= this.currentPregnancy.incubation === 0 ? 0 : 1;
        }
    }

    public serialize(): IWomb | void {
        if (this.currentPregnancy)
            return {
                pregnancy: this.currentPregnancy
            };
    }

    public deserialize(saveObject: IWomb | undefined) {
        if (saveObject) {
            this.currentPregnancy = new Pregnancy();
            this.currentPregnancy.deserialize(saveObject.pregnancy);
        }
    }
}
