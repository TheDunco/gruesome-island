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
                    biome = "City";
                }
                this.chunks[i][j] = new Chunk(biome);
            }
        }
    }
    
    refreshPlayer(player: Player) {
        // get the index of the player
        let index = this.specificPlayer(player);
        // remove the old player from their current chunk
        this.chunks[this.players[index].posI][this.players[index].posJ].removePlayer(this.players[index]);
        // remove the old player from the world
        this.players.splice(index, 1);
        // add the new player to the world
        this.players.push(player);
        // add a new player to the chunk they're supposed to be in
        this.chunks[player.posI][player.posJ].addPlayer(player);
    }
    
    lookAround(player: Player): string {
        let retstring = "";
        let playerIndex: number = this.specificPlayer(player);
        if (playerIndex == -1) {
            console.log("Player not found");
        } else {
            let posI = this.players[playerIndex].posI;
            let posJ = this.players[playerIndex].posJ;
            
            retstring += "\t";
            // North/Up
            if (posI - 1 >= 0) {
                retstring += this.chunks[posI - 1][posJ].biome;
            } else {
                retstring += "World border";
            }
            retstring += "\n";
            
            // East/Left
            if (posJ - 1 >= 0) {
                retstring += this.chunks[posI][posJ - 1].biome;
            } else {
                retstring += "World border";
            }
            
            retstring += " ";
            retstring += this.chunks[posI][posJ].biome;
            retstring += " ";
            
            // West/Right
            if (posJ + 1 < this.size) {
                retstring += this.chunks[posI][posJ + 1].biome;
            } else {
                retstring += "World border";
            }
            retstring += "\n";
            retstring += "\t";

            // South/Down
            if (posI + 1 < this.size) {
                retstring += this.chunks[posI + 1][posJ].biome;
            } else {
                retstring += "World border";
            }
            retstring += "\n";
        }
        return retstring;
    }
    
    // get a specific player's index from the list
    specificPlayer(play: Player): number {
        let index = 0;
        for(let play of this.players) {
            if (this.players[index].name == play.name) {
                console.log(this.players[index].name == play.name, this.players[index].alive == play.alive)
                return index;
            } else {
                index++;
            }
        }
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

export type BiomeName = "Forest" | "Lake" | "Mountains" | "City" | "Grassland";
