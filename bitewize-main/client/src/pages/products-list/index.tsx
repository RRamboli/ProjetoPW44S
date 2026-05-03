import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import type { IProduct } from "@/commons/types";
import ProductService from "@/services/products-service";

export const ProductListPage = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const { findAll } = ProductService;
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await findAll();
            if (response.status === 200) {
                setProducts(Array.isArray(response.data) ? response.data : []);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Não foi possível carregar a lista de produtos.",
                    life: 3000,
                });
            }
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Erro de Conexão",
                detail: "Verifique a conexão com a API.",
                life: 3000,
            });
        }
    };

    const handleEdit = (productId: number | undefined) => {
        if (productId) navigate(`/products/${productId}`);
    };

    const handleDelete = (product: IProduct) => {
        console.log("Excluir produto:", product.productId);
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <h2 className="text-xl mb-4">Catálogo de Produtos</h2>

            <div className="flex justify-content-end mb-3">
                <Button
                    label="Adicionar Novo Produto"
                    icon="pi pi-plus"
                    onClick={() => navigate("/products/new")}
                />
            </div>

            {products.length === 0 ? (
                <p>Nenhum produto encontrado.</p>
            ) : (
                <ul className="list-none p-0 m-0">
                    {products.map((product) => (
                        <li
                            key={product.productId}
                            className="flex align-items-center justify-content-between border-bottom-1 surface-border py-3"
                        >
                            <div className="flex align-items-center gap-3">
                                <img
                                    src={product.imageUrl || "/assets/images/placeholder.jpg"}
                                    alt={product.name}
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                    }}
                                />

                                <div>
                                    <div className="text-lg font-semibold">{product.name}</div>
                                    <div className="text-sm text-secondary">
                                        Categoria: {product.category?.categoryName}
                                    </div>
                                    <div className="font-bold mt-1">
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(product.price)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    label="Editar"
                                    icon="pi pi-pencil"
                                    className="p-button-sm p-button-secondary"
                                    onClick={() => handleEdit(product.productId)}
                                />
                                <Button
                                    label="Excluir"
                                    icon="pi pi-trash"
                                    className="p-button-sm p-button-danger"
                                    onClick={() => handleDelete(product)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
