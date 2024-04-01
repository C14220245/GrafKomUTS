

function main() {
    var CANVAS = document.getElementById("myCanvas");


    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;


    var drag = false;
    var dX = 0;
    var dY = 0;


    var X_prev = 0;
    var Y_prev = 0;


    var THETA = 0;
    var ALPHA = 0;


    var FRICTION = 0;


    var mouseDown = function (e) {
        drag = true;
        X_prev = e.pageX;
        Y_prev = e.pageY;
    }


    var mouseUp = function (e) {
        drag = false;
    }


    var mouseMove = function (e) {
        if (!drag) { return false; }
        dX = e.pageX - X_prev;
        dY = e.pageY - Y_prev;
        console.log(dX + " " + dY);
        X_prev = e.pageX;
        Y_prev = e.pageY;


        THETA += dX * 2 * Math.PI / CANVAS.width;
        ALPHA += dY * 2 * Math.PI / CANVAS.height;
    }


    var keyDown = function (e) {
        e.preventDefault();
        console.log(e);
    }


    CANVAS.addEventListener("mousedown", mouseDown, false);
    CANVAS.addEventListener("mouseup", mouseUp, false);
    CANVAS.addEventListener("mouseout", mouseUp, false);
    CANVAS.addEventListener("mousemove", mouseMove, false);
    CANVAS.addEventListener("keydown", keyDown);



    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
    } catch (e) {
        alert("WebGL context cannot be initialized");
        return false;
    }
    //shaders
    var shader_vertex_source = `
      attribute vec3 position;
      attribute vec3 color;


      uniform mat4 PMatrix;
      uniform mat4 VMatrix;
      uniform mat4 MMatrix;
     
      varying vec3 vColor;
      void main(void) {
      gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
      vColor = color;


      gl_PointSize=20.0;
      }`;
    var shader_fragment_source = `
      precision mediump float;
      varying vec3 vColor;
      // uniform vec3 color;


      uniform float greyScality;


      void main(void) {
      float greyScaleValue = (vColor.r + vColor.g + vColor.b)/3.;
      vec3 greyScaleColor = vec3(greyScaleValue, greyScaleValue, greyScaleValue);
      vec3 color = mix(greyScaleColor, vColor, greyScality);
      gl_FragColor = vec4(color, 1.);
      }`;
    /*========================= THE TRIANGLE ========================= */
    POINTS:
    // var triangle_vertex = [
    //   -1, -1, // first corner (ind 0) : -> bottom left of the viewport
    //  1,0,0,
    //   1, -1, // (ind 1) bottom right of the viewport
    //   0,1,0,
    //   0, 1,  // (ind 2) top right of the viewport
    //   0,0,1,
    // ];

    
// -----------------------------------CONFIG VERTEX-----------------------------------
    var sphere = generateSphere(0, 0, 0, 2, 24, 24)
    var sphere_faces = sphereElements(24, 24);

    var cylinder = generateCylinder(0, 0, 0, 1.3, 4)
    var cylinder_faces = cylinderElements();

    var leg1 = generateCylinder(0, 0.5, -3, 0.45, 3)
    var leg1_faces = cylinderElements();

    var leg2 = generateCylinder(0, -0.5, -3, 0.45, 3)
    var leg2_faces = cylinderElements();

    var hand1 = generateCylinder(0, 1, 5, 0.45, 3)
    var hand1_faces = cylinderElements();

    var hand2 = generateCylinder(0, 4, 5, 0.45, 3)
    var hand2_faces = cylinderElements();



// -----------------------------------------------------------------------------------


    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX2 = LIBS.get_I4();
    var MODEL_MATRIX_HAND1 = LIBS.get_I4();
    var MODEL_MATRIX_HAND2 = LIBS.get_I4();

    LIBS.translateZ(VIEW_MATRIX, -25);


    var sphereObject = new MyObject(sphere, sphere_faces, shader_vertex_source, shader_fragment_source);
    sphereObject.setup();


    var cylinderObject = new MyObject(cylinder, cylinder_faces, shader_vertex_source, shader_fragment_source);
    cylinderObject.setup();

    var leg1Object = new MyObject(leg1, leg1_faces, shader_vertex_source, shader_fragment_source);
    leg1Object.setup();

    var leg2Object = new MyObject(leg2, leg2_faces, shader_vertex_source, shader_fragment_source);
    leg2Object.setup();

    var hand1Object = new MyObject(hand1, hand1_faces, shader_vertex_source, shader_fragment_source);
    hand1Object.setup();

    var hand2Object = new MyObject(hand2, hand2_faces, shader_vertex_source, shader_fragment_source);
    hand2Object.setup();
    /*========================= DRAWING ========================= */
    GL.clearColor(0, 0, 0.0, 0);


    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    var time_prev = 0;
    var animate = function (time) {
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.D_BUFFER_BIT);
        var dt = time - time_prev;
        time_prev = time;


        if (!drag) {
            dX *= FRICTION;
            dY *= FRICTION;


            THETA += dX * 2 * Math.PI / CANVAS.width;
            ALPHA += dY * 2 * Math.PI / CANVAS.height;
        }


        var radius = 2;
        var pos_x = radius * Math.cos(ALPHA) * Math.sin(THETA);
        var pos_y = radius * Math.sin(ALPHA);
        var pos_z = radius * Math.cos(ALPHA) * Math.cos(THETA);


        MODEL_MATRIX = LIBS.get_I4();
        LIBS.translateX(MODEL_MATRIX, 1);
        LIBS.rotateY(MODEL_MATRIX, THETA);
        LIBS.rotateX(MODEL_MATRIX, ALPHA);


        MODEL_MATRIX2 = LIBS.get_I4();
        LIBS.translateX(MODEL_MATRIX2, -1)
        LIBS.rotateY(MODEL_MATRIX2, -THETA);
        LIBS.rotateX(MODEL_MATRIX2, -ALPHA);

        var temp = LIBS.get_I4();
        LIBS.translateX(temp, -4);
        MODEL_MATRIX2 = LIBS.multiply(MODEL_MATRIX2, temp);
        temp = LIBS.get_I4();
        LIBS.rotateY(temp, THETA);
        MODEL_MATRIX2 = LIBS.multiply(MODEL_MATRIX2, temp);
        LIBS.rotateY(temp, THETA);
        MODEL_MATRIX2 = LIBS.multiply(MODEL_MATRIX2, temp);
        temp = LIBS.get_I4();
        LIBS.translateX(temp, 10);
        MODEL_MATRIX2 = LIBS.multiply(MODEL_MATRIX2, temp);



        sphereObject.MODEL_MATRIX = MODEL_MATRIX;
        sphereObject.render(VIEW_MATRIX, PROJECTION_MATRIX);

        cylinderObject.MODEL_MATRIX = MODEL_MATRIX;
        cylinderObject.render(VIEW_MATRIX, PROJECTION_MATRIX);

        leg1Object.MODEL_MATRIX = MODEL_MATRIX;
        leg1Object.render(VIEW_MATRIX, PROJECTION_MATRIX);

        leg2Object.MODEL_MATRIX = MODEL_MATRIX;
        leg2Object.render(VIEW_MATRIX, PROJECTION_MATRIX);

        // hand1Object.MODEL_MATRIX = MODEL_MATRIX;
        // hand1Object.render(VIEW_MATRIX, PROJECTION_MATRIX);

        // hand2Object.MODEL_MATRIX = MODEL_MATRIX;
        // hand2Object.render(VIEW_MATRIX, PROJECTION_MATRIX);




        window.requestAnimationFrame(animate);
    };
    animate(0);
}
window.addEventListener('load', main);