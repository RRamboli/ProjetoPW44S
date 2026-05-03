import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import type { IProduct, ICategory, IResponse } from "@/commons/types";
import ProductService from "@/services/products-service";
import CategoryService from "@/services/category-service"; // Necessário para o Dropdown
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

/**
 * Página de formulário para criação e edição de produtos.
 */
export const ProductFormPage = () => {
    // O parâmetro de rota é nomeado :productId na AppRoutes
    const { productId } = useParams<{ productId: string }>();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [productData, setProductData] = useState<IProduct | undefined>(undefined);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<IProduct>({
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            imageUrl: "",
            category: undefined as unknown as ICategory, // Inicializa com valor que será sobrescrito/selecionado
        },
    });

    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const { findById, save } = ProductService;
    const { findAll: findAllCategories } = CategoryService;

    const isEdit = !!productId;

    // -------------------------------------------------------------------
    // EFEITO: CARREGAR DADOS DO PRODUTO (MODO EDIÇÃO) E LISTA DE CATEGORIAS
    // -------------------------------------------------------------------

    useEffect(() => {
        loadInitialData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    const loadInitialData = async () => {
        setLoading(true);

        // 1. Carregar lista de categorias (necessário tanto para CREATE quanto para EDIT)
        await loadCategories();

        // 2. Carregar dados do produto (apenas se for EDIÇÃO)
        if (isEdit) {
            await loadProduct(parseInt(productId!));
        }

        setLoading(false);
    };

    const loadCategories = async () => {
        try {
            const response = (await findAllCategories()) as IResponse;
            if (response.status === 200 && Array.isArray(response.data)) {
                // Assume que a resposta.data é um array de ICategory
                setCategories(response.data);
            }
        } catch {
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Falha ao carregar a lista de categorias.",
                life: 3000,
            });
        }
    };

    const loadProduct = async (id: number) => {
        const response = (await findById(id)) as IResponse;
        try {
            if (response.status === 200) {
                const productData = response.data as IProduct;
                setProductData(productData);
                // Preencher o formulário com os dados carregados
                reset(productData);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Falha ao carregar o registro do produto.",
                    life: 3000,
                });
            }
        } catch {
            setProductData(undefined);
        }
    };

    // -------------------------------------------------------------------
    // SUBMISSÃO DO FORMULÁRIO
    // -------------------------------------------------------------------

    const onSubmit = async (data: IProduct) => {
        setLoading(true);
        try {
            const response = await save(data); // Usa POST/PUT com base na presença do ID

            const success = (response.status === 201 || response.status === 200) && response.data;

            if (success) {
                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Produto salvo com sucesso.",
                    life: 3000,
                });
                setTimeout(() => {
                    navigate("/products");
                }, 1000);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: response.message || "Não foi possível salvar o registro.",
                    life: 3000,
                });
            }
        } catch (e) {
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro de conexão ou servidor ao salvar o produto.",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------------------
    // RENDERIZAÇÃO
    // -------------------------------------------------------------------


    


    // Exibe o formulário se não estiver em edição OU se os dados já foram carregados
    const shouldRenderForm = !isEdit || productData;

    return (
        <div className="container mx-auto px-4 pt-24 max-w-2xl">
            <Toast ref={toast} />
            <h2 className="text-2xl mb-4">
                {isEdit ? "Editar Produto" : "Novo Produto"}
            </h2>

            {loading && !shouldRenderForm && <p>Carregando dados do produto...</p>}

            {shouldRenderForm ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-fluid">

                    {/* Nome do Produto */}
                    <div>
                        <label htmlFor="name" className="block mb-2 font-medium">Nome</label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: "O nome é obrigatório." }}
                            render={({ field }) => (
                                <InputText id="name" {...field} placeholder="Nome do Produto" />
                            )}
                        />
                        {errors.name && (<small className="p-error">{errors.name.message}</small>)}
                    </div>

                    {/* Categoria (Dropdown) */}
                    <div>
                        <label htmlFor="category" className="block mb-2 font-medium">Categoria</label>
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: "A categoria é obrigatória." }}
                            render={({ field }) => (
                                <Dropdown
                                    id="category"
                                    {...field}
                                    value={field.value}
                                    options={categories}
                                    optionLabel="categoryName" // Campo de ICategory para exibir no dropdown
                                    placeholder="Selecione a Categoria"
                                    // Esta linha garante que o objeto de Categoria completo seja salvo
                                    onChange={(e) => field.onChange(e.value)}
                                />
                            )}
                        />
                        {errors.category && (<small className="p-error">{errors.category.message}</small>)}
                    </div>

                    {/* Preço */}
                    <div>
                        <label htmlFor="price" className="block mb-2 font-medium">Preço</label>
                        <Controller
                            name="price"
                            control={control}
                            rules={{
                                required: "O preço é obrigatório.",
                                min: { value: 0.01, message: "O preço deve ser maior que zero." }
                            }}
                            render={({ field }) => (
                                <InputNumber
                                    id="price"
                                    value={field.value}
                                    onValueChange={(e) => field.onChange(e.value)}
                                    mode="currency"
                                    currency="BRL"
                                    locale="pt-BR"
                                    placeholder="0,00"
                                />
                            )}
                        />
                        {errors.price && (<small className="p-error">{errors.price.message}</small>)}
                    </div>

                    {/* URL da Imagem */}
                    <div>
                        <label htmlFor="imageUrl" className="block mb-2 font-medium">URL da Imagem</label>
                        <Controller
                            name="imageUrl"
                            control={control}
                            render={({ field }) => (
                                <InputText id="imageUrl" {...field} placeholder="Ex: http://imagem.com/produto.jpg" />
                            )}
                        />
                        {errors.imageUrl && (<small className="p-error">{errors.imageUrl.message}</small>)}
                    </div>

                    {/* Descrição */}
                    <div>
                        <label htmlFor="description" className="block mb-2 font-medium">Descrição</label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <InputTextarea
                                    id="description"
                                    {...field}
                                    rows={4}
                                    placeholder="Descreva o produto..."
                                    autoResize
                                />
                            )}
                        />
                        {errors.description && (<small className="p-error">{errors.description.message}</small>)}
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            label="Cancelar"
                            className="p-button-secondary"
                            onClick={() => navigate("/products")}
                            disabled={loading || isSubmitting}
                        />
                        <Button
                            type="submit"
                            label={isEdit ? "Atualizar Produto" : "Salvar Produto"}
                            loading={loading || isSubmitting}
                            disabled={loading || isSubmitting}
                        />
                    </div>
                </form>
            ) : (
                // Se isEdit for true, mas o produto ainda não carregou (ou falhou)
                <p>Não foi possível carregar o produto. Verifique o ID.</p>
            )}
        </div>
    );
};