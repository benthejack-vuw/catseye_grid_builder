import { QDOrthoGLCanvas } from '../webGL/qdOrthoGLCanvas'
import GLMirrorPolygon from '../webGL/GLMirrorPolygon'
import { Polygon } from 'quick-canvas';
import { textureVertexShader, textureFragmentShader} from '../shaders/patternBuilderShaders'

const _2dCanvas = document.createElement("canvas");
const _glCanvas = document.createElement("canvas");
const _glCtx = _glCanvas.getContext("webgl");
const _orthoGLCanvas = new QDOrthoGLCanvas(_glCanvas, _glCtx, textureVertexShader, textureFragmentShader, 'u_matrix');

if (!_glCtx) {
    throw("webgl unavailable");
}
        
const tileSize = (maxTileSize, scale, bbox)=>{
    return {x: maxTileSize * scale * bbox.width,
            y: maxTileSize * scale * bbox.height};
}

export const renderPattern = ({textureCoordinates, image, polyGrid, scale, maxTileSize})=>{

    //--------------------------------internal functions-----------------------------------

    const updateGLCanvas = ()=>{
       
        _orthoGLCanvas.setView(
            tileSize( maxTileSize, scale, polyGrid.edge_normalized_clipRect),
            renderModelView()
        );

        _orthoGLCanvas.setTexture(image, 'u_texture');

        _glCtx.clear(_glCtx.COLOR_BUFFER_BIT);
    }
    
    const renderPolygon = (glPoly, glCanvas)=>{
        const pts = glPoly.GLPoints();
        glCanvas.setbuffer(pts, 3, "a_position");
        const texcoords = glPoly.GLTexCoords(textureCoordinates);
        glCanvas.setbuffer(texcoords, 2, 'a_texcoord');
    
        glCanvas.render(glCanvas.glContext.TRIANGLE_FAN, glPoly.length+2);
    }
    
    const renderModelView = () => {
        return {x: polyGrid.edge_normalized_clipRect.width,
                y: polyGrid.edge_normalized_clipRect.height}
    }


    //-------------------------------------------FUNCTION LOGIC-----------------------------------------------



    const glCanvas = updateGLCanvas(_glCanvas, _glCtx);

    polyGrid.edge_normalized_polygons.forEach(
        (poly) => {
            renderPolygon(new GLMirrorPolygon(poly), _orthoGLCanvas);
        }
    )

    return _glCanvas;

}


export const renderGrid = (drawInternals, colour, {polyGrid, scale, maxTileSize})=>{
    
    const tSize = tileSize(maxTileSize, scale, polyGrid.edge_normalized_clipRect);
    _2dCanvas.setAttribute('width', tSize.x);
    _2dCanvas.setAttribute('height', tSize.y);

    const context = _2dCanvas.getContext('2d');
    context.clearRect(0,0,tSize.x,tSize.y);

    const polygons = polyGrid.edge_normalized_polygons.map((verts)=>(new Polygon(verts)));

    context.beginPath();
    polygons.forEach((polygon)=>{
        context.strokeStyle = colour ? "#FF0000" : 'black';
        context.setLineDash([0]);
        polygon.draw(context, false, maxTileSize*scale);
    })
    context.stroke();
    
    if(drawInternals){
        context.beginPath();
        polygons.forEach((polygon)=>{
            context.strokeStyle = colour ? "#0000FF" : 'black';
            context.setLineDash([5, 5]);
            polygon.drawFan(context, maxTileSize*scale );
        })
        context.stroke();
    }

    return _2dCanvas;
}

export const patternFill = (tileCanvas, canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var pattern = ctx.createPattern(tileCanvas, "repeat");
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = pattern;
    ctx.fill();
}