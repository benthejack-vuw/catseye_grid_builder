export const defaults = {
    image: 'data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7',
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

export const patternBuilderSettings = {
    image: 'xyz123',
    scale: 0.7,
    showGrid: true,
    grid: {x:10},
    textureCoordinates: [{x:0.1, y:0.2}, {x:1, y:0.5}, {x:0.9, y:0.8}],

    output:{
        width:  300,
        height: 300,
        format: 'jpg',
    }
}