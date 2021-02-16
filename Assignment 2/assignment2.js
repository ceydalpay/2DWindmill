"use strict";

var canvas;
var gl;


var bufferTri, bufferRect, triVertices, rectVertices, bufferRect2, rect2Vertices, bufferRect3, rect3Vertices;
var vPosition, color;
var transformationMatrix, transformationMatrixLoc;
var translate_X = 0;
var translate_Y = 0;
var scaling = 1;
var rotating = 0;
var speed = 1;
var colorRed = 0;
var colorGreen = 0;
var colorBlue = 0;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

  
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Make the letters
    triVertices = [
    vec2(  -0.5,  -0.5 ),
    vec2(  0.2,  -0.5 ),
    vec2(  -0.2, 0.3 )
    ];

    rectVertices = [
        vec2(  0.1,  -0.2 ),
        vec2(  0.3,  -0.2 ),
        vec2(  0.1,  0.2 ),
        vec2(  0.3,  0.2 )
    ];

    rect2Vertices = [
        vec2(  0.4,  -0.2 ),
        vec2(  0.6,  -0.2 ),
        vec2(  0.4,  0.2 ),
        vec2(  0.6,  0.2 )
    ];

    rect3Vertices = [
        vec2(  0.7,  -0.2 ),
        vec2(  0.9,  -0.2 ),
        vec2(  0.7,  0.2 ),
        vec2(  0.9,  0.2 )
    ];


    
    // Load the data into the GPU
    bufferTri = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferTri );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(triVertices), gl.STATIC_DRAW );

  
    // Load the data into the GPU
    bufferRect = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rectVertices), gl.STATIC_DRAW );

   
    bufferRect2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rect2Vertices), gl.STATIC_DRAW );

   
    bufferRect3 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect3 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(rect3Vertices), gl.STATIC_DRAW );


   
    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );
    color = gl.getUniformLocation( program, "color" );

    document.getElementById("inp_objX").oninput = function(event) {
      translate_X = document.getElementById("inp_objX").value;
    };
    document.getElementById("inp_objY").oninput = function(event) {
      translate_Y = document.getElementById("inp_objY").value;
    };
    document.getElementById("inp_obj_scale").oninput = function(event) {
        scaling = document.getElementById("inp_obj_scale").value;
    };
    document.getElementById("inp_obj_rotation").oninput = function(event) {
       rotating = document.getElementById("inp_obj_rotation").value;
    };
    document.getElementById("inp_wing_speed").oninput = function(event) {
        speed = document.getElementById("inp_wing_speed").value;
    };
    document.getElementById("redSlider").oninput = function(event) {
        colorRed = document.getElementById("redSlider").value;
    };
    document.getElementById("greenSlider").oninput = function(event) {
        colorGreen = document.getElementById("greenSlider").value;
    };
    document.getElementById("blueSlider").oninput = function(event) {
        colorBlue = document.getElementById("blueSlider").value;
    };

    render();

};

var ramount = 0;

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    transformationMatrix = mat4();

    transformationMatrix = mult(transformationMatrix, translate(translate_X, translate_Y, 0));
    transformationMatrix = mult(transformationMatrix, scalem(scaling, scaling, 1));
    transformationMatrix = mult(transformationMatrix, rotateZ(rotating));

    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    gl.uniform4fv( color, flatten([colorRed, colorGreen, colorBlue, 1]));


    gl.bindBuffer( gl.ARRAY_BUFFER, bufferTri );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 3 );

  
    ramount = ramount + (0.5 * speed);

    transformationMatrix = mult(transformationMatrix, translate(-0.5, 0.6, 0));
    transformationMatrix = mult(transformationMatrix, translate(0.3, -0.35, 0));
    transformationMatrix = mult(transformationMatrix, rotateZ(ramount));
    transformationMatrix = mult(transformationMatrix, translate(-0.3, 0.1, 0));

    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    gl.uniform4fv( color, flatten([1, 0, 0, 1]));

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4);


    transformationMatrix = mult(transformationMatrix, translate(-0.2, -0.3, 0));
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    gl.uniform4fv( color, flatten([0 ,0 , 1, 1]));

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect2 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    
    
    transformationMatrix = mult(transformationMatrix, translate(0.7, 1.0, 0));
    transformationMatrix = mult(transformationMatrix, rotateZ(-90));
    
    

    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );
    gl.uniform4fv ( color, flatten([0, 1, 0, 1]));

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferRect3 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    window.requestAnimFrame(render);
}
