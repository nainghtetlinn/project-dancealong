import Point from './Point'

export default class Segment {
  private p1: Point
  private p2: Point
  private width: number = 2
  private color: string = 'white'

  constructor(p1: Point, p2: Point) {
    this.p1 = p1
    this.p2 = p2
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.lineWidth = this.width
    ctx.strokeStyle = this.color
    ctx.moveTo(this.p1.x, this.p1.y)
    ctx.lineTo(this.p2.x, this.p2.y)
    ctx.stroke()
  }

  setColor(color: string) {
    this.color = color
    return this
  }

  setWidth(width: number) {
    this.width = width
    return this
  }
}
