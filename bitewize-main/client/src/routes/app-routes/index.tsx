import { Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { HomePage } from "@/pages/home";
import { RequireAuth } from "@/components/require-auth";
import { Layout } from "@/components/layout";

import { CategoryListPage } from "@/pages/category-list";
import { CategoryFormPage } from "@/pages/category-form";

import { ProductListPage } from "@/pages/products-list";
import { ProductFormPage } from "@/pages/products-form";

import { AddressListPage } from "@/pages/address-list";
import { AddressFormPage } from "@/pages/address-form";
import { ShoppingListPage } from "@/pages/shopping-list";
import Checkout from "@/pages/order";
import CheckoutPage from "@/pages/checkout";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                
                {/* public routes */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductListPage />} />

                {/* protected routes */}
                <Route element={<RequireAuth />}>

                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />

                    {/* Rotas de Categoria */}
                    <Route path="/categories" element={<CategoryListPage />} />
                    <Route path="/categories/new" element={<CategoryFormPage />} />
                    <Route path="/categories/:id" element={<CategoryFormPage />} />

                    {/* Rotas de Produto */}
                    
                    <Route path="/products/new" element={<ProductFormPage />} />
                    <Route path="/products/:productId" element={<ProductFormPage />} />

                    {/* Rotas de Endereço */}
                    <Route path="/addresses" element={<AddressListPage />} />
                    <Route path="/addresses/new" element={<AddressFormPage />} />
                    <Route path="/addresses/:id" element={<AddressFormPage />} />

                    {/* Rota de Compras */}
                    <Route path="/shopping-list" element={<ShoppingListPage />} />

                    {/* Carrinho / Checkout */}
                    <Route path="/order" element={<Navigate to="/cart" replace />} />
                    <Route path="/cart" element={<Checkout />} />
                    <Route path="/checkout" element={<CheckoutPage />} />

                </Route>
            </Route>
        </Routes>
    );
}
