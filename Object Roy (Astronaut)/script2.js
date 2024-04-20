

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


    var FRICTION = 0.9;


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
        // console.log(dX + " " + dY);
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
    // shaders
    var shader_vertex_source_texture = `
      attribute vec3 position;
      attribute vec3 color;
      attribute vec2 uv;


      uniform mat4 PMatrix;
      uniform mat4 VMatrix;
      uniform mat4 MMatrix;
     
      varying vec3 vColor;
      varying vec2 vUv;

      void main(void) {
      gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
      vColor = color;
      vUv = uv;

      gl_PointSize=20.0;
      }`;
    var shader_fragment_source_texture = `
      precision mediump float;
      varying vec3 vColor;
      uniform sampler2D sampler;
      varying vec2 vUv;
      // uniform vec3 color;
      void main(void) {
      gl_FragColor = vec4(vColor, 1.);
      gl_FragColor = texture2D(sampler, vUv);
     
      }`;

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
    // var cube = [
    //     // belakang
    //     -1, -1, -1, 1, 1, 0,    0, 0,
    //     1, -1, -1, 1, 1, 0,     1, 0,
    //     1, 1, -1, 1, 1, 0,      1, 1,
    //     -1, 1, -1, 1, 1, 0,      0, 1,

    //     // depan
    //     -1, -1, 1, 0, 0, 1,     0, 0,
    //     1, -1, 1, 0, 0, 1, 1, 0,
    //     1, 1, 1, 0, 0, 1, 1, 1,
    //     -1, 1, 1, 0, 0, 1, 0, 1,

    //     // Kiri
    //     -1, -1, -1, 0, 1, 1, 0, 0,
    //     -1, 1, -1, 0, 1, 1, 1, 0,
    //     -1, 1, 1, 0, 1, 1, 1, 1,
    //     -1, -1, 1, 0, 1, 1, 0, 1,

    //     // kanan
    //     1, -1, -1, 1, 0, 0, 0, 0,
    //     1, 1, -1, 1, 0, 0, 1, 0,
    //     1, 1, 1, 1, 0, 0, 1, 1,
    //     1, -1, 1, 1, 0, 0, 0, 1,

    //     // bawah
    //     -1, -1, -1, 1, 0, 1, 0, 0,
    //     -1, -1, 1, 1, 0, 1, 1, 0,
    //     1, -1, 1, 1, 0, 1, 1, 1,
    //     1, -1, -1, 1, 0, 1, 0, 1,

    //     // atas
    //     -1, 1, -1, 0, 1, 0, 0, 0,
    //     -1, 1, 1, 0, 1, 0, 1, 0,
    //     1, 1, 1, 0, 1, 0, 1, 1,
    //     1, 1, -1, 0, 1, 0, 0, 1

    // ]

    var cube = [
        // belakang
        -1, -1, -1, 1, 1, 0, 0, 0,
        1, -1, -1, 1, 1, 0, 0, 0,
        1, 1, -1, 1, 1, 0, 0, 0,
        -1, 1, -1, 1, 1, 0, 0, 0,

        // depan
        -1, -1, 1, 0, 0, 1, 0, 0,
        1, -1, 1, 0, 0, 1, 0, 0,
        1, 1, 1, 0, 0, 1, 0, 0,
        -1, 1, 1, 0, 0, 1, 0, 0,

        // Kiri
        -1, -1, -1, 0, 1, 1, 0, 0,
        -1, 1, -1, 0, 1, 1, 0, 0,
        -1, 1, 1, 0, 1, 1, 0, 0,
        -1, -1, 1, 0, 1, 1, 0, 0,

        // kanan
        1, -1, -1, 1, 0, 0, 0, 0,
        1, 1, -1, 1, 0, 0, 1, 0,
        1, 1, 1, 1, 0, 0, 1, 1,
        1, -1, 1, 1, 0, 0, 0, 1,

        // bawah
        -1, -1, -1, 1, 0, 1, 0, 0,
        -1, -1, 1, 1, 0, 1, 0, 0,
        1, -1, 1, 1, 0, 1, 0, 0,
        1, -1, -1, 1, 0, 1, 0, 0,

        // atas
        -1, 1, -1, 0, 1, 0, 0, 0,
        -1, 1, 1, 0, 1, 0, 0, 0,
        1, 1, 1, 0, 1, 0, 0, 0,
        1, 1, -1, 0, 1, 0, 0, 0,

    ]
    var cube_faces = [
        0, 1, 2,
        0, 2, 3,


        4, 5, 6,
        4, 6, 7,


        8, 9, 10,
        8, 10, 11,


        12, 13, 14,
        12, 14, 15,


        16, 17, 18,
        16, 18, 19,


        20, 21, 22,
        20, 22, 23
    ];


    // var sphere = generateSphere(0, 0, 0, 2, 24, 24)
    // var sphere_faces = sphereElements(24, 24);

    // var sphereGenerated = generateSphereUV(0, 0, 0, 2, 24, 24)
    // var sphere = sphereGenerated["vertices"];
    // var sphere_faces = sphereGenerated["faces"];


    var cylinder = generateCylinder(0, 0, -1, 1.3, 4, 1, 1, 1)
    var cylinder_faces = cylinderElements();

    console.log("body:", cylinder);
    var leg1 = generateCylinder(0, 0.5, -3, 0.45, 3, 0.058, 0.070, 0.129)
    var leg1_faces = cylinderElements();

    var leg2 = generateCylinder(0, -0.5, -3, 0.45, 3, 0.058, 0.070, 0.129)
    var leg2_faces = cylinderElements();

    var hand1 = generateCylinder(0.5, 1.5, -1, 0.45, 3, 0.058, 0.070, 0.129)
    var hand1_faces = cylinderElements();

    var hand2 = generateCylinder(0.5, -1.5, -1, 0.45, 3, 0.058, 0.070, 0.129)
    var hand2_faces = cylinderElements();


    // -----------------------------------------------------------------------------------


    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX2 = LIBS.get_I4();


    LIBS.translateZ(VIEW_MATRIX, -20);



    // var sphereObject = new MyObject(sphere, sphere_faces, shader_vertex_source, shader_fragment_source);
    // sphereObject.setup();

    // -----------------------------------------------ROY--------------------------------------------------------------------------------------------------


    var astronautBodyObject = new MyObject(cylinder, cylinder_faces, shader_vertex_source, shader_fragment_source);
    astronautBodyObject.setup();

    var leg1Object = new MyObject(leg1, leg1_faces, shader_vertex_source, shader_fragment_source);
    leg1Object.setup();

    var leg2Object = new MyObject(leg2, leg2_faces, shader_vertex_source, shader_fragment_source);
    leg2Object.setup();

    var cubeObject = new MyObjectTexture(cube, cube_faces, shader_vertex_source_texture, shader_fragment_source_texture);
    cubeObject.setup();
    // ------------------------
    var hand1Object = new MyObject(hand1, hand1_faces, shader_vertex_source, shader_fragment_source);
    // var matrix = hand1Object.MODEL_MATRIX;
    LIBS.rotateX(hand1Object.MODEL_MATRIX, 90);
    hand1Object.setup();

    var hand2Object = new MyObject(hand2, hand2_faces, shader_vertex_source, shader_fragment_source);
    hand2Object.setup();
    //                                             x     y    z  
    var leftShoe = new MyObject(JcreateSphere(0.15, -0.5, -6, 0.6, 0.5, 0.3, 100, 100, 1, 1, 1).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    leftShoe.setup();
    var rightShoe = new MyObject(JcreateSphere(0.15, 0.5, -6, 0.6, 0.5, 0.3, 100, 100, 1, 1, 1).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    rightShoe.setup();


    astronautBodyObject.child.push(leg1Object);
    astronautBodyObject.child.push(leg2Object);
    astronautBodyObject.child.push(cubeObject);
    astronautBodyObject.child.push(hand1Object);
    astronautBodyObject.child.push(hand2Object);
    astronautBodyObject.child.push(leftShoe);
    astronautBodyObject.child.push(rightShoe);
    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------JAVIER---------------------------------------------------------------------------------------------------------

    var object = new MyObjectJavier(Jelips(4, 5, 2, 128, 0.5176470588235295, 0.6, 0.1843137254901961).vertices, Jelips(4, 5, 2, 128, 0.5176470588235295, 0.6, 0.1843137254901961).indices, shader_vertex_source, shader_fragment_source);
    object.setup();
    var body = new MyObjectJavier(JgenerateCylinderVertices(0, -6.3, 0, 3.25, -2, 4.8, 0.08235294117647059, 0.39215686274509803, 0.6705882352941176), JgenerateCylinderIndices(), shader_vertex_source, shader_fragment_source);
    body.setup();
    var eyes1 = new MyObjectJavier(JcreateSphere(0, 0.9, 1.5, 0.73, 0.73, 0.73, 100, 100, 1, 1, 1).positions, JcreateSphere(0, 3, 5, 1, 1, 1, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    eyes1.setup();
    var eyes2 = new MyObjectJavier(JcreateSphere(-2, 0.6, 1.5, 0.73, 0.73, 0.73, 100, 100, 1, 1, 1).positions, JcreateSphere(0, 3, 5, 1, 1, 1, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    eyes2.setup();
    var eyes3 = new MyObjectJavier(JcreateSphere(2, 0.6, 1.5, 0.73, 0.73, 0.73, 100, 100, 1, 1, 1).positions, JcreateSphere(0, 3, 5, 1, 1, 1, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    eyes3.setup();

    var black1 = new MyObjectJavier(JcreateSphere(2, 0.6, 2.1, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).positions, JcreateSphere(0, 3, 5, 1, 1, 1, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    black1.setup();
    var black2 = new MyObjectJavier(JcreateSphere(-2, 0.6, 2.1, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).positions, JcreateSphere(0, 3, 5, 1, 1, 1, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    black2.setup();
    var black3 = new MyObjectJavier(JcreateSphere(0, 0.9, 2.1, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).positions, JcreateSphere(0, 3, 5, 1, 1, 1, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    black3.setup();

    var anthena = new MyObjectJavier(JgenerateCylinderVertices(0, 4, 0, 0.1, 0.1, -2, 0.5176470588235295, 0.6, 0.1843137254901961), JgenerateCylinderIndices(), shader_vertex_source, shader_fragment_source);
    anthena.setup();
    var anthenaBall = new MyObjectJavier(JcreateSphere(0, 4, 0, 0.35, 0.35, 0.35, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(0, 3, 5, 1, 1, 1, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    anthenaBall.setup();

    var mouth = new MyObjectJavier(JcreateSphere(0, -0.7, 1.8, 0.4, 0.3, 0.35, 100, 100, 0.11372549019607843, 0.16470588235294117, 0.047058823529411764).positions, JcreateSphere(0, 3, 5, 1, 1, 1, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    mouth.setup();

    var belt = new MyObjectJavier(JgenerateCylinderVertices(0, -4.5, 0, 3.5, -2.3, 0.8, 0.0784313725490196, 0.10980392156862745, 0.29411764705882354), JgenerateCylinderIndices(), shader_vertex_source, shader_fragment_source);
    belt.setup();

    var leftEar = new MyObjectJavier(JgenerateEarVertices(-3.2, 0, 0, 0.8, 2.5, 0.5176470588235295, 0.6, 0.1843137254901961, 0), JgenerateEarIndices(), shader_vertex_source, shader_fragment_source);
    leftEar.setup();
    var rightEar = new MyObjectJavier(JgenerateEarVertices(3.2, 0, 0, 0.8, 2.5, 0.5176470588235295, 0.6, 0.1843137254901961, 1), JgenerateEarIndices(), shader_vertex_source, shader_fragment_source);
    rightEar.setup();

    var leftLeg = new MyObjectJavier(JgenerateCylinderVertices(-1.5, -7, 0, 1.5, 1, 1, 0.5176470588235295, 0.6, 0.1843137254901961), JgenerateCylinderIndices(), shader_vertex_source, shader_fragment_source);
    leftLeg.setup();
    var rightLeg = new MyObjectJavier(JgenerateCylinderVertices(1.5, -7, 0, 1.5, 1, 1, 0.5176470588235295, 0.6, 0.1843137254901961), JgenerateCylinderIndices(), shader_vertex_source, shader_fragment_source);
    rightLeg.setup();

    var leftShoe = new MyObjectJavier(JcreateSphere(-1.7, -7, 0.5, 1.7, 0.7, 2, 100, 100, 0.0784313725490196, 0.10980392156862745, 0.29411764705882354).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    leftShoe.setup();
    var rightShoe = new MyObjectJavier(JcreateSphere(1.7, -7, 0.5, 1.7, 0.7, 2, 100, 100, 0.0784313725490196, 0.10980392156862745, 0.29411764705882354).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    rightShoe.setup();

    var leftArm = new MyObjectJavier(JgenerateArmVertices(-5, -2.5, 0, 0.6, 2, 0.09019607843137255, 0.25098039215686274, 0.47058823529411764), JgenerateArmIndices(), shader_vertex_source, shader_fragment_source);
    leftArm.setup();
    var rightArm = new MyObjectJavier(JgenerateArmVertices(3.2, -2.5, 0, 0.6, 2, 0.09019607843137255, 0.25098039215686274, 0.47058823529411764), JgenerateArmIndices(), shader_vertex_source, shader_fragment_source);
    rightArm.setup();

    var leftHand = new MyObjectJavier(JcreateSphere(-5.55, -2.5, 0, 0.85, 0.7, 0.5, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    leftHand.setup();
    var rightHand = new MyObjectJavier(JcreateSphere(5.7, -2.5, 0, 0.85, 0.7, 0.5, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    rightHand.setup();

    var leftFinger1 = new MyObjectJavier(JcreateSphere(-5.55, -1.7, 0, 0.3, 0.7, 0.2, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    leftFinger1.setup();
    var leftFinger2 = new MyObjectJavier(JcreateSphere(-5.8, -2.2, 0, 1.5, 0.25, 0.2, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    leftFinger2.setup();
    var leftFinger3 = new MyObjectJavier(JcreateSphere(-5.8, -2.7, 0, 1.5, 0.25, 0.2, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    leftFinger3.setup();

    var rightFinger1 = new MyObjectJavier(JcreateSphere(5.8, -1.7, 0, 0.3, 0.7, 0.2, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    rightFinger1.setup();
    var rightFinger2 = new MyObjectJavier(JcreateSphere(6, -2.2, 0, 1.5, 0.25, 0.2, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    rightFinger2.setup();
    var rightFinger3 = new MyObjectJavier(JcreateSphere(6, -2.7, 0, 1.5, 0.25, 0.2, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    rightFinger3.setup();


    object.child.push(body);
    object.child.push(eyes1);
    object.child.push(eyes2);
    object.child.push(eyes3);
    object.child.push(black1);
    object.child.push(black2);
    object.child.push(black3);
    object.child.push(anthena);
    object.child.push(anthenaBall);
    object.child.push(mouth);
    object.child.push(belt);
    object.child.push(leftEar);
    object.child.push(rightEar);
    object.child.push(leftLeg);
    object.child.push(rightLeg);
    object.child.push(leftShoe);
    object.child.push(rightShoe);
    object.child.push(leftArm);
    object.child.push(rightArm);
    object.child.push(leftHand);
    object.child.push(rightHand);
    object.child.push(leftFinger1);
    object.child.push(leftFinger2);
    object.child.push(leftFinger3);
    object.child.push(rightFinger1);
    object.child.push(rightFinger2);
    object.child.push(rightFinger3);
    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------
   
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


        // nge set posisi awal astronaut
        MODEL_MATRIX = LIBS.get_I4();
        LIBS.translateX(MODEL_MATRIX, 1);
        LIBS.rotateX(MODEL_MATRIX, -250);
        LIBS.rotateY(MODEL_MATRIX, 300);
        LIBS.rotateZ(MODEL_MATRIX, 550);
        LIBS.rotateY(MODEL_MATRIX, THETA);
        LIBS.rotateX(MODEL_MATRIX, ALPHA);
        LIBS.translateY(MODEL_MATRIX, 2);
        LIBS.translateX(MODEL_MATRIX, -1);



        // MODEL_MATRIX2 = LIBS.get_I4();
        // LIBS.translateX(MODEL_MATRIX2, -1)
        // LIBS.rotateY(MODEL_MATRIX2, -THETA);
        // LIBS.rotateX(MODEL_MATRIX2, -ALPHA);

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



        astronautBodyObject.MODEL_MATRIX = MODEL_MATRIX;
        astronautBodyObject.render(VIEW_MATRIX, PROJECTION_MATRIX);

        // MODEL_MATRIX2 = MODEL_MATRIX;
        // cubeObject.MODEL_MATRIX = MODEL_MATRIX2;
        // // LIBS.scale(cubeObject.MODEL_MATRIX, 3, 3, 3);
        // // LIBS.translateX(cubeObject.MODEL_MATRIX, -0);
        // // LIBS.translateZ(cubeObject.MODEL_MATRIX, -0.);
        // // LIBS.translateY(cubeObject.MODEL_MATRIX,0);

        // cubeObject.render(VIEW_MATRIX, PROJECTION_MATRIX);

        // --------------------------------------------JAVIER---------------------------------------------------------------------------------------------------
        body_Model = LIBS.get_I4();
        LIBS.rotateY(body_Model, -THETA);
        LIBS.rotateX(body_Model, -ALPHA);

        object.MODEL_MATRIX = body_Model;
        body.MODEL_MATRIX = body_Model;
        eyes1.MODEL_MATRIX = body_Model;
        eyes2.MODEL_MATRIX = body_Model;
        eyes3.MODEL_MATRIX = body_Model;
        black1.MODEL_MATRIX = body_Model;
        black2.MODEL_MATRIX = body_Model;
        black3.MODEL_MATRIX = body_Model;
        anthena.MODEL_MATRIX = body_Model;
        anthenaBall.MODEL_MATRIX = body_Model;
        mouth.MODEL_MATRIX = body_Model;
        belt.MODEL_MATRIX = body_Model;
        leftEar.MODEL_MATRIX = body_Model;
        rightEar.MODEL_MATRIX = body_Model;
        leftLeg.MODEL_MATRIX = body_Model;
        rightLeg.MODEL_MATRIX = body_Model;
        leftShoe.MODEL_MATRIX = body_Model;
        rightShoe.MODEL_MATRIX = body_Model;
        leftArm.MODEL_MATRIX = body_Model;
        rightArm.MODEL_MATRIX = body_Model;
        leftHand.MODEL_MATRIX = body_Model;
        rightHand.MODEL_MATRIX = body_Model;
        leftFinger1.MODEL_MATRIX = body_Model;
        leftFinger2.MODEL_MATRIX = body_Model;
        leftFinger3.MODEL_MATRIX = body_Model;
        rightFinger1.MODEL_MATRIX = body_Model;
        rightFinger2.MODEL_MATRIX = body_Model;
        rightFinger3.MODEL_MATRIX = body_Model;


        LIBS.translateX(body.MODEL_MATRIX, 5);
        LIBS.translateY(body.MODEL_MATRIX, 2);

        LIBS.scale(body.MODEL_MATRIX, 0.3, 0.3, 0.3);
        object.render(VIEW_MATRIX, PROJECTION_MATRIX);




        window.requestAnimationFrame(animate);
    };
    animate(0);
}
window.addEventListener('load', main);