import { createSlice } from '@reduxjs/toolkit'

const user = JSON.parse(localStorage.getItem('manthetic_user'))

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    token: localStorage.getItem('manthetic_token') || null,
    loading: false,
    error: null
  },
  reducers: {
    loginStart(state) {
      state.loading = true
      state.error = null
    },
    loginSuccess(state, action) {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      localStorage.setItem('manthetic_token', action.payload.token)
      localStorage.setItem('manthetic_user', JSON.stringify(action.payload.user))
    },
    loginFailure(state, action) {
      state.loading = false
      state.error = action.payload
    },
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('manthetic_token')
      localStorage.removeItem('manthetic_user')
    }
  }
})

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions
export default authSlice.reducer
