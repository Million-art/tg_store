import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./slice/userReducer";
import messageReducer from "./slice/messageReducer";
import productReducer from "./slice/productSlice";
import orderReducer from "./slice/orderSlice";
import cartReducer from "./slice/cartReducer";

export const store = configureStore({
    reducer: {
        user: userReducer,
        message:messageReducer,
        products: productReducer,
        order:orderReducer,
        cart: cartReducer,

    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
