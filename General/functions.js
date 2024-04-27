function generateBSpline(controlPoint, m, degree) {
  var curves = [];
  var knotVector = [];

  var n = controlPoint.length / 6;


  // Calculate the knot values based on the degree and number of control points
  for (var i = 0; i < n + degree + 1; i++) {
    if (i < degree + 1) {
      knotVector.push(0);
    } else if (i >= n) {
      knotVector.push(n - degree);
    } else {
      knotVector.push(i - degree);
    }
  }



  var basisFunc = function (i, j, t) {
    if (j == 0) {
      if (knotVector[i] <= t && t < (knotVector[(i + 1)])) {
        return 1;
      } else {
        return 0;
      }
    }

    var den1 = knotVector[i + j] - knotVector[i];
    var den2 = knotVector[i + j + 1] - knotVector[i + 1];

    var term1 = 0;
    var term2 = 0;


    if (den1 != 0 && !isNaN(den1)) {
      term1 = ((t - knotVector[i]) / den1) * basisFunc(i, j - 1, t);
    }

    if (den2 != 0 && !isNaN(den2)) {
      term2 = ((knotVector[i + j + 1] - t) / den2) * basisFunc(i + 1, j - 1, t);
    }

    return term1 + term2;
  }


  for (var t = 0; t < m; t++) {
    var x = 0;
    var y = 0;
    var z = 0;
    var r = 0;
    var g = 0;
    var b = 0;

    var u = (t / m * (knotVector[controlPoint.length / 6] - knotVector[degree])) + knotVector[degree];

    //C(t)
    for (var key = 0; key < n; key++) {

      var C = basisFunc(key, degree, u);
      x += (controlPoint[key * 6] * C);
      y += (controlPoint[key * 6 + 1] * C);
      z += (controlPoint[key * 6 + 2] * C);
      r += (controlPoint[key * 6 + 3] * C);
      g += (controlPoint[key * 6 + 4] * C);
      b += (controlPoint[key * 6 + 5] * C);
    }
    curves.push(x);
    curves.push(y);
    curves.push(z);
    curves.push(r);
    curves.push(g);
    curves.push(b);

  }
  return curves;
}
function generateCone(x, y, z, rad) {
  var list = []
  var r = 1;
  var g = 1;
  var b = 1;
  list.push(x, y, z + 2, r, g, b);
  for (var i = 0; i <= 360; i++) {
    var a = rad * Math.cos((i / 180) * Math.PI) + x;
    var b = rad * Math.sin((i / 180) * Math.PI) + y;
    list.push(a);
    list.push(b);
    list.push(z);
    list.push(r);
    list.push(g);
    list.push(b);

  }
  list.push(x, y, z, 1.0, 1.0, 1.0);
  return list;
}

function coneElement() {
  var list = [];
  for (var i = 1; i <= 360; i++) {
    list.push(0);
    list.push(i);
    list.push(i + 1);
  }
  for (var i = 1; i < 360; i++) {
    list.push(362);
    list.push(i);
    list.push(i + 1);
  }
  return list;
}

function generateSphere(x, y, z, radius, sectorCount, stackCount) {
  var vertices = [];
  var normals = [];
  var texCoords = [];

  var x, y, z, xy;
  var nx, ny, nz, lengthInv = 1.0 / radius;
  // console.log(lengthInv);
  var s, t;

  var sectorStep = 2 * Math.PI / sectorCount;
  var stackStep = Math.PI / stackCount;
  var sectorAngle, stackAngle;
  var rOdd = 1;
  var gOdd = 1;
  var bOdd = 1;

  var rEven = 1;
  var gEven = 1;
  var bEven = 1;

  for (var i = 0; i <= stackCount; ++i) {
    stackAngle = Math.PI / 2 - i * stackStep;    // starting from pi/2 to -pi/2
    xy = radius * Math.cos(stackAngle);              // r * cos(u)
    z = radius * Math.sin(stackAngle);           // r * sin(u)

    // add (sectorCount+1) vertices per stack
    // first and last vertices have same position and normal, but different tex coords
    for (var j = 0; j <= sectorCount; ++j) {
      sectorAngle = j * sectorStep;            // starting from 0 to 2pi

      // vertex position (x, y, z)
      x = xy * Math.cos(sectorAngle);              // r * cos(u) * cos(v)
      y = xy * Math.sin(sectorAngle);              // r * cos(u) * sin(v)
      vertices.push(x);
      vertices.push(y);
      vertices.push(z);
      if (i % 4 == 0) {
        vertices.push(rEven, gEven, bEven);
      } else {
        vertices.push(rOdd, gOdd, bOdd);
      }
      // iniiiiiiii
      vertices.push(0,1);

      // normalized vertex normal (nx, ny, nz)
      nx = x * lengthInv;
      ny = y * lengthInv;
      nz = z * lengthInv;
      normals.push(nx);
      normals.push(ny);
      normals.push(nz);
      // normals.push(r, g, b); 

      // vertex tex coord (s, t) range between [0, 1]
      s = parseFloat(j / sectorCount);
      t = parseFloat(i / stackCount);
      texCoords.push(s);
      texCoords.push(t);
      texCoords.push(nz);
      // texCoords.push(r, g, b);  
    }

  }

  // console.log("vertices:", vertices);
  // console.log("normals:", normals);
  // console.log("texCoords:", texCoords);
  return vertices;
}

