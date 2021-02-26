import { randomInt } from "crypto";
import { type } from "os";
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
                this.chunks[i][j] = new Chunk("Forest");
            }
        }
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
}

export type BiomeName = "Forest" | "Lake" | "Mountains" | "Desert" | "Grassland";
