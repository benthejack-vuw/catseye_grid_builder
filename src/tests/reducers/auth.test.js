import authReducer from '../../reducers/auth'

test("should set uid state when logged in", ()=>{
    
    const uid = '1234abcd';
    const action = {
        type:'LOGIN',
        uid
    }

    expect(authReducer({}, action)).toEqual({
        uid
    })

})

test("should clear auth state when logged out", ()=>{
    
    const oldState = {
        uid:'1234abcd',
        dummyData:'guff'
    } 
    
    const action = { type:'LOGOUT' }

    expect(authReducer(oldState, action)).toEqual({})
})