import React from 'react';
import { shallow } from 'enzyme';
import { Header } from '../../reactComponents/Header';

test('should render header correctly', ()=>{
    const wrapper = shallow(<Header startLogout={()=>{}}/>);
    expect(wrapper).toMatchSnapshot();
})