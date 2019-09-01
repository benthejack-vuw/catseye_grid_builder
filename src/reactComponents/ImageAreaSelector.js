import React from 'react'

export default class ImageAreaSelector extends React.Component{

    _svgContainerRef;
    _svgImageRef;

	constructor(props){
        super(props);

        this.state = {
            size:props.size,
            coords: [{x:0, y:0}, {x:props.size.x, y:0}, {x:props.size.x, y:props.size.y}],
            selected: undefined
        }

        this._svgContainerRef = React.createRef();
        this._svgImageRef = React.createRef();

        document.addEventListener('mouseup', this.stopDragging);
    }

    render = () => ( 
        <div>
            <svg 
             ref={this._svgContainerRef}
             width={this.state.size.x}
             height={this.state.size.y}
             onMouseMove={this.updateMouseCoords}
            >
                <image 
                    ref={this._svgImageRef}
                    xlinkHref={this.props.image && this.props.image.src}
                    width='100%'
                    onLoad={
                        (() => {
                            this.centerImage()
                            this.constrainSelectorsToImage()
                            this.setFromTextureCoordinates(this.props.textureCoordinates)
                        })
                    }
                />

                {this.dashedLines()}
                {this.selectionCircles()}
            </svg>
        </div>
    )

    componentDidMount = () => {
        this.centerImage();
        this.constrainSelectorsToImage();
    }

    componentWillUnmount = () => {
        document.removeEventListener('mouseup', this.stopDragging);
    }

    updateMouseCoords = (e) => {
        const rect = this._svgContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;

        this.setState((prev)=>{
            const coords = [...prev.coords];
            if(prev.selected !== undefined){
                coords[prev.selected] = {x,y};
            }
            return {coords};
        });

        this.constrainSelectorsToImage();
        this.props.updateCallback(this.uvCoordinates());
    }

    setFromTextureCoordinates = (textureCoordinates) => {
        const bounds = this.imageBounds();

        const coords = textureCoordinates.map((coord)=>{
            return {
                x:coord.x*bounds.width + bounds.left,
                y:coord.y*bounds.height + bounds.top
            }
        });

        this.setState(()=>({ coords }))
    }

    uvCoordinates = () => {
        const bounds = this.imageBounds();

        return this.state.coords.map((coord)=>{
            return {
                x:(coord.x - bounds.left)/bounds.width,
                y:(coord.y - bounds.top)/bounds.height
            }
        });
    }
    
    imageBounds = () => {
        const containerRect = this._svgContainerRef.current.getBoundingClientRect();
        const imageRect = this._svgImageRef.current.getBoundingClientRect();
        return new DOMRect(imageRect.x - containerRect.x, imageRect.y - containerRect.y, imageRect.width, imageRect.height);
    }

    centerImage = () => {
        const imageElem = this._svgImageRef.current;
        const imageRect = imageElem.getBoundingClientRect();
        imageElem.setAttribute('x', (this.state.size.x-imageRect.width)/2 );
        imageElem.setAttribute('y', (this.state.size.y-imageRect.height)/2 );
    }

    constrainSelectorsToImage = () => {
        const bounds = this.imageBounds();
        this.setState(({coords}) => ({
            coords: coords.map(({x, y}) => ({
                x: Math.min(Math.max(bounds.left, x), bounds.right),
                y: Math.min(Math.max(bounds.top, y), bounds.bottom),
            }))
        }))
    }

    idPrefix = () => this.props.id || 'image-area-selector'

    startDragging = (index) => {
        this.setState( ({selected:prevSelected}) => ({selected: !prevSelected ? index : prevSelected}) ) 
    }

    stopDragging = () => {
        this.setState( () => ({selected: undefined}) )
    }

    dashedLines = () => {
        return this.state.coords.map((pt, index, array) => (
            <line 
                key={`selectionLine${index}`}
                strokeDasharray="5, 5"
                x1={pt.x}
                y1={pt.y}
                x2={array[(index+1)%array.length].x}
                y2={array[(index+1)%array.length].y}
                stroke='black'
            />
        ))
    }

    selectionCircles = () => {
        return this.state.coords.map((pt, index) => (
            <circle 
                key={`selection${index}`}
                className='image-selection-circle'                            
                cx={pt.x}
                cy={pt.y}
                r={10}
                onMouseDown = {()=>{this.startDragging(index)}}
            />
        ))
    }

}
