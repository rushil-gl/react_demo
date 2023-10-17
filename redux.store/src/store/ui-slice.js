const { createSlice } = require("@reduxjs/toolkit");

const uiSlice = createSlice({
  name: 'ui',
  initialState: { isCartVisible: false, notification: null },
  reducers: {
    toggle(state) {
      state.isCartVisible = !state.isCartVisible;
    },
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        message: action.payload.message,
        title: action.payload.title,
      }
    }
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;

