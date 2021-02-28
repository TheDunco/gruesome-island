import { Player } from "../player/player";
import { Chunk } from "./chunk";
import { v4 as uuidv4 } from 'uuid';
import { Item, ItemType } from "../item/item";

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
                // Create the chunk with determined biome name
                this.chunks[i][j] = new Chunk(biome);
                
                // Populate chunk with items
                let itemNum = this.randomInteger(0, 100);
                if (itemNum <= 25 && biome != "Lake") {
                    this.chunks[i][j].addItem(this.pistol());
                }
                if (itemNum <= 10 && biome == "City") {
                    this.chunks[i][j].addItem(this.sniper());
                } else
                if (itemNum <= 2) {
                    this.chunks[i][j].addItem(this.fullHeal());
                } else
                if (itemNum > 90 && itemNum < 100) {
                    this.chunks[i][j].addItem(this.caffeine());
                }
                
            }
        }
    }
    
    // items
    // numbers go uses, weight, range, accuracy, damage
    pistol(): Item {
        return new Item(uuidv4(), "pistol", "Ranged Weapon", 5, 1, 2, 75, 30, "Simple, common, trusty pistol")
    }
    sniper(): Item {
        return new Item(uuidv4(), "sniper", "Ranged Weapon", 3, 4, 5, 90, 85, "Long range, powerful rifle. Detect and shoot players at long range")
    }
    fullHeal(): Item {
        return new Item(uuidv4(), "fullheal", "Heal", 1, 2, 0, 100, -100, "Heal fully")
    }
    caffeine(): Item {
        return new Item(uuidv4(), "caffeine", "Buff", 1, 1, 0, 100, 0, "Increase speed/action economy based on game mode")
    }
    
    isItemInChunk(player: Player, itemName: string): boolean {
        let playerIndex = this.specificPlayer(player);
        let posI = this.players[playerIndex].posI;
        let posJ = this.players[playerIndex].posJ;
        let allChunkItems = this.chunks[posI][posJ].getItems();
        for (let index = 0; index < allChunkItems.length; index++) {
            if (allChunkItems[index].name == itemName) {
                return true;
            }
        }
        return false;
    }
    
    removeItemFromChunk(player: Player, itemName: string) {
        let playerIndex = this.specificPlayer(player);
        let posI = this.players[playerIndex].posI;
        let posJ = this.players[playerIndex].posJ;
        console.log("Full list", this.chunks[posI][posJ].getItems())
        
        let allChunkItems = this.chunks[posI][posJ].getItems();
        for (let index = 0; index <= allChunkItems.length; index++) {
            if (allChunkItems[index].name == itemName) {
                console.log("Removed", index, itemName, allChunkItems[index].name)
                this.chunks[posI][posJ].removeItem(allChunkItems[index]);
                return;
            }
        }
        console.log("Did not remove", this.chunks[posI][posJ].getItems())
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
    
    getChunkItem(name: string, player: Player): Item {
        let playerIndex: number = this.specificPlayer(player);
        let posI = this.players[playerIndex].posI;
        let posJ = this.players[playerIndex].posJ;
        
        let allChunkItems = this.chunks[posI][posJ].getItems();
        for (let index = 0; index < allChunkItems.length; index++) {
            if (allChunkItems[index].name == name) {
                return allChunkItems[index];
            }
        }
        
    }
    
    inspectChunk(player: Player): string {
        let playerIndex: number = this.specificPlayer(player);
        let retstring: string = "Items: ";
        if (playerIndex == -1) {
            return "";
        } else {
            let posI = this.players[playerIndex].posI;
            let posJ = this.players[playerIndex].posJ;
            let items = this.chunks[posI][posJ].getItems();
            items.forEach((item) => {
                console.log(item.name, item.id);
                retstring += item.name + " | ";
            })
        }
        return retstring;
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
            if (posI - player.currentViewDistance >= 0) {
                retstring += this.chunks[posI - player.currentViewDistance][posJ].biome + "(";
                retstring += this.chunks[posI - player.currentViewDistance][posJ].getNumItems() + ")";
            } else { 
                retstring += "Worldborder";
            }
            retstring += "\n";
            
            // East/Left
            if (posJ - player.currentViewDistance >= 0) {
                retstring += this.chunks[posI][posJ - player.currentViewDistance].biome + "(";
                retstring += this.chunks[posI][posJ - player.currentViewDistance].getNumItems() + ")";
            } else {
                retstring += "Worldborder";
            }
            
            retstring += " ";
            retstring += this.chunks[posI][posJ].biome + "(";
            retstring += this.chunks[posI][posJ].getNumItems() + ")";
            retstring += " ";
            
            // West/Right
            if (posJ + player.currentViewDistance < this.size) {
                retstring += this.chunks[posI][posJ + player.currentViewDistance].biome + "(";
                retstring += this.chunks[posI][posJ + player.currentViewDistance].getNumItems()+ ")";
            } else {
                retstring += "Worldborder";
            }
            retstring += "\n";
            retstring += "\t";

            // South/Down
            if (posI + player.currentViewDistance < this.size) {
                retstring += this.chunks[posI + player.currentViewDistance][posJ].biome + "(";
                retstring += this.chunks[posI + player.currentViewDistance][posJ].getNumItems() + ")";
            } else {
                retstring += "Worldborder";
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
                        retstring += this.chunks[i][j].biome + "(" + this.chunks[i][j].getNumItems() + ")";
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
