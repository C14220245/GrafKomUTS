function generateBSpline(controlPoint, m, degree){
    var curves = [];
    var knotVector = []
  
    var n = controlPoint.length/5;
  
   
    // Calculate the knot values based on the degree and number of control points
    for (var i = 0; i < n + degree+1; i++) {
      if (i < degree + 1) {
        knotVector.push(0);
      } else if (i >= n) {
        knotVector.push(n - degree);
      } else {
        knotVector.push(i - degree);
      }
    }
  
  
  
    var basisFunc = function(i,j,t){
        if (j == 0){
          if(knotVector[i] <= t && t<(knotVector[(i+1)])){
            return 1;
          }else{
            return 0;
          }
        }
  
        var den1 = knotVector[i + j] - knotVector[i];
        var den2 = knotVector[i + j + 1] - knotVector[i + 1];
       
        var term1 = 0;
        var term2 = 0;
     
   
        if (den1 != 0 && !isNaN(den1)) {
          term1 = ((t - knotVector[i]) / den1) * basisFunc(i,j-1,t);
        }
     
        if (den2 != 0 && !isNaN(den2)) {
          term2 = ((knotVector[i + j + 1] - t) / den2) * basisFunc(i+1,j-1,t);
        }
     
        return term1 + term2;
    }
  
   
    for(var t=0;t<m;t++){
      var x=0;
      var y=0;
     
      var u = (t/m * (knotVector[controlPoint.length/5] - knotVector[degree]) ) + knotVector[degree] ;
  
      //C(t)
      for(var key =0;key<n;key++){
  
        var C = basisFunc(key,degree,u);
        x+=(controlPoint[key*5] * C);
        y+=(controlPoint[key*5+1] * C);
      }
      curves.push(x);
      curves.push(y);
      curves.push(1);
      curves.push(1);
      curves.push(1);
     
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

function generateCylinder(x, y, z, rad, height) {
  var list = [];
  var rColor = 1;
  var gColor = 1;
  var bColor = 1;
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

    list.push(0,1)

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

    list.push(0, 1)

  };
  console.log(list);
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
