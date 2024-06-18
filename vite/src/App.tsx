import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Market from "./pages/Market";
import Mint from "./pages/Mint";
import MintList from "./pages/MintList";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/marketList" element={<MintList />} />
          <Route path="/createMarketItemForm" element={<Mint />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
