import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ViewMediaReducer } from "../types/features";

const initialState: ViewMediaReducer = {
  pdfData: null,
  image: null,
};

const viewMediaSlice = createSlice({
  name: "viewMedia",
  initialState,
  reducers: {
    setPdfData(state, action: PayloadAction<ViewMediaReducer["pdfData"]>) {
      state.image = null;
      state.pdfData = action.payload;
    },
    setImageData(state, action: PayloadAction<string | null>) {
      state.pdfData = null;
      state.image = action.payload;
    },
    reset(state) {
      state.pdfData = null;
      state.image = null;
    },
  },
});

export const { setImageData, setPdfData } = viewMediaSlice.actions;

export default viewMediaSlice.reducer;
