import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Controller, useForm } from "react-hook-form";

import type { IAddress } from "@/commons/types";
import AddressService from "@/services/address-services";
import { useAuth } from "@/context/hooks/use-auth";

export const AddressFormPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const { authenticatedUser } = useAuth();
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<IAddress>({
        defaultValues: {
            id: undefined,
            userId: authenticatedUser?.id,
            street: "",
            number: "",
            city: "",
            state: "",
            zipCode: "",
            isDefault: false
        },
    });

    const { findById, save } = AddressService;

    useEffect(() => {
        if (id) loadData();
    }, [id]);

    // When authenticatedUser becomes available and we're creating a NEW address (no id),
    // reset the form so the userId field is populated in the form values.
    useEffect(() => {
        if (!id) {
            reset({
                id: undefined,
                userId: authenticatedUser?.id,
                street: "",
                number: "",
                city: "",
                state: "",
                zipCode: "",
                isDefault: false,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authenticatedUser]);

    const loadData = async () => {
        setLoading(true);
        const response = await findById(Number(id));

        if (response.status === 200) {
            reset(response.data);
        } else {
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Não foi possível carregar o endereço.",
            });
        }

        setLoading(false);
    };

    const handleSave = async (formData: IAddress) => {
        setLoading(true);

        if (!authenticatedUser?.id) {
            // Try fallback to localStorage.userId (in case authenticatedUser wasn't populated)
            const stored = localStorage.getItem("userId");
            const parsed = stored ? Number(stored) : undefined;
            if (!parsed || Number.isNaN(parsed)) {
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Usuário não identificado. Faça login novamente.",
                });
                setLoading(false);
                return;
            }
            formData.userId = parsed;
        }

        // If authenticatedUser is present, prefer it
        if (authenticatedUser?.id) formData.userId = authenticatedUser.id as number;

        console.log("Enviando dados:", formData);

        try {
            let response;

            if (id) formData.id = Number(id);
            response = await save(formData);

            if (response.status === 200 || response.status === 201) {
                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: id ? "Endereço atualizado!" : "Endereço criado!",
                    life: 2000
                });

                setTimeout(() => navigate("/addresses"), 800);
            } else {
                throw new Error("Erro no backend");
            }

        } catch (err: any) {
            console.error("Erro ao salvar:", err);

            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Não foi possível salvar o endereço.",
                life: 3000
            });
        }

        setLoading(false);
    };

    return (
        <div className="card p-4">
            <Toast ref={toast} />

            <h2 className="text-xl mb-4">
                {id ? "Editar Endereço" : "Novo Endereço"}
            </h2>

            <form onSubmit={handleSubmit(handleSave)} className="grid gap-4">

                <div>
                    <label>Rua</label>
                    <Controller
                        name="street"
                        control={control}
                        rules={{ required: "Informe a rua" }}
                        render={({ field }) => (
                            <InputText {...field} className={errors.street ? "p-invalid w-full" : "w-full"} />
                        )}
                    />
                    {errors.street && <small className="p-error">{errors.street.message}</small>}
                </div>

                <div>
                    <label>Número</label>
                    <Controller
                        name="number"
                        control={control}
                        rules={{ required: "Informe o número" }}
                        render={({ field }) => (
                            <InputText {...field} className={errors.number ? "p-invalid w-full" : "w-full"} />
                        )}
                    />
                    {errors.number && <small className="p-error">{errors.number.message}</small>}
                </div>

                <div>
                    <label>Cidade</label>
                    <Controller
                        name="city"
                        control={control}
                        rules={{ required: "Informe a cidade" }}
                        render={({ field }) => (
                            <InputText {...field} className={errors.city ? "p-invalid w-full" : "w-full"} />
                        )}
                    />
                    {errors.city && <small className="p-error">{errors.city.message}</small>}
                </div>

                <div>
                    <label>Estado</label>
                    <Controller
                        name="state"
                        control={control}
                        rules={{ required: "Informe o estado" }}
                        render={({ field }) => (
                            <InputText {...field} className={errors.state ? "p-invalid w-full" : "w-full"} />
                        )}
                    />
                    {errors.state && <small className="p-error">{errors.state.message}</small>}
                </div>

                <div>
                    <label>CEP</label>
                    <Controller
                        name="zipCode"
                        control={control}
                        rules={{ required: "Informe o CEP" }}
                        render={({ field }) => (
                            <InputText {...field} className={errors.zipCode ? "p-invalid w-full" : "w-full"} />
                        )}
                    />
                    {errors.zipCode && <small className="p-error">{errors.zipCode.message}</small>}
                </div>

                <div className="flex align-items-center gap-2">
                    <Controller
                        name="isDefault"
                        control={control}
                        render={({ field }) => (
                            <Checkbox checked={field.value} onChange={(e) => field.onChange(e.checked)} />
                        )}
                    />
                    <label>Definir como endereço principal</label>
                </div>

                <div className="flex justify-end gap-3 mt-3">
                    <Button label="Voltar" type="button" severity="secondary" onClick={() => navigate("/addresses")} />
                    <Button label="Salvar" type="submit" icon="pi pi-check" loading={loading} />
                </div>

            </form>
        </div>
    );
};
