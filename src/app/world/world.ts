import { Player } from "../player/player";
import { Chunk } from "./chunk";

export class World {
    players: Player[];
    size: number;
    chunks: Chunk[][];
    
    constructor(wsize: number) {
        this.size = wsize;
        this.chunks = new Array<Array<Chunk>>()
        this.players = [];
        for(var i: number = 0; i < wsize; i++) {
            this.chunks[i] = [];
            for(var j: number = 0; j < wsize; j++) {
                let biome: BiomeName;
                let biomeNum = this.randomInteger(0, 100);
                // 30% forest
                if (biomeNum <= 30) {
                    biome = "Forest";
                // 20% grassland
                } else if (biomeNum > 30 && biomeNum <= 50) {
                    biome = "Grassland";
                // 20% mountains
                } else if (biomeNum > 50 && biomeNum <= 70) {
                    biome = "Mountains";
                // 20% lake
                } else if (biomeNum > 70 && biomeNum <= 90) {
                    biome = "Lake"
                }
                // 10% desert
                else if (biomeNum > 90 && biomeNum <= 100) {
                    biome = "Desert";
                }
                this.chunks[i][j] = new Chunk(biome);
            }
        }
    }
    
    lookAround(player: Player): string {
        let retstring = "";
        let posI = this.players[this.specificPlayer(player)].posI;
        let posJ = this.players[this.specificPlayer(player)].posJ;
        // construct and tell player what biomes etc. they see around them. 
        // handle this in the app.component as well.
        return retstring;
    }
    
    // get a specific player's index from the list
    specificPlayer(play: Player): number {
        let index = 0;
        this.players.forEach((player) => {
            if (player.name == play.name && player.alive == play.alive) { // continue...
                return index;
            } else {
                index++;
            }
        });
        return -1;
    }
    
    showWorld(): string {
        let retstring = "";
        for(var i: number = 0; i < this.size; i++) {
            for(var j: number = 0; j < this.size; j++) {
                this.players.forEach((p) => {
                    if (p.posI == i && p.posJ == j) {
                        retstring += p.name;
                        retstring += " ";
                    }
                    else {
                        retstring += this.chunks[i][j].biome;
                        retstring += " ";
                    }
                });
                
            }
            retstring += "\n";
        }
        return retstring;
    }
    
    randomInteger(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
}

export type BiomeName = "Forest" | "Lake" | "Mountains" | "Desert" | "Grassland";
