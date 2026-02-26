export class MinionItem {

    clone(): MinionItem {
        return new MinionItem(this.name);
    }
    constructor(name: string) {
        this.name = name;
    }
    name!: string;
    
}
