export default class Point {
  public x: number
  public y: number
  private size: number = 5
  private color: string = 'white'
  private fillColor: string = 'white'
  private fill: boolean = false

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  draw(ctx: CanvasRenderingContext2D) {
    const radius = this.size / 2
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2)
    ctx.fill()

    if (this.fill) {
      ctx.beginPath()
      ctx.arc(this.x, this.y, radius * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = this.fillColor
      ctx.fill()
    }
  }

  setSize(size: number) {
    this.size = size
    return this
  }

  setColor(color: string) {
    this.color = color
    return this
  }

  enableFill(color: string) {
    this.fill = true
    this.fillColor = color
    return this
  }
}
