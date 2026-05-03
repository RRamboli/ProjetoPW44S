import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import type { IAddress } from "@/commons/types";
import AddressService from "@/services/address-services";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useAuth } from "@/context/hooks/use-auth";

export const AddressListPage = () => {
    const [data, setData] = useState<IAddress[]>([]);
    const { findAll, remove } = AddressService;
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    // ✔ pega usuário logado
    const { authenticatedUser } = useAuth();

    useEffect(() => {
        if (authenticatedUser?.id) loadData(authenticatedUser.id);
    }, [authenticatedUser]);

    const loadData = async (userId: number) => {
        const response = await findAll(userId);

        if (response.status === 200) {
            const addresses = Array.isArray(response.data) ? response.data : [];
            setData(addresses);

        } else {
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Não foi possível carregar a lista de endereços.",
                life: 3000,
            });
        }
    };

    const handleEdit = (address: IAddress) => {
        navigate(`/addresses/${address.id}`);
    };

    const handleDelete = async (address: IAddress) => {
        if (confirm(`Tem certeza que deseja excluir o endereço "${address.street}, ${address.number}"?`)) {
            if (address.id) {
                try {
                    await remove(address.id);
                    setData((prev) => prev.filter((c) => c.id !== address.id));

                    toast.current?.show({
                        severity: "success",
                        summary: "Sucesso",
                        detail: "Endereço removido com sucesso.",
                        life: 3000,
                    });
                } catch {
                    toast.current?.show({
                        severity: "error",
                        summary: "Erro",
                        detail: "Não foi possível remover o endereço.",
                        life: 3000,
                    });
                }
            }
        }
    };

    const actionTemplate = (rowData: IAddress) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-sm p-button-text"
                onClick={() => handleEdit(rowData)}
                tooltip="Editar"
            />
            <Button
                icon="pi pi-trash"
                className="p-button-sm p-button-text p-button-danger"
                onClick={() => handleDelete(rowData)}
                tooltip="Excluir"
            />
        </div>
    );

    return (
        <div className="card">
            <Toast ref={toast} />

            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl">Meus Endereços</h2>

                <Button
                    label="Novo Endereço"
                    icon="pi pi-plus"
                    className="p-button-success"
                    onClick={() => navigate("/addresses/new")}
                />
            </div>

            <DataTable
                value={data}
                stripedRows
                emptyMessage="Nenhum endereço encontrado."
            >
                <Column field="street" header="Rua" />
                <Column field="number" header="Número" style={{ width: "10%" }} />
                <Column field="city" header="Cidade" />
                <Column field="state" header="Estado" style={{ width: "10%" }} />
                <Column field="zipCode" header="CEP" style={{ width: "12%" }} />
                <Column
                    header="Principal?"
                    style={{ width: "10%" }}
                    body={(row) =>
                        row.isDefault ? (
                            <span className="text-green-600 font-semibold">Sim</span>
                        ) : (
                            <span className="text-gray-500">Não</span>
                        )
                    }
                />
                <Column
                    body={actionTemplate}
                    header="Ações"
                    style={{ width: "20%" }}
                />
            </DataTable>
        </div>
    );
};
