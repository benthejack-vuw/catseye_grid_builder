import { updateTextureCoordinates, updateImage, updateScale } from '../../actions/PatternBuilder' 


test('should generate updateTextureCoordinates action correctly', ()=>{
    const coords = [{x:1, y:0}, {x:0, y:0}, {x:1, y:1}];
    const action = updateTextureCoordinates(coords);
    expect(action.type).toBe("UPDATE_TEXTURE_COORDINATES");
    expect(action.textureCoordinates).toEqual(coords);
})

test('should generate updateImage action correctly', ()=>{
    const testImage = 'test_image_string';
    const action = updateImage(testImage);
    expect(action.type).toBe("UPDATE_IMAGE");
    expect(action.image).toEqual(testImage);
})

test('should generate updateScale action correctly', ()=>{
    const testScale = 0.1234;
    const action = updateScale(testScale);
    expect(action.type).toBe("UPDATE_SCALE");
    expect(action.scale).toEqual(testScale);
})