// generate CCW index list of sphere triangles
// k1--k1+1
// |  / |
// | /  |
// k2--k2+1
function sphereElements(stackCount, sectorCount) {
  var indices = [];
  var lineIndices = [];
  var k1, k2;

  for (var i = 0; i < stackCount; i++) {
    k1 = i * (sectorCount + 1);// beginning of current stack
    k2 = k1 + sectorCount + 1; // beginning of next stack

    for (var j = 0; j < sectorCount; ++j, ++k1, ++k2) {
      // 2 triangles per sector excluding first and last stacks
      // k1 => k2 => k1+1
      if (i != 0) {
        indices.push(k1);
        indices.push(k2);
        indices.push(k1 + 1);
      }
      // k1+1 => k2 => k2+1
      if (i != (stackCount - 1)) {
        indices.push(k1 + 1);
        indices.push(k2);
        indices.push(k2 + 1);
      }
      // store indices for lines
      // vertical lines for all stacks, k1 => k2
      lineIndices.push(k1);
      lineIndices.push(k2);
      if (i != 0) { // horizontal lines except 1st stack, k1 => k+1
        lineIndices.push(k1);
        lineIndices.push(k1 + 1);
      }

    }
  }


  return indices;
}

function generateCylinder(x, y, z, rad, height, r =1 , g = 1, b = 1) {
  var list = [];
  var rColor = r;
  var gColor = g;
  var bColor = b;
  for (var i = 0; i < 360; i++) {
    // atas
    var a = rad * Math.cos((i / 180) * Math.PI) + x;
    var b = rad * Math.sin((i / 180) * Math.PI) + y;
    list.push(a);
    list.push(b);
    list.push(z);
    list.push(rColor);
    list.push(gColor);
    list.push(bColor);

    // list.push(0,1)

  };

  for (var i = 0; i < 360; i++) {
    // atas
    var a = rad * Math.cos((i / 180) * Math.PI) + x;
    var b = rad * Math.sin((i / 180) * Math.PI) + y;
    list.push(a);
    list.push(b);
    list.push(z - height);
    list.push(rColor);
    list.push(gColor);
    list.push(bColor);

    // list.push(0, 1)

  };
  // console.log(list);
  return list;
}

function cylinderElements() {
  var list = [];
  for (var i = 0; i <= 360; i++) {
    list.push(i);
    list.push(i + 360);
    list.push(i + 1);
    list.push(i + 1);
    list.push(i + 360);
    list.push(i + 362);
  }
  for (var i = 1; i < 360; i++) {
    list.push(0);
    list.push(i);
    list.push(i + 1);
  }
  for (var i = 360; i < 721; i++) {
    list.push(360);
    list.push(i);
    list.push(i + 1);
  }
  return list;
}


function generateSphereUV(xrad, yrad, zrad, step, stack){ //with UV
  var vertices = [];
  var faces = [];
  for(var i =0; i<=stack; i++){
    for(var j = 0; j<=step; j++){
      var u = i*1.0/stack * Math.PI;
      var v = j*1.0/step * 2 * Math.PI;

      var x = Math.cos(v)*Math.sin(u)*xrad;
      var y = Math.cos(u)*yrad;
      var z = Math.sin(v)*Math.sin(u)*zrad;

      u = i*1.0/stack;
      v = j*1.0/step;

      vertices.push(x,y,z, 1,1,1 ,u,v);

    }
  }

  for(var i = 0; i<=stack; i++){
    for(var j = 0; j<=step; j++){
      var a = i*step+j;
      var b = a+1;
      var c = a+step;
      var d = a+step+1;

      faces.push(a,b,d, a,d,c);
    }
  }

  return {"vertices":vertices, "faces":faces};
}


