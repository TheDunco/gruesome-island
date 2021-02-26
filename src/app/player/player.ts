import { Item } from "../item/item";

export class Player {
    
    name: string;
    health: number = 100;
    spawned: boolean = false;
    range: number = 0;
    items: Item[] = [];
    alive: boolean = true;
    kills: number = 0;
    
    // set by spawning in the world.
    posI: number;
    posJ: number;
    
    constructor(uname: string) {
        this.name = uname;
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
