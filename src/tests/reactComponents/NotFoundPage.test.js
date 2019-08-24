import React from 'react';
import { shallow } from 'enzyme';
import NotFoundPage from '../../reactComponents/NotFoundPage';

test('should render header correctly', ()=>{
    const wrapper = shallow(<NotFoundPage/>);
    expect(wrapper).toMatchSnapshot();
})