function bspline3D(listOfPoint, radius) {
  var totalPoints = 100

  var vertices = [];
  var indices = [];
  var points = generateBSpline(listOfPoint, totalPoints, (listOfPoint.length/6)-1)


  for (let i = 0; i < totalPoints * 2; i++) {
    for (let j = 0; j < 360; j++) {
      var angleInRadians = (j * Math.PI) / 180;
      var newX = points[i * 6] + Math.cos(angleInRadians) * radius; // Rotate around X-axis
      var newY = points[i * 6 + 1]; // Y-coordinate remains the same
      var newZ = points[i * 6 + 2] + Math.sin(angleInRadians) * radius; // Translate along Z-axis
      var r = points[i * 6 + 3]
      var g = points[i * 6 + 4]
      var b = points[i * 6 + 5]
      vertices.push(newX);
      vertices.push(newY);
      vertices.push(newZ);
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
    }
  }
  for (let i = 0; i < totalPoints * 2; i++) {
    for (let j = 0; j < 360; j++) {
      indices.push(j + (i * 360));
      indices.push(j + 360 + (i * 360));
      indices.push(j + 361 + (i * 360));

      indices.push(j + (i * 360));
      indices.push(j + 1 + (i * 360));
      indices.push(j + 361 + (i * 360));
    }
  }

  return { vertices, indices };
}
function RgenerateCylinderVertices(x, y, z, radiusX, radiusZ, height, r, g, b) {
  var vertices = [];
  vertices.push(x);
  vertices.push(y);
  vertices.push(z);
  vertices.push(r);
  vertices.push(g);
  vertices.push(b);
  for (let i = 0; i <= 360; i++) {
    var angleInRadians = (i * Math.PI) / 180;
    var newX = x + Math.cos(angleInRadians) * radiusX; // Rotate around X-axis
    var newY = y + Math.sin(angleInRadians) * radiusZ; // Y-coordinate remains the same
    var newZ = z ; // Translate along Z-axis
    vertices.push(newX);
    vertices.push(newY);
    vertices.push(newZ);
    vertices.push(r);
    vertices.push(g);
    vertices.push(b);
  }
  vertices.push(x);
  vertices.push(y);
  vertices.push(z+height);
  vertices.push(r);
  vertices.push(g);
  vertices.push(b);
  for (let i = 0; i <= 360; i++) {
    var angleInRadians = (i * Math.PI) / 180;
    var newX = x + Math.cos(angleInRadians) * radiusX; // Rotate around X-axis
    var newY = y + Math.sin(angleInRadians) * radiusZ; // Y-coordinate remains the same
    var newZ = z + height; // Translate along Z-axis
    vertices.push(newX);
    vertices.push(newY);
    vertices.push(newZ);
    vertices.push(r);
    vertices.push(g);
    vertices.push(b);
  }
  return vertices;
}
function RgenerateCylinderIndices() {
  var faces = [];

  for (let i = 0; i <= 360; i++) {
    faces.push(0);
    faces.push(i + 1);
    faces.push(i + 2);
  }
  for (let i = 362; i < 722; i++) {
    faces.push(362);
    faces.push(i + 1);
    faces.push(i + 2);
  }
  for (let i = 1; i <= 361; i++) {
    faces.push(i);
    faces.push(360 + i);
    faces.push(361 + i);

    faces.push(361 + i);
    faces.push(i);
    faces.push(i + 1);
  }
  return faces;
}
function JgenerateSaturRingVertices(x, y, z, lowRad, highRad, r, g, b){
  var vertices = [];
  for (let i = 0; i <= 360; i++) {
    var angleInRadians = (i * Math.PI) / 180;
    var newX = x + Math.cos(angleInRadians) * lowRad; // Rotate around X-axis
    var newY = y + Math.sin(angleInRadians) * lowRad; // Y-coordinate remains the same
    var newZ = z; // Translate along Z-axis
    vertices.push(newX);
    vertices.push(newY);
    vertices.push(newZ);
    vertices.push(r);
    vertices.push(g);
    vertices.push(b);
  }
  for (let i = 0; i <= 360; i++) {
    var angleInRadians = (i * Math.PI) / 180;
    var newX = x + Math.cos(angleInRadians) * highRad; // Rotate around X-axis
    var newY = y + Math.sin(angleInRadians) * highRad; // Y-coordinate remains the same
    var newZ = z ; // Translate along Z-axis
    vertices.push(newX);
    vertices.push(newY);
    vertices.push(newZ);
    vertices.push(r);
    vertices.push(g);
    vertices.push(b);
  }
  return vertices;
}
function JgenerateSaturnRingIndices(){
  var faces = [];
  for (let i = 0; i <= 360; i++) {
    faces.push(i);
    faces.push(i + 1);
    faces.push(i + 360);
    faces.push(i + 1);
    faces.push(i + 360);
    faces.push(i + 361);
  }
  return faces;
}


