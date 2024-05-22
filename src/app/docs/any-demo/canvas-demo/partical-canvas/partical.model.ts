export class FireworkPartical {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number = 0;
  // 距离圆心位置
  r: number = 0;
  size: number = 1;
  color: string = 'rgb(112, 219, 110)';
  tailPartical: FireworkPartical[] = [];
  constructor(x: number, y: number, vx: number, vy: number, age?: number) {
    this.age = age ?? 0;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }
}
export class Firework {
  particals: FireworkPartical[] = [];
  // 爆炸状态 0 烟花上升 1 正在爆炸 2 爆炸结束
  status: number = 0;
  option: any = {
    // 烟花上升初速度
    maxSpeed: 3.6,
    minSpeed: 1.6,
    // 加速度
    accelerate: 0.01,
    // 粒子爆炸掉落速度
    maxDrop: 2,
    minDrop: 0.5,
    // 最小高度
    minFly: 200,
    // 最大高度
    maxFly: 800,
    maxWidth: 700,
    color: '#0153a6',
    // 粒子周期
    minAge: 31,
    maxAge: 90,
    // 烟花爆炸半径
    radius: 150,
    // 烟花爆炸颜色
    fireColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(75, 192, 192, 1)'
    ]
  };
  // 尾焰 粒子数
  tailpipe: number = this.random(12, 22);
  // 烟花爆炸高度
  fly: number = 0;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.initFirework();
  }
  initFirework() {
    const { maxWidth, minFly, maxFly, maxSpeed, minSpeed, accelerate } = this.option;
    this.status = 0;
    this.fly = this.random(minFly, maxFly);
    this.particals = [new FireworkPartical(this.random(0, maxWidth), 0, 0, this.random(minSpeed, maxSpeed))];
  }
  destroy() {
    this.particals = [];
  }

  render() {
    switch (this.status) {
      case 0:
        this.launch();
        break;
      case 1:
        this.boom();
        break;
      case 2:
        this.finish();
        break;
    }
  }
  launch() {
    const { minAge, maxAge, accelerate, maxSpeed, minSpeed, fireColor } = this.option;
    // 上升粒子
    const partical = this.particals[0];
    partical.x += partical.vx;
    partical.y += partical.vy;
    partical.vy += accelerate;
    this.ctx.save();
    this.ctx.fillStyle = 'rgb(255, 255, 255)';
    this.ctx.fillRect(partical.x, partical.y, 2, 3);
    let preY = partical.y;
    // 焰尾
    for (let i = this.tailpipe; i > 0; i--) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${i / this.tailpipe})`;
      this.ctx.fillRect(partical.x, preY, 2, 1);
      preY -= 1;
    }
    this.ctx.restore();
    if (partical.y > this.fly) {
      this.status = 1;
      // 爆炸状态
      // 初始化爆炸粒子
      const boomCount = 500;
      this.particals = new Array(boomCount).fill(0).map((el, idx) => {
        // 爆炸初速度
        let v = this.random(minSpeed, maxSpeed);
        let θ = (360 * boomCount) / (idx + 1);
        let color = fireColor[Math.floor(this.random(0, 5))];
        let newP = new FireworkPartical(
          partical.x,
          partical.y,
          Math.sin(θ) * v,
          Math.cos(θ) * v,
          this.random(minAge, maxAge)
        );
        newP.color = color;
        return newP;
      });
      // 爆炸高亮
      this.ctx.save();
      this.ctx.fillStyle = 'rgba(255,255,255,0.05)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.restore();
    }
  }
  boom() {
    this.ctx.save();
    this.particals.forEach((partical, idx) => {
      const { x, y, vx, vy, age } = partical;
      partical.age--;
      if (partical.age > 0) {
        partical.x += partical.vx;
        partical.y += partical.vy;
        partical.vy -= 0.05;
        this.ctx.fillStyle = partical.color;
        this.ctx.fillRect(partical.x, partical.y, 2, 3);
        partical.tailPartical.forEach((el, i) => {
          this.ctx.globalAlpha = (partical.tailPartical.length - i) / this.tailpipe;
          this.ctx.fillRect(el.x, el.y, 2, 1);
        });
        // 尾焰粒子
        partical.tailPartical.unshift(new FireworkPartical(x, y, vx, vy, age));
        partical.tailPartical = partical.tailPartical.slice(0, 12);
      }
    });
    this.ctx.restore();
    this.particals = this.particals.filter(el => el.age > 0);
    // 爆炸完成
    if (this.particals.length == 0) {
      this.status = 2;
      return;
    }
  }
  finish() {
    this.initFirework();
  }
  random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
// 烟花控制
export class FireworkControl {
  maxFirework: number = 10;
  ctx: CanvasRenderingContext2D;
  fireworks: Firework[] = [];
  twinkle: TwinkleStars;
  animeId: number;
  width: number;
  height: number;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    const stream = ctx.canvas.captureStream(60)
    const recorder = new MediaRecorder(stream);
    let chunks = []
    recorder.ondataavailable = (e) => {
      chunks.push(e.data)
    };
    recorder.start();
    recorder.onstop = (e) => {
      var blob = new Blob(chunks, { 'type' : 'video/webm' });
      var url = URL.createObjectURL(blob);
      // 你可以用这个URL创建一个视频元素，进行预览
      var video = document.createElement('video');
      document.body.appendChild(video)
      video.src = url;
      console.log(url, chunks,' stop ')
    }
    setTimeout(() => {
      recorder.stop()
    }, 10000);
    this.fireworks = new Array(this.maxFirework).fill(0).map((el, idx) => {
      return new Firework(ctx);
    });
    this.twinkle = new TwinkleStars(ctx);
    this.render();
  }
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  render() {
    this.clear();
    this.fireworks.forEach(el => {
      el.render();
    });
    this.twinkle.render();
    this.animeId = requestAnimationFrame(() => {
      this.render();
    });
  }
  stop() {
    cancelAnimationFrame(this.animeId);
  }
  destroy() {
    this.fireworks.forEach(el => el.destroy());
  }
}
export class TwinkleStar {
  x: number;
  y: number;
  size: number;
  frequency: number;
  changeFrequency: number;
  flashTime: number = 4;
  constructor(x: number, y: number, size: number, frequency: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.frequency = frequency;
    this.changeFrequency = frequency;
  }
  render(ctx: CanvasRenderingContext2D) {
    this.changeFrequency > 0 && this.changeFrequency--;
    if (this.changeFrequency == 0) {
      this.flashTime--;
      ctx.fillStyle = `rgba(0,0,0)`;
      ctx.fillRect(this.x, this.y, this.size, this.size);
      // flash
      if (this.flashTime == 0) {
        this.flashTime = 4;
        this.changeFrequency = this.frequency;
      }
    } else {
        ctx.fillStyle = `rgba(255,255,255)`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  }
}
// 闪烁星星
export class TwinkleStars {
  option: any = {
    rate: 1 / 20000,
    frequency: [31, 125],
    size: [1, 2]
  };
  twinkleStart: TwinkleStar[] = [];
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.width = ctx.canvas.width;
    this.height = ctx.canvas.height;
    this.init();
  }
  init() {
    const { rate, size, frequency } = this.option;
    const count = Math.round(this.width * this.height * rate)
    this.twinkleStart = new Array(count).fill(0).map((el, idx) => {
      return new TwinkleStar(
        this.random(0, this.width),
        this.random(0, this.height),
        Math.round(this.random(...(size as [number, number]))),
        Math.round(this.random(...(frequency as [number, number])))
      );
    });
  }
  render() {
    this.twinkleStart.forEach(el => {
        el.render(this.ctx);
    })
  }
  random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}
