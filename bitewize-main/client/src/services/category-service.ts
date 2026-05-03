import type { ICategory, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const categoryURL = "/categories";

const save = async (category: ICategory): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.post(categoryURL, category);

        response = {
            status: 200,
            success: true,
            message: "Categoria salva com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response.status,
            success: false,
            message: "Falha ao salvar categoria",
            data: err.response.data,
        };
    }

    return response;
};

const findAll = async (): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.get(categoryURL);

        response = {
            status: 200,
            success: true,
            message: "Lista de categorias carregada com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response.status,
            success: false,
            message: "Falha ao carregar categorias",
            data: err.response.data,
        };
    }

    return response;
};

const remove = async (id: number): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.delete(`${categoryURL}/${id}`);

        response = {
            status: 200,
            success: true,
            message: "Categoria removida com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response.status,
            success: false,
            message: "Falha ao remover categoria",
            data: err.response.data,
        };
    }

    return response;
};

const findById = async (id: number): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.get(`${categoryURL}/${id}`);

        response = {
            status: 200,
            success: true,
            message: "Categoria carregada com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        response = {
            status: err.response.status,
            success: false,
            message: "Falha ao carregar categoria",
            data: err.response.data,
        };
    }

    return response;
};

const CategoryService = {
    save,
    findAll,
    remove,
    findById,
};

export default CategoryService;