function McreateSphere(x, y, z, xRadius, yRadius, zRadius, latitudeBands, longitudeBands, r, g, b) {
  const positions = [];
  const indices = [];

  for (let lat = 0; lat <= latitudeBands; lat++) {
      const theta = lat * Math.PI / latitudeBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let long = 0; long <= longitudeBands; long++) {
          const phi = long * 2 * Math.PI / longitudeBands;
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);

          const xPosition = x + xRadius * cosPhi * sinTheta;
          const yPosition = y + yRadius * sinPhi * sinTheta;
          const zPosition = z + zRadius * cosTheta;

          positions.push(xPosition, yPosition, zPosition, r, g, b);
      }
  }

  for (let lat = 0; lat < latitudeBands; lat++) {
      for (let long = 0; long < longitudeBands; long++) {
          const first = (lat * (longitudeBands + 1)) + long;
          const second = first + longitudeBands + 1;

          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
      }
  }

  return { positions, indices };
}


function MgenerateBlockVertices(startX, startY, startZ, p, l, t, r, g, b,) {

  var vertices = [];

  vertices.push(startX, startY, startZ, r, g, b);//0 - kiri bwh
  vertices.push(startX + p, startY, startZ, r, g, b);//1 - kanan bwh
  vertices.push(startX + p, startY + t, startZ, r, g, b);//2 - kanan atas
  vertices.push(startX, startY + t, startZ, r, g, b);//3 - kiri atas

  vertices.push(startX, startY, startZ - l, r, g, b);//4 -kiri bwh
  vertices.push(startX + p, startY, startZ - l, r, g, b);//5 - kanan bwh
  vertices.push(startX + p, startY + t, startZ - l, r, g, b);//6 - kanan atas
  vertices.push(startX, startY + t, startZ - l, r, g, b);//7 - kiri atas

  return vertices;
}
function shuuBlockIndices() {
  var indices = [];

  indices.push(0);
  indices.push(1);
  indices.push(2);

  indices.push(2);
  indices.push(0);
  indices.push(3);

  indices.push(1);
  indices.push(2);
  indices.push(5);

  indices.push(2);
  indices.push(5);
  indices.push(6);

  indices.push(4);
  indices.push(5);
  indices.push(6);

  indices.push(4);
  indices.push(6);
  indices.push(7);

  indices.push(3);
  indices.push(0);
  indices.push(4);

  indices.push(3);
  indices.push(4);
  indices.push(7);

  indices.push(3);
  indices.push(2);
  indices.push(7);

  indices.push(2);
  indices.push(6);
  indices.push(7);

  indices.push(0);
  indices.push(1);
  indices.push(4);

  indices.push(1);
  indices.push(4);
  indices.push(5);

  return indices;
}





