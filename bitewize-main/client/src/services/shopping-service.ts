import type { IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const orderURL = "/order";

const findAllByUserId = async (userId: number): Promise<IResponse> => {
    let response = {} as IResponse;

    try {
        const data = await api.get(`${orderURL}/user/${userId}`);

        response = {
            status: 200,
            success: true,
            message: "Lista de pedidos carregada com sucesso!",
            data: data.data,
        };
    } catch (err: any) {
        console.error("[SHOPPING-SERVICE] Erro:", err);
        response = {
            status: err.response?.status,
            success: false,
            message: "Falha ao carregar lista de pedidos",
            data: err.response?.data,
        };
    }

    return response;
};

export default {
    findAllByUserId,
};
