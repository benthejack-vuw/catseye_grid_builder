import React from 'react';
import { shallow } from 'enzyme';
import { Header } from '../../reactComponents/Header';

test('should render header correctly', ()=>{
    const wrapper = shallow(<Header startLogout={()=>{}}/>);
    expect(wrapper).toMatchSnapshot();
})

test("startLogout should be called when logout button is clicked", ()=>{
    const logout_dummy = jest.fn();
    const wrapper = shallow(<Header startLogout={logout_dummy}/>);
    wrapper.find('button').simulate('click');
    expect(logout_dummy).toHaveBeenCalled();
})