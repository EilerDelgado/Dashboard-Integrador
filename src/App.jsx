import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import Footer from './components/Footer';

export default function App() {
    return (
        <Router>
            <div id="wrapper" className="d-flex">
                <SideBar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <TopBar />
                        {/* <Routes>
                            <Route path="/" element={<Dashboard />} />
                            Otras rutas
                        </Routes> */}
                    </div>
                    <Footer />
                </div>
            </div>
        </Router>
    );
}
