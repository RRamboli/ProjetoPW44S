import type { IProduct, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

// URL base para as requisições de produto
const productURL = "/products";

// ------------------------------------------------------------------
// 1. SAVE (CRIAR E ATUALIZAR)
// ------------------------------------------------------------------

/**
 * Função para salvar (criar ou atualizar) um produto.
 * * Se product.productId é nulo/undefined, faz um POST (criação).
 * Se product.productId existe, faz um PUT (atualização).
 * * @param product - Dados do produto que será salvo
 * @returns - Retorna uma Promise com a resposta da API
 **/
const save = async (product: IProduct): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        let data;
        // Verifica se é uma edição (PUT) ou criação (POST)
        if (product.productId) {
            data = await api.put(`${productURL}/${product.productId}`, product);
        } else {
            data = await api.post(productURL, product);
        }

        response = {
            status: data.status,
            success: true,
            message: "Produto salvo com sucesso!",
            data: data.data,
        };

    } catch (err: any) {
        response = {
            status: err.response.status,
            success: false,
            message: "Falha ao salvar produto",
            data: err.response.data,
        };
    }
    return response;
};


// ------------------------------------------------------------------
// 2. FIND ALL (BUSCAR TODOS)
// ------------------------------------------------------------------

/**
 * Função para buscar todos os produtos
 * @returns - Retorna uma Promise com a resposta da API
 * com a lista de produtos
 **/
const findAll = async (): Promise<IResponse> => {
    let response = {} as IResponse;
    try {
        const data = await api.get(productURL);
        response = {
            status: 200,
            success: true,
            message: "Lista de produtos carregada com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response.status,
            success: false,
            message: "Falha ao carregar a lista de produtos",
            data: err.response.data,
        };
    }
    return response;
};

// ------------------------------------------------------------------
// 3. REMOVE (EXCLUIR)
// ------------------------------------------------------------------

/**
 * Função para remover um produto
 * @param id - Recebe o id do produto que será removido (productId)
 * @returns - Retorna uma Promise com a resposta da API
 */
const remove = async (id: number): Promise<IResponse> => {
    let response = {} as IResponse;
    try {
        const data = await api.delete(`${productURL}/${id}`);
        response = {
            status: 200,
            success: true,
            message: "Produto removido com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response.status,
            success: false,
            message: "Falha ao remover produto",
            data: err.response.data,
        };
    }
    return response;
};

// ------------------------------------------------------------------
// 4. FIND BY ID (BUSCAR POR ID)
// ------------------------------------------------------------------

/**
 * Função para buscar um produto pelo id
 * @param id - Recebe o id do produto que será buscado (productId)
 * @returns - Retorna uma Promise com a resposta da API
 */
const findById = async (id: number): Promise<IResponse> => {
    let response = {} as IResponse;
    try {
        const data = await api.get(`${productURL}/${id}`);
        response = {
            status: 200,
            success: true,
            message: "Produto carregado com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response.status,
            success: false,
            message: "Falha ao carregar produto",
            data: err.response.data,
        };
    }
    return response;
};

// Objeto que exporta todas as funções
const ProductService = {
    save,
    findAll,
    remove,
    findById,
};

export default ProductService;