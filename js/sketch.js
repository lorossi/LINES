class Sketch extends Engine {
  setup() {
    // parameters
    this._duration = 600;
    this._items = 30;
    this._scl = 0.3;
    this._border = 0.4;
    this._recording = false;
    this._show_fps = false;
    this._random_saves = 0;
    // sketch setup
    console.clear();
    this._dPhi = Math.PI / this._items;

    this._w = (this._width * (1 - this._border)) / this._items;
    this._h = (this._height * (1 - this._border));
    // setup capturer
    if (this._recording) {
      this._capturer = new CCapture({ format: "png" });
      this._capturer_started = false;
    }
    // setup random saves
    this._save_frame = [];
    for (let i = 0; i < this._random_saves; i++) this._save_frame.push(Math.floor(Math.random() * this._duration));
  }

  draw() {
    if (!this._capturer_started && this._recording) {
      this._capturer_started = true;
      this._capturer.start();
      console.log("%c Recording started", "color: green; font-size: 2rem");
    }

    // variables setup
    const percent = (this._frameCount % this._duration) / this._duration;
    const dx = this._width * this._border / 2;
    const dy = this._height * this._border / 2;
    const ampl = Math.PI * 0.125;

    // now, draw!
    this.background("rgb(10, 10, 10)");
    this._ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < this._items; i++) {
      const phi = this.ease(percent) * Math.PI * 2 + this._dPhi * i + Math.PI;
      const dpos = 2;

      this._ctx.save();
      this._ctx.translate(dx + this._w * i, dy + this._h / 2);
      this._ctx.rotate(Math.sin(phi) * ampl);
      // main rect
      this._ctx.fillStyle = "rgb(220, 220, 220)";
      this._ctx.fillRect(0, -this._h / 2, this._w * this._scl, this._h);

      // chromatic aberration
      this._ctx.fillStyle = "rgba(220, 0, 0, 0.25)";
      this._ctx.fillRect(dpos, -this._h / 2, this._w * this._scl, this._h);
      this._ctx.fillStyle = "rgba(0, 220, 0, 0.25)";
      this._ctx.fillRect(-dpos, -this._h / 2, this._w * this._scl, this._h);
      this._ctx.fillStyle = "rgba(0, 0, 220, 0.25)";
      this._ctx.fillRect(0, dpos - this._h / 2, this._w * this._scl, this._h);

      this._ctx.restore();
    }

    if (this._save_frame.includes(this._frameCount)) this.saveFrame();

    // show FPS
    if (this._show_fps) {
      this._ctx.save();
      this._ctx.fillStyle = "red";
      this._ctx.font = "30px Hack";
      this._ctx.fillText(parseInt(this._frameRate), 40, 40);
      this._ctx.restore();
    }
    // handle recording
    if (this._recording) {
      if (this._frameCount <= this._duration) {
        this._capturer.capture(this._canvas);
      } else {
        this._recording = false;
        this._capturer.stop();
        this._capturer.save();
        console.log("%c Recording ended", "color: red; font-size: 2rem");
      }
    }
  }

  ease(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
  }
}