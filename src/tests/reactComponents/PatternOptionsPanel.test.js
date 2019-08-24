import React from 'react';
import { shallow } from 'enzyme';
import { PatternOptionsPanel } from '../../reactComponents/PatternOptionsPanel'

import { defaults } from '../fixtures/PatternBuilderSettings'

test('should render PatternOptionsPanel correctly', ()=>{
    const wrapper = shallow(<PatternOptionsPanel 
                                image={defaults.image}
                                textureCoordinates={defaults.textureCoordinates}
                            />);
    expect(wrapper).toMatchSnapshot();
})

/*test('should call updateImage prop when the loadImage button was pressed', ()=>{
    
    const updateImageSpy = jest.fn();
    const wrapper = shallow(<PatternOptionsPanel 
                                image={defaults.image}
                                textureCoordinates={defaults.textureCoordinates}
                                updateImage={updateImageSpy}
                            />);
    wrapper.find('button').simulate('click', {});
    expect(updateImageSpy).toHaveBeenCalled();
})*/

test('should call updateScale prop when the scale slider is changed', ()=>{
    const updateScaleSpy = jest.fn();
    const wrapper = shallow(<PatternOptionsPanel 
                                image={defaults.image}
                                textureCoordinates={defaults.textureCoordinates}
                                updateScale={updateScaleSpy}
                            />);
    wrapper.find('input').simulate('change', {target:{value:0.12345}});
    expect(updateScaleSpy).toHaveBeenCalledWith(0.12345);
})