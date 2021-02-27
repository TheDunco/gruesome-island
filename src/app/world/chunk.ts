import { Player } from "../player/player";
import { BiomeName } from "src/app/world/world"
import { Item } from "../item/item";

export class Chunk {
    
    private occupyingPlayers: Player[] = [];
    private items: Item[] = [];
    biome: BiomeName;
    
    constructor(nbiome: BiomeName) {
        this.biome = nbiome
    }
    
    addItem(it: Item) {
        this.items.push(it);
    }
    
    removeItem(it: Item) {
        let index = 0;
        this.items.forEach((item) => {
            if (item.id == it.id) {
                this.items.splice(index, 1);
            }
            return;
        });
    }
    
    getItems(): Item[] {
        return this.items;
    }
    
    getNumItems(): number {
        return this.items.length;
    }
    
    addPlayer(aplayer: Player) {
        this.occupyingPlayers.push(aplayer);
    }
    
    removePlayer(rplayer: Player) {
        // get a matching index
        const index = this.occupyingPlayers.findIndex(p => p.name === rplayer.name);
        if (index > -1) {
          // delete this.exampleNote[index];
          this.occupyingPlayers.splice(index, 1);
        }
    }
}
