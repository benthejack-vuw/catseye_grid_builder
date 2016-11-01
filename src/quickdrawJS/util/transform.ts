// Last updated November 2011
// By Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Free to use and distribute at will
// So long as you are nice to people, etc

// Simple class for keeping track of the current transformation matrix

// For instance:
//    let t = new Transform();
//    t.rotate(5);
//    let m = t.m;
//    ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);

// Is equivalent to:
//    ctx.rotate(5);

// But now you can retrieve it :)

// Remember that this does not account for any CSS transforms applied to the canvas

import Point from "../geometry/point";

export default class Transform{

  protected m: Array<number>;

  constructor() {
    this.reset();
  }

  public set(arr:Array<number>):void{
    this.m = [].concat(arr);
  }

  public copy():Transform{
    var cpy:Transform = new Transform();
    cpy.set(this.m);
    return cpy;
  }

  public reset() {
    this.m = [1,0,0,1,0,0];
  }

  public multiply(matrix: Transform): void{
    let m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
    let m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

    let m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
    let m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

    let dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
    let dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
    this.m[4] = dx;
    this.m[5] = dy;
  };

  public invert(): void {
    let d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
    let m0 = this.m[3] * d;
    let m1 = -this.m[1] * d;
    let m2 = -this.m[2] * d;
    let m3 = this.m[0] * d;
    let m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
    let m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
    this.m[0] = m0;
    this.m[1] = m1;
    this.m[2] = m2;
    this.m[3] = m3;
    this.m[4] = m4;
    this.m[5] = m5;
  }

  public rotate(rad: number): void {

    let c = Math.cos(rad);
    let s = Math.sin(rad);
    let m11 = this.m[0] * c + this.m[2] * s;
    let m12 = this.m[1] * c + this.m[3] * s;
    let m21 = this.m[0] * -s + this.m[2] * c;
    let m22 = this.m[1] * -s + this.m[3] * c;
    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
  }

  public translate(x: number, y:number): void{
    this.m[4] += this.m[0] * x + this.m[2] * y;
    this.m[5] += this.m[1] * x + this.m[3] * y;
  }

  public scale(sx: number, sy:number): void{
    this.m[0] *= sx;
    this.m[1] *= sx;
    this.m[2] *= sy;
    this.m[3] *= sy;
  }

  public transformPoint(pt: Point): Point{
    let tx = pt.x;
    let ty = pt.y;
    let px = tx * this.m[0] + ty * this.m[2] + this.m[4];
    let py = tx * this.m[1] + ty * this.m[3] + this.m[5];

    return new Point(px, py);
  }

  public apply(context:CanvasRenderingContext2D):void{
    context.setTransform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5])
  }

}