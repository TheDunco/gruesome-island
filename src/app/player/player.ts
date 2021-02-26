import { Item } from "../item/item";

export class Player {
    
    name: string;
    health: number = 100;
    spawned: boolean = false;
    range: number = 0;
    items: Item[] = [];
    alive: boolean = true;
    kills: number = 0;
    carryingCapacity = 10;
    currentWeight = 10;
    itemCapacity = 5;
    
    // set by spawning in the world.
    posI: number;
    posJ: number;
    
    constructor(uname: string) {
        this.name = uname;
    }
    
    addItem(it: Item): string {
        let message: string;
        if (this.items.length < this.itemCapacity) {
            if (this.currentWeight + it.weight <= this.carryingCapacity) {
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].name == it.name || this.items[i].id == it.id) {
                        message = "Cannot pick up item: You already have this item";
                        return message;
                    }
                }
                this.items.push(it);
                message = "Item added successfully";
            } else { 
                message = "Cannot pick up item: You're carrying too much weight!"
            }
        } else {
            message = "Cannot pick up item: You're carrying too many items!"
        }
        return message;
    }
    
    removeItem(it: Item) {
        let index = 0;
        this.items.forEach((item) => {
            if (item.name == it.name) {
                this.items.splice(index, 1);
            } else {
                index++;
            }
        })
    }
    
    heal(hp: number) {
        if (this.health + hp > 100) {
            this.health = 100;
        } else if (hp <= 0) {
            this.damage(hp);
        } else {
            this.health += hp;
        }
    }
    
    damage(hp: number) {
        if (this.health - hp <= 0) {
            this.alive = false;
        } else if (hp < 0) {
            hp = -hp;
        } else {
            this.health -= hp;
        }
    }
}
