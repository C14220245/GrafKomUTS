function generateCircle(x, y, rad) {
    var list = []
    for (var i = 0; i < 360; i++) {
        var a = rad * Math.cos((i / 180) * Math.PI) + x;
        var b = rad * Math.sin((i / 180) * Math.PI) + y;
        list.push(a);
        list.push(b);
    }
    return list;
}




function main() {
    var CANVAS = document.getElementById("myCanvas");


    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;


    var GL;
    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
    } catch (e) {
        alert("WebGL context cannot be initialized");
        return false;
    }


    // attribute untuk pass data dari js ke shader
    // uniform untuk pass data dari js ke shader, tapi untuk semua vertex, yang sebelumnya itu beda per vertex
    // varying untuk pass data dari VERTEX SHADER ke FRAGMENT SHADER
    // 
    //shaders
    var shader_vertex_source = `
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
    var shader_fragment_source = `
      precision mediump float;
      varying vec3 vColor;
      // uniform vec3 color;
      void main(void) {
      gl_FragColor = vec4(vColor, 1.);
     
      }`;
    var compile_shader = function (source, type, typeString) {
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    };

    var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");

    var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);




    GL.linkProgram(SHADER_PROGRAM);


    var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
    var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");


    //uniform
    var _PMatrix = GL.getUniformLocation(SHADER_PROGRAM, "PMatrix"); //projection
    var _VMatrix = GL.getUniformLocation(SHADER_PROGRAM, "VMatrix"); //View
    var _MMatrix = GL.getUniformLocation(SHADER_PROGRAM, "MMatrix"); //Model


    // var _color = GL.getUniformLocation(SHADER_PROGRAM, "color")


    GL.enableVertexAttribArray(_color);
    GL.enableVertexAttribArray(_position);

    GL.useProgram(SHADER_PROGRAM);


    /*========================= THE TRIANGLE ========================= */
    POINTS:
    // var triangle_vertex = [
    //     -1, -1, // first corner (ind 0) : -> bottom left of the viewport
    //     1, 0, 0,
    //     1, -1, // (ind 1) bottom right of the viewport
    //     0, 1, 0,
    //     0, 1,  // (ind 2) top right of the viewport
    //     0, 0, 1,
    // ];


    var cube = [
        // belakang
        -1, -1, -1, 1, 1, 0,    0,0,
        1, -1, -1, 1, 1, 0,     1,0,
        1, 1, -1, 1, 1, 0,      1,1,
        -1, 1, -1, 1, 1, 0,     0,1,

        // depan
        -1, -1, 1, 0, 0, 1,     0,0,
        1, -1, 1, 0, 0, 1,      1,0,  
        1, 1, 1, 0, 0, 1,       1,1,
        -1, 1, 1, 0, 0, 1,      0,1,

        // Kiri
        -1, -1, -1, 0, 1, 1,    0,0,
        -1, 1, -1, 0, 1, 1,     1,0,
        -1, 1, 1, 0, 1, 1,      1,1,
        -1, -1, 1, 0, 1, 1,     0,1,

        // kanan
        1, -1, -1, 1, 0, 0,     0,0,
        1, 1, -1, 1, 0, 0,      1,0,
        1, 1, 1, 1, 0, 0,       1,1,
        1, -1, 1, 1, 0, 0,      0,1,

        // bawah
        -1, -1, -1, 1, 0, 1,    0,0,
        -1, -1, 1, 1, 0, 1,     1,0,
        1, -1, 1, 1, 0, 1,      1,1,
        1, -1, -1, 1, 0, 1,     0,1,

        // atas
        -1, 1, -1, 0, 1, 0,     0,0,
        -1, 1, 1, 0, 1, 0,      1,0,
        1, 1, 1, 0, 1, 0,       1,1,
        1, 1, -1, 0, 1, 0,      0,1

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


    // VBO cube
    var CUBE_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER,
        new Float32Array(cube),
        GL.STATIC_DRAW);


    // FACES:
    // var triangle_faces = [0, 1, 2];
    var CUBE_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(cube_faces),
        GL.STATIC_DRAW);




    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();


    LIBS.translateZ(VIEW_MATRIX, -5);


    /*========================= DRAWING ========================= */
    GL.clearColor(0.4, 0.7, 0.5, 1);

    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    var timeRef = 0;
    var animate = function (time) {
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.D_BUFFER_BIT);

        var dt = time - timeRef;
        timeRef = time;
        LIBS.rotateZ(MODEL_MATRIX, dt * LIBS.degToRad(0.05));
        LIBS.rotateY(MODEL_MATRIX, dt * LIBS.degToRad(0.05));
        LIBS.rotateX(MODEL_MATRIX, dt * LIBS.degToRad(0.05));
        
        

        GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);


        // GL.vertexAttribPointer(_position, 2, GL.FLOAT, false, 4*2, 0);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 4 * (3 + 3), 0);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4 * (3 + 3), 3 * 4);




        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
        // GL.uniform3f(_color, 1,0,0);


        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

        //GL.drawArrays(GL.TRIANGLE_FAN, 0, cube.length / 6);


        GL.drawElements(GL.TRIANGLES, cube_faces.length, GL.UNSIGNED_SHORT, 0);


        GL.flush();


        window.requestAnimationFrame(animate);
    };


    animate(0);
}
window.addEventListener('load', main);