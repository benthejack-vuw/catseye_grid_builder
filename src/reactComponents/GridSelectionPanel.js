import React from 'react'

import store from '../store/configureStore'


const GridSelectionPanel = (props) => (
    <div>
        {
            props.grids &&
            props.grids.map((grid)=>(
                <GridButton key={grid.name} {...grid} />
            ))
        }
    </div>
)

export default GridSelectionPanel;