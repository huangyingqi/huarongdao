import * as PIXI from "pixi.js"
import { Block } from "./block"
import Game from './game';

interface ZeroPoint{
  row: number;
  col: number;
};
interface BlockMaps{
  [key:number]: Block
};

interface BoardInfo{
  x: number;  // x坐标
  y: number;  // y坐标
  width: number; // 宽度
  height: number; 
  row: number;  // 行数
  col: number;  // 列数
  blockW: number;
  blockH: number;
};

export class Board{
  private _board: PIXI.Container;
  private _bWidth: number;
  private _hBlock: number;
  private _blocks: BlockMaps={};
  private _count: number[];
  private _curZero: ZeroPoint;
  private _col: number;
  private _row: number;
    
  constructor(info: BoardInfo) {
    this._board = new PIXI.Container();
    this._board.x = info.x;
    this._board.y = info.y;

    this._board.width = info.width;
    this._board.height = info.height;
    this._bWidth = 20;
    this._hBlock = info.blockW;
    this._row = info.row;
    this._col = info.col;

    this._count = [];
    console.log('board' + JSON.stringify(info));
    for (let i = 0; i < info.row * info.col; i++){
      this._count.push(i);
    }
    this.drawBackground(info.width, info.height);

    this.initGame();
  }
  
  private drawBackground(width:number, height:number): void{
    const graphics = new PIXI.Graphics();
    let boarder = this._bWidth;
    let lineWidth = 2;

    graphics.lineStyle(boarder, 0x666666, 1);
    graphics.beginFill(0x663300);
    graphics.drawRect(0, 0, width+boarder, height+boarder);
    graphics.endFill();

    height = this._hBlock;
    boarder /= 2;

    graphics.lineStyle(lineWidth, 0x330000, 1);
    let x = height * this._col + boarder;
    for (let index = 1; index <this._col; index++) {
      let y = height*index+boarder;
      graphics.moveTo(boarder, y);
      graphics.lineTo(x, y);  
    }
    let y = height * this._row+ boarder;
    for (let index = 1; index < this._row; index++) {
      let x = height*index + boarder;
      graphics.moveTo(x, boarder);
      graphics.lineTo(x, y);  
    }
    
    this.board.addChild(graphics);
  }

  get board() : PIXI.Container{
    return this._board;
  }

  shuffle(arr: number[]): number[]{
    let n = arr.length;
    let random:number;
    while(0!=n){
        random =  (Math.random() * n--) >>> 0; // 无符号右移位运算符向下取整
        [arr[n], arr[random]] = [arr[random], arr[n]] // ES6的结构赋值实现变量互换
    }
    return arr;
  }

  newGame(): void{
    let Row = this._row;
    let Column = this._col;
    let count = this._count;
    let bWidth = this._bWidth / 2;
    let width = this._hBlock;
    let maxCount = this._row * this._col;
    let num = 0;
    count = this.shuffle(count);

    for (let i = 0; i < Row; i ++){
      for (let j = 0; j < Column; j++){
        if (count[num] == 0) {
          num++;
          this._curZero = { row: i, col: j };
          continue;         
        }

        let b = this.getBlock(count[num]);
        b.row = i;
        b.col = j;
        b.x = j * width + bWidth;
        b.y = i * width + bWidth;
        this._blocks[count[num]] = b;
        b.enableBlock();
        num++;
        if (num > maxCount) break;
      }
    }

    this._count = count;
  }

  getBlock(num: number) : Block{
    return this._blocks[num];
  }

  initGame(): void {
    let Row = this._row;
    let Column = this._col;
    let count = this._count;
    let bWidth = Math.floor(this._bWidth / 2);  //边框宽度的一半
    let width = this._hBlock;
    let maxCount = this._row * this._col;
    let num = 0;
    count = this.shuffle(count);
    console.log(count);

    for (let i = 0; i < Row; i ++){
      for (let j = 0; j < Column; j++){
        if (count[num] == 0) {
          num++;
          this._curZero = { row: i, col: j };
          continue;         
        }

        let b = new Block(this, {
          title: count[num],
          row: i,
          col: j,
          width: width,
          height: width,
          totolCol: Column
        });
        b.anchor.set(0.5);
        b.x = j * width + bWidth;
        b.y = i * width + bWidth;

        this._board.addChild(b);
        let numKey:number = count[num];

        this._blocks[numKey] = b;
        num++;
        if (num > maxCount) break;
      }
    }
    this._count = count;
  }

  processBtn(num: number, row: number, col: number) {
    if (row == this._curZero.row) {
      // console.log("同在一行");
      this.changeRow(col, row, this._curZero.col);
    } else if (col == this._curZero.col) {
      // console.log("同在一列");
      this.changeCol(row, col, this._curZero.row);
    } else {
      console.log("无法移动");
    }
    if (this.isGameFinish()) {
      console.log("game finished");
      // 需要停止计时
      Game.getInstance().gameFinished();
      // 需要屏幕禁止再点击
    }
  }

  changeRow(col: number, row: number, zeorCol: number): void {
    if (col < zeorCol) {
      while (zeorCol > col) {
        let zero = zeorCol + (row * this._col);
        let num = this._count[zero - 1];
        this._count[zero] = num;
        this._count[zero - 1] = 0;
        this._blocks[num].moveRight();
        zeorCol--;
      }
      this._curZero = { row: row, col: col };
    } else {
      while (col > zeorCol) {
        let zero = zeorCol + (row * this._col);
        let num = this._count[zero + 1];
        this._count[zero] = num;
        this._count[zero + 1] = 0;    
        this._blocks[num].moveLeft();
        zeorCol++;
      }
      this._curZero = { row: row, col: col };
    }
  }

  changeCol(row: number, col: number, zeorRow: number): void {
    let span = this._col;
    if (row < zeorRow) {
      while (zeorRow > row) {
        let zero = zeorRow * this._col + col;
        let num = this._count[zero - span];
        this._count[zero] = num;
        this._count[zero - span] = 0;
        this._blocks[num].moveDown();
        zeorRow--;
      }
      this._curZero = { row: row, col: col };
    } else {
      while (row > zeorRow) {
        let zero = zeorRow * this._col + col;
        let num = this._count[zero + span];
        this._count[zero] = num;
        this._count[zero + span] = 0;    
        this._blocks[num].moveUp();
        zeorRow++;
      }
      this._curZero = { row: row, col: col };
    }    
  }

  isGameFinish(): boolean {
    let nTotal = this._col * this._row - 1;
    let temp = 0;
    for (let i = 0; i < nTotal; i++){
      if (this._count[i] <= temp)
        return false;
      temp = this._count[i];
    }
    return true;
  }

  endGame(): void{
    let Row = this._row;
    let Column = this._col;
    let count = this._count;
    let num = 0;
    for (let i = 0; i < Row; i ++){
      for (let j = 0; j < Column; j++){
        if (count[num] == 0) {
          num++;
          continue;         
        }

        this.getBlock(count[num]).disableBlock();
      }
    }
  }
}