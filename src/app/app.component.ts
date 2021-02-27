import { ThrowStmt } from '@angular/compiler';
import { Component, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { Console } from 'console';
import { BrowserStack } from 'protractor/built/driverProviders';
import { Player } from 'src/app/player/player';
import { World } from 'src/app/world/world';

/*
Gamemode ideas:
1. Blitz
  - timed
  - typing speed/player speed based
  - each turn has a time limit and it alternates
  
2. Turn based (default)
  - no time limit per turn
  - Each player gets 3-5 (can be more with items) moves per turn (different commands count as differnt "moves")

3. Turn based (batch)
  - no time limit per turn
  - Each player can only run 1 command per turn
  - One batch command ($) only counts as 1 command
*/


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gruesome-island';
  debug = false;
  
  constructor() {
    this.username = localStorage.getItem("username");
    if (this.username != "") {
      this.mainBoxShown = true;
      this.player = new Player(this.username);
    }
    this.usernameDisabled = false;
  }
  
  messages: string[] = [];
  
  username: string;
  usernameDisabled: boolean = false;
  command: string;
  mainBoxShown = false;
  
  player: Player;
  world: World;
  
  COMMANDS: Command[] = [
    {name: "h/help/?", description: "Display a list of available commands and game rules."},
    {name: "$", description: "Run multiple commands seperated by spaces (batch/block mode)."},
    {name: "s/spawn", description: "Spawn into a new world."},
    {name: "up/north", description: "Move your player up."},
    {name: "down/south", description: "Move your player down."},
    {name: "left/west", description: "Move your player left."},
    {name: "right/east", description: "Move your player right."},
    {name: "l/look", description: "Get a look at the surrounding chunks."},
    {name: "pickup {itemname}", description: "Pick up an item with the specified name."},
    {name: "items/inventory {v for verbose}", description: "Show your inventory."}
  ]
  
  usernameEntered() {
    // start the game
    this.player = new Player(this.username);
    localStorage.setItem("username", this.username);
    this.mainBoxShown = true;
  }
  
  runCommand(command: string = this.command) {
    let args: string[] = this.command.split(" ").slice(1,);
    this.debug && args.forEach((arg) => this.post(arg));
    
    // batch/block mode
    if (command[0] == "$") {
      for (let i = 0; i < args.length; i++) {
        this.runCommand(args[i]);
      }
    }
    
    switch (command.split(' ')[0]) {  
      case "":
        break;
        
      // help
      case "h":
      case "help":
      case "?":
        this.displayHelpMessage();
        break;
      
      // spawn
      case "s":
      case "spawn":
      case "start": // probably will change later
        this.spawn();
        break;
        
      // show the world (debug)  
      case ">sw":
        this.showWorld();
        break;
      
      // move up
      case "up":
      case "north":
        this.moveUp();
        break;
        
      // move down
      case "down":
      case "south":
        this.moveDown();
        break;
      
      // move left
      case "left":
      case "west":
        this.moveLeft();
        break;
      
      // move right
      case "right":
      case "east":
        this.moveRight();
        break;
        
      case "l":
      case "look":
        this.lookAround();
        break;
        
      case "i":
      case "inspect":
        this.post(this.world.inspectChunk(this.player));
        break;
        
      case "p":
      case "pickup":
        this.post(this.player.addItem(this.world.getChunkItem(args[0], this.player)));
        this.post(`Current weight: ${this.player.currentWeight}`)
        break;
        
      case "inventory":
      case "items":
        this.post(`Current weight: ${this.player.currentWeight}`)
        if (args[0] == "v") {
          this.post(this.player.showInventory(true));
        } else {
          this.post(this.player.showInventory(false))
        }
        break;
        
      default:
        if (command[0] != "$") {
          this.post(`"${command}" not recognized as a command`);
        }
        break;
    }
  }
  
  private lookAround() {
    let surroundings = this.world.lookAround(this.player).split("\n");
    surroundings.forEach((str) => this.post(str));
  }
  
  private moveRight() {
    if (this.player.posJ + 1 < this.world.size) {
      this.player.posJ += 1;
      this.post("Moving right");
    } else {
      this.post("You've hit the world border");
    }
    this.refreshPlayerInWorld();
  }
  
  private moveLeft() {
    if (this.player.posJ - 1 >= 0) {
      this.player.posJ -= 1;
      this.post("Moving left");
    } else {
      this.post("You've hit the world border");
    }
    this.refreshPlayerInWorld();
  }
  
  private moveDown() {
    if (this.player.posI + 1 < this.world.size) {
      this.player.posI += 1;
      this.post("Moving down");
    } else {
      this.post("You've hit the world border");
    }
    this.refreshPlayerInWorld();
  }

  private moveUp() {
    if (this.player.posI - 1 >= 0) {
      this.player.posI -= 1;
      this.post("Moving up");
    } else {
      this.post("You've hit the world border");
    }
    this.refreshPlayerInWorld();
  }
  
  private refreshPlayerInWorld() {
    this.world.refreshPlayer(this.player);
  }
  
  private showWorld() {
    let wrld = this.world.showWorld().split("\n");
    wrld.forEach((str) => this.post(str));
  }

  private spawn() {
    if (!this.player.spawned) {
      this.post("Spawning...");
      // disable username changing
      this.usernameDisabled = true;
      
      // create a new world
      this.world = new World(10);

      // put the player in a random spot in the world
      this.player.posI = this.randomInteger(0, this.world.size - 1);
      this.player.posJ = this.randomInteger(0, this.world.size - 1);
      this.world.players.push(this.player);
      this.player.spawned = true;
      
    } else if (this.player.spawned) {
      this.post("You've already been spawned in");
    }
  }

  private displayHelpMessage() {
    this.post("----------Available Commands----------");
    this.COMMANDS.forEach((com) => this.post(`${com.name}: ${com.description}`));
    this.post("-------------------------------------------------------");
  }

  public post(msg: string) {
    this.messages.push(msg);
    this.command = "";
    this.scrollToBottom(); // not working
  }
  
  randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }
}

interface Command {
  name: string;
  description: string;
}