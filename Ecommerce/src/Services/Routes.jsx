import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Site pages
import HomePage from '../Components/HomePage/HomePage.jsx';
import ProductDetails from '../Components/ProductDetails/ProductDetails.jsx';
import WishlistPage from "../Components/CWOP/WishlistPage.jsx";
import CartPage from "../Components/CWOP/CartPage.jsx";
import OrderPlacement from "../Components/CWOP/OrderPlacement.jsx";
import LoginCard from "../Components/LR/LoginCard.jsx";
import RegisterCard from "../Components/LR/RegisterCard.jsx";
import UserAccount from "../Components/Info/UserAccount.jsx";
import AddandUpdate from "../Components/AddandUpdate.jsx";

// Admin pages
import AdminPage from "../Components/Admin/AdminPage.jsx";
import SellerDashboard from "../Components/Info/SellerDashboard.jsx";
import AdminOrderView from "../Components/Admin/AdminOrderView.jsx";
import Sellerdata from "../Components/Admin/SellerData.jsx";
import UserData from "../Components/Admin/UserData.jsx";
import AddProductForm from "../Components/AddProductForm.jsx";
import ProductsData from "../Components/Admin/ProductsData.jsx";
import OrdersData from "../Components/Admin/OrdersData.jsx";
import AddandUpdateByAdmin from "../Components/Admin/AddandUpdateByAdmin.jsx";



import ProtectedRoute from "./ProtectedRoute.jsx";


import SiteLayout from '../Components/HomePage/HomeNavBar.jsx';
import AdminNavbar from '../Components/HomePage/AdminNavBar.jsx';
import OrdersPage from "../Components/CWOP/OrdersPage.jsx";
import BecomeSellerCard from "../Components/BecomeSellerCard.jsx";
import SearchPage from "../Components/HomePage/SearchPage.jsx";


const SiteShell = () => (
    <SiteLayout>
        <Outlet />
    </SiteLayout>
);

const AdminShell = () => (
    <>
        <AdminNavbar />
        <div className="container-fluid">
            <Outlet />
        </div>
    </>
);

export default function AppRoutes() {
    return (
        <Routes>

            <Route element={<SiteShell />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/login" element={<LoginCard />} />
                <Route path="/RegisterCard" element={<RegisterCard />} />
                <Route path="/search" element={<SearchPage/>}/>


                <Route element={<ProtectedRoute />}>
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/ordersplacement" element={<OrderPlacement />} />
                    <Route path="/update" element={<AddandUpdate />} />
                    <Route path="/account" element={<UserAccount />} />
                    <Route path="/addproduct" element={<AddProductForm />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/becomeAseller" element={<BecomeSellerCard />}/>
                </Route>
            </Route>


            <Route element={<AdminShell />}>
                <Route path="/adminpage" element={<AdminPage />} />
                <Route path="/sellerdashboard" element={<SellerDashboard />} />
                <Route path="/adminorderview" element={<AdminOrderView />} />
                <Route path="/admin/sellerdata" element={<Sellerdata />} />
                <Route path="/admin/userdata" element={<UserData />} />
                <Route path="/admin/products" element={<ProductsData />} />
                <Route path="/admin/orders" element={<OrdersData />} />
                <Route path="/admin/customers/edit/:id" element={<AddandUpdateByAdmin type="CUSTOMER" />} />
                <Route path="/admin/customers/edit/" element={<AddandUpdateByAdmin type="CUSTOMER" />} />
                <Route path="/admin/sellers/edit/" element={<AddandUpdateByAdmin type="SELLER" />} />
                <Route path="/admin/sellers/edit/:id" element={<AddandUpdateByAdmin type="SELLER" />} />
                <Route path="/sellerDash" element={<SellerDashboard />} />

            </Route>
        </Routes>
    );
}
