import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { url, setHeaders } from './api';

const initialState = {
  token: localStorage.getItem('token'),
  name: '',
  email: '',
  _id: '',
  isAdmin: false,
  registerStatus: '',
  registerError: '',
  loginStatus: '',
  loginError: '',
  userLoaded: false,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (values, { rejectWithValue }) => {
    try {
      console.log("sdjhgjhdjsahdjsadjaskdfja------------Post call")
      await axios.post(`${url}/register`, {
        name: values.name,
        email: values.email,
        password: values.password,
      }).then((response) => {
        const token = response.data;
        localStorage.setItem('token', token);
        return token;
      }).catch((error) => {
        return rejectWithValue(error.response.data);
      })

    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login`, {
        email: values.email,
        password: values.password,
      });
      const token = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/user/${id}`, setHeaders());
      const token = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loadUser(state, action) {
      const token = state.token;
      if (token) {
        const user = jwtDecode(token);
        state.token = token;
        state.name = user.name;
        state.email = user.email;
        state._id = user._id;
        state.isAdmin = user.isAdmin;
        state.userLoaded = true;
      } else {
        state.userLoaded = true;
      }
    },
    logoutUser(state, action) {
      localStorage.removeItem('token');
      return {
        ...initialState,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        if (action.payload) {
          const user = jwtDecode(action.payload);
          state.token = action.payload;
          state.name = user.name;
          state.email = user.email;
          state._id = user._id;
          state.isAdmin = user.isAdmin;
          state.registerStatus = 'success';
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = 'rejected';
        state.registerError = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload) {
          const user = jwtDecode(action.payload);
          state.token = action.payload;
          state.name = user.name;
          state.email = user.email;
          state._id = user._id;
          state.isAdmin = user.isAdmin;
          state.loginStatus = 'success';
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = 'rejected';
        state.loginError = action.payload;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        if (action.payload) {
          const user = jwtDecode(action.payload);
          state.token = action.payload;
          state.name = user.name;
          state.email = user.email;
          state._id = user._id;
          state.isAdmin = user.isAdmin;
          state.getUserStatus = 'success';
        }
      })
      .addCase(getUser.rejected, (state, action) => {
        state.getUserStatus = 'rejected';
        state.getUserError = action.payload;
      });
  },
});

export const { loadUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;

