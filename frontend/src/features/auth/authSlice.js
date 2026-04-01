import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../../utils/axiosClient';


const registerUser = createAsyncThunk(
    "/auth/register",
    async (data, {rejectWithValue})=>{
        try{
            const response = await axiosClient.post("/auth/register", data)
            return response.data.user;
        }
        catch(err)
        {
           return rejectWithValue(err);
        }
    }
)


const loginUser = createAsyncThunk(
    "/auth/login",
    async (data, {rejectWithValue})=>{
        try
        {
            const response = await axiosClient.post("/auth/login", data);
            return response.data.user;
        }
        catch(err)
        {
           return rejectWithValue(err);
        }
    }
)


const checkAuth = createAsyncThunk(
    "/auth/checkAuth",
    async (_ , {rejectWithValue})=>{
        try
        {
            const response = await axiosClient.get("/auth/check");
            return response.data.user;
        }
        catch(err)
        {
          
            return  rejectWithValue(err.message);
        }
    }
)


const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_ , {rejectWithValue})=>{
        try
        {
            await axiosClient.post("/auth/logout")
        }
        catch(err)
        {
           return rejectWithValue(err);
        }
    }
)






const authSlice = createSlice(
    {
        name : "auth",
        initialState: {
            isLoading: false,
            isAuthenticated: false,
            data: [],
            error: null
        },
        reducer: {

        },
        extraReducers: (builder)=>{
            builder.
            addCase(registerUser.pending, (state)=>{
                state.isLoading = true;
                state.error = false;
            }) 
            .addCase(registerUser.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isAuthenticated = true;
                state.data = action.payload;
            })
            .addCase(registerUser.rejected, (state, action)=>{
                state.isLoading = false,
                state.isAuthenticated = false,
                state.error = action.payload?.message || "Something went wrong";
                state.data = null
            })
            .addCase(loginUser.pending, (state)=>{
                state.isLoading = true;
                state.error = false;
            })
            .addCase(loginUser.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isAuthenticated = true;
                state.data = action.payload;
            })
             .addCase(loginUser.rejected, (state, action)=>{
                state.isLoading = false,
                state.isAuthenticated = false,
                state.error = action.payload?.message || "Something went wrong";
                state.data = null
            })
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.data = action.payload;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.data = null;
            })
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.data = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Something went wrong';
                state.isAuthenticated = false;
                state.data = null;
            })
        }
    }
)


export default authSlice.reducer;
export {loginUser, registerUser, checkAuth, logoutUser}