import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { PayloadType } from "@/types/payload";
import { getToken } from "@/queries/auth";

import { extractAxiosError } from "@/lib/axios";

export const fetchToken = createAsyncThunk(
  "token/fetchToken",
  async (_, { rejectWithValue }) => {
    try {
      return await getToken();
    } catch (err) {
      return rejectWithValue(extractAxiosError(err));
    }
  }
);

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    data: null as PayloadType | null,
    status: "idle",
    error: null as string | null,
  },
  reducers: {
    setToken: (state, action: PayloadAction<PayloadType>) => {
      state.data = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearToken: (state) => {
      state.data = null;
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToken.pending, (state) => {
        state.status = "loading";
        state.data = null;
        state.error = null;
      })
      .addCase(
        fetchToken.fulfilled,
        (state, action: PayloadAction<PayloadType | null>) => {
          state.data = action.payload;
          state.status = "succeeded";
        }
      )
      .addCase(fetchToken.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || (action.error.message as string);
      });
  },
});

export const { setToken, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
