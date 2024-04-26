var GL;
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
function bspline3D(listOfPoint, radius) {
    var totalPoints = 100

    var vertices = [];
    var indices = [];
    var points = generateBSpline(listOfPoint, totalPoints, (listOfPoint.length / 6) - 1);
    console.log(listOfPoint.length);


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
function JcreateSphere(x, y, z, xRadius, yRadius, zRadius, latitudeBands, longitudeBands, r, g, b) {
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


function createSphere(radius, segments, capSegments) {
    const vertices = [];
    const indices = [];
    const adjustedY = cosLat * 0.2; // Adjust this value to make the shape flatter or rounder


    for (let i = 0; i <= segments; i++) {
        const lat = Math.PI * i / segments;
        const sinLat = Math.sin(lat);
        const cosLat = Math.cos(lat);

        for (let j = 0; j <= segments; j++) {
            const lng = 2 * Math.PI * j / segments;
            const sinLng = Math.sin(lng);
            const cosLng = Math.cos(lng);
            const tanLng = Math.tan(lng);
            const secLng = 1 / Math.cos(lng);


            const x = cosLng * sinLat;
            const y = adjustedY;
            const z = sinLng * sinLat;

            vertices.push(radius * x, radius * y, radius * z);

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
        const lat = Math.PI * (segments + i) / (segments + capSegments);
        const sinLat = Math.sin(lat);
        const cosLat = Math.cos(lat);

        for (let j = 0; j <= segments; j++) {
            const lng = 2 * Math.PI * j / segments;
            const sinLng = Math.sin(lng);
            const cosLng = Math.cos(lng);

            const x = cosLng * sinLat;
            const y = cosLat;
            const z = sinLng * sinLat;

            vertices.push(radius * x, radius * y, radius * z);

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


function JcreateSphere(x, y, z, xRadius, yRadius, zRadius, latitudeBands, longitudeBands, r, g, b) {
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


class MyObject {
    canvas = null;
    vertex = [];
    faces = [];


    SHADER_PROGRAM = null;
    _color = null;
    _position = null;
    _uv = null;


    _MMatrix = LIBS.get_I4();
    _PMatrix = LIBS.get_I4();
    _VMatrix = LIBS.get_I4();
    _greyScality = 0;


    TRIANGLE_VERTEX = null;
    TRIANGLE_FACES = null;


    SHUU_MATRIX = LIBS.get_I4();
    texture = null;

    child = [];

    constructor(vertex, faces, source_shader_vertex, source_shader_fragment) {
        this.vertex = vertex;
        this.faces = faces;


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

        var shader_vertex = compile_shader(source_shader_vertex, GL.VERTEX_SHADER, "VERTEX");

        var shader_fragment = compile_shader(source_shader_fragment, GL.FRAGMENT_SHADER, "FRAGMENT");

        this.SHADER_PROGRAM = GL.createProgram();
        GL.attachShader(this.SHADER_PROGRAM, shader_vertex);
        GL.attachShader(this.SHADER_PROGRAM, shader_fragment);

        GL.linkProgram(this.SHADER_PROGRAM);


        //vao
        this._color = GL.getAttribLocation(this.SHADER_PROGRAM, "color");
        this._position = GL.getAttribLocation(this.SHADER_PROGRAM, "position");
        this._uv = GL.getAttribLocation(this.SHADER_PROGRAM, "uv");


        //uniform
        this._PMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "PMatrix"); //projection
        this._VMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "VMatrix"); //View
        this._MMatrix = GL.getUniformLocation(this.SHADER_PROGRAM, "MMatrix"); //Model
        this._greyScality = GL.getUniformLocation(this.SHADER_PROGRAM, "greyScality");//GreyScality
        this._sampler = GL.getUniformLocation(this.SHADER_PROGRAM, "sampler");//Texture


        GL.enableVertexAttribArray(this._color);
        GL.enableVertexAttribArray(this._position);
        GL.enableVertexAttribArray(this._uv);
        GL.useProgram(this.SHADER_PROGRAM);




        this.TRIANGLE_VERTEX = GL.createBuffer();
        this.TRIANGLE_FACES = GL.createBuffer();
    }


    setup() {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
        GL.bufferData(GL.ARRAY_BUFFER,
            new Float32Array(this.vertex),
            GL.STATIC_DRAW);


        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.faces),
            GL.STATIC_DRAW);

        this.child.forEach(obj => {
            obj.render(VIEW_MATRIX, PROJECTION_MATRIX);
        });
    }


    render(VIEW_MATRIX, PROJECTION_MATRIX) {
        GL.useProgram(this.SHADER_PROGRAM);
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, this.texture);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);
        GL.vertexAttribPointer(this._position, 3, GL.FLOAT, false, 4 * (3 + 3), 0);
        GL.vertexAttribPointer(this._color, 3, GL.FLOAT, false, 4 * (3 + 3), 3 * 4);
        GL.vertexAttribPointer(this._uv, 2, GL.FLOAT, false, 4 * (3 + 3), (3 + 3) * 4);
        LIBS.translateX(this.SHUU_MATRIX, -5);

        // Create a rotation matrix
        let angle = 20; // Set the angle of rotation
        let rad = angle * Math.PI / 180;
        let cos = Math.cos(rad);
        let sin = Math.sin(rad);
        let rotationMatrix = [
            1, 0, 0, 0,
            0, cos, -sin, 0,
            0, sin, cos, 0,
            0, 0, 0, 1
        ];

        // Multiply the view matrix with the rotation matrix
        let modelViewMatrix = mat4.multiply([], VIEW_MATRIX, rotationMatrix);

        // Set the uniform for the model-view matrix
        GL.uniformMatrix4fv(this._uMVMatrix, false, modelViewMatrix);


        GL.uniformMatrix4fv(this._PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(this._VMatrix, false, VIEW_MATRIX);
        GL.uniformMatrix4fv(this._MMatrix, false, this.SHUU_MATRIX);
        GL.uniform1f(this._greyScality, 1);
        GL.uniform1i(this._sampler, 0);


        GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0);

        this.child.forEach(obj => {
            obj.render(VIEW_MATRIX, PROJECTION_MATRIX);
        });

        GL.flush();
    }
}


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


    var FRICTION = 1;


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
    var shader_fragment_source = `
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

    //NOTE: KALIKAN vUV dengan color utk texture berwarna



    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var SHUU_MATRIX = LIBS.get_I4();
    var SHUU_MATRIX2 = LIBS.get_I4();


    LIBS.translateZ(VIEW_MATRIX, -25);


    //UFO body (parent)
    var UFO = new MyObject(JcreateSphere(0,0,0,4,0.8,4,64,64,0.35,0.3,0.3).positions, JcreateSphere(0,0,0,4,0.8,4,64,64,0.35,0.3,0.3).indices, shader_vertex_source, shader_fragment_source);
    UFO.setup();
    // Apply any transformations to the UFO object here...
    var UFOMatrix = LIBS.get_I4();
    LIBS.translateY(UFOMatrix, 1);  // Adjust the Y value as needed
    UFO.SHUU_MATRIX = UFOMatrix;


    //kacaUFO
    var kacaUFO = new MyObject(createDome(2, 60, 20).vertices, createDome(2, 60, 20).indices, shader_vertex_source, shader_fragment_source);
    kacaUFO.setup();
    var kacaUFOMatrix = LIBS.get_I4();
    LIBS.translateY(kacaUFOMatrix, 1);  // Adjust the Y value as needed
    LIBS.translateZ(kacaUFOMatrix, 5);  // Adjust the Z value as needed

    //legs
    //legA1
    var legA1 = new MyObject(createCylinder(0.1, 1, 64, 1.5, -1, 1.5).vertices, createCylinder(0.1, 1, 64, 1.5, -1, 1.5).indices, shader_vertex_source, shader_fragment_source);
    legA1.setup();
    legA1.SHUU_MATRIX = LIBS.get_I4();
    //legA2
    var legA2 = new MyObject(createCylinder(0.1, 1, 64, 1.5, -2, 1.5).vertices, createCylinder(0.1, 1.5, 64, 1.5, -1, 1.5).indices, shader_vertex_source, shader_fragment_source);
    legA2.setup();
    legA2.SHUU_MATRIX = LIBS.get_I4();
    //legB1
    var legB1 = new MyObject(createCylinder(0.1, 1, 64, -1.5, -1, -1.5).vertices, createCylinder(0.1, 1, 64, -1.5, -1, -1.5).indices, shader_vertex_source, shader_fragment_source);
    legB1.setup();
    legB1.SHUU_MATRIX = LIBS.get_I4();
    //legB2
    var legB2 = new MyObject(createCylinder(0.1, 1, 64, -1.5, -2, -1.5).vertices, createCylinder(0.1, 1, 64, -1.5, -2, -1.5).indices, shader_vertex_source, shader_fragment_source);
    legB2.setup();
    legB2.SHUU_MATRIX = LIBS.get_I4();
    //legC1
    var legC1 = new MyObject(createCylinder(0.1, 1, 64, -1.5, -1, 1.5).vertices, createCylinder(0.1, 1, 64, -1.5, -1, 1.5).indices, shader_vertex_source, shader_fragment_source);
    legC1.setup();
    legC1.SHUU_MATRIX = LIBS.get_I4();
    //legC2
    var legC2 = new MyObject(createCylinder(0.1, 1, 64, -1.5, -2, 1.5).vertices, createCylinder(0.1, 1, 64, -1.5, -2, 1.5).indices, shader_vertex_source, shader_fragment_source);
    legC2.setup();
    legC2.SHUU_MATRIX = LIBS.get_I4();
    //legD1
    var legD1 = new MyObject(createCylinder(0.1, 1, 64, 1.5, -1, -1.5).vertices, createCylinder(0.1, 1, 64, 1.5, -1, -1.5).indices, shader_vertex_source, shader_fragment_source);
    legD1.setup();
    legD1.SHUU_MATRIX = LIBS.get_I4();
    //legD2
    var legD2 = new MyObject(createCylinder(0.1, 1, 64, 1.5, -2, -1.5).vertices, createCylinder(0.1, 1, 64, 1.5, -2, -1.5).indices, shader_vertex_source, shader_fragment_source);
    legD2.setup();
    legD2.SHUU_MATRIX = LIBS.get_I4();
    //warningbox
    var offset = 5;
    var warning = new MyObject(generateBlockVertices(-3.5 - offset, 2.25, -6, 7, 0.2, 4.5, 0.5, 0.5, 1), generateBlockIndices(), shader_vertex_source, shader_fragment_source);
    warning.setup();
    warning.SHUU_MATRIX = LIBS.get_I4();

    var cpWt = [
        0.15 - offset, 6, -5.8, 1, 0, 0,
        -2 - offset, 3, -5.8, 1, 0, 0,
        -2 - offset, 3, -5.8, 1, 0, 0,
        -2 - offset, 3, -5.8, 1, 0, 0,
        -2 - offset, 3, -5.8, 1, 0, 0,
        0 - offset, 3, -5.8, 1, 0, 0,
        2 - offset, 3, -5.8, 1, 0, 0,
        2 - offset, 3, -5.8, 1, 0, 0,
        2 - offset, 3, -5.8, 1, 0, 0,
        2 - offset, 3, -5.8, 1, 0, 0,
        -0.15 - offset, 6, -5.8, 1, 0, 0,
        -0.15 - offset, 6, -5.8, 1, 0, 0,

    ]
    var warntriangle = new MyObject(bspline3D(cpWt, 0.2).vertices, bspline3D(cpWt, 0.3).indices, shader_vertex_source, shader_fragment_source);
    warntriangle.setup();
    warntriangle.SHUU_MATRIX = LIBS.get_I4();

    var tandaseru = new MyObject(generateBlockVertices(-0.1 - offset, 4, -5.7, 0.2, 0.3, 1, 1, 0, 0), generateBlockIndices(), shader_vertex_source, shader_fragment_source);
    tandaseru.setup();
    tandaseru.SHUU_MATRIX = LIBS.get_I4();

    var titikseru = new MyObject(generateBlockVertices(-0.1 - offset, 3.3, -5.7, 0.2, 0.3, 0.3, 1, 0, 0), generateBlockIndices(), shader_vertex_source, shader_fragment_source);
    titikseru.setup();
    titikseru.SHUU_MATRIX = LIBS.get_I4();

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
    /*========================= DRAWING ========================= */
<<<<<<< HEAD
    // GL.clearColor(1, 0.75, 0.0, 0.3);
=======
    GL.clearColor(0.5, 0.75, 0.0, 0.3);
>>>>>>> cfe4ae289ea5b27382b4080884d875aa568219e6


    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    var time_prev = 0;
    var timereference = 0;
    var animate = function (time) {
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.D_BUFFER_BIT);
        var dt = time - time_prev;
        time_prev = time;

        //move objects
        //LIBS.translateX(kacaUFO.SHUU_MATRIX, 20);

        //move done
        timereference = timereference + 1;
        timesecond = timereference / 60;
        //console.log(timereference, timesecond);
        if (!drag) {
            console.log(dY + "<-dY    dX->" + dX);

            dX *= FRICTION;
            dY *= FRICTION;


            THETA += dX * 2 * Math.PI / CANVAS.width;
            ALPHA += dY * 2 * Math.PI / CANVAS.height;
        }





        SHUU_MATRIX = LIBS.get_I4();



        SHUU_MATRIX2 = LIBS.get_I4();

        //debug view
        // LIBS.rotateZ(SHUU_MATRIX2, -0.5);
        // LIBS.rotateX(SHUU_MATRIX2, 0.2);
        // LIBS.rotateY(SHUU_MATRIX2, -0.5);

        LIBS.rotateY(SHUU_MATRIX2, -THETA);
        LIBS.rotateX(SHUU_MATRIX2, -ALPHA);

        //PENTING! UTK ROTASI DAN GESER SELURUH OBJEK
        var temp = LIBS.get_I4();
        //LIBS.rotateY(temp, 1);
        if(timesecond<3){
        LIBS.translateX(temp, timesecond*2);
        }
        else{
            LIBS.translateX(temp, 6);
        }
        SHUU_MATRIX2 = LIBS.multiply(SHUU_MATRIX2, temp);
        temp = LIBS.get_I4();



<<<<<<< HEAD
        object.MODEL_MATRIX = MODEL_MATRIX;
        object.render(VIEW_MATRIX, PROJECTION_MATRIX);


        object2.MODEL_MATRIX = MODEL_MATRIX2;
        object2.render(VIEW_MATRIX, PROJECTION_MATRIX);
=======

        UFO.render(VIEW_MATRIX, PROJECTION_MATRIX);


        //object3.SHUU_MATRIX = SHUU_MATRIX2;
        UFO.SHUU_MATRIX = SHUU_MATRIX2;
        legA1.SHUU_MATRIX = SHUU_MATRIX2;
        kacaUFO.INDIVIDUAL_MATRIX = LIBS.get_I4();
        LIBS.translateY(kacaUFO.INDIVIDUAL_MATRIX, 0);
        //move kacaUFO
        kacaUFO.SHUU_MATRIX = LIBS.get_I4();
        kacaUFO.SHUU_MATRIX = LIBS.multiply(kacaUFO.SHUU_MATRIX, SHUU_MATRIX2);
        kacaUFO.SHUU_MATRIX = LIBS.multiply(kacaUFO.SHUU_MATRIX, kacaUFO.INDIVIDUAL_MATRIX);
        //move done


        //Concat legA1
        legA1.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legA1.SHUU_MATRIX = LIBS.get_I4();
        //concat legA1 done
        //legA1A2
        legA2.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legA2.SHUU_MATRIX = LIBS.get_I4();
        //legA1A2 done
        //Concat legB1
        legB1.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legB1.SHUU_MATRIX = LIBS.get_I4();
        legB1.SHUU_MATRIX = LIBS.multiply(legB1.SHUU_MATRIX, SHUU_MATRIX2);
        legB1.SHUU_MATRIX = LIBS.multiply(legB1.SHUU_MATRIX, legB1.INDIVIDUAL_MATRIX);
        //concat legB1 done
        //legB1B2
        legB2.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legB2.SHUU_MATRIX = LIBS.get_I4();
        legB2.SHUU_MATRIX = LIBS.multiply(legB2.SHUU_MATRIX, SHUU_MATRIX2);
        legB2.SHUU_MATRIX = LIBS.multiply(legB2.SHUU_MATRIX, legB2.INDIVIDUAL_MATRIX);
        //legB1B2 done
        //Concat legC1
        legC1.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legC1.SHUU_MATRIX = LIBS.get_I4();
        legC1.SHUU_MATRIX = LIBS.multiply(legC1.SHUU_MATRIX, SHUU_MATRIX2);
        legC1.SHUU_MATRIX = LIBS.multiply(legC1.SHUU_MATRIX, legC1.INDIVIDUAL_MATRIX);
        //concat legC1 done
        //legC1C2
        legC2.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legC2.SHUU_MATRIX = LIBS.get_I4();
        legC2.SHUU_MATRIX = LIBS.multiply(legC2.SHUU_MATRIX, SHUU_MATRIX2);
        legC2.SHUU_MATRIX = LIBS.multiply(legC2.SHUU_MATRIX, legC2.INDIVIDUAL_MATRIX);
        //legC1C2 done
        //Concat legD1
        legD1.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legD1.SHUU_MATRIX = LIBS.get_I4();
        legD1.SHUU_MATRIX = LIBS.multiply(legD1.SHUU_MATRIX, SHUU_MATRIX2);
        legD1.SHUU_MATRIX = LIBS.multiply(legD1.SHUU_MATRIX, legD1.INDIVIDUAL_MATRIX);
        //concat legD1 done
        //legD1D2
        legD2.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legD2.SHUU_MATRIX = LIBS.get_I4();
        legD2.SHUU_MATRIX = LIBS.multiply(legD2.SHUU_MATRIX, SHUU_MATRIX2);
        legD2.SHUU_MATRIX = LIBS.multiply(legD2.SHUU_MATRIX, legD2.INDIVIDUAL_MATRIX);
        //legD1D2 done

        //WarnBox
        warning.INDIVIDUAL_MATRIX = LIBS.get_I4();
        warning.SHUU_MATRIX = LIBS.get_I4();
        warning.SHUU_MATRIX = LIBS.multiply(warning.SHUU_MATRIX, SHUU_MATRIX2);
        warning.SHUU_MATRIX = LIBS.multiply(warning.SHUU_MATRIX, warning.INDIVIDUAL_MATRIX);
        //WarnBox done

        //warntrg
        warntriangle.INDIVIDUAL_MATRIX = LIBS.get_I4();
        warntriangle.SHUU_MATRIX = LIBS.get_I4();
        warntriangle.SHUU_MATRIX = LIBS.multiply(warntriangle.SHUU_MATRIX, SHUU_MATRIX2);
        warntriangle.SHUU_MATRIX = LIBS.multiply(warntriangle.SHUU_MATRIX, warntriangle.INDIVIDUAL_MATRIX);
        //warntrg done

        //btgseru
        tandaseru.INDIVIDUAL_MATRIX = LIBS.get_I4();
        tandaseru.SHUU_MATRIX = LIBS.get_I4();
        tandaseru.SHUU_MATRIX = LIBS.multiply(tandaseru.SHUU_MATRIX, SHUU_MATRIX2);
        tandaseru.SHUU_MATRIX = LIBS.multiply(tandaseru.SHUU_MATRIX, tandaseru.INDIVIDUAL_MATRIX);
        //btgseru done

        //ttkseru
        titikseru.INDIVIDUAL_MATRIX = LIBS.get_I4();
        titikseru.SHUU_MATRIX = LIBS.get_I4();
        titikseru.SHUU_MATRIX = LIBS.multiply(titikseru.SHUU_MATRIX, SHUU_MATRIX2);
        titikseru.SHUU_MATRIX = LIBS.multiply(titikseru.SHUU_MATRIX, titikseru.INDIVIDUAL_MATRIX);
        //ttkseru done

        //scale warning
        var scale = (timesecond - 2) * 4;
        if (scale < 0) {
            scale = 0;
        }
        if (scale > 1) {
            scale = 1;
        }
        LIBS.scale(warning.SHUU_MATRIX, scale, scale, scale);
        LIBS.scale(warntriangle.SHUU_MATRIX, scale, scale, scale);
        LIBS.scale(tandaseru.SHUU_MATRIX, scale, scale, scale);
        LIBS.scale(titikseru.SHUU_MATRIX, scale, scale, scale);
        warning.SHUU_MATRIX = LIBS.multiply(warning.SHUU_MATRIX, SHUU_MATRIX2);
        warning.SHUU_MATRIX = LIBS.multiply(warning.SHUU_MATRIX, warning.INDIVIDUAL_MATRIX);
        warntriangle.SHUU_MATRIX = LIBS.multiply(warntriangle.SHUU_MATRIX, SHUU_MATRIX2);
        warntriangle.SHUU_MATRIX = LIBS.multiply(warntriangle.SHUU_MATRIX, warntriangle.INDIVIDUAL_MATRIX);
        tandaseru.SHUU_MATRIX = LIBS.multiply(tandaseru.SHUU_MATRIX, SHUU_MATRIX2);
        tandaseru.SHUU_MATRIX = LIBS.multiply(tandaseru.SHUU_MATRIX, tandaseru.INDIVIDUAL_MATRIX);
        titikseru.SHUU_MATRIX = LIBS.multiply(titikseru.SHUU_MATRIX, SHUU_MATRIX2);
        titikseru.SHUU_MATRIX = LIBS.multiply(titikseru.SHUU_MATRIX, titikseru.INDIVIDUAL_MATRIX);
        //scale done
        legB1.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legB1.SHUU_MATRIX = LIBS.get_I4();
        legB2.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legB2.SHUU_MATRIX = LIBS.get_I4();
        legC1.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legC1.SHUU_MATRIX = LIBS.get_I4();
        legC2.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legC2.SHUU_MATRIX = LIBS.get_I4();
        legD1.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legD1.SHUU_MATRIX = LIBS.get_I4();
        legD2.INDIVIDUAL_MATRIX = LIBS.get_I4();
        legD2.SHUU_MATRIX = LIBS.get_I4();


        //Rotate legs
        var axisA1 = [1.5, 0, 1.5];
        var axisA2 = [1.5, -1.5, 1.5];
        var axisB1 = [-1.5, 0, -1.5];
        var axisB2 = [-1.5, -1.5, -1.5];
        var axisC1 = [-1.5, 0, 1.5];
        var axisC2 = [-1.5, -1.5, 1.5];
        var axisD1 = [1.5, 0, -1.5];
        var axisD2 = [1.5, -1.5, -1.5];
        if (timesecond < 2) {
            //legA
            LIBS.rotateObjectAroundArbitraryAxis(legA2, axisA2, timesecond - 2);
            //legB
            LIBS.rotateObjectAroundArbitraryAxis(legB2, axisB2, timesecond - 2);
            //legC
            LIBS.rotateObjectAroundArbitraryAxis(legC2, axisC2, timesecond - 2);
            //legD
            LIBS.rotateObjectAroundArbitraryAxis(legD2, axisD2, timesecond - 2);
        }
        else if (timesecond > 2 && timesecond < 3.5) {
            //legA
            LIBS.rotateObjectAroundArbitraryAxis(legA1, axisA1, -(timesecond - 2));
            LIBS.translateX(legA2.SHUU_MATRIX, 0.6 * -(timesecond - 2));
            LIBS.translateY(legA2.SHUU_MATRIX, 1 * (timesecond - 2));
            LIBS.translateZ(legA2.SHUU_MATRIX, 0.89 * (timesecond - 2));
            //legB
            LIBS.rotateObjectAroundArbitraryAxis(legB1, axisB1, -(timesecond - 2));
            LIBS.translateX(legB2.SHUU_MATRIX, 0.6 * (timesecond - 2));
            LIBS.translateY(legB2.SHUU_MATRIX, 0.89 * (timesecond - 2));
            LIBS.translateZ(legB2.SHUU_MATRIX, 1 * -(timesecond - 2));
            //legC
            LIBS.rotateObjectAroundArbitraryAxis(legC1, axisC1, -(timesecond - 2));
            LIBS.translateX(legC2.SHUU_MATRIX, 0.89 * -(timesecond - 2));
            LIBS.translateY(legC2.SHUU_MATRIX, 1 * (timesecond - 2));
            LIBS.translateZ(legC2.SHUU_MATRIX, 0.6 * -(timesecond - 2));
            //legD
            LIBS.rotateObjectAroundArbitraryAxis(legD1, axisD1, -(timesecond - 2));
            LIBS.translateX(legD2.SHUU_MATRIX, 0.89 * (timesecond - 2));
            LIBS.translateY(legD2.SHUU_MATRIX, 1 * (timesecond - 2));
            LIBS.translateZ(legD2.SHUU_MATRIX, 0.6 * (timesecond - 2));

        }
        else if (timesecond >= 3.5) {
            //legA
            LIBS.rotateObjectAroundArbitraryAxis(legA1, axisA1, 1.5);
            LIBS.translateX(legA2.SHUU_MATRIX, -1.5);
            //legB
            LIBS.rotateObjectAroundArbitraryAxis(legB1, axisB1, 1.5);
            LIBS.translateX(legB2.SHUU_MATRIX, 1.5);
            //legC
            LIBS.rotateObjectAroundArbitraryAxis(legC1, axisC1, 1.5);
            LIBS.translateZ(legC2.SHUU_MATRIX, -1.5);
            //legC
            LIBS.rotateObjectAroundArbitraryAxis(legD1, axisD1, 1.5);
            LIBS.translateZ(legD2.SHUU_MATRIX, 1.5);
        }
        //legA
        LIBS.rotateObjectAroundArbitraryAxis(legA2, axisA2, 2);
        legA1.SHUU_MATRIX = LIBS.multiply(legA1.SHUU_MATRIX, SHUU_MATRIX2);
        legA1.SHUU_MATRIX = LIBS.multiply(legA1.SHUU_MATRIX, legA1.INDIVIDUAL_MATRIX);
        legA2.SHUU_MATRIX = LIBS.multiply(legA2.SHUU_MATRIX, SHUU_MATRIX2);
        legA2.SHUU_MATRIX = LIBS.multiply(legA2.SHUU_MATRIX, legA2.INDIVIDUAL_MATRIX);
        //legB
        LIBS.rotateObjectAroundArbitraryAxis(legB2, axisB2, 2);
        legB1.SHUU_MATRIX = LIBS.multiply(legB1.SHUU_MATRIX, SHUU_MATRIX2);
        legB1.SHUU_MATRIX = LIBS.multiply(legB1.SHUU_MATRIX, legB1.INDIVIDUAL_MATRIX);
        legB2.SHUU_MATRIX = LIBS.multiply(legB2.SHUU_MATRIX, SHUU_MATRIX2);
        legB2.SHUU_MATRIX = LIBS.multiply(legB2.SHUU_MATRIX, legB2.INDIVIDUAL_MATRIX);
        //legC
        LIBS.rotateObjectAroundArbitraryAxis(legC2, axisC2, 2);
        legC1.SHUU_MATRIX = LIBS.multiply(legC1.SHUU_MATRIX, SHUU_MATRIX2);
        legC1.SHUU_MATRIX = LIBS.multiply(legC1.SHUU_MATRIX, legC1.INDIVIDUAL_MATRIX);
        legC2.SHUU_MATRIX = LIBS.multiply(legC2.SHUU_MATRIX, SHUU_MATRIX2);
        legC2.SHUU_MATRIX = LIBS.multiply(legC2.SHUU_MATRIX, legC2.INDIVIDUAL_MATRIX);
        //legD
        LIBS.rotateObjectAroundArbitraryAxis(legD2, axisD2, 2);
        legD1.SHUU_MATRIX = LIBS.multiply(legD1.SHUU_MATRIX, SHUU_MATRIX2);
        legD1.SHUU_MATRIX = LIBS.multiply(legD1.SHUU_MATRIX, legD1.INDIVIDUAL_MATRIX);
        legD2.SHUU_MATRIX = LIBS.multiply(legD2.SHUU_MATRIX, SHUU_MATRIX2);
        legD2.SHUU_MATRIX = LIBS.multiply(legD2.SHUU_MATRIX, legD2.INDIVIDUAL_MATRIX);
        //rotate legs done



        // object2.render(VIEW_MATRIX, PROJECTION_MATRIX);
>>>>>>> cfe4ae289ea5b27382b4080884d875aa568219e6



        window.requestAnimationFrame(animate);
    };


    animate(0);
}
window.addEventListener('load', main);