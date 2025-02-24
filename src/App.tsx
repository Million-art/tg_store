import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, store } from "./store/store"; 
import { ThemeProvider } from "next-themes"; 
import { Routes, Route } from "react-router-dom";

import TopNav from "./components/TopNav";
import BottomNav from "./components/BottomNav";

import { Home } from "./screens/Home";
import Order from "./screens/Order";
import Products from "./screens/Products";
import Cart from "./screens/Cart";
import Referrals from "./screens/Referrals";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { selectShowMessage, setShowMessage } from "./store/slice/messageReducer";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const message = useSelector((state: RootState) => selectShowMessage(state));


    // Show message as toast
    useEffect(() => {
      if (message) {
        toast(message.message, {
          autoClose: 2500,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          closeButton: false,
        });
        dispatch(setShowMessage(null));
      }
    }, [message, dispatch]);

  return (
      <ThemeProvider attribute="class" defaultTheme="system">
        <TopNav />
        <ToastContainer
        style={{
          width: "calc(100% - 40px)",
          maxWidth: "none",
          left: "20px",
          right: "20px",
          top: "30px",
          height: "80px",
        }}
        toastStyle={{
          minHeight: "20px",
          padding: "0px 10px",
          paddingBottom: "4px",
          backgroundColor: message?.color || "#00c000",
          color: "white",
          borderRadius: "6px",
          marginBottom: "4px",
        }}
      />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/referral" element={<Referrals />} />
        </Routes>
        <BottomNav />
      </ThemeProvider>
   );
}

export default App;
