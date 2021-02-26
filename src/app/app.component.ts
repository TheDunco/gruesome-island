import { ThrowStmt } from '@angular/compiler';
import { Component, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { Console } from 'console';
import { BrowserStack } from 'protractor/built/driverProviders';
import { Player } from 'src/app/player/player';
import { World } from 'src/app/world/world';

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
    {name: "spawn", description: "Spawn into a new world."},
    {name: "up/move up/north/move north", description: "Move your player up."},
    {name: "down/move down/south/move south", description: "Move your player down."}
  ]
  
  usernameEntered() {
    // start the game
    this.player = new Player(this.username);
    localStorage.setItem("username", this.username);
    this.mainBoxShown = true;
  }
  
  runCommand() {
    let args: string[] = this.command.split(" ").slice(1,);
    this.debug && args.forEach((arg) => this.post(arg));
    
    switch (this.command.toLowerCase()) {
      
      // help
      case "h":
      case "help":
      case "?":
        this.displayHelpMessage();
        break;
      
      // spawn
      case "spawn":
        this.spawn();
        break;
        
      // show the world (debug)  
      case ">sw":
        this.showWorld();
        break;
      
      // move up
      case "up":
      case "move up":
      case "north":
      case "move north":
        this.moveUp();
        break;
        
      // move down
      case "down":
      case "move down":
      case "south":
      case "move south":
        this.moveDown();
        break;
      
      // move left
      case "left":
      case "move left":
      case "west":
      case "move west":
        this.moveLeft();
        break;
      
      // move right
      case "right":
      case "move right":
      case "east":
      case "move east":
        this.moveRight();
        break;
        
      default:
        this.post(`"${this.command}" not recognized as a command`);
        break;
    }
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
    this.world.players.pop();
    this.world.players.push(this.player);
    // this.showWorld();
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
    this.scrollToBottom();
  }
  
  randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  scrollToBottom() {
    console.log("Scrolling to bottom");
    window.scrollTo(0, document.body.scrollHeight);
  }
}

interface Command {
  name: string;
  description: string;
}