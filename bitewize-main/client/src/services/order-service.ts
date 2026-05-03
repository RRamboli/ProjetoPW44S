import type { IOrder, IProductOrder, IResponse, PaymentMethod } from "@/commons/types";
import { api } from "@/lib/axios";

const orderURL = "/order";

type CheckoutPayload = {
    userId: number;
    addressId: number;
    paymentMethod: PaymentMethod;
    items: IProductOrder[];
};

const createOrder = async (order: IOrder): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        console.log("[ORDER-SERVICE] Enviando order:", order);
        const data = await api.post(orderURL, order);

        response = {
            status: 200,
            success: true,
            message: "Pedido criado com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        console.error("[ORDER-SERVICE] Erro completo:", err);
        console.error("[ORDER-SERVICE] Response data:", err.response?.data);
        console.error("[ORDER-SERVICE] Request config:", err.config);
        response = {
            status: err.response?.status,
            success: false,
            message: "Falha ao criar pedido",
            data: err.response?.data,
        };
    }

    return response;
};

const findAll = async (): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.get(orderURL);

        response = {
            status: 200,
            success: true,
            message: "Lista de pedidos carregada com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response?.status,
            success: false,
            message: "Falha ao carregar pedidos",
            data: err.response?.data,
        };
    }

    return response;
};

const findById = async (id: number): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.get(`${orderURL}/${id}`);

        response = {
            status: 200,
            success: true,
            message: "Pedido encontrado!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response?.status,
            success: false,
            message: "Falha ao buscar pedido",
            data: err.response?.data,
        };
    }

    return response;
};

const addProductToOrder = async (productOrder: IProductOrder): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.post(`${orderURL}/add-to-cart`, productOrder);

        response = {
            status: 200,
            success: true,
            message: "Produto adicionado ao pedido!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response?.status,
            success: false,
            message: "Falha ao adicionar produto ao pedido",
            data: err.response?.data,
        };
    }

    return response;
};

const getCart = async (userId: number): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.get(`${orderURL}/cart/${userId}`);
        response = {
            status: 200,
            success: true,
            message: "Carrinho carregado com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response?.status,
            success: false,
            message: "Falha ao carregar carrinho",
            data: err.response?.data,
        };
    }

    return response;
};

const checkout = async (payload: CheckoutPayload): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.post(`${orderURL}/checkout`, payload);
        response = {
            status: 200,
            success: true,
            message: "Pedido finalizado com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response?.status,
            success: false,
            message: "Falha ao finalizar pedido",
            data: err.response?.data,
        };
    }

    return response;
};

export default {
    createOrder,
    findAll,
    findById,
    addProductToOrder,
    getCart,
    checkout,
};
