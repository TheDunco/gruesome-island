import { Item } from "../item/item";
import { World } from "../world/world";

export class Player {
    
    name: string;
    kills: number;
    items: Item[];
    spawned: boolean = false;
    alive: boolean;
    
    posI: number;
    posJ: number;
    
    constructor(uname: string) {
        this.name = uname;
    }
    
}
