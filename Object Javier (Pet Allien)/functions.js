
function JdrawCircle(x, y, z, radius, r, g, b) {
    var vertices = [];
    for (let i = 0; i <= 360; i++) {
      var angleInRadians = (i * Math.PI) / 180;
      var newX = x; // X-coordinate remains the same
      var newY = y + Math.cos(angleInRadians) * radius; // Rotate around X-axis
      var newZ = z + Math.sin(angleInRadians) * radius; // Translate along Z-axis
      vertices.push(newX);
      vertices.push(newY);
      vertices.push(newZ);
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
    }
    return vertices;
  }
  function JgenerateCylinderVertices(x,y,z, radiusX,radiusZ, height, r,g,b){
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
      var newY = y; // Y-coordinate remains the same
      var newZ = z + Math.sin(angleInRadians) * radiusZ; // Translate along Z-axis
      vertices.push(newX);
      vertices.push(newY);
      vertices.push(newZ);
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
    }
    vertices.push(x);
    vertices.push(y+height);
    vertices.push(z);
    vertices.push(r);
    vertices.push(g);
    vertices.push(b);
    for (let i = 0; i <= 360; i++) {
      var angleInRadians = (i * Math.PI) / 180;
      var newX = x + Math.cos(angleInRadians) * radiusX; // Rotate around X-axis
      var newY = y+height; // Y-coordinate remains the same
      var newZ = z + Math.sin(angleInRadians) * radiusZ; // Translate along Z-axis
      vertices.push(newX);
      vertices.push(newY);
      vertices.push(newZ);
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
    }
    return vertices;
  }
  function JgenerateCylinderIndices(){
    var faces = [];
  
    for (let i = 0; i <= 360; i++) {
      faces.push(0);
      faces.push(i+1);
      faces.push(i+2);
    }
    for (let i = 362; i < 722; i++) {
      faces.push(362);
      faces.push(i+1);
      faces.push(i+2);
    }
    for (let i = 1; i <= 361; i++) {
      faces.push(i);
      faces.push(360+i);
      faces.push(361+i);
  
      faces.push(361+i);
      faces.push(i);
      faces.push(i+1);
    }
    return faces;
  }
  function Jelips(radiusX, radiusY, radiusZ, segments, r, g, b) {
    const vertices = [];
    const indices = [];
  
    // Generate vertices for both the top and bottom halves of the frisbee
    for (let i = 0; i <= segments; i++) {
        const lat = Math.PI * i / segments;
        const sinLat = Math.sin(lat);
        const cosLat = Math.cos(lat);
  
        // Adjust the y-coordinate based on the latitude to create a frisbee-like shape
        const adjustedY = cosLat * 0.4; // Adjust this value to make the shape flatter or rounder
  
        for (let j = 0; j <= segments; j++) {
            const lng = 2 * Math.PI * j / segments;
            const sinLng = Math.sin(lng);
            const cosLng = Math.cos(lng);
  
            const x = cosLng * sinLat;
            const y = adjustedY; // Use the adjusted y-coordinate
            const z = sinLng * sinLat;
  
            // Push vertices for the top half of the frisbee
            vertices.push(radiusX * x, radiusY * y, radiusZ * z, r, g, b);
  
            // Push vertices for the bottom half of the frisbee
            vertices.push(radiusX * x, -radiusY * y, radiusZ * z, r, g, b);
  
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
  
    return { vertices, indices };
  }

  function JcreateSphere(x, y, z, xRadius, yRadius, zRadius, latitudeBands, longitudeBands,r,g,b) {
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
  
            positions.push(xPosition, yPosition, zPosition,r,g,b);
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

function JcreateSaturn(x, y, z, xRadius, yRadius, zRadius, latitudeBands, longitudeBands, r, g, b) {
  const positions = [];
  const indices = [];
  var realR = r
  var realG = g
  var realB = b


  for (let lat = 0; lat <= latitudeBands; lat++) {
    const theta = lat * Math.PI / latitudeBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    if (random < 0.333) {
      r = 0 + 0.8 * realR;
      g = 0 + 0.8 * realG;
      b = 0 + 0.8 * realB;
    }
    else if (random > 0.666) {
      r = 0 + 0.9 * realR;
      g = 0 + 0.9 * realG;
      b = 0 + 0.9 * realB;
    }
    else {
      r = realR;
      g = realG;
      b = realB;
    }
    for (let long = 0; long <= longitudeBands; long++) {
      const phi = long * 2 * Math.PI / longitudeBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const xPosition = x + xRadius * cosPhi * sinTheta;
      const yPosition = y + yRadius * sinPhi * sinTheta;
      const zPosition = z + zRadius * cosTheta;

      var random = Math.random();
     

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

function JcreateMoon(x, y, z, xRadius, yRadius, zRadius, latitudeBands, longitudeBands, r, g, b) {
  const positions = [];
  const indices = [];
  var realR = r
  var realG = g
  var realB = b


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

      var random = Math.random();

      if (random < 0.1) {
        r = 0 + 0.8 * realR;
        g = 0 + 0.8 * realG;
        b = 0 + 0.8 * realB;
      }
      else if (random > 0.9) {
        r = 0 + 0.9 * realR;
        g = 0 + 0.9 * realG;
        b = 0 + 0.9 * realB;
      }
      else {
        r = realR;
        g = realG;
        b = realB;
      }


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


function JcreateBlackHole(x, y, z, xRadius, yRadius, zRadius, latitudeBands, longitudeBands, r, g, b) {
  const positions = [];
  const indices = [];
  var realR = r
  var realG = g
  var realB = b


  for (let lat = 0; lat <= latitudeBands; lat++) {
    const theta = lat * Math.PI / latitudeBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    var random = Math.random();

    if (random < 0.05) {
      r = 1 - 0.7 * realR;
      g = 1 - 0.7 * realG;
      b = 1 - 0.7 * realB;
    }
    else if (random > 0.95) {
      r = 1 - 0.8 * realR;
      g = 1 - 0.8 * realG;
      b = 1 - 0.8 * realB;
    }
    else {
      r = realR;
      g = realG;
      b = realB;
    }

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




  function JgenerateEarVertices(startX, startY, startZ, radius, height, red, green, blue, LoR){
  
    var redStatic = 0;
    var greenStatic = 0.6705882352941176;
    var blueStatic = 0.2549019607843137;
  
    var vertices = [];
  
    vertices.push(startX,startY,startZ,red,green,blue); //0-tengah
    
    if(LoR===0){
      vertices.push(startX+radius-0.5,startY,startZ,red,green,blue); //1-kanan
      vertices.push(startX-radius,startY,startZ-radius,red,green,blue); //2-kiri atas
      vertices.push(startX-radius,startY,startZ+radius,red,green,blue); //3-kiri bawah
      vertices.push(startX-radius,startY+height,startZ,red,green,blue); //4-puncak
      
      vertices.push(startX-(radius*0.75),startY+(height/2),startZ,0.06274509803921569,0.20392156862745098,0.01568627450980392); //5-anonym
      vertices.push(startX-radius,startY,startZ-radius,redStatic, greenStatic, blueStatic); //6-kiri atas anonym
      vertices.push(startX-radius,startY,startZ+radius,redStatic, greenStatic, blueStatic); //7-kiri bawah anonym
      vertices.push(startX-radius,startY+height,startZ,redStatic, greenStatic, blueStatic); //8-puncak anonym
    }else if(LoR===1){
      vertices.push(startX-radius+0.5,startY,startZ,red,green,blue); //1-kiri
      vertices.push(startX+radius,startY,startZ-radius,red,green,blue); //2-kanan atas
      vertices.push(startX+radius,startY,startZ+radius,red,green,blue); //3-kanan bawah
      vertices.push(startX+radius,startY+height,startZ,red,green,blue); //4-puncak
      
      vertices.push(startX+(radius*0.75),startY+(height/2),startZ,0.06274509803921569,0.20392156862745098,0.01568627450980392); //5-anonym
      vertices.push(startX+radius,startY,startZ-radius,redStatic, greenStatic, blueStatic); //6-kanan atas anonym
      vertices.push(startX+radius,startY,startZ+radius,redStatic, greenStatic, blueStatic); //7-kanan bawah anonym
      vertices.push(startX+radius,startY+height,startZ,redStatic, greenStatic, blueStatic); //8-puncak anonym
    }
  
    return vertices;
  }
  function JgenerateEarIndices(){
    var indices = [];
  
    //Normal
    //Fondasi
    indices.push(1);
    indices.push(2);
    indices.push(3);
    
    //Atas
    indices.push(1);
    indices.push(2);
    indices.push(4);
    
    //Bawah
    indices.push(1);
    indices.push(3);
    indices.push(4);
  
    //ANONYM
    indices.push(6);
    indices.push(5);
    indices.push(8);
  
    indices.push(6);
    indices.push(5);
    indices.push(7);
  
    indices.push(8);
    indices.push(5);
    indices.push(7);
  
    return indices;
  }
  function JgenerateArmVertices(x, y, z, radius, length, r, g, b){
    var vertices = [];
  
    var vertices = [];
    vertices.push(x);
    vertices.push(y);
    vertices.push(z);
    vertices.push(r);
    vertices.push(g);
    vertices.push(b);
    for (let i = 0; i <= 360; i++) {
      
      var angleInRadians = (i * Math.PI) / 180;
      var newX = x; // Y-coordinate remains the same
      var newY = y + Math.cos(angleInRadians) * radius; // Rotate around Y-axis
      var newZ = z + Math.sin(angleInRadians) * radius; // Translate along Z-axis
      vertices.push(newX);
      vertices.push(newY);
      vertices.push(newZ);
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
    }
    vertices.push(x+length);
    vertices.push(y);
    vertices.push(z);
    vertices.push(r);
    vertices.push(g);
    vertices.push(b);
    for (let i = 0; i <= 360; i++) {
      var angleInRadians = (i * Math.PI) / 180;
      var newX = x + length; // Y-coordinate remains the same
      var newY = y + Math.cos(angleInRadians) * radius;// Rotate around X-axis
      var newZ = z + Math.sin(angleInRadians) * radius; // Translate along Z-axis
      vertices.push(newX);
      vertices.push(newY);
      vertices.push(newZ);
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
    }
    return vertices;
  }
  function JgenerateArmIndices(){
    var faces = [];
  
    for (let i = 0; i < 360; i++) {
      faces.push(0);
      faces.push(i+1);
      faces.push(i+2);
    }
    for (let i = 362; i < 722; i++) {
      faces.push(362);
      faces.push(i+1);
      faces.push(i+2);
    }
    for (let i = 1; i <= 361; i++) {
      faces.push(i);
      faces.push(360+i);
      faces.push(361+i);
  
      faces.push(361+i);
      faces.push(i);
      faces.push(i+1);
    }
    return faces;
  }

function generateBlockVertices(startX, startY, startZ, p, l, t, r, g, b,) {

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
function generateBlockIndices() {
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