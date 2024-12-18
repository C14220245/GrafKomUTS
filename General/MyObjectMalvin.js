class ShuuObject {
    canvas = null;
    vertex = [];
    faces = [];


    SHADER_PROGRAM = null;
    _color = null;
    _position = null;
    _uv = null;


    _MMatrix = LIBSSHUU.get_I4();
    _PMatrix = LIBSSHUU.get_I4();
    _VMatrix = LIBSSHUU.get_I4();
    _greyScality = 0;


    TRIANGLE_VERTEX = null;
    TRIANGLE_FACES = null;


    SHUU_MATRIX = LIBSSHUU.get_I4();
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
        LIBSSHUU.translateX(this.SHUU_MATRIX, -5);

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