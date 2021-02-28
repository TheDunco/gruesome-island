export class Item {
    id: string;
    name: string;
    type: ItemType; // define more specifically later
    usesRemaining: number;
    usesDefault: number;
    broken: boolean;
    weight: number;
    description: string;
    range: number;
    accuracy: number; // have a biome protection level that factors into this as well
    damage: number;
    
    constructor(id: string, name: string, type: ItemType, usesDefault: number, weight: number, range: number = 1, accuracy: number, damage: number, description: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.usesDefault = usesDefault;
        this.usesRemaining = usesDefault;
        this.weight = weight;
        this.description = description;
        this.range = range;
        this.accuracy = accuracy;
        this.damage = damage;
    }
    
    use(): boolean {
        if (this.usesRemaining > 0) {
            this.usesRemaining--;
            return true;
        } else {
            return false;
        }
    }
    
    restock() {
        this.usesRemaining = this.usesDefault;
    }
}

export type ItemType = "Ranged Weapon" | "Buff" | "Heal"