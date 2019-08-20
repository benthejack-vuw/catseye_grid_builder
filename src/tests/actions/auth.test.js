import { login, logout } from '../../actions/auth'

test("should create login action", ()=>{
    const uid = '1234abcd';
    expect(login(uid)).toEqual({
        type:'LOGIN',
        uid
    });
})

test("should create logout action", ()=>{
    expect(logout()).toEqual({
        type:'LOGOUT'
    });
})
