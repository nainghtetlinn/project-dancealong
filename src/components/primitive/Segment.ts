import Point from './Point'

type SegmentOptions = {
  width?: number
  color?: string
}

export default class Segment {
  private p1: Point
  private p2: Point
  private width: number = 2
  private color: string = 'white'

  constructor(p1: Point, p2: Point, options?: SegmentOptions) {
    this.p1 = p1
    this.p2 = p2

    if (options) {
      if (options.width !== undefined) this.width = options.width
      if (options.color !== undefined) this.color = options.color
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.lineWidth = this.width
    ctx.strokeStyle = this.color
    ctx.moveTo(this.p1.x, this.p1.y)
    ctx.lineTo(this.p2.x, this.p2.y)
    ctx.stroke()
  }
}
