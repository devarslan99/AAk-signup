import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface SignupPayload {
    user_type: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    country: Country;
}

interface Country {
    name: string;
}

interface SignupState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: SignupState = {
    loading: false,
    error: null,
    success: false,
};

export const signupUser = createAsyncThunk(
    'auth/signup',
    async (signupData: SignupPayload, { rejectWithValue }) => {
        try {
            const response = await axios.post('https://django-dev.aakscience.com/signup/', signupData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // AxiosError type ensures proper handling of response errors
                return rejectWithValue(error.response?.data || 'Signup failed');
            } else {
                // For non-Axios errors, provide a fallback
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

const signupSlice = createSlice({
    name: 'signup',
    initialState,
    reducers: {
        resetSignupState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetSignupState } = signupSlice.actions;
export default signupSlice.reducer;
