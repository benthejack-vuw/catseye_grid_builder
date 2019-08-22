import React from 'react';
import { shallow } from 'enzyme';
import PatternBuilderPage from '../../reactComponents/PatternBuilderPage';

test('should render PatternBuilderPage correctly', ()=>{
    const wrapper = shallow(<PatternBuilderPage startLogout={()=>{}}/>);
    expect(wrapper).toMatchSnapshot();
})