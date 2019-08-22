import React from 'react';
import { shallow } from 'enzyme';
import GridBuilderPage from '../../reactComponents/GridBuilderPage';

test('should render GridBuilderPage correctly', ()=>{
    const wrapper = shallow(<GridBuilderPage startLogout={()=>{}}/>);
    expect(wrapper).toMatchSnapshot();
})