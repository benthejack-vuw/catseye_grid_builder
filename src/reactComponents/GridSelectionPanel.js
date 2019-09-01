import React from 'react'
import { connect } from 'react-redux'

import GridButton from './GridButton'
import {updateGrid} from '../actions/PatternBuilder'

const GridSelectionPanel = (props) => (
    <div>
    {
        props.grids &&
        props.grids.map((grid)=>(
            <GridButton
                key={grid.name}
                width={100}
                height={100}
                maxTileSize={100}
                scale={0.1}
                onClick={()=>{props.updateGrid(grid.polyGrid)}}
                selected={
                    JSON.stringify(grid.polyGrid) === JSON.stringify(props.grid)
                }
            {...grid}
        />
        ))
    }
    </div>
)


const mapStateToProps = (state) => ({
    grid: state.patternBuilder.grid
});

const mapDispatchToProps = (dispatch) => ({
    updateGrid: (grid) => dispatch(updateGrid(grid)),
});

export default connect(mapStateToProps, mapDispatchToProps) (GridSelectionPanel);