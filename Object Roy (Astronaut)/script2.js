

function main() {
    var CANVAS = document.getElementById("myCanvas");


    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    var THETA = 0;
    var ALPHA = 0;

    var drag = false;
    var dX = 0;
    var dY = 0;


    var X_prev = 0;
    var Y_prev = 0;


    var JscaleX = 1;
    var JscaleY = 1;
    var JscaleZ = 1;

    var JrotateX = 0;
    var JrotateY = 0;
    var JrotateZ = 0;
    var JtranslateX = 0;
    var JtranslateY = 0;
    var JtranslateZ = 0;

    var FRICTION = 0.990;


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

    var keys = {}; // Menyimpan status tombol keyboard

    var handleKeyDown = function (e) {
        keys[e.key] = true;

        // Tambahkan logika khusus jika diperlukan
    };

    var handleKeyUp = function (e) {
        keys[e.key] = false;

        // Tambahkan logika khusus jika diperlukan
    };

    document.addEventListener("keydown", handleKeyDown, false);
    document.addEventListener("keyup", handleKeyUp, false);

    var handleKeys = function () {
        //Pny Javier
        if (keys["w"]) {
            // Logika pergerakan ke atas
            JrotateX += 0.05;
            //console.log("Kepencet");
        }
        if (keys["q"]) {
            // Logika pergerakan ke kiri
            JrotateX -= 0.05;
        }
        if (keys["r"]) {
            // Logika pergerakan ke bawah
            JrotateY += 0.05;
        }
        if (keys["e"]) {
            // Logika pergerakan ke kanan
            JrotateY -= 0.05;
        }
        if (keys["y"]) {
            // Logika pergerakan ke kanan
            JrotateZ += 0.05;
        }
        if (keys["t"]) {
            // Logika pergerakan ke kanan
            JrotateZ -= 0.05;
        }
        if (keys["i"]) {
            // Logika pergerakan ke kanan
            JtranslateX += 0.05;
        }
        if (keys["u"]) {
            // Logika pergerakan ke kanan
            JtranslateX -= 0.05;
        }
        if (keys["p"]) {
            // Logika pergerakan ke kanan
            JtranslateY += 0.05;
        }
        if (keys["o"]) {
            // Logika pergerakan ke kanan
            JtranslateY -= 0.05;
        }
        if (keys["]"]) {
            // Logika pergerakan ke kanan
            JtranslateZ += 0.05;
        }
        if (keys["["]) {
            // Logika pergerakan ke kanan
            JtranslateZ -= 0.05;
        }
        if (keys["4"]) {
            // Logika pergerakan ke kanan
            JscaleX += 0.01;
            JscaleY += 0.01;
            JscaleZ += 0.01;
        }
        if (keys["5"]) {
            // Logika pergerakan ke kanan
            JscaleX -= 0.01;
            JscaleY -= 0.01;
            JscaleZ -= 0.01;
        }
    };


    CANVAS.addEventListener("mousedown", mouseDown, false);
    CANVAS.addEventListener("mouseup", mouseUp, false);
    CANVAS.addEventListener("mouseout", mouseUp, false);
    CANVAS.addEventListener("mousemove", mouseMove, false);
    CANVAS.addEventListener("keydown", keyDown);



    try {
        GL = CANVAS.getContext("webgl", { antialias: true, alpha: true });
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
    var shuu_vertex_source = `
      attribute vec3 position;
      attribute vec3 color;
      attribute vec2 uv;



      uniform mat4 PMatrix;
      uniform mat4 VMatrix;
      uniform mat4 MMatrix;
      
      varying vec3 vColor;
      varying vec2 vUV;
      void main(void) {
      gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
      vColor = color;
      vUV = uv;


      gl_PointSize=20.0;
      }`;
     var shuu_fragment_source = `
      precision mediump float;
      varying vec3 vColor;
      varying vec2 vUV;
      uniform sampler2D sampler;


      // uniform vec3 color;


      uniform float greyScality;


      void main(void) {   
      float greyScaleValue = (vColor.r + vColor.g + vColor.b)/3.;
      vec3 greyScaleColor = vec3(greyScaleValue, greyScaleValue, greyScaleValue);
      vec3 color = mix(greyScaleColor, vColor, greyScality);
      gl_FragColor = vec4(color, 1.);
      //gl_FragColor = texture2D(sampler, vUV);
      }`;

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
        1, 1, -1, 1, 0, 0, 1, 0, //bawah kanan
        1, 1, 1, 1, 0, 0, 1, 1, // bawah atas
        1, -1, 1, 1, 0, 0, 0, 1, // atas kiri

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


    var sphere = generateSphere(0, 0, 0, 2, 24, 24)
    var sphere_faces = sphereElements(24, 24);

    var sphereGenerated = generateSphereUV(0, 0, 0, 2, 24, 24)
    var sphere = sphereGenerated["vertices"];
    var sphere_faces = sphereGenerated["faces"];


    var cylinder = generateCylinder(0, 0, -1, 1.3, 4, 0.85, 0.85, 0.85)
    var cylinder_faces = cylinderElements();

    // console.log("body:", cylinder);
    var leg1 = generateCylinder(0, 0.5, -3, 0.45, 3, 0.647, 0.663, 0.71)
    var leg1_faces = cylinderElements();

    var leg2 = generateCylinder(0, -0.5, -3, 0.45, 3, 0.647, 0.663, 0.71)
    var leg2_faces = cylinderElements();

    // var hand1 = generateCylinder(0.5, 1.5, -1, 0.45, 3, 0.647, 0.663, 0.71)
    // var hand1_faces = cylinderElements();

    var hand2 = generateCylinder(0.5, -1.5, -1, 0.45, 3, 0.647, 0.663, 0.71)
    var hand2_faces = cylinderElements();

    // var hand1ControlPoints = [
    // //depan  kanan  atas
    //     0,    1,    -1.5,      0.647, 0.663, 0.71,
    //     0,    2,    -1.5,      0.647, 0.663, 0.71,
    //     1,    2.3,    -2,      0.647, 0.663, 0.71,
    //     1.5,    2.5,    -2.5,      0.647, 0.663, 0.71,
    // ] ;

    // var hand1ControlPoints = [
    //     //depan  kanan  atas
    //     0,         0,    0,                 0.647, 0.663, 0.71,
    //     0,         0,    0,                 0.647, 0.663, 0.71,
    //     0,         0,    0,                 0.647, 0.663, 0.71,
    //     0,         0,    0,                 0.647, 0.663, 0.71,
    // ];


    var hand1ControlPoints = [
        //depan  kanan  atas
        0, 0, -2, 0.647, 0.663, 0.71,
        0, 1.2, -1.5, 0.647, 0.663, 0.71,
        0, 2.4, -1, 0.647, 0.663, 0.71,
        0, 3, 0.5, 0.647, 0.663, 0.71,
    ];


    var hand1 = bspline3D(hand1ControlPoints, 0.45).vertices;
    var hand1_faces = bspline3D(hand1ControlPoints, 0.45).indices;

    var hand2ControlPoints = [
        //depan  kanan  atas
        0, 0, -2, 0.647, 0.663, 0.71,
        0, -1.2, -1.5, 0.647, 0.663, 0.71,
        0, -2.4, -1, 0.647, 0.663, 0.71,
        0, -3, 0.5, 0.647, 0.663, 0.71,
    ];

    var hand2 = bspline3D(hand2ControlPoints, 0.45).vertices;
    var hand2_faces = bspline3D(hand2ControlPoints, 0.45).indices;



    // console.log("hand1:", hand1);
    // console.log("hand1_faces:", hand1_faces);

    // -----------------------------------------------------------------------------------


    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX2 = LIBS.get_I4();


    // ZOOM
    LIBS.translateZ(VIEW_MATRIX, -60);
    LIBS.translateY(VIEW_MATRIX, 1);





    // -----------------------------------------------ROY--------------------------------------------------------------------------------------------------


    var astronautBodyObject = new MyObject(cylinder, cylinder_faces, shader_vertex_source, shader_fragment_source);
    astronautBodyObject.setup();

    var leg1Object = new MyObject(leg1, leg1_faces, shader_vertex_source, shader_fragment_source);
    leg1Object.setup();

    var leg2Object = new MyObject(leg2, leg2_faces, shader_vertex_source, shader_fragment_source);
    leg2Object.setup();

    var cubeObject = new MyObjectTexture(cube, cube_faces, shader_vertex_source_texture, shader_fragment_source_texture);
    cubeObject.setup();

    var flagObject = new MyObjectTexture(cube, cube_faces, shader_vertex_source_texture, shader_fragment_source_texture);
    cubeObject.setup();


    // ------------------------
    var hand1Object = new MyObjectJavier(hand1, hand1_faces, shader_vertex_source, shader_fragment_source);
    // var matrix = hand1Object.MODEL_MATRIX;
    LIBS.rotateX(hand1Object.MODEL_MATRIX, 90);
    hand1Object.setup();

    var hand2Object = new MyObjectJavier(hand2, hand2_faces, shader_vertex_source, shader_fragment_source);
    hand2Object.setup();
    //                                             x     y    z  
    var leftShoe = new MyObject(JcreateSphere(0.15, -0.5, -6, 0.6, 0.5, 0.3, 100, 100, 1, 1, 1).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    leftShoe.setup();
    var rightShoe = new MyObject(JcreateSphere(0.15, 0.5, -6, 0.6, 0.5, 0.3, 100, 100, 1, 1, 1).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    rightShoe.setup();

    var tanganKiri = new MyObject(JcreateSphere(0, 3, 0.5, 0.6, 0.4, 0.5, 100, 100, 1, 1, 1).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    tanganKiri.setup();

    var tanganKanan = new MyObject(JcreateSphere(0, -3, 0.5, 0.6, 0.4, 0.5, 100, 100, 1, 1, 1).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    tanganKanan.setup();

    // var cylinder = generateCylinder(0, 0, -1, 1.3, 4, 1, 1, 1)
    var belt = new MyObject(RgenerateCylinderVertices(0, 0, -4, 1.5, 1.5, 0.5, 0.059, 0.071, 0.129), RgenerateCylinderIndices(), shader_vertex_source, shader_fragment_source);
    belt.setup();

    var flagRed = new MyObject(generateBlockVertices(1.06, 0.3, -1.3, 0.2, 0.1, 0.5, 1, 0, 0), generateBlockIndices(), shader_vertex_source, shader_fragment_source);
    flagRed.setup();

    var flagWhite = new MyObject(generateBlockVertices(1.06, 0.3, -1.4, 0.2, 0.1, 0.5, 1, 1, 1), generateBlockIndices(), shader_vertex_source, shader_fragment_source);
    flagWhite.setup();








    astronautBodyObject.child.push(leg1Object);
    astronautBodyObject.child.push(leg2Object);
    astronautBodyObject.child.push(cubeObject);
    astronautBodyObject.child.push(hand1Object);
    astronautBodyObject.child.push(hand2Object);
    astronautBodyObject.child.push(leftShoe);
    astronautBodyObject.child.push(rightShoe);
    astronautBodyObject.child.push(tanganKiri);
    astronautBodyObject.child.push(tanganKanan);
    astronautBodyObject.child.push(belt);

    astronautBodyObject.child.push(flagRed);
    astronautBodyObject.child.push(flagWhite);

    // astronautBodyObject.child.push(rightHand);

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

    cpAnthena = [
        0, 2, 0, 0.5176470588235295, 0.6, 0.1843137254901961,
        0.75, 3, 0, 0.5176470588235295, 0.6, 0.1843137254901961,
        0, 4, 0, 0.5176470588235295, 0.6, 0.1843137254901961
    ];
    var anthena = new MyObjectJavier(bspline3D(cpAnthena, 0.2).vertices, bspline3D(cpAnthena, 2).indices, shader_vertex_source, shader_fragment_source);
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

    var rightRedFlag = new MyObjectJavier(generateBlockVertices(0, 6, 0, 3.8, 1, 2, 1, 0, 0), generateBlockIndices(), shader_vertex_source, shader_fragment_source);
    rightRedFlag.setup();
    var leftRedFlag = new MyObjectJavier(generateBlockVertices(0, 6, 0, -3.8, 1, 2, 1, 0, 0), generateBlockIndices(), shader_vertex_source, shader_fragment_source);
    leftRedFlag.setup();

    cpRightPole = [
        5.8, -2.5, 0, 1, 1, 1,
        8, 6, 0, 1, 1, 1,
        3.5, 6, 0, 1, 1, 1
    ];
    var rightPole = new MyObjectJavier(bspline3D(cpRightPole, 0.2).vertices, bspline3D(cpRightPole, 2).indices, shader_vertex_source, shader_fragment_source);
    rightPole.setup();

    cpleftPole = [
        -5.8, -2.5, 0, 1, 1, 1,
        -8, 6, 0, 1, 1, 1,
        -3.5, 6, 0, 1, 1, 1
    ];
    var leftPole = new MyObjectJavier(bspline3D(cpleftPole, 0.2).vertices, bspline3D(cpleftPole, 2).indices, shader_vertex_source, shader_fragment_source);
    leftPole.setup();

    // var leftFinger1 = new MyObjectJavier(JcreateSphere(-5.55, -1.7, 0, 0.3, 0.7, 0.2, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    // leftFinger1.setup();
    // var leftFinger2 = new MyObjectJavier(JcreateSphere(-5.8, -2.2, 0, 1.5, 0.25, 0.2, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    // leftFinger2.setup();
    // var leftFinger3 = new MyObjectJavier(JcreateSphere(-5.8, -2.7, 0, 1.5, 0.25, 0.2, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    // leftFinger3.setup();

    // var rightFinger1 = new MyObjectJavier(JcreateSphere(5.8, -1.7, 0, 0.3, 0.7, 0.2, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    // rightFinger1.setup();
    // var rightFinger2 = new MyObjectJavier(JcreateSphere(6, -2.2, 0, 1.5, 0.25, 0.2, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    // rightFinger2.setup();
    // var rightFinger3 = new MyObjectJavier(JcreateSphere(6, -2.7, 0, 1.5, 0.25, 0.2, 100, 100, 0.5176470588235295, 0.6, 0.1843137254901961).positions, JcreateSphere(2, 2, 2, 2, 1, 3, 100, 100, 1, 0, 0).indices, shader_vertex_source, shader_fragment_source);
    // rightFinger3.setup();


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
    object.child.push(rightPole);
    object.child.push(leftPole);
    object.child.push(rightRedFlag);
    object.child.push(leftRedFlag);
    // object.child.push(leftFinger1);
    // object.child.push(leftFinger2);
    // object.child.push(leftFinger3);
    // object.child.push(rightFinger1);
    // object.child.push(rightFinger2);
    // object.child.push(rightFinger3);
    //---------------------------------------------------------------------MALVIN--------------------------------------------------------------------------------------------
    var UFO = new ShuuObject(McreateSphere(0, 0, 0, 8, 1.6, 8, 64, 64, 0.35, 0.3, 0.3).positions, McreateSphere(0, 0, 0, 8, 1.6, 8, 64, 64, 0.35, 0.3, 0.3).indices, shuu_vertex_source, shuu_fragment_source);
    UFO.setup();
    // Apply any transformations to the UFO object here...
    var UFOMatrix = LIBSSHUU.get_I4();
    LIBSSHUU.translateY(UFOMatrix, 1);  // Adjust the Y value as needed
    UFO.SHUU_MATRIX = UFOMatrix;


    //kacaUFO
    var kacaUFO = new ShuuObject(createDome(4, 60, 20).vertices, createDome(4, 60, 20).indices, shuu_vertex_source, shuu_fragment_source);
    kacaUFO.setup();
    var kacaUFOMatrix = LIBSSHUU.get_I4();
    LIBSSHUU.translateY(kacaUFOMatrix, 1);  // Adjust the Y value as needed
    LIBSSHUU.translateZ(kacaUFOMatrix, 5);  // Adjust the Z value as needed

    //legs
    //legA1
    var legA1 = new ShuuObject(createCylinder(0.2, 2, 64, 3, -2, 3).vertices, createCylinder(0.2, 2, 64, 3, -2, 3).indices, shuu_vertex_source, shuu_fragment_source);
    legA1.setup();
    legA1.SHUU_MATRIX = LIBSSHUU.get_I4();
    //legA2
    var legA2 = new ShuuObject(createCylinder(0.2, 2, 64, 3, -4, 3).vertices, createCylinder(0.2, 2.5, 64, 3, -2, 3).indices, shuu_vertex_source, shuu_fragment_source);
    legA2.setup();
    legA2.SHUU_MATRIX = LIBSSHUU.get_I4();
    //legB1
    var legB1 = new ShuuObject(createCylinder(0.2, 2, 64, -3, -2, -3).vertices, createCylinder(0.2, 2, 64, -3, -2, -3).indices, shuu_vertex_source, shuu_fragment_source);
    legB1.setup();
    legB1.SHUU_MATRIX = LIBSSHUU.get_I4();
    //legB2
    var legB2 = new ShuuObject(createCylinder(0.2, 2, 64, -3, -4, -3).vertices, createCylinder(0.2, 2, 64, -3, -4, -3).indices, shuu_vertex_source, shuu_fragment_source);
    legB2.setup();
    legB2.SHUU_MATRIX = LIBSSHUU.get_I4();
    //legC1
    var legC1 = new ShuuObject(createCylinder(0.2, 2, 64, -3, -2, 3).vertices, createCylinder(0.2, 2, 64, -3, -2, 3).indices, shuu_vertex_source, shuu_fragment_source);
    legC1.setup();
    legC1.SHUU_MATRIX = LIBSSHUU.get_I4();
    //legC2
    var legC2 = new ShuuObject(createCylinder(0.2, 2, 64, -3, -4, 3).vertices, createCylinder(0.2, 2, 64, -3, -4, 3).indices, shuu_vertex_source, shuu_fragment_source);
    legC2.setup();
    legC2.SHUU_MATRIX = LIBSSHUU.get_I4();
    //legD1
    var legD1 = new ShuuObject(createCylinder(0.2, 2, 64, 3, -2, -3).vertices, createCylinder(0.2, 2, 64, 3, -2, -3).indices, shuu_vertex_source, shuu_fragment_source);
    legD1.setup();
    legD1.SHUU_MATRIX = LIBSSHUU.get_I4();
    //legD2
    var legD2 = new ShuuObject(createCylinder(0.2, 2, 64, 3, -4, -3).vertices, createCylinder(0.2, 2, 64, 3, -4, -3).indices, shuu_vertex_source, shuu_fragment_source);
    legD2.setup();
    legD2.SHUU_MATRIX = LIBSSHUU.get_I4();
    //warningbox
    var offset = 10;
    var warning = new ShuuObject(generateBlockVertices(-7 - offset, 2, -12, 13.5, 0.4, 11, 0.5, 0.5, 1), shuuBlockIndices(), shuu_vertex_source, shuu_fragment_source);
    warning.setup();
    warning.SHUU_MATRIX = LIBSSHUU.get_I4();

    var cpWt = [
        0.3 - offset, 12, -11.6, 1, 0, 0,
        -5 - offset, 3, -11.6, 1, 0, 0,
        -5 - offset, 3, -11.6, 1, 0, 0,
        -5 - offset, 3, -11.6, 1, 0, 0,
        -5 - offset, 3, -11.6, 1, 0, 0,
        0 - offset, 3, -11.6, 1, 0, 0,
        5 - offset, 3, -11.6, 1, 0, 0,
        5 - offset, 3, -11.6, 1, 0, 0,
        5 - offset, 3, -11.6, 1, 0, 0,
        5 - offset, 3, -11.6, 1, 0, 0,
        -0.3 - offset, 12, -11.6, 1, 0, 0,
        -0.3 - offset, 12, -11.6, 1, 0, 0,

    ]
    var warntriangle = new ShuuObject(bspline3D(cpWt, 0.4).vertices, bspline3D(cpWt, 0.4).indices, shuu_vertex_source, shuu_fragment_source);
    warntriangle.setup();
    warntriangle.SHUU_MATRIX = LIBSSHUU.get_I4();

    var tandaseru = new ShuuObject(generateBlockVertices(-0.2 - offset, 6.5, -11.4, 0.8, 0.3, 2, 1, 0, 0), shuuBlockIndices(), shuu_vertex_source, shuu_fragment_source);
    tandaseru.setup();
    tandaseru.SHUU_MATRIX = LIBSSHUU.get_I4();

    var titikseru = new ShuuObject(generateBlockVertices(-0.2 - offset, 5, -11.4, 0.8, 0.3, 0.6, 1, 0, 0), shuuBlockIndices(), shuu_vertex_source, shuu_fragment_source);
    titikseru.setup();
    titikseru.SHUU_MATRIX = LIBSSHUU.get_I4();

    var engine = new ShuuObject(createEliptPara(0.5,32,32,-5.5,2,0).vertices, createEliptPara(0.5,32,32,-5.5,2,0).indices, shuu_vertex_source, shuu_fragment_source);
    engine.setup();
    engine.SHUU_MATRIX = LIBSSHUU.get_I4();

    var fire = new ShuuObject(createEliptCone(1,16,16, -7, 2, 0, 0.3, 0.4, 1).vertices, createEliptCone(1,16,16, -7, 2, 0, 0.3, 0.4, 1).indices, shuu_vertex_source, shuu_fragment_source);
    fire.setup();
    fire.SHUU_MATRIX = LIBSSHUU.get_I4();

    var firetail = new ShuuObject(createEliptCone(0.7,16,16, -7, 2, 0, 1, 0,7, 0,2).vertices, createEliptCone(0.7,16,16, -7, 2, 0, 1, 0,7, 0,2).indices, shuu_vertex_source, shuu_fragment_source);
    firetail.setup();
    firetail.SHUU_MATRIX = LIBSSHUU.get_I4();

    UFO.child.push(kacaUFO);
    UFO.child.push(legA1);
    legA1.child.push(legA2);
    UFO.child.push(legB1);
    legB1.child.push(legB2);
    UFO.child.push(legC1);
    legC1.child.push(legC2);;
    UFO.child.push(legD1);
    legD1.child.push(legD2);
    UFO.child.push(warning);
    warning.child.push(warntriangle);
    warning.child.push(tandaseru);
    warning.child.push(titikseru);
    UFO.child.push(engine);
    engine.child.push(fire);
    engine.child.push(firetail);    
    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------ENVIRONMENT ATTRIBUTE------------------------------------------------------------
    var moon = new MyObjectJavier(JcreateMoon(0, 0, 0, 10, 10, 9.5, 100, 100, 0.7, 0.7, 0.7).positions, JcreateSphere(0, 0, 0, 2, 2, 2, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    moon.setup();

    // var earth = new MyObjectJavier(JcreateEarth(0, 0, 0, 10, 10, 9.5, 100, 100, 0.7, 0.7, 0.7).positions, JcreateSphere(0, 0, 0, 2, 2, 2, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    // moon.setup();

    var saturn = new MyObjectJavier(JcreateSaturn(0, 0, 0, 2, 2, 2, 100, 100, 0.878, 0.749, 0.38).positions, JcreateSphere(0, 0, 0, 2, 2, 2, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    saturn.setup();
    var saturnRing = new MyObjectJavier(JgenerateSaturRingVertices(0, 0, 0, 3, 4, 0.729, 0.624, 0.392), JgenerateSaturnRingIndices(), shader_vertex_source, shader_fragment_source);
    saturnRing.setup();

    var blackHole = new MyObjectJavier(JcreateBlackHole(0, 0, 0, 12, 12, 12, 100, 100, 0, 0, 0).positions, JcreateBlackHole(0.5, 0.5, 0.5, 10, 10, 10, 100, 100, 1, 1, 1).indices, shader_vertex_source, shader_fragment_source);
    blackHole.setup();
    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    object.child.push(moon);
    object.child.push(saturn);
    object.child.push(saturnRing);
    object.child.push(blackHole);

    // object.child.push(earth);
    /*========================= DRAWING ========================= */
    GL.clearColor(0, 0, 0, 0);


    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    // var saturnX = 0;
    var saturnY = 0;
    var rotasiBlackHoleSpeed = 0;

    // ------------------ANIMASI ASTRONOT-------------------
    var astronotY = 0; //ini ngestore koordinat horizontalnya
    var astronautMasuk = 0;
    var astronautMuter = 0;
    var astronautScaleX = 1;
    var astronautScaleY = 1;
    var astronautScaleZ = 1;
    // ------------------================-------------------

    var headAlienGeserX = 0;

    var time_prev = 0;
    var timereference = 0;
    var animate = function (time) {
        var ratioAnimation = 0.005;
        timereference = timereference + 1;
        timesecond = timereference / 60;

        // saturnX += ratioAnimation;
        saturnY += ratioAnimation;
        rotasiBlackHoleSpeed += 0.5;
        astronautMasuk += 0.2;
        if (JtranslateX <= 5) {
            JtranslateX += 0.01;
        } else {
            JtranslateX = 5;
            headAlienGeserX += 0.05
        }
        astronautMuter += 0.01;
        // saturnZ += ratioAnimation;

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




        // nge set posisi awal astronaut
        ASTRONOUT_MODEL = LIBS.get_I4();
        LIBS.translateX(ASTRONOUT_MODEL, -20);

        //console.log(-40+astronautMasuk);
        //console.log(astronautMasuk);

        //console.log(astronautMasuk)
        //console.log("scale Y: ", astronautScaleY);

        LIBS.translateX(ASTRONOUT_MODEL, -50 + astronautMasuk);
        if (astronautMasuk >= 70) {
            astronautScaleY = 1 - ((astronautMasuk - 69) / 10);
            astronautScaleX = 1 - ((astronautMasuk - 69) / 10);
            astronautScaleZ = 1 - ((astronautMasuk - 69) / 10);
        }
        if (astronautMasuk >= 78) {
            astronautMasuk = 0;
        }

        if (astronautMasuk >= 0.1 && astronautMasuk <= 0.5) {
            astronautScaleX = 1;
            astronautScaleY = 1;
            astronautScaleZ = 1;
        }

        LIBS.scale(ASTRONOUT_MODEL, astronautScaleX, astronautScaleY, astronautScaleZ);

        // LIBS.rotateX(ASTRONOUT_MODEL, -20 + astronautMuter);
        LIBS.translateY(ASTRONOUT_MODEL, 1);
        LIBS.rotateX(ASTRONOUT_MODEL, -250);
        LIBS.rotateY(ASTRONOUT_MODEL, 5);
        LIBS.rotateZ(ASTRONOUT_MODEL, 550);
        LIBS.rotateY(ASTRONOUT_MODEL, THETA);
        LIBS.rotateX(ASTRONOUT_MODEL, ALPHA);




        // MODEL_MATRIX2 = LIBS.get_I4();
        // LIBS.JtranslateX(MODEL_MATRIX2, -1)
        // LIBS.JrotateY(MODEL_MATRIX2, -THETA);
        // LIBS.JrotateX(MODEL_MATRIX2, -ALPHA);

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



        astronautBodyObject.MODEL_MATRIX = ASTRONOUT_MODEL;
        // LIBS.translateZ(astronautBodyObject.MODEL_MATRIX, 3);

        astronautBodyObject.render(VIEW_MATRIX, PROJECTION_MATRIX);




        // MODEL_MATRIX2 = MODEL_MATRIX;
        // cubeObject.MODEL_MATRIX = MODEL_MATRIX2;
        // LIBS.scale(cubeObject.MODEL_MATRIX, 3, 3, 3);
        // LIBS.JtranslateX(cubeObject.MODEL_MATRIX, -0);
        // LIBS.JtranslateZ(cubeObject.MODEL_MATRIX, -0.);
        // LIBS.JtranslateY(cubeObject.MODEL_MATRIX,0);

        cubeObject.render(VIEW_MATRIX, PROJECTION_MATRIX);

        // // --------------------------------------------JAVIER---------------------------------------------------------------------------------------------------
        var radius = 1;
        var pos_x = radius * Math.cos(JtranslateY) * Math.sin(JtranslateX);
        var pos_y = radius * Math.sin(JtranslateY);
        var pos_z = radius * Math.cos(JtranslateY) * Math.cos(JtranslateX);

        var startPointXJav = -10

        head_model = LIBS.get_I4();
        LIBS.rotateX(head_model, JrotateX);
        LIBS.rotateY(head_model, JrotateY + headAlienGeserX);
        // LIBS.rotateZ(head_model, JrotateZ);
        LIBS.translateX(head_model, startPointXJav + JtranslateX);
        LIBS.translateY(head_model, JtranslateY);
        // LIBS.translateZ(head_model, JtranslateZ);
        // LIBS.setPosition(head_model, 0, 0, 0);
        // LIBS.scalling(head_Model, JscaleX, JscaleY, JscaleZ);

        body_Model = LIBS.get_I4();
        LIBS.rotateX(body_Model, JrotateX);
        LIBS.rotateY(body_Model, 0 + JrotateY);
        // LIBS.rotateZ(body_Model, JrotateZ);
        LIBS.translateX(body_Model, startPointXJav + JtranslateX);
        // LIBS.translateY(body_Model, JtranslateY);
        // LIBS.translateZ(body_Model, JtranslateZ);
        // LIBS.setPosition(body_Model, 0, 0, 0);
        // LIBS.scale(body_Model, JscaleX, JscaleY, JscaleZ);

        left_hand_model = LIBS.get_I4();
        LIBS.rotateX(left_hand_model, JrotateX);
        LIBS.rotateY(left_hand_model, JrotateY);
        LIBS.rotateZ(left_hand_model, JrotateZ);
        LIBS.translateX(left_hand_model, startPointXJav + JtranslateX);
        // LIBS.translateY(left_hand_model, JtranslateY);
        // LIBS.translateZ(left_hand_model, JtranslateZ);
        // LIBS.setPosition(left_hand_model,0,0,+pos_z);

        right_hand_model = LIBS.get_I4();
        LIBS.rotateX(right_hand_model, JrotateX);
        LIBS.rotateY(right_hand_model, JrotateY);
        LIBS.rotateZ(right_hand_model, -JrotateZ);
        LIBS.translateX(right_hand_model, startPointXJav + JtranslateX);
        // LIBS.translateY(right_hand_model, JtranslateY);
        // LIBS.translateZ(right_hand_model, JtranslateZ);
        // LIBS.setPosition(right_hand_model,0,0,+pos_z);

        object.MODEL_MATRIX = head_model;
        eyes1.MODEL_MATRIX = head_model;
        eyes2.MODEL_MATRIX = head_model;
        eyes3.MODEL_MATRIX = head_model;
        black1.MODEL_MATRIX = head_model;
        black2.MODEL_MATRIX = head_model;
        black3.MODEL_MATRIX = head_model;
        anthena.MODEL_MATRIX = head_model;
        anthenaBall.MODEL_MATRIX = head_model;
        mouth.MODEL_MATRIX = head_model;
        leftEar.MODEL_MATRIX = head_model;
        rightEar.MODEL_MATRIX = head_model;

        body.MODEL_MATRIX = body_Model;
        belt.MODEL_MATRIX = body_Model;
        leftLeg.MODEL_MATRIX = body_Model;
        rightLeg.MODEL_MATRIX = body_Model;
        leftShoe.MODEL_MATRIX = body_Model;
        rightShoe.MODEL_MATRIX = body_Model;
        leftArm.MODEL_MATRIX = body_Model;
        rightArm.MODEL_MATRIX = body_Model;
        leftHand.MODEL_MATRIX = body_Model;
        rightHand.MODEL_MATRIX = body_Model;
        rightPole.MODEL_MATRIX = body_Model;
        leftPole.MODEL_MATRIX = body_Model;
        rightRedFlag.MODEL_MATRIX = body_Model;
        leftRedFlag.MODEL_MATRIX = body_Model;
        // leftFinger1.MODEL_MATRIX = body_Model;
        // leftFinger2.MODEL_MATRIX = body_Model;
        // leftFinger3.MODEL_MATRIX = body_Model;
        // rightFinger1.MODEL_MATRIX = body_Model;
        // rightFinger2.MODEL_MATRIX = body_Model;
        // rightFinger3.MODEL_MATRIX = body_Model;

        object.render(VIEW_MATRIX, PROJECTION_MATRIX);

        //-----------------------------MALVIN------------------------------------
        SHUU_MATRIX = LIBSSHUU.get_I4();



        SHUU_MATRIX2 = LIBSSHUU.get_I4();

        //debug view
        // LIBSSHUU.rotateZ(SHUU_MATRIX2, -0.5);
        // LIBSSHUU.rotateX(SHUU_MATRIX2, 0.2);
        // LIBSSHUU.rotateY(SHUU_MATRIX2, -0.5);

        LIBSSHUU.rotateY(SHUU_MATRIX2, -THETA);
        LIBSSHUU.rotateX(SHUU_MATRIX2, -ALPHA);

        //PENTING! UTK ROTASI DAN GESER SELURUH OBJEK
        var temp = LIBSSHUU.get_I4();
        //LIBSSHUU.rotateY(temp, 1);
        if (timesecond < 3) {
            LIBSSHUU.translateX(temp, timesecond * 2);
        }
        else {
            LIBSSHUU.translateX(temp, 6);
        }
        SHUU_MATRIX2 = LIBSSHUU.multiply(SHUU_MATRIX2, temp);
        temp = LIBSSHUU.get_I4();




        UFO.render(VIEW_MATRIX, PROJECTION_MATRIX);


        //object3.SHUU_MATRIX = SHUU_MATRIX2;
        UFO.SHUU_MATRIX = SHUU_MATRIX2;
        legA1.SHUU_MATRIX = SHUU_MATRIX2;
        kacaUFO.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        LIBSSHUU.translateY(kacaUFO.INDIVIDUAL_MATRIX, 0);
        //move kacaUFO
        kacaUFO.SHUU_MATRIX = LIBSSHUU.get_I4();
        kacaUFO.SHUU_MATRIX = LIBSSHUU.multiply(kacaUFO.SHUU_MATRIX, SHUU_MATRIX2);
        kacaUFO.SHUU_MATRIX = LIBSSHUU.multiply(kacaUFO.SHUU_MATRIX, kacaUFO.INDIVIDUAL_MATRIX);
        //move done


        //Concat legA1
        legA1.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legA1.SHUU_MATRIX = LIBSSHUU.get_I4();
        //concat legA1 done
        //legA1A2
        legA2.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legA2.SHUU_MATRIX = LIBSSHUU.get_I4();
        //legA1A2 done
        //Concat legB1
        legB1.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legB1.SHUU_MATRIX = LIBSSHUU.get_I4();
        legB1.SHUU_MATRIX = LIBSSHUU.multiply(legB1.SHUU_MATRIX, SHUU_MATRIX2);
        legB1.SHUU_MATRIX = LIBSSHUU.multiply(legB1.SHUU_MATRIX, legB1.INDIVIDUAL_MATRIX);
        //concat legB1 done
        //legB1B2
        legB2.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legB2.SHUU_MATRIX = LIBSSHUU.get_I4();
        legB2.SHUU_MATRIX = LIBSSHUU.multiply(legB2.SHUU_MATRIX, SHUU_MATRIX2);
        legB2.SHUU_MATRIX = LIBSSHUU.multiply(legB2.SHUU_MATRIX, legB2.INDIVIDUAL_MATRIX);
        //legB1B2 done
        //Concat legC1
        legC1.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legC1.SHUU_MATRIX = LIBSSHUU.get_I4();
        legC1.SHUU_MATRIX = LIBSSHUU.multiply(legC1.SHUU_MATRIX, SHUU_MATRIX2);
        legC1.SHUU_MATRIX = LIBSSHUU.multiply(legC1.SHUU_MATRIX, legC1.INDIVIDUAL_MATRIX);
        //concat legC1 done
        //legC1C2
        legC2.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legC2.SHUU_MATRIX = LIBSSHUU.get_I4();
        legC2.SHUU_MATRIX = LIBSSHUU.multiply(legC2.SHUU_MATRIX, SHUU_MATRIX2);
        legC2.SHUU_MATRIX = LIBSSHUU.multiply(legC2.SHUU_MATRIX, legC2.INDIVIDUAL_MATRIX);
        //legC1C2 done
        //Concat legD1
        legD1.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legD1.SHUU_MATRIX = LIBSSHUU.get_I4();
        legD1.SHUU_MATRIX = LIBSSHUU.multiply(legD1.SHUU_MATRIX, SHUU_MATRIX2);
        legD1.SHUU_MATRIX = LIBSSHUU.multiply(legD1.SHUU_MATRIX, legD1.INDIVIDUAL_MATRIX);
        //concat legD1 done
        //legD1D2
        legD2.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legD2.SHUU_MATRIX = LIBSSHUU.get_I4();
        legD2.SHUU_MATRIX = LIBSSHUU.multiply(legD2.SHUU_MATRIX, SHUU_MATRIX2);
        legD2.SHUU_MATRIX = LIBSSHUU.multiply(legD2.SHUU_MATRIX, legD2.INDIVIDUAL_MATRIX);
        //legD1D2 done

        //WarnBox
        warning.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        warning.SHUU_MATRIX = LIBSSHUU.get_I4();
        warning.SHUU_MATRIX = LIBSSHUU.multiply(warning.SHUU_MATRIX, SHUU_MATRIX2);
        warning.SHUU_MATRIX = LIBSSHUU.multiply(warning.SHUU_MATRIX, warning.INDIVIDUAL_MATRIX);
        //WarnBox done

        //warntrg
        warntriangle.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        warntriangle.SHUU_MATRIX = LIBSSHUU.get_I4();
        warntriangle.SHUU_MATRIX = LIBSSHUU.multiply(warntriangle.SHUU_MATRIX, SHUU_MATRIX2);
        warntriangle.SHUU_MATRIX = LIBSSHUU.multiply(warntriangle.SHUU_MATRIX, warntriangle.INDIVIDUAL_MATRIX);
        //warntrg done

        //btgseru
        tandaseru.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        tandaseru.SHUU_MATRIX = LIBSSHUU.get_I4();
        tandaseru.SHUU_MATRIX = LIBSSHUU.multiply(tandaseru.SHUU_MATRIX, SHUU_MATRIX2);
        tandaseru.SHUU_MATRIX = LIBSSHUU.multiply(tandaseru.SHUU_MATRIX, tandaseru.INDIVIDUAL_MATRIX);
        //btgseru done

        //ttkseru
        titikseru.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        titikseru.SHUU_MATRIX = LIBSSHUU.get_I4();
        titikseru.SHUU_MATRIX = LIBSSHUU.multiply(titikseru.SHUU_MATRIX, SHUU_MATRIX2);
        titikseru.SHUU_MATRIX = LIBSSHUU.multiply(titikseru.SHUU_MATRIX, titikseru.INDIVIDUAL_MATRIX);
        //ttkseru done

        //engine
        //enginebody
        engine.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        engine.SHUU_MATRIX = LIBSSHUU.get_I4();
        var axisEngine = [0, 1, 0];
        LIBSSHUU.rotateObjectAroundArbitraryAxis(engine, axisEngine, 1.5);
        LIBSSHUU.translateZ(engine.SHUU_MATRIX, 6);
        LIBSSHUU.translateX(engine.SHUU_MATRIX, -4);
        LIBSSHUU.translateY(engine.SHUU_MATRIX, -1);
        engine.SHUU_MATRIX = LIBSSHUU.multiply(engine.SHUU_MATRIX, SHUU_MATRIX2);
        engine.SHUU_MATRIX = LIBSSHUU.multiply(engine.SHUU_MATRIX, engine.INDIVIDUAL_MATRIX);
        //enginefire
        fire.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        fire.SHUU_MATRIX = LIBSSHUU.get_I4();
        var axisFire = [0, 1, 0];
        LIBSSHUU.rotateObjectAroundArbitraryAxis(fire, axisFire, 1.5);
        LIBSSHUU.translateZ(fire.SHUU_MATRIX, 7.8);
        var randomfire = Math.random() * 0.3;
        LIBSSHUU.translateX(fire.SHUU_MATRIX, -7 - randomfire);
        LIBSSHUU.translateY(fire.SHUU_MATRIX, -1);
        fire.SHUU_MATRIX = LIBSSHUU.multiply(fire.SHUU_MATRIX, SHUU_MATRIX2);
        fire.SHUU_MATRIX = LIBSSHUU.multiply(fire.SHUU_MATRIX, fire.INDIVIDUAL_MATRIX);
        //firetail
        firetail.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        firetail.SHUU_MATRIX = LIBSSHUU.get_I4();
        var axisfiretail = [0, 1, 0];
        LIBSSHUU.rotateObjectAroundArbitraryAxis(firetail, axisfiretail, 4.5);
        LIBSSHUU.translateZ(firetail.SHUU_MATRIX, -5.5);
        var randomfiretail = Math.random() * 0.5;
        LIBSSHUU.translateX(firetail.SHUU_MATRIX, -14 - randomfiretail);
        LIBSSHUU.translateY(firetail.SHUU_MATRIX, -1);
        firetail.SHUU_MATRIX = LIBSSHUU.multiply(firetail.SHUU_MATRIX, SHUU_MATRIX2);
        firetail.SHUU_MATRIX = LIBSSHUU.multiply(firetail.SHUU_MATRIX, firetail.INDIVIDUAL_MATRIX);


        //scale warning
        var scale = (timesecond - 2) * 4;
        if (scale < 0) {
            scale = 0;
        }
        if (scale > 1) {
            scale = 1;
        }
        LIBSSHUU.scale(warning.SHUU_MATRIX, scale, scale, scale);
        LIBSSHUU.scale(warntriangle.SHUU_MATRIX, scale, scale, scale);
        LIBSSHUU.scale(tandaseru.SHUU_MATRIX, scale, scale, scale);
        LIBSSHUU.scale(titikseru.SHUU_MATRIX, scale, scale, scale);
        warning.SHUU_MATRIX = LIBSSHUU.multiply(warning.SHUU_MATRIX, SHUU_MATRIX2);
        warning.SHUU_MATRIX = LIBSSHUU.multiply(warning.SHUU_MATRIX, warning.INDIVIDUAL_MATRIX);
        warntriangle.SHUU_MATRIX = LIBSSHUU.multiply(warntriangle.SHUU_MATRIX, SHUU_MATRIX2);
        warntriangle.SHUU_MATRIX = LIBSSHUU.multiply(warntriangle.SHUU_MATRIX, warntriangle.INDIVIDUAL_MATRIX);
        tandaseru.SHUU_MATRIX = LIBSSHUU.multiply(tandaseru.SHUU_MATRIX, SHUU_MATRIX2);
        tandaseru.SHUU_MATRIX = LIBSSHUU.multiply(tandaseru.SHUU_MATRIX, tandaseru.INDIVIDUAL_MATRIX);
        titikseru.SHUU_MATRIX = LIBSSHUU.multiply(titikseru.SHUU_MATRIX, SHUU_MATRIX2);
        titikseru.SHUU_MATRIX = LIBSSHUU.multiply(titikseru.SHUU_MATRIX, titikseru.INDIVIDUAL_MATRIX);
        //scale done
        legB1.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legB1.SHUU_MATRIX = LIBSSHUU.get_I4();
        legB2.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legB2.SHUU_MATRIX = LIBSSHUU.get_I4();
        legC1.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legC1.SHUU_MATRIX = LIBSSHUU.get_I4();
        legC2.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legC2.SHUU_MATRIX = LIBSSHUU.get_I4();
        legD1.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legD1.SHUU_MATRIX = LIBSSHUU.get_I4();
        legD2.INDIVIDUAL_MATRIX = LIBSSHUU.get_I4();
        legD2.SHUU_MATRIX = LIBSSHUU.get_I4();


        //Rotate legs
        var axisA1 = [3, 0, 3];
        var axisA2 = [3, -3, 3];
        var axisB1 = [-3, 0, -3];
        var axisB2 = [-3, -3, -3];
        var axisC1 = [-3, 0, 3];
        var axisC2 = [-3, -3, 3];
        var axisD1 = [3, 0, -3];
        var axisD2 = [3, -3, -3];
        if (timesecond < 2) {
            //legA
            LIBSSHUU.rotateObjectAroundArbitraryAxis(legA2, axisA2, timesecond - 2);
            //legB
            LIBSSHUU.rotateObjectAroundArbitraryAxis(legB2, axisB2, timesecond - 2);
            //legC
            LIBSSHUU.rotateObjectAroundArbitraryAxis(legC2, axisC2, timesecond - 2);
            //legD
            LIBSSHUU.rotateObjectAroundArbitraryAxis(legD2, axisD2, timesecond - 2);
        }
        else if (timesecond > 2 && timesecond < 3.5) {
            //legA
            LIBSSHUU.rotateObjectAroundArbitraryAxis(legA1, axisA1, -(timesecond - 2));
            LIBSSHUU.translateX(legA2.SHUU_MATRIX, 1.2 * -(timesecond - 2));
            LIBSSHUU.translateY(legA2.SHUU_MATRIX, 2 * (timesecond - 2));
            LIBSSHUU.translateZ(legA2.SHUU_MATRIX, 1.8 * (timesecond - 2));
            //legB
            LIBSSHUU.rotateObjectAroundArbitraryAxis(legB1, axisB1, -(timesecond - 2));
            LIBSSHUU.translateX(legB2.SHUU_MATRIX, 1.2 * (timesecond - 2));
            LIBSSHUU.translateY(legB2.SHUU_MATRIX, 1.8 * (timesecond - 2));
            LIBSSHUU.translateZ(legB2.SHUU_MATRIX, 2 * -(timesecond - 2));
            //legC
            LIBSSHUU.rotateObjectAroundArbitraryAxis(legC1, axisC1, -(timesecond - 2));
            LIBSSHUU.translateX(legC2.SHUU_MATRIX, 1.8 * -(timesecond - 2));
            LIBSSHUU.translateY(legC2.SHUU_MATRIX, 2 * (timesecond - 2));
            LIBSSHUU.translateZ(legC2.SHUU_MATRIX, 1.2 * -(timesecond - 2));
            //legD
            LIBSSHUU.rotateObjectAroundArbitraryAxis(legD1, axisD1, -(timesecond - 2));
            LIBSSHUU.translateX(legD2.SHUU_MATRIX, 1.8 * (timesecond - 2));
            LIBSSHUU.translateY(legD2.SHUU_MATRIX, 2 * (timesecond - 2));
            LIBSSHUU.translateZ(legD2.SHUU_MATRIX, 1.2 * (timesecond - 2));

        }
        else if (timesecond >= 3.5) {
            //legA
            LIBSSHUU.rotateObjectAroundArbitraryAxis(legA1, axisA1, 1.5);
            LIBSSHUU.translateX(legA2.SHUU_MATRIX, -3);
            //legB
            LIBSSHUU.rotateObjectAroundArbitraryAxis(legB1, axisB1, 1.5);
            LIBSSHUU.translateX(legB2.SHUU_MATRIX, 3);
            //legC
            LIBSSHUU.rotateObjectAroundArbitraryAxis(legC1, axisC1, 1.5);
            LIBSSHUU.translateZ(legC2.SHUU_MATRIX, -3);
            //legC
            LIBSSHUU.rotateObjectAroundArbitraryAxis(legD1, axisD1, 1.5);
            LIBSSHUU.translateZ(legD2.SHUU_MATRIX, 3);
        }
        //legA
        LIBSSHUU.rotateObjectAroundArbitraryAxis(legA2, axisA2, 2);
        legA1.SHUU_MATRIX = LIBSSHUU.multiply(legA1.SHUU_MATRIX, SHUU_MATRIX2);
        legA1.SHUU_MATRIX = LIBSSHUU.multiply(legA1.SHUU_MATRIX, legA1.INDIVIDUAL_MATRIX);
        legA2.SHUU_MATRIX = LIBSSHUU.multiply(legA2.SHUU_MATRIX, SHUU_MATRIX2);
        legA2.SHUU_MATRIX = LIBSSHUU.multiply(legA2.SHUU_MATRIX, legA2.INDIVIDUAL_MATRIX);
        //legB
        LIBSSHUU.rotateObjectAroundArbitraryAxis(legB2, axisB2, 2);
        legB1.SHUU_MATRIX = LIBSSHUU.multiply(legB1.SHUU_MATRIX, SHUU_MATRIX2);
        legB1.SHUU_MATRIX = LIBSSHUU.multiply(legB1.SHUU_MATRIX, legB1.INDIVIDUAL_MATRIX);
        legB2.SHUU_MATRIX = LIBSSHUU.multiply(legB2.SHUU_MATRIX, SHUU_MATRIX2);
        legB2.SHUU_MATRIX = LIBSSHUU.multiply(legB2.SHUU_MATRIX, legB2.INDIVIDUAL_MATRIX);
        //legC
        LIBSSHUU.rotateObjectAroundArbitraryAxis(legC2, axisC2, 2);
        legC1.SHUU_MATRIX = LIBSSHUU.multiply(legC1.SHUU_MATRIX, SHUU_MATRIX2);
        legC1.SHUU_MATRIX = LIBSSHUU.multiply(legC1.SHUU_MATRIX, legC1.INDIVIDUAL_MATRIX);
        legC2.SHUU_MATRIX = LIBSSHUU.multiply(legC2.SHUU_MATRIX, SHUU_MATRIX2);
        legC2.SHUU_MATRIX = LIBSSHUU.multiply(legC2.SHUU_MATRIX, legC2.INDIVIDUAL_MATRIX);
        //legD
        LIBSSHUU.rotateObjectAroundArbitraryAxis(legD2, axisD2, 2);
        legD1.SHUU_MATRIX = LIBSSHUU.multiply(legD1.SHUU_MATRIX, SHUU_MATRIX2);
        legD1.SHUU_MATRIX = LIBSSHUU.multiply(legD1.SHUU_MATRIX, legD1.INDIVIDUAL_MATRIX);
        legD2.SHUU_MATRIX = LIBSSHUU.multiply(legD2.SHUU_MATRIX, SHUU_MATRIX2);
        legD2.SHUU_MATRIX = LIBSSHUU.multiply(legD2.SHUU_MATRIX, legD2.INDIVIDUAL_MATRIX);
        //rotate legs done



        //-----------------------------ENVIRONMENT------------------------------------
        MOON_MODEL_MATRIX = LIBS.get_I4();
        LIBS.rotateX(MOON_MODEL_MATRIX, 5);
        LIBS.rotateY(MOON_MODEL_MATRIX, saturnY);
        LIBS.translateX(MOON_MODEL_MATRIX, 40);
        LIBS.translateY(MOON_MODEL_MATRIX, 25);
        LIBS.translateZ(MOON_MODEL_MATRIX, -45);

        moon.MODEL_MATRIX = MOON_MODEL_MATRIX;

        SATURN_MODEL_MATRIX = LIBS.get_I4();
        LIBS.rotateX(SATURN_MODEL_MATRIX, 5);
        LIBS.rotateY(SATURN_MODEL_MATRIX, saturnY);
        LIBS.translateX(SATURN_MODEL_MATRIX, -26);
        LIBS.translateY(SATURN_MODEL_MATRIX, 15);

        saturn.MODEL_MATRIX = SATURN_MODEL_MATRIX;
        saturnRing.MODEL_MATRIX = SATURN_MODEL_MATRIX;

        // moon.render(VIEW_MATRIX, PROJECTION_MATRIX);



        BLACKHOLE_MODEL_MATRIX = LIBS.get_I4();
        LIBS.rotateX(BLACKHOLE_MODEL_MATRIX, 0.3);
        LIBS.rotateZ(BLACKHOLE_MODEL_MATRIX, rotasiBlackHoleSpeed);
        LIBS.translateX(BLACKHOLE_MODEL_MATRIX, 15);
        LIBS.translateY(BLACKHOLE_MODEL_MATRIX, 1);
        LIBS.translateZ(BLACKHOLE_MODEL_MATRIX, -40);

        blackHole.MODEL_MATRIX = BLACKHOLE_MODEL_MATRIX;
        // blackHole.render(VIEW_MATRIX, PROJECTION_MATRIX);




        // ------------------------------------------------------------------------------------------------------------------
        handleKeys();

        window.requestAnimationFrame(animate);
    };
    animate(0);
}
window.addEventListener('load', main);