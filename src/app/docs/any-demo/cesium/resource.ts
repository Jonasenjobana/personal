// import ship1 from '/assets/map/ship/1.png';
// import ship2 from '/assets/map/ship/2.png';
// import ship3 from '/assets/map/ship/3.png';
// import ship4 from '/assets/map/ship/4.png';
// import ship5 from '/assets/map/ship/5.png';
// import ship6 from '/assets/map/ship/6.png';
// import ship7 from '/assets/map/ship/7.png';
// import ship8 from '/assets/map/ship/8.png';

export const ShipImageSource = {};
export function loadShipImageSource(type: string): Promise<HTMLImageElement> {
  if (ShipImageSource[type]) {
    return Promise.resolve(ShipImageSource[type]);
  }
  return new Promise((res, rej) => {
    const url = '/assets/map/ship/' + type + '.png';
    const image = new Image();
    image.src = url;
    ShipImageSource[type] = image;
    image.onload = () => {
      res(image);
    };
    image.onerror = () => {
      rej(null);
    };
  });
}
