import * as PIXI from "pixi.js";
import HuaRongDao from './huarongdao';
import { Scene } from "./scene";
import screenfull from "screenfull";


class Game{
  static _gGame: Game;
  _app: PIXI.Application;
  loadder: PIXI.Loader;
  _scene: Scene;
  _width: number;
  _height: number;
  _sprites: {};

  private constructor() {
    window.onload = function () {
      if (document.fullscreenEnabled) {
        console.log("enable fullscreen");
      }
      document.getElementById('screenfull').addEventListener("click", () =>
      {
        console.log("click");
        if (screenfull.isEnabled) {
          screenfull.request();
        }
      })
      this._width = window.innerWidth > 640? 640 : window.innerWidth; // 640
      this._height = window.innerWidth > 640? 1136: window.innerHeight; // 1136
      this._app = new PIXI.Application({
        width: this._width,
        height: this._height,
        backgroundColor: 0xc0c0c0
      });

      this._app.renderer.autoResize = true;
      this._app.renderer.view.style.position = "relative";//"absolute";
      this._app.renderer.view.style.display = "block";
      this._app.renderer.resize(this._width, this._height);
      console.log("width:", window.innerWidth, 'height:', window.innerHeight);
      this.loadRes();
      
      document.body.appendChild(this._app.view);
  
      console.log('Game Init ok!');
    }.bind(this);

  }

  startGame() :void {
    
  }

  static getInstance() {
    if (!Game._gGame) {
      Game._gGame = new Game(); 
    }
    return Game._gGame
  }

  private loadRes(): void {
    this._app.loader.add("assets/huarongdao/images/spritesheet.json")
     .load((loader, resources) => {
        console.log('Load Res OK!',PIXI.Texture);

        this.newGame();

        this._app.ticker.add(
          this.gameLoop.bind(this));
      });
    this._app.loader.onProgress.add((e) => {
      console.log(e.progress);
      })
  }

  gameLoop() {
    this._scene?.gameTimer(); 
  }

  get app() {
    return this._app;
  }

  newGame(): Scene {
    this._scene = new HuaRongDao(this._app);
    return this._scene;
  }

  gameFinished(): void {
    this._scene.gameFinished();
  }

  getGameScene(): Scene{
    return this._scene;
  }

}

Game.getInstance();

export default Game;
