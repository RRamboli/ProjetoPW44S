import { useEffect, useState, useRef, useCallback } from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import ProductService from "@/services/products-service";
import CategoryService from "@/services/category-service";
import OrderService from "@/services/order-service";
import type { IProduct, ICategory, IProductOrder } from "@/commons/types";
import { useAuth } from "@/context/hooks/use-auth";


import { Dialog } from 'primereact/dialog';

export const HomePage = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);

    const { findAll } = ProductService;
    const { findAll: findAllCategories } = CategoryService;
    const toast = useRef<Toast>(null);

    // Controladores de stato do popup
    const [selProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const { authenticatedUser } = useAuth();

    const applyFiltersWithProducts = useCallback((productsList: IProduct[]) => {
        let result = productsList;

        if (search.trim().length > 0) {
            result = result.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (categoryFilter) {
            result = result.filter((p) => {
                let categoryName: string | null = null;
                
                if (typeof p.category === 'string') {
                    categoryName = p.category;
                } else if (typeof p.category === 'number') {
                    categoryName = String(p.category);
                } else if (typeof p.category === 'object' && p.category) {
                    categoryName = p.category.categoryName || null;
                }
                
                return categoryName === categoryFilter;
            });
        }

        setFilteredProducts(result);
    }, [search, categoryFilter]);

    // Carregar produtos apenas uma vez
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await findAll();
                if (response.success && response.data) {
                    setProducts(response.data);
                } else {
                    console.warn("Falha ao carregar produtos:", response);
                    setProducts([]);
                }
            } catch (error) {
                console.error("Erro ao carregar produtos:", error);
                setProducts([]);
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Não foi possível carregar os produtos.",
                    life: 3000,
                });
            }
        };
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Carregar categorias apenas uma vez
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await findAllCategories();
                if (response.success && response.data) {
                    const categoryOptions = response.data.map((cat: ICategory) => ({
                        label: cat.categoryName,
                        value: cat.categoryName,
                    }));
                    setCategories(categoryOptions);
                } else {
                    console.warn("Falha ao carregar categorias:", response);
                    setCategories([]);
                }
            } catch (error) {
                console.error("Erro ao carregar categorias:", error);
                setCategories([]);
            }
        };
        loadCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Aplicar filtros quando produtos, search ou categoria mudarem
    useEffect(() => {
        applyFiltersWithProducts(products);
    }, [products, applyFiltersWithProducts]);

    // Adicionar ao carrinho
    const addToCart = async (product: IProduct) => {
        try {
            const token = localStorage.getItem("token");
            
            if (!token || !authenticatedUser?.id) {
                toast.current?.show({
                    severity: "warn",
                    summary: "Atenção",
                    detail: "Faça login para adicionar produtos ao carrinho!",
                    life: 3000,
                });
                return;
            }

            const productOrder: IProductOrder = {
                userId: authenticatedUser.id,
                productId: product.productId || 0,
                quantity: 1,
                price: product.price,
            };

            const productOrderResponse = await OrderService.addProductToOrder(productOrder);

            if (!productOrderResponse.success) {
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: productOrderResponse.message || "Produto não foi adicionado ao pedido.",
                    life: 3000,
                });
                return;
            }

            toast.current?.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Produto adicionado ao carrinho!",
                life: 3000,
            });
        } catch (error: any) {
            console.error("Erro ao adicionar ao carrinho:", error);
            const errorMessage = error?.response?.status === 401 
                ? "Sessão expirada. Faça login novamente." 
                : "Não foi possível adicionar ao carrinho.";
            
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: errorMessage,
                life: 3000,
            });
        }
    };

    return (
        <div className="p-4">
            <Toast ref={toast} />

            {/* Banner estilizado */}
            <div
                className="shadow-4"
                style={{
                    width: "100%",
                    height: "320px",
                    borderRadius: "20px",
                    marginBottom: "40px",
                    position: "relative",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #1e1e1e55, #00000055)",
                }}
            >
                <img
                    src="/assets/images/BiteWizeStoreLogo.png"
                    alt="BiteWize Store Banner"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(0.9) blur(3px)",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                    }}
                />

                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        color: "white",
                        textShadow: "0 2px 10px rgba(0,0,0,0.6)"
                    }}
                >
                    <h1 style={{ fontSize: "42px", fontWeight: "800", margin: 0 }}>
                        BiteWize Store
                    </h1>
                    <p style={{ fontSize: "18px", marginTop: "8px" }}>
                        Tecnologia, inovação e estilo em um só lugar.
                    </p>
                </div>
            </div>

            {/* Barra de busca + filtro */}
            <div className="grid mb-4">
                <div className="col-12 md:col-6">
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-search" />
                        <InputText
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar produtos..."
                            className="w-full"
                        />
                    </span>
                </div>

                <div className="col-12 md:col-4">
                    <Dropdown
                        value={categoryFilter}
                        options={categories}
                        placeholder="Filtrar por categoria"
                        className="w-full"
                        onChange={(e) => setCategoryFilter(e.value)}
                        showClear
                    />
                </div>

                <div className="col-12 md:col-2">
                    <Button
                        label="Limpar"
                        icon="pi pi-filter-slash"
                        className="w-full p-button-outlined"
                        onClick={() => {
                            setSearch("");
                            setCategoryFilter(null);
                        }}
                    />
                </div>
            </div>

            <h2 className="text-3xl mb-4 font-bold">Produtos em Destaque</h2>

            <div className="grid">
                {filteredProducts.length === 0 ? (
                    <p>Nenhum produto encontrado.</p>
                ) : (
                    filteredProducts.map((product) => (
                        <div
                            key={product.productId}
                            className="col-12 md:col-4 lg:col-3 p-2"
                        >
                            <Card
                                className="shadow-3 transition-transform hover:shadow-6 hover:scale-105"
                                style={{
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    border: "1px solid #e5e7eb",
                                }}
                                header={
                                    <div style={{ position: "relative", overflow: "hidden" }}>
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            style={{
                                                width: "100%",
                                                height: "210px",
                                                objectFit: "cover",
                                                transition: "transform 0.4s",
                                            }}
                                            className="hover:scale-110"
                                        />

                                        {/* Categoria */}
                                        <span
                                            style={{
                                                position: "absolute",
                                                top: "10px",
                                                left: "10px",
                                                background: "rgba(0, 0, 0, 0.65)",
                                                color: "white",
                                                padding: "6px 12px",
                                                borderRadius: "8px",
                                                fontSize: "0.85rem",
                                                backdropFilter: "blur(4px)",
                                            }}
                                        >
                                            {product.category?.categoryName}
                                        </span>
                                    </div>
                                }
                                footer={
                                    <div className="mt-3">

                                        {/* Linha superior: Preço + Botão Ver */}
                                        <div className="flex justify-content-between align-items-center mb-3">
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "1.3rem",
                                                    color: "#2563eb",
                                                }}
                                            >
                                                {new Intl.NumberFormat("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                }).format(product.price)}
                                            </span>

                                            <Button
                                                label="Ver"
                                                icon="pi pi-search"
                                                className="p-button-sm p-button-rounded p-button-primary"
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setShowDialog(true);
                                                }}
                                            />
                                        </div>

                                        {/* Botão inferior: full width */}
                                        <Button
                                            label="Adicionar ao carrinho"
                                            icon="pi pi-shopping-cart"
                                            className="p-button-primary p-button-sm w-full"
                                            onClick={() => addToCart(product)}
                                        />
                                    </div>
                                }
                            >
                                {/* Conteúdo do Card */}
                                <div style={{ padding: "8px 0" }}>
                                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                                    <p className="text-sm" style={{ color: "#6b7280" }}>
                                        Produto disponível • Frete rápido
                                    </p>
                                </div>
                            </Card>
                        </div>
                    ))
                )}

                <Dialog
                header="Detalhes do Produto"
                visible={showDialog}
                style={{ width: "450px" }}
                modal
                draggable={false}
                onHide={() => setShowDialog(false)}
            >
                {selProduct && (
                    <div className="space-y-3">

                        <img
                            src={selProduct.imageUrl}
                            alt={selProduct.name}
                            className="w-full h-56 object-cover rounded-md mb-3"
                        />

                        <h2 className="text-xl font-bold">{selProduct.name}</h2>

                        <p className="text-gray-600">
                            Categoria: <b>{selProduct.category?.categoryName}</b>
                        </p>

                        <p className="text-lg font-semibold text-blue-600">
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            }).format(selProduct.price)}
                        </p>

                        <p className="text-gray-700 whitespace-pre-line">
                            {selProduct.description || "Sem descrição."}
                        </p>
                        
                    </div>
                )}
            </Dialog>


            </div>
        </div>
    );
};
