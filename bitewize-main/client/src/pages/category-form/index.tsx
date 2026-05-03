import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import type { ICategory, IResponse } from "@/commons/types";
import CategoryService from "@/services/category-service";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export const CategoryFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<ICategory | undefined>(undefined);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ICategory>({
        defaultValues: { categoryName: "" }, // ✔ campo correto
    });

    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const { findById, save } = CategoryService;

    const isEdit = !!id;

    useEffect(() => {
        loadCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadCategory = async () => {
        if (isEdit) {
            setLoading(true);
            try {
                const response = (await findById(parseInt(id!))) as IResponse;
                if (response.status === 200) {
                    setCategory(response.data as ICategory);
                    reset(response.data as ICategory); // ✔ agora reseta categoryName
                } else {
                    toast.current?.show({
                        severity: "error",
                        summary: "Erro",
                        detail: "Falha ao carregar o registro.",
                        life: 3000,
                    });
                }
            } catch (err) {
                setCategory(undefined);
            } finally {
                setLoading(false);
            }
        }
    };

    const onSubmit = async (data: ICategory) => {
        setLoading(true);
        try {
            const response = await save(data);

            if ((response.status === 200 || response.status === 201) && response.data) {
                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Categoria salva com sucesso.",
                    life: 3000,
                });

                setTimeout(() => navigate("/categories"), 1000);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Não foi possível salvar o registro.",
                    life: 3000,
                });
            }
        } catch {
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Não foi possível salvar o registro.",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 pt-24 max-w-xl">
            <Toast ref={toast} />

            <h2 className="text-2xl mb-4">
                {isEdit ? "Editar Categoria" : "Nova Categoria"}
            </h2>

            {!isEdit || category ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-fluid">

                    {/* CAMPO categoryName CORRIGIDO */}
                    <div>
                        <label htmlFor="categoryName" className="block mb-2">
                            Nome da Categoria
                        </label>

                        <Controller
                            name="categoryName"
                            control={control}
                            rules={{ required: "O nome é obrigatório" }}
                            render={({ field }) => (
                                <InputText
                                    id="categoryName"
                                    {...field}
                                    placeholder="Digite o nome da categoria"
                                />
                            )}
                        />

                        {errors.categoryName && (
                            <small className="p-error">{errors.categoryName.message}</small>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            label="Cancelar"
                            className="p-button-secondary"
                            onClick={() => navigate("/categories")}
                            loading={loading || isSubmitting}
                            disabled={loading || isSubmitting}
                        />

                        <Button
                            type="submit"
                            label={isEdit ? "Atualizar" : "Salvar"}
                            loading={loading || isSubmitting}
                            disabled={loading || isSubmitting}
                        />
                    </div>
                </form>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    );
};
