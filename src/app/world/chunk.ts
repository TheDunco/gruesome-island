import { Player } from "../player/player";
import { BiomeName } from "src/app/world/world"

export class Chunk {
    
    private occupyingPlayers: Player[];
    biome: BiomeName;
    
    constructor(nbiome: BiomeName) {
        this.biome = nbiome
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
