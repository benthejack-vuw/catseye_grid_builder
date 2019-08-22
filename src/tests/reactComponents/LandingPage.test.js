import React from 'react';
import { shallow } from 'enzyme';
import LandingPage from '../../reactComponents/LandingPage';

test('should render LandingPage correctly', ()=>{
    const wrapper = shallow(<LandingPage startLogout={()=>{}}/>);
    expect(wrapper).toMatchSnapshot();
})