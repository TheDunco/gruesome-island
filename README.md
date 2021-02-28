# GruesomeIsland
This is a web version of the 2020 CalvinHacks project started by myself, Andrew Baker, Advait Scaria, and Josh Ridder.

## What is Gruesome Island?
Gruesome Island is Andrew Baker's brainchild: a text based battle royale! Discover the world, pickup and use items, and outsmart your opponents to win!

Of course, that's the goal.

Started for the 2020 CalvinHacks, the original implementation of the game was made in 24 hours by 4 people. We ran into some major problems with the ways we were doing things, and having 4 people working at the same time on the same project was a bit of a nightmare. So, I got the inspiration the other day to re-create the idea in a web app! I figured it woudl make it more accessable and infinitely easier to do multiplayer games. After taking CS336 Web Development in Fall of 2020, I felt super confident about doing this in Angular, and it's turning out to be much easier.

## Play!
The current implementation is a work in progress, but to see my progress, check it out here:
https://gruesome-island-angular.web.app/

## Ideas
I've had a couple ideas for different game modes.
1. Blitz
  - typing speed/player speed based
  - no time or turn limitations: take actions as fast as you can
  
2. Turn/Move based (default)
  - no time limit per turn
  - Each player gets 3-5 (items like caffeine can increase this) moves per turn (different commands count as a differnt number of "moves")

3. Batch Blast
  - time limit to write command (probably ~10-20s)
  - Each player can only run 1 command per turn
  - One batch command ($) only counts as 1 command which makes stringing together commands critical and makes efficiency important

## Devs
This is an Angular 8 application that's currently deployed on Google's Firebase.
If you fork/clone the project, you might have to run `npm install` or `ng install` to get things set up.
After that, run `ng serve` to run the dev server.
