// 粒子
class Particle {
    id
    size
    x
    y
    constructor(x, y) {
        this.id = Date.now()
        this.size = 10
        // x坐标
        this.x = x
        // y坐标
        this.y = y
    }
}
// 粒子管理
class ParticeManager {
    particles
    particlesMap
    constructor() {
        this.particles = []
        this.particlesMap = {}
    }
    init(num) {
        let i = num
        while (i > 0) {
            const x = Math.floor(Math.random() * 500 + 1);
            const y = Math.floor(Math.random() * 500 + 1);
            this._add(new Particle(x, y))
            i--
        }
    }

    _add(particle) {
        this.particles.push(particle)
        this.particlesMap[particle.id] = this.particles.length - 1
    }

    _remove(id) {
        this.particles.splice(this.particlesMap[id], 1)
        delete this.particlesMap[id]
    }

    update(callback) {
        this.particles.forEach(p => {
            callback(p)
        })
    }

    get() {
        return this.particles
    }
}