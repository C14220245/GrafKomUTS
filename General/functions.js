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
  var r = 0.05;
  var g = 0.05;
  var b = 0.05;
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

    r = r + 0.09;
    g = g + 0.09;
    b = b + 0.09;
  }
  list.push(x, y, z, 1.0, 0.5, 0.6);
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