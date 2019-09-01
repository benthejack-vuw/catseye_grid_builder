import React from 'react'
import { renderPattern, renderGrid, patternFill } from '../helperFunctions/gridRenderer'

export class PatternDisplay extends React.Component{

    _patternCanvasRef;
    _gridCanvasRef

    constructor(props){
        super(props);

        this._patternCanvasRef = React.createRef();
        this._gridCanvasRef = React.createRef();
    }

    render = ()=>(
        <div className='pattern-display'>
            <canvas ref={this._patternCanvasRef} className='pattern-display__canvas' width={1500} height={1500}/>
            {this.props.showGrid && <canvas ref={this._gridCanvasRef} className='pattern-display__canvas'  width={1500} height={1500}/>}
        </div>
    )
    
    componentDidUpdate = () => {
        const tile = renderPattern(this.props);
        patternFill(tile, this._patternCanvasRef.current);

        if(this._gridCanvasRef.current){
            const gridTile = renderGrid(true, true, this.props);
            patternFill(gridTile, this._gridCanvasRef.current);
        }
    }    

}

export default PatternDisplay;