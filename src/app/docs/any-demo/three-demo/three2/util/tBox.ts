import { Vector3, Box3, Sphere, PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
export class CameraAutoMover {
  private readonly camera: PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly animDuration = 1.0;

  constructor(camera: PerspectiveCamera, controls: OrbitControls) {
    this.camera = camera;
    this.controls = controls;
  }

  async moveToObject(object: THREE.Object3D) {
    // 1. 计算世界空间包围盒
    const box = new Box3().setFromObject(object);
    const center = new Vector3();
    box.getCenter(center);

    // 2. 转换为包围球简化计算
    const sphere = new Sphere();
    box.getBoundingSphere(sphere);

    // 3. 计算最佳观察距离
    const distance = this.calculateIdealDistance(sphere.radius);

    // 4. 确定目标方向
    const direction = new Vector3().subVectors(this.camera.position, center).normalize();

    // 5. 计算目标位置
    const targetPosition = new Vector3().copy(center).addScaledVector(direction, distance);

    // 6. 执行动画
    await this.animateCamera(targetPosition, center);
  }
  /**
   * 防止穿模，计算合适的观察距离
   * @param radius 
   * @returns 
   */
  private calculateIdealDistance(radius: number): number {
    // 根据视场角计算合适距离
    const fovRad = (this.camera.fov * Math.PI) / 180;
    return (radius / Math.tan(fovRad / 2)) * 1.5; // 1.5倍安全距离
  }

  private async animateCamera(targetPos: Vector3, targetLookAt: Vector3) {
    this.controls.enabled = false; // 禁用交互

    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();

    const startTime = performance.now();

    const update = () => {
      const t = Math.min(1, (performance.now() - startTime) / (this.animDuration * 1000));
      const smoothT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // 平滑缓动函数

      // 插值相机位置
      this.camera.position.lerpVectors(startPos, targetPos, smoothT);

      // 插值观察目标
      this.controls.target.lerpVectors(startTarget, targetLookAt, smoothT);
      this.controls.update();

      return t < 1;
    };

    // 使用动画循环
    return new Promise<void>(resolve => {
      const animate = () => {
        if (update()) {
          requestAnimationFrame(animate);
        } else {
          this.controls.enabled = true;
          resolve();
        }
      };
      animate();
    });
  }
}
