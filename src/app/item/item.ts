export class Item {
    name: string;
    type: string; // define more specifically later
    usesRemaining: number;
    usesDefault: number;
    broken: boolean;
    
    use() {
        this.usesRemaining--;
    }
    
    restock() {
        this.usesRemaining = this.usesDefault;
    }
}
