import LoginPanel from "./components/Login/Login"
import Home from "./components/Home/Home"
import About from "./components/About/About"
import Contact from "./components/Contact/Contact"
import Register from "./components/Register/Register"
import {Routes, Route } from "react-router-dom";
import Dealers from './components/Dealers/Dealers';
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";
import SearchCars from "./components/Dealers/SearchCars";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginPanel />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dealers" element={<Dealers/>} />
            <Route path="/dealer/:id" element={<Dealer/>} />
            <Route path="/postreview/:id" element={<PostReview/>} />
            <Route path="/searchcars/:id" element={<SearchCars/>} />
        </Routes>
    );
}
export default App;
