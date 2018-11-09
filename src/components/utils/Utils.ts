export function calcOuterRec(ang: number, w: number, h: number):number[] {
    if (ang > 90 && ang < 180) {
        ang = 90 - Math.abs(90 - ang);
    }
    if (ang >= 180 && ang < 270) {
        ang = ang - 180;
    }

    if (ang >= 270) {
        ang = 360 - ang;
    }
    var t = (ang * Math.PI) / 180; // Convert to radians

    var x = Math.sin(t) * h + Math.cos(t) * w; // The bounding box width
    var y = Math.sin(t) * w + Math.cos(t) * h;
    return [x, y];
}

export function calcPrevImgSize(maxPrevWidth:number, imgSize:number[]):number[]{
      let width: number = maxPrevWidth;
      let height: number = (width * imgSize[1]) / imgSize[0];
      if (imgSize[1] > imgSize[0]) {
         height = maxPrevWidth;
         width = (height * imgSize[0]) / imgSize[1];
      }    
      return [width,height];
}

