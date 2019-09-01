import React from 'react'
import { renderGrid, patternFill } from '../helperFunctions/gridRenderer'

export default class GridButton extends React.Component{
    
    _canvasRef;

    constructor(props){
        super(props);
        this._canvasRef = React.createRef();
    }

    componentDidMount = ()=>{
        const tile = renderGrid(true, false, this.props);
        this._canvasRef.current.getContext('2d').clearRect(0,0,this.props.width, this.props.height);
        patternFill(tile, this._canvasRef.current);
    }

    render = ()=>(
                <canvas
                    className={
                        this.props.selected
                        ? 'grid-button grid-button--selected'
                        : 'grid-button'
                    }
                    ref={this._canvasRef}
                    width={this.props.width}
                    height={this.props.height}
                    onClick={this.props.onClick}
                />
        )
    

}

