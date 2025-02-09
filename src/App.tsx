import BottomNav from "./components/BottomNav";

import { Home } from "./screens/Home";
import Order from "./screens/Order";
import Products from "./screens/Products";
import Cart from "./screens/Cart";
import { Route, Routes } from "react-router-dom";
import TopNav from "./components/TopNav";
import { ThemeProvider } from "next-themes";

function App() {
  
  return (
    <>
        <ThemeProvider attribute="class" defaultTheme="system">

          <TopNav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
          <BottomNav />
      </ThemeProvider>

    </>
  );
}

export default App;
