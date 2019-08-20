import React from 'react'
import { shallow } from 'enzyme'
import { LoginPage } from '../../reactComponents/pages/LoginPage'

let wrapper;

beforeEach(()=>{
    wrapper = shallow(<LoginPage/>);
})

test("should render LoginPage correctly", ()=>{
    expect(wrapper).toMatchSnapshot();
})


test("startLogin should be called when login button is clicked", ()=>{
    const login_dummy = jest.fn();
    const wrapper = shallow(<LoginPage startLogin={login_dummy}/>);
    wrapper.find('button').simulate('click');
    expect(login_dummy).toHaveBeenCalled();
})