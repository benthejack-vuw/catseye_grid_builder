import React from 'react'
import { DomUtils } from 'bj-utils'
import { connect } from 'react-redux'
import { updateTextureCoordinates, startUpdateImage, updateScale } from '../actions/PatternBuilder'
import ImageAreaSelector from './ImageAreaSelector'



export class PatternOptionsPanel extends React.Component{

    updateTexCoords = (coords)=>{
        this.props.updateTexCoords(coords);
    }
    
    loadImage = ()=>{
        DomUtils.selectImage().then((file)=>{
            return DomUtils.readImageAsURL(file);
        }).then((imageContentURL)=>{
            this.props.startUpdateImage(imageContentURL);
        });
    }

    updateScale = (e)=>{
        this.props.updateScale(e.target.value);
    }

    render = ()=>(
        <div className='pattern-options-panel'>
            <button onClick={this.loadImage}>Load Image</button>
            
            <ImageAreaSelector 
                image={this.props.image}
                textureCoordinates={this.props.textureCoordinates}
                size={{x:400,y:400}}
                updateCallback={this.updateTexCoords}
            />

            <input 
                type='range'
                min={0.01}
                max={2}
                step={0.01}
                value={this.props.scale}
                onChange={this.updateScale} 
            />
        </div>
    )
}


const mapStateToProps = (state) => ({
    image: state.patternBuilder.image,
    scale: state.patternBuilder.scale,
    textureCoordinates: state.patternBuilder.textureCoordinates,
});

const mapDispatchToProps = (dispatch) => ({
    startUpdateImage: (image) => dispatch(startUpdateImage(image)),
    updateScale: (scale) => dispatch(updateScale(scale)),
    updateTexCoords: (coords) => dispatch(updateTextureCoordinates(coords)),
});

export default connect(mapStateToProps, mapDispatchToProps) (PatternOptionsPanel);

