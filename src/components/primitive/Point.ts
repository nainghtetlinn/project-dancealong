export type PointOptions = {
  size?: number
  color?: string
  fillColor?: string
}

export default class Point {
  public x: number
  public y: number
  private size: number = 5
  private color: string = 'white'
  private fillColor?: string = undefined

  constructor(x: number, y: number, options?: PointOptions) {
    this.x = x
    this.y = y

    if (options) {
      if (options.size !== undefined) this.size = options.size
      if (options.color !== undefined) this.color = options.color
      if (options.fillColor !== undefined) this.fillColor = options.fillColor
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const radius = this.size / 2
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2)
    ctx.fill()

    if (this.fillColor !== undefined) {
      ctx.beginPath()
      ctx.arc(this.x, this.y, radius * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = this.fillColor
      ctx.fill()
    }
  }
}
