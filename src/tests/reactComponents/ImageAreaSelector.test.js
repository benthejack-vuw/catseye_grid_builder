import React from 'react';
import { shallow } from 'enzyme';
import ImageAreaSelector from '../../reactComponents/ImageAreaSelector';
import { defaults } from '../fixtures/PatternBuilderSettings';

const panelSize = 400;

window.document.getElementById = ()=>({
    getBoundingClientRect: ()=>({x:0, y:0, left:0, right:panelSize, top:0, bottom:panelSize, width:panelSize, height:panelSize}),
    setAttribute: ()=>{}
})

window.DOMRect = (x, y, w, h)=>({x:x, y:y, left:x, right:x+w, top:y, bottom:y+h, width:w, height:h})

test('should render ImageAreaSelector correctly', ()=>{
    const wrapper = shallow(<ImageAreaSelector
                            image={defaults.image}
                            size={{x:panelSize,y:panelSize}}
                            updateCallback={()=>{}}
                            onImageLoad={()=>{}}
                        />);
    expect(wrapper).toMatchSnapshot();
})

test('should call updateCallback prop with current texture coordinates (on mouse moved)', ()=>{
    const mockUpdate = jest.fn(); 
    const wrapper = shallow(<ImageAreaSelector
        image={defaults.image}
        size={{x:panelSize,y:panelSize}}
        updateCallback={mockUpdate}
        onImageLoad={()=>{}}
    />);
    wrapper.find('svg').simulate('mousemove', {clientX: 0, clientY:0});
    expect(mockUpdate).toHaveBeenLastCalledWith([{x:0, y:0}, {x:1, y:0}, {x:1, y:1}]);
})

test('should select node on mouse down', ()=>{

    const wrapper = shallow(<ImageAreaSelector
        image={defaults.image}
        size={{x:panelSize,y:panelSize}}
        updateCallback={()=>{}}
        onImageLoad={()=>{}}
    />);

    wrapper.find('circle').at(1).simulate('mousedown', {});
    expect(wrapper.state('selected')).toBe(1);
})

test('should update mouse coordinates on selected node when mousemoved', ()=>{
    const state = {
            size:{x:panelSize,y:panelSize},
            coords: [{x:0, y:0}, {x:panelSize, y:0}, {x:panelSize, y:panelSize}],
            selected: 1,
    }

    const wrapper = shallow(<ImageAreaSelector
        image={defaults.image}
        size={{x:panelSize,y:panelSize}}
        updateCallback={()=>{}}
        onImageLoad={()=>{}}
    />);

    wrapper.setState(()=>state)
    wrapper.find('svg').simulate('mousemove', {clientX: 123, clientY:321});
    expect(wrapper.state('coords')).toEqual([{x:0, y:0}, {x:123, y:321}, {x:panelSize, y:panelSize}]);
})

test('should NOT update mouse coordinates if no Node selected when mousemoved', ()=>{
    
    const coords = [{x:0, y:0}, {x:panelSize, y:0}, {x:panelSize, y:panelSize}];

    const state = {
            size:{x:panelSize,y:panelSize},
            coords,
            selected: undefined,
    }

    const wrapper = shallow(<ImageAreaSelector
        image={defaults.image}
        size={{x:panelSize,y:panelSize}}
        updateCallback={()=>{}}
        onImageLoad={()=>{}}
    />);

    wrapper.setState(()=>state)
    wrapper.find('svg').simulate('mousemove', {clientX: 123, clientY:321});
    expect(wrapper.state('coords')).toEqual(coords);
})

test('should constrain selectors to image size', ()=>{

    const state = {
            size:{x:panelSize,y:panelSize},
            coords: [{x:0, y:0}, {x:panelSize, y:0}, {x:panelSize, y:panelSize}],
            selected: 1,
    }

    const wrapper = shallow(<ImageAreaSelector
        image={defaults.image}
        size={{x:panelSize,y:panelSize}}
        updateCallback={()=>{}}
        onImageLoad={()=>{}}
    />);

    wrapper.setState(()=>state)

    wrapper.find('svg').simulate('mousemove', {clientX: 1000, clientY:1000})
    expect(wrapper.state('coords')).toEqual([{x:0, y:0}, {x:panelSize, y:panelSize}, {x:panelSize, y:panelSize}]);

    wrapper.find('svg').simulate('mousemove', {clientX: -1000, clientY:-1000})
    expect(wrapper.state('coords')).toEqual([{x:0, y:0}, {x:0, y:0}, {x:panelSize, y:panelSize}]);
})

test('should correctly set node/handle coordinates from normalized texture coordinates', ()=>{
    const texCoords = [{x:0.5, y:0.75}, {x:0.25, y:0.15}, {x:0.6, y:0.85}]
    
    const wrapper = shallow(
        <ImageAreaSelector
            textureCoordinates={texCoords}
            image={defaults.image}
            size={{x:panelSize,y:panelSize}}
            updateCallback={()=>{}}
        />
    );

    wrapper.find('image').simulate('load', {});
    expect(wrapper.state('coords')).toEqual(texCoords.map((coord)=>({x:coord.x*panelSize, y:coord.y*panelSize})));
})