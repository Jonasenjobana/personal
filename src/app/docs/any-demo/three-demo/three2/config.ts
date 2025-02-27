export interface CameraTrackOption {
    key: string,
    position: [number, number, number],
    target: [number, number, number],
    orbit?: any // 相机轨迹
}
export const CameraTrack: CameraTrackOption[] = [
    {
        key: '003',
        position: [-183, 12, -233],
        target: [-180, 2.5, -249],
    }
]