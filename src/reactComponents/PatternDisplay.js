import { DomUtils } from 'bj-utils'
import React from 'react'
import { QDOrthoGLCanvas } from '../webGL/qdOrthoGLCanvas'
import GLMirrorPolygon from '../webGL/GLMirrorPolygon'

export class PatternDisplay extends React.Component{
    //props.maxTileSize
    //props.scale
    //props.polyGrid
    //props.image
    //props.showGrid
    //props.textureCoordinates

    _glCanvas;
    _glCtx;

    constructor(props){
        super(props);

        this._glCanvas = document.createElement("canvas");
		this._glCtx = this._glCanvas.getContext("webgl");
	    if (!this._glCtx) {
	      throw("webgl unavailable");
	    }
    }

    render = ()=>(
        <div style={
                {
                width:'60vw',
                height:'60vh',
                float:'left'
                }
            }
        >
            <canvas id='pattern-canvas' width='1000' height='1000'/>
            {this.props.showGrid && <canvas id='grid-canvas'/>}
        </div>
    )
    
    componentDidUpdate = () => {
        this.renderPattern(document.getElementById('pattern-canvas'));
    }

    renderPattern = async (canvas)=>{
        
        const glCanvas = await this.buildGLCanvas(this._glCanvas, this._glCtx);

        this.props.polyGrid.edge_normalized_polygons.forEach(
            (poly) => {
                this.renderPolygon(new GLMirrorPolygon(poly), glCanvas);
            }
        )
        
        this.patternFill(glCanvas.canvas, canvas);

        glCanvas.destroy();
    }

    renderGrid = (e)=>{
        const canvas = e.target;
    }

    buildGLCanvas = async (canvas, glContext)=>{
        const glCanvas = new  QDOrthoGLCanvas(canvas, glContext, vertexShader, fragmentShader, 'u_matrix');
        const image = await DomUtils.buildImageFromURL(this.props.image);
        glCanvas.setView(this.tileSize(), this.renderModelView());
        glCanvas.setTexture(image, 'u_texture');
        glCanvas.glContext.clear(glContext.COLOR_BUFFER_BIT);
        return glCanvas;
    }

    renderPolygon = (glPoly, glCanvas)=>{
        const pts = glPoly.GLPoints();
        glCanvas.setbuffer(pts, 3, "a_position");
        const texcoords = glPoly.GLTexCoords(this.props.textureCoordinates);
        glCanvas.setbuffer(texcoords, 2, 'a_texcoord');

        glCanvas.render(glCanvas.glContext.TRIANGLE_FAN, glPoly.length+2);
    }

    patternFill = (patternCanvas, canvas) => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var pattern = ctx.createPattern(patternCanvas, "repeat");
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = pattern;
        ctx.fill();
    }
    
    tileSize = ()=>{
       return {x: this.props.maxTileSize * this.props.scale * this.props.polyGrid.edge_normalized_clipRect.width,
               y: this.props.maxTileSize * this.props.scale * this.props.polyGrid.edge_normalized_clipRect.height};
    }

    renderModelView = () => {
        return {x: this.props.polyGrid.edge_normalized_clipRect.width,
                y: this.props.polyGrid.edge_normalized_clipRect.height}
    }
}

var vertexShader = `
attribute vec2 a_texcoord;
attribute vec4 a_position;

uniform mat4 u_matrix;

varying vec2 v_texcoord;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}`

var fragmentShader = `
precision mediump float;

// Passed in from the vertex shader.
varying vec2 v_texcoord;

// The texture.
uniform sampler2D u_texture;

void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
}`


export default PatternDisplay;