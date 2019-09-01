
const defaults = {
    image: undefined,
    scale: 0.5,
    showGrid: false,
    grid: undefined,
    textureCoordinates: [{x:0, y:0}, {x:1, y:0}, {x:1, y:1}],

    output:{
        width:  1000,
        height: 1000,
        format: 'png',
    }
}

export default (state = defaults, {type, ...action}) => {
    switch(type){
        case 'UPDATE_TEXTURE_COORDINATES':
            return {
                ...state,
                textureCoordinates: action.textureCoordinates
            }
        case 'UPDATE_IMAGE':
            return {
                ...state,
                image: action.image
            }
        case 'UPDATE_SCALE':
            return {
                ...state,
                scale: action.scale
            }
        case 'UPDATE_GRID':
            console.log('UPDATING GRID')
            return {
                ...state,
                grid: action.grid
            }
        default:
            return state;
    }
}