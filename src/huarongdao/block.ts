import * as PIXI from "pixi.js"
import { Board } from './board';

interface BlockInfo{
  title: number,
  row: number,
  col: number,
  width: number,
  height: number,
  totolCol: number
}
interface FontInfo{
  dropShadowBlur: number,
  dropShadowDistance: number,
  fontSize: number,
  strokeThickness: number
}

export class Block extends PIXI.Sprite{
  private _num: number;
  private _container: PIXI.Container;
  private _row: number;
  private _col: number;
  private _curBoard: Board;
  private _numText: PIXI.Text;
  private _totalCol = 4;
  constructor(borard: Board, info: BlockInfo, texture?: PIXI.Texture, ) {
    super(texture)
    this._num = info.title;
    this._curBoard = borard;
    this._container = new PIXI.Container();
    this._row = info.row;
    this._col = info.col;
    this._width = info.width;
    this._height = info.height;
    this._totalCol = info.totolCol;

    this.drawSelf(info.row, info.col);
    this.interactive = false;
    this.buttonMode = false;

    this.on('pointerdown', this.onSelect.bind(this));
  }

  enableBlock() {
    this.interactive = true;
    this.buttonMode = true;
  }

  get block() {
    return this._container;
  }

  set row(rowNum: number) {
    this._row = rowNum;
  }

  set col(colNum: number) {
    this._col = colNum;
  }

  moveLeft() : void{
    this._col -= 1;
    this.x -= this._width;
  }

  moveRight(): void{
    this._col += 1;
    this.x += this._width;    
  }

  moveUp(): void{
    this._row -= 1;
    this.y -= this._height;
  }

  moveDown(): void{
    this._row += 1;
    this.y += this._height;
  }

  onSelect() {
    this._curBoard.processBtn(this._num, this._row, this._col);
  }

  getFontWeight(): FontInfo{
    if (this._width > 100) {
      switch (this._totalCol) {
        case 5: {
          return {
            dropShadowBlur: 4,
            dropShadowDistance: 10,
            fontSize: 50,
            strokeThickness: 10
          };
        }
        case 4: {
          return {
            dropShadowBlur: 4,
            dropShadowDistance: 10,
            fontSize: 70,
            strokeThickness: 15
          };
        }
        default: {
          return {
            dropShadowBlur: 4,
            dropShadowDistance: 10,
            fontSize: 70,
            strokeThickness: 15
          };
        }
      }
        
    } else {
      switch (this._totalCol) {
        case 5: {
          return {
            dropShadowBlur: 2,
            dropShadowDistance: 4,
            fontSize: 20,
            strokeThickness: 5
          };
        }
        case 4: {
          return {
            dropShadowBlur: 2,
            dropShadowDistance: 4,
            fontSize: 35,
            strokeThickness: 8
          };
        }
        default: {
          return {
            dropShadowBlur: 2,
            dropShadowDistance: 4,
            fontSize: 35,
            strokeThickness: 8
          };
        }
      }
        
    }
  }

  getTextPosition(width: number): { x: number, y: number }{
    switch (this._totalCol) {
      case 5:
        {
          let x = this._num > 9 ? width / 6 : width / 4;
          let y = width / 5;
          return { x, y };

        }
      case 4:
        {
          let x = this._num > 9 ? width / 5 : width / 3;
          let y = width/5;
          return { x, y };
        }
      default:
        {
          let x = this._num > 9 ? width / 5 : width / 3;
          let y = width/5;
          return { x, y };
        }
        
    }
  }

  drawSelf(x:number, y: number): void{
    const graphics = new PIXI.Graphics();
    let boarder = 2;
    let width = this._width - 2* boarder;
    let height = this._height - 2 * boarder;
    let fontInfo = this.getFontWeight();
    
    graphics.lineStyle(boarder, 0x666666, 2);
    graphics.beginFill(0x996633);
    graphics.drawRect(0, 0, width, height);
    graphics.endFill();

    this._container.addChild(graphics);

    const textStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      dropShadow: true,
      dropShadowAlpha: 0.7,
      dropShadowAngle: 1.1,
      dropShadowBlur: fontInfo.dropShadowBlur,
      dropShadowColor: "0x111111",
      dropShadowDistance: fontInfo.dropShadowDistance,
      fill: ['#ffffff'],
      stroke: '#664620',
      fontSize: fontInfo.fontSize,
      fontWeight: "bolder",
      lineJoin: "round",
      strokeThickness: fontInfo.strokeThickness
    });

    this._numText = new PIXI.Text(this._num.toString(), textStyle);
    this._numText.x = this.getTextPosition(width).x; 
    this._numText.y = this.getTextPosition(width).y;//width/5;
    this._container.addChild(this._numText);
    this.addChild(this._container);
  }

  get blockName() {
    return this._num;
  }

  disableBlock() {
    this.interactive = true;
    this.buttonMode = true;
  }
}