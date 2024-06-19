import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Market from "./pages/Market";
import Mint from "./pages/Mint";
import MintList from "./pages/MintList";
import DetailAdmItem from "./pages/DetailAdmItem";
import DetailMarketItem from "./pages/DetailMarketItem";
import MyList from "./pages/MyList";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/marketList" element={<MintList />} />
          <Route path="/myList" element={<MyList />} />
          <Route path="/createMarketItemForm" element={<Mint />} />
          <Route path="/detailAdmItem" element={<DetailAdmItem />} />
          <Route path="/detailMarketItem" element={<DetailMarketItem />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
