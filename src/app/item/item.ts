export class Item {
    id: string;
    name: string;
    type: string; // define more specifically later
    usesRemaining: number;
    usesDefault: number;
    broken: boolean;
    weight: number;
    
    constructor(id: string, name: string, type: string, usesDefault: number, weight: number) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.usesDefault = usesDefault;
        this.usesRemaining = usesDefault;
        this.weight = weight;
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
