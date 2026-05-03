import type { IAddress, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const addressURL = "/addresses";

// SALVAR (criar ou atualizar)
const save = async (address: IAddress): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.post(addressURL, address);

        response = {
            status: 200,
            success: true,
            message: "Endereço salvo com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response?.status ?? 500,
            success: false,
            message: "Falha ao salvar endereço",
            data: err.response?.data,
        };
    }

    return response;
};

// LISTAR TODOS POR USUÁRIO
const findAll = async (userId: number): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.get(`${addressURL}/user/${userId}`);

        response = {
            status: 200,
            success: true,
            message: "Lista de endereços carregada com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response?.status ?? 500,
            success: false,
            message: "Falha ao carregar endereços",
            data: err.response?.data,
        };
    }

    return response;
};

// REMOVER
const remove = async (id: number): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.delete(`${addressURL}/${id}`);

        response = {
            status: 200,
            success: true,
            message: "Endereço removido com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response?.status ?? 500,
            success: false,
            message: "Falha ao remover endereço",
            data: err.response?.data,
        };
    }

    return response;
};

// BUSCAR POR ID
const findById = async (id: number): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.get(`${addressURL}/${id}`);

        response = {
            status: 200,
            success: true,
            message: "Endereço carregado com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response?.status ?? 500,
            success: false,
            message: "Falha ao carregar endereço",
            data: err.response?.data,
        };
    }

    return response;
};

const AddressService = {
    save,
    findAll,
    remove,
    findById,
};

export default AddressService;
