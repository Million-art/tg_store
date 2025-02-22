import { Provider } from "react-redux";
import { store } from "./store/store"; 
import { ThemeProvider } from "next-themes"; 
import { Routes, Route } from "react-router-dom";

import TopNav from "./components/TopNav";
import BottomNav from "./components/BottomNav";

import { Home } from "./screens/Home";
import Order from "./screens/Order";
import Products from "./screens/Products";
import Cart from "./screens/Cart";
import Referrals from "./screens/Referrals";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system">
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/referral" element={<Referrals />} />
        </Routes>
        <BottomNav />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
