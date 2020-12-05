import * as PIXI from "pixi.js";
import { Scene } from './scene';
import { Board } from "./board";
import { Block } from "./block";
import { Button } from "./myui";
import Game from './game';

class HuaRongDao extends Scene{
  private _header: PIXI.Container;
  private _boarder: Board;
  private _col: number;
  private _row: number;
  private _curLevel: number = 1;
  private _countUp: number;
  private _curTime: Date;
  private _state = 0;
  private _lastTime = 0;
  private _style: PIXI.TextStyle;
  private _levelText: PIXI.Text;
  private _bestText: PIXI.Text;
  private _currentText: PIXI.Text;
  private _bestTime: number;
  private _congratulationText: PIXI.Text;
  private _resultTime: PIXI.Text;
  private _resultBest: PIXI.Text;

  constructor(app: PIXI.Application) {
    super(app);

    this._countUp = 99999;
    this._row = this.getConfig(this._curLevel).row;
    this._col = this.getConfig(this._curLevel).col;
    this._header = new PIXI.Container();
    let border = this.app.screen.width / 10;
    this._header.x = border;
    this._header.y = border;
    let widthH = this.app.screen.width - 2 * border;
    let heightH = this.app.screen.height / 6;
    this._header.width = widthH;
    this._header.height = heightH;
    let best = localStorage.getItem("bestTime");
    this._bestTime = best ? parseInt(best) : 999;

    const graphicsH = new PIXI.Graphics();
    graphicsH.lineStyle(4, 0xffffff, 1);
    graphicsH.beginFill(0xcc6633);
    graphicsH.drawRect(0, 0, widthH, heightH);
    graphicsH.endFill();

    this._header.addChild(graphicsH);


    this.drawBoarder();

    this.containner.addChild(this.header);
    this.containner.addChild(this.boarder.board);

    this._curTime = new Date();
    this._curTime.getSeconds();
    this.drawHeader();
    this.initResult();

    console.log("=====", PIXI.Texture);
    
    let play = new Button(PIXI.Texture.from("btn_huang.png"), "Start");

    play.x = app.screen.width / 2 + 10;
    play.y = 10;
    if (app.screen.width < 640) {
      play.scale.set(0.5);
    }
    this.onPlay = this.onPlay.bind(this);
    play.on('pointerdown', this.onPlay); 
    this._header.addChild(play);


  }

  initResult() {
    let height = 400;
    let left = 40;
    let top = 180;
    let x = 80;
    let y = 180; 
    let span = 100;
    if (this.app.screen.width < 500) {
      height = 300;
      left = 20;
      top = 100;
      x = 40;
      y = 110;
      span = 40;
    }
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0x262626, 1);
    graphics.beginFill(0x663300, 0.9);
    graphics.drawRoundedRect(left, top, height, height, 16);
    graphics.endFill();

    this.resultContainner.addChild(graphics);
    this.resultContainner.x = x;
    this.resultContainner.y = y;
    this.resultContainner.visible = false;
    this._congratulationText = new PIXI.Text("Congratulation", this._style);
    this.resultContainner.addChild(this._congratulationText);
    this._congratulationText.x = x;
    this._congratulationText.y = y + span;

    this._resultTime = new PIXI.Text("Time: 999", this._style);
    this.resultContainner.addChild(this._resultTime);
    this._resultTime.x = x;
    this._resultTime.y = y + span*2;

    this._resultBest = new PIXI.Text("Best: "+this._bestTime, this._style);
    this.resultContainner.addChild(this._resultBest);
    this._resultBest.x = x;
    this._resultBest.y = y + span * 3;

  }

  draw() :void{
  }

  getConfig(level:number): {row:number, col:number, width: number, height:number, hBlock: number} {
    let nameLevel = 'level' + level;
    let mWidth = Math.floor(this.app.screen.width * 4 / 5);
    let width = this.app.screen.width > 640? 640: mWidth;
    // return config['huaRongDao'][nameLevel];
    return { row: 4, col: 4, width: width, height: width, hBlock: Math.floor(width/4) };
    // return { row: 5, col: 4, width: 640, height: 800, hBlock: 160 };
    // return { row: 5, col: 5, width: 600, height: 600 , hBlock: 120};
  }

  getBestCount(): number{
    return this._bestTime;
  }

  get header() {
    return this._header;
  }

  get boarder(): Board {
    return this._boarder;
  }

  private drawHeader(): void{
    let fontSize = 40;
    let span = 80;
    if (this.app.screen.width < 500) {
      fontSize = 23;
      span = 55;
    }
    this._style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      dropShadow: true,
      dropShadowAlpha: 0.6,
      dropShadowAngle: 1.1,
      dropShadowBlur: 1,
      dropShadowColor: "0x111111",
      dropShadowDistance: 2,
      fill: ['#ffffff'],
      stroke: '#664620',
      fontSize: fontSize,
      fontWeight: "lighter",
      lineJoin: "round",
      strokeThickness: 8
    });
  
    let lText = 'Level: ' + this._row + " x " + this._col;
    this._levelText = new PIXI.Text(lText, this._style);
    this._levelText.x = 20;
    this._levelText.y = 15;

    this._bestText = new PIXI.Text('Best: '+this.getBestCount(), this._style);
    this._bestText.x = 20;
    this._bestText.y = 15 + span;


    this._currentText = new PIXI.Text('Current: '+this._countUp, this._style);
    this._currentText.x = this.header.width * 2 / 5;
    this._currentText.y = 15 + span;

    this.header.addChild(this._levelText);
    this.header.addChild(this._bestText);
    this.header.addChild(this._currentText);
  }

  onPlay(): void{
    this._countUp = 0;
    this._state = 1;
    Game.getInstance().startGame();
    this._boarder.newGame();
    this._curTime.getSeconds();
    this.resultContainner.visible = false;
  }

  private drawBoarder(): Board{
    let gameInfo = this.getConfig(this._curLevel);
    let width = gameInfo.width - (gameInfo.width % 4);
    let height = gameInfo.height-(gameInfo.height % 4);
    let hBlock = gameInfo.hBlock;
    this._boarder = new Board({
      x: Math.floor((this.app.screen.width - width) / 2),
      y: Math.floor(this.header.height + 100),
      width: width,
      height: height,
      row: this._row,
      col: this._col,
      blockW: hBlock,
      blockH: hBlock
    })
    return this._boarder;
  }

  gameTimer(): void{
    if (this._state) {
      let cur = new Date().getSeconds();
      if (cur != this._lastTime) {
        this._countUp++;        
        this._lastTime = cur;
        this.updateCount(this._countUp);
      }      
    }
    
  }

  gameFinished(): void{
    this._state = 0;
    if (this._countUp < this._bestTime) {
      this._bestTime = this._countUp;
      localStorage.setItem('bestTime', this._bestTime.toString());

    }
    this.boarder.endGame();
    this.showResult();
  }

  showResult(): void{
    this._resultTime.text = "Time: " + this._countUp;
    this._resultBest.text = "Best: " + this._bestTime;
    this.resultContainner.visible = true;
  }

  private updateCount(count: number) {
    this._currentText.text = 'Current: ' + count;
  }

  private updateLevel() {
    this._levelText.text = 'Level: ' + this._row + " x " + this._col;
  }

  private updateBest() {
    this._bestText.text = 'Best: ' + this._bestTime;
  }
}

export default HuaRongDao;