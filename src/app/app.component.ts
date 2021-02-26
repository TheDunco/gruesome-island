import { ThrowStmt } from '@angular/compiler';
import { Component } from '@angular/core';
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
  debug = true;
  
  constructor() {
    this.username = localStorage.getItem("username");
    if (this.username != "") {
      this.mainBoxShown = true;
      this.player = new Player(this.username);
    }
  }
  
  messages: string[] = []; 
  
  username: string;
  command: string;
  mainBoxShown = false;
  
  player: Player;
  world: World;
  
  COMMANDS: Command[] = [
    {name: "h/help/?", description: "Display a list of available commands and game rules."},
    {name: "spawn", description: "Spawn into a new world."},
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
      
      case "h" || "help" || "?":
        this.post("----------Available Commands----------")
        this.COMMANDS.forEach((com) => this.post(`${com.name}: ${com.description}`))
        this.post("-------------------------------------------------------")
        break;
        
      case "spawn":
        if (!this.player.spawned) {
          this.post("Spawning...")
          // create a new world
          this.world = new World(10);
          
          this.player.posI = this.randomInteger(0, this.world.size - 1);
          this.player.posJ = this.randomInteger(0, this.world.size - 1);
          
          this.player.spawned = true;
          this.world.players.push(this.player);
          
          this.post(`I:${this.player.posI}`)
          this.post(`J:${this.player.posJ}`)
          
        } else if(this.player.spawned) {
          this.post("You've already been spawned in");
        }
        break;
        
      case ">sw":
        let wrld = this.world.showWorld().split("\n")
        wrld.forEach((str) => this.post(str))
        break;
        
      case "u" || "up" || "move up":
        if (this.player.posI - 1 >= 0) {
          this.player.posI -= 1;
          this.post("Moving up");
        }
        this.world.players.pop(); // Find a better way to do this! MAKE AN UPDATE PLAYER METHOD
        this.world.players.push(this.player);
        break;
        
      default:
        this.post(`"${this.command}" not recognized as a command`);
        break;
    }
  }
  
  public post(msg: string) {
    this.messages.push(msg);
    this.command = "";
    if (this.messages.length > 5) {
      this.messages.slice(0);
    }
  }
  
  randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

interface Command {
  name: string;
  description: string;
}