function UFOBody(radius, segments) {
  const vertices = [];
  const indices = [];
  const texCoords = []; // New array for texture coordinates

  // Generate vertices for both the top and bottom halves of the frisbee
  for (let i = 0; i <= segments; i++) {
      const lat = Math.PI * i / segments;
      const sinLat = Math.sin(lat);
      const cosLat = Math.cos(lat);

      // Adjust the y-coordinate based on the latitude to create a frisbee-like shape
      const adjustedY = cosLat * 0.2; // Adjust this value to make the shape flatter or rounder

      for (let j = 0; j <= segments; j++) {
          const lng = 2 * Math.PI * j / segments;
          const sinLng = Math.sin(lng);
          const cosLng = Math.cos(lng);

          const x = cosLng * sinLat;
          const y = adjustedY; // Use the adjusted y-coordinate
          const z = sinLng * sinLat;

          // Push vertices for the top half of the frisbee
          vertices.push(radius * x, radius * y, radius * z, 0.35, 0.3, 0.3);

          // Push vertices for the bottom half of the frisbee
          vertices.push(radius * x, -radius * y, radius * z, 0.3, 0.3, 0.3);

          // Push texture coordinates
          texCoords.push(j / segments, i / segments); // u, v

          if (i < segments && j < segments) {
              let first = i * (segments + 1) + j;
              let second = first + segments + 1;

              // Push indices for the top half of the frisbee
              indices.push(first, second, first + 1);
              indices.push(second, second + 1, first + 1);

              // Push indices for the bottom half of the frisbee
              indices.push(first + segments + 1, second + segments + 1, first + segments + 2);
              indices.push(second + segments + 1, second + segments + 2, first + segments + 2);
          }
      }
  }

  return { vertices, indices, texCoords }; // Include texCoords in the returned object
}

function createDome(radius, segments, capSegments) {
  const vertices = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
      const lat = Math.PI * i / 2 / segments;
      const sinLat = Math.sin(lat);
      const cosLat = Math.cos(lat);

      for (let j = 0; j <= segments; j++) {
          const lng = 2 * Math.PI * j / segments;
          const sinLng = Math.sin(lng);
          const cosLng = Math.cos(lng);
          const tanLng = Math.tan(lng);
          const secLng = 1 / Math.cos(lng);


          const x = cosLng * sinLat;
          const y = cosLat;
          const z = sinLng * sinLat;

          vertices.push(radius * x, radius * y, radius * z, 0.5, 0.5, 0.5);

          if (i < segments && j < segments) {
              let first = i * (segments + 1) + j;
              let second = first + segments + 1;

              indices.push(first, second, first + 1);
              indices.push(second, second + 1, first + 1);
          }
      }
  }

  return { vertices, indices };
}

function createCylinder(radius, height, segments, xoff, yoff, zoff) {
  const vertices = [];
  const indices = [];

  // Generate the vertices and indices for the sides of the cylinder
  for (let i = 0; i < segments; i++) {
      const angle = 2 * Math.PI * i / segments;
      const nextAngle = 2 * Math.PI * (i + 1) / segments;

      const x1 = radius * Math.cos(angle);
      const z1 = radius * Math.sin(angle);

      const x2 = radius * Math.cos(nextAngle);
      const z2 = radius * Math.sin(nextAngle);

      // Push the vertices for this segment
      vertices.push(x1 + xoff, height / 2 + yoff, z1 + zoff, 0.8, 0.8, 0.8);
      vertices.push(x2 + xoff, height / 2 + yoff, z2 + zoff, 0.8, 0.8, 0.8);
      vertices.push(x1 + xoff, -height / 2 + yoff, z1 + zoff, 0.8, 0.8, 0.8);
      vertices.push(x2 + xoff, -height / 2 + yoff, z2 + zoff, 0.8, 0.8, 0.8);

      // Push the indices that form the quad for this segment
      const first = i * 2;
      indices.push(first, first + 2, first + 1); // Changed the order here
      indices.push(first + 1, first + 2, first + 3); // And here
  }

  // Generate the vertices and indices for the top cap of the cylinder
  for (let i = 0; i < 360; i++) {
      const angle = (i / 180) * Math.PI;

      // Top cap
      vertices.push(radius * Math.cos(angle) + xoff, height / 2 + yoff, radius * Math.sin(angle) + zoff, 0.8, 0.8, 0.8);

      // Indices
      if (i < 359) {
          const start = segments * 2;
          indices.push(start, start + i + 1, start + i + 2);
      }
  }

  // Generate the vertices and indices for the bottom cap of the cylinder
  for (let i = 0; i <= 720; i++) { // Changed the loop condition to <= 360
      const angle = (i / 180) * Math.PI;

      // Bottom cap
      vertices.push(xoff, -height / 2 + yoff, zoff, 0.8, 0.8, 0.8); // Center point
      vertices.push(radius * Math.cos(angle) + xoff, -height / 2 + yoff, radius * Math.sin(angle) + zoff, 0.8, 0.8, 0.8); // Current point
      vertices.push(radius * Math.cos((angle + 1 / 180 * Math.PI)) + xoff, -height / 2 + yoff, radius * Math.sin((angle + 1 / 180 * Math.PI)) + zoff, 0.8, 0.8, 0.8); // Next point

      // Indices
      if (i < 720) { // Changed the condition to < 360
          const start = segments * 4 + 360 + i * 3;
          indices.push(start, start + 1, start + 2);
      }
  }

  return { vertices, indices };
}


