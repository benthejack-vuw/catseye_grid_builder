import { DomUtils } from 'bj-utils'

export const updateTextureCoordinates = (textureCoordinates) => ({
    type: 'UPDATE_TEXTURE_COORDINATES',
    textureCoordinates
});

export const updateImage = (image) => ({
    type: 'UPDATE_IMAGE',
    image
});

export const startUpdateImage = (imageURLString) => {
    return (dispatch) => {
        DomUtils.buildImageFromURL(imageURLString).then((image)=>{
            dispatch(updateImage(image));
        })
    }
}

export const updateScale = (scale) => ({
    type: 'UPDATE_SCALE',
    scale
});

export const updateGrid = (grid) => ({
    type: 'UPDATE_GRID',
    grid
});