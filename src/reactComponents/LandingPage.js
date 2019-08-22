import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => (
    <div>

        <Link to='/pattern-builder/'>
            <p>Build a pattern</p>
        </Link>

        <Link to='/grid-builder/'>
            <p>Build a grid</p>
        </Link>
    
    </div>
)

export default LandingPage;