function createEliptPara(radius, segments, capSegments, xoff, yoff, zoff) {
  const vertices = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
      //v
      const lat = Math.PI * i / segments;
      const sinLat = Math.sin(lat);
      const cosLat = Math.cos(lat);

      for (let j = 0; j <= segments; j++) {
          //u
          const lng = 2 * Math.PI * j / segments;
          const sinLng = Math.sin(lng);
          const cosLng = Math.cos(lng);
          const tanLng = Math.tan(lng);
          const secLng = 1 / Math.cos(lng);


          const x = lat * cosLng;
          const y = lat * sinLng;
          const z = lat * lat;

          vertices.push(radius * x + xoff, radius * y + yoff, radius * z + zoff, 0.3, 0.1, 0.1);

          if (i < segments && j < segments) {
              let first = i * (segments + 1) + j;
              let second = first + segments + 1;

              indices.push(first, second, first + 1);
              indices.push(second, second + 1, first + 1);
          }
      }
  }

  const start = vertices.length / 3;
  for (let i = 0; i <= capSegments; i++) {
      const lat = Math.PI * i / segments;
      const sinLat = Math.sin(lat);
      const cosLat = Math.cos(lat);

      for (let j = 0; j <= segments; j++) {
          const lng = 2 * Math.PI * j / segments;
          const sinLng = Math.sin(lng);
          const cosLng = Math.cos(lng);
          const tanLng = Math.tan(lng);
          const secLng = 1 / Math.cos(lng);

          const x = lat * cosLng;
          const y = lat * sinLng;
          const z = lat * lat;
          vertices.push(radius * x + xoff, radius * y + yoff, radius * z + zoff, 0.3, 0.1, 0.1);

          if (i < capSegments && j < segments) {
              let first = start + i * (segments + 1) + j;
              let second = first + segments + 1;

              indices.push(first, second, first + 1);
              indices.push(second, second + 1, first + 1);
          }
      }
  }

  return { vertices, indices };
}



function createEliptCone(radius, segments, capSegments, xoff, yoff, zoff, r, g, b) {
  const vertices = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
      //v
      const lat = Math.PI * i / segments;
      const sinLat = Math.sin(lat);
      const cosLat = Math.cos(lat);

      for (let j = 0; j <= segments; j++) {
          //u
          const lng = 2 * Math.PI * j / segments;
          const sinLng = Math.sin(lng);
          const cosLng = Math.cos(lng);
          const tanLng = Math.tan(lng);
          const secLng = 1/Math.cos(lng);


          const x = lat * cosLng;
          const y = lat*sinLng;
          const z = lat;

          vertices.push(radius * x+xoff, radius * y+yoff, radius * z+zoff, r, g, b);

          if (i < segments && j < segments) {
              let first = i * (segments + 1) + j;
              let second = first + segments + 1;

              indices.push(first, second, first + 1);
              indices.push(second, second + 1, first + 1);
          }
      }
  }

  const start = vertices.length / 3;
  for (let i = 0; i <= capSegments; i++) {
      const lat = Math.PI * i / segments;
      const sinLat = Math.sin(lat);
      const cosLat = Math.cos(lat);

      for (let j = 0; j <= segments; j++) {
          const lng = 2 * Math.PI * j / segments;
          const sinLng = Math.sin(lng);
          const cosLng = Math.cos(lng);
          const tanLng = Math.tan(lng);
          const secLng = 1/Math.cos(lng);


          const x = lat * cosLng;
          const y = lat*sinLng;
          const z = lat;

          vertices.push(radius * x+xoff, radius * y+yoff, radius * z+zoff, r, g, b);

          if (i < capSegments && j < segments) {
              let first = start + i * (segments + 1) + j;
              let second = first + segments + 1;

              indices.push(first, second, first + 1);
              indices.push(second, second + 1, first + 1);
          }
      }
  }

  return { vertices, indices };
}