import React from 'react'

import PatternOptionsPanel from './PatternOptionsPanel'
import GridSelectionPanel  from './GridSelectionPanel'
import PatternDisplay from './PatternDisplay.js'

const PatternBuilderPage = () => (
    <div>
        <PatternDisplay/>
        <PatternOptionsPanel/>
        <GridSelectionPanel/>
    </div>
)

export default PatternBuilderPage;