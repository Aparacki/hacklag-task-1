export default function calcOuterRec(ang, w, h) {
    if (ang > 90 && ang < 180) {
        ang = 90 - Math.abs(90 - ang);
    }
    if (ang >= 180 && ang < 270) {
        console.log("e");
        ang = ang - 180;
    }

    if (ang >= 270) {
        ang = 360 - ang;
    }
    var t = (ang * Math.PI) / 180; // Convert to radians

    var x = Math.sin(t) * h + Math.cos(t) * w; // The bounding box width
    var y = Math.sin(t) * w + Math.cos(t) * h;
    console.log(ang);
    return [x,y]
}
