import patternBuilderReducer from '../../reducers/PatternBuilder'
import { patternBuilderSettings } from '../fixtures/PatternBuilderSettings'
import { defaults } from '../fixtures/PatternBuilderSettings'

test("should set default state", ()=>{
    expect(patternBuilderReducer(undefined, {type:'@@init'})).toEqual(
        defaults
    );
})

test("should update texture coordinates", ()=>{
    
    const textureCoordinates = [{x:.5, y:.6}, {x:.7, y:.8}, {x:.9, y:.1}];
    const action = {
        type:'UPDATE_TEXTURE_COORDINATES',
        textureCoordinates
    };

    expect(patternBuilderReducer(patternBuilderSettings, action)).toEqual({...patternBuilderSettings, textureCoordinates});
})

test("should update image", ()=>{
    
    const image = 'image url string';
    const action = {
        type:'UPDATE_IMAGE',
        image
    };

    expect(patternBuilderReducer(patternBuilderSettings, action)).toEqual({...patternBuilderSettings, image});
})

test("should update scale", ()=>{
    
    const scale = 0.1234;
    const action = {
        type:'UPDATE_SCALE',
        scale
    };

    expect(patternBuilderReducer(patternBuilderSettings, action)).toEqual({...patternBuilderSettings, scale});
})