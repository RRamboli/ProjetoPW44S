import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import type { IOrder } from "@/commons/types";
import ShoppingService from "@/services/shopping-service";
import { Toast } from "primereact/toast";
import { useAuth } from "@/context/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const ShoppingListPage = () => {
    const [data, setData] = useState<IOrder[]>([]);
    const { findAllByUserId } = ShoppingService;
    const toast = useRef<Toast>(null);
    const { authenticatedUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authenticatedUser?.id) loadData(authenticatedUser.id);
    }, [authenticatedUser]);

    const loadData = async (userId: number) => {
        const response = await findAllByUserId(userId);

        if (response.status === 200) {
            const orders = Array.isArray(response.data) ? response.data : [];
            setData(orders);
        } else {
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Não foi possível carregar a lista de compras.",
                life: 3000,
            });
        }
    };

    const statusTemplate = (rowData: IOrder) => {
        const statusColorMap: { [key: string]: string } = {
            OPEN: "text-yellow-500",
            PROCESSING: "text-blue-500",
            COMPLETED: "text-green-600",
            CANCELLED: "text-red-500",
        };

        return (
            <span className={`font-semibold ${statusColorMap[rowData.status] || "text-gray-500"}`}>
                {rowData.status}
            </span>
        );
    };

    const dateTemplate = (rowData: IOrder) => {
        try {
            const date = new Date(rowData.dateTime);
            return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
        } catch {
            return rowData.dateTime;
        }
    };

    const paymentMethodTemplate = (rowData: IOrder) => {
        const paymentMap: { [key: string]: string } = {
            PIX: "PIX",
            CREDIT_CARD: "Cartão de Crédito",
            BOLETO: "Boleto",
        };

        return paymentMap[rowData.paymentMethod || ""] || rowData.paymentMethod || "-";
    };

    return (
        <div className="card">
            <Toast ref={toast} />

            <div className="mb-4 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Minhas Compras</h2>
                    <p className="text-gray-400">
                        Visualize o histórico de todas as suas compras realizadas.
                    </p>
                </div>
                <Button
                    label="Meus Endereços"
                    icon="pi pi-home"
                    className="p-button-secondary"
                    onClick={() => navigate("/addresses")}
                />
            </div>

            <DataTable
                value={data}
                stripedRows
                emptyMessage="Nenhuma compra encontrada."
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
            >
                <Column
                    field="id"
                    header="ID Pedido"
                    style={{ width: "10%" }}
                />
                <Column
                    field="dateTime"
                    header="Data"
                    body={dateTemplate}
                    style={{ width: "25%" }}
                />
                <Column
                    field="status"
                    header="Status"
                    body={statusTemplate}
                    style={{ width: "15%" }}
                />
                <Column
                    field="paymentMethod"
                    header="Forma de Pagamento"
                    body={paymentMethodTemplate}
                    style={{ width: "25%" }}
                />
                <Column
                    header="Valor Total"
                    style={{ width: "15%" }}
                    body={(row) => (
                        <span className="font-semibold">
                            {row.totalAmount
                                ? `R$ ${Number(row.totalAmount).toFixed(2)}`
                                : "-"}
                        </span>
                    )}
                />
            </DataTable>
        </div>
    );
};
