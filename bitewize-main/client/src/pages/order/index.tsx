import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router-dom";
import ProductService from "@/services/products-service";
import AddressService from "@/services/address-services";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import type { IAddress, IProductOrder, PaymentMethod } from "@/commons/types";
import { useAuth } from "@/context/hooks/use-auth";
import OrderService from "@/services/order-service";

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const toast = React.useRef<Toast | null>(null);
  const { authenticatedUser } = useAuth();

  // Função para buscar detalhes do produto usando ProductService
  const fetchProduct = async (productId: number) => {
    const res = await ProductService.findById(productId);
    return res.data;
  };

  const removeItem = async (itemId: number) => {
  try {
   /// await OrderService.removeItem(itemId);

    setItems((prev) => prev.filter((i) => i.id !== itemId));

    toast.current?.show({
      severity: "success",
      summary: "Removido",
      detail: "Item removido do carrinho",
      life: 2000
    });
  } catch (err) {
    console.error(err);
    toast.current?.show({
      severity: "error",
      summary: "Erro",
      detail: "Falha ao remover item",
      life: 3000
    });
  }
};

  useEffect(() => {
    if (!authenticatedUser?.id) return;

    const loadOrders = async () => {
      const userId = authenticatedUser!.id as number;
      try {
        const cartRes = await OrderService.getCart(userId);
        const cartData = cartRes.data as any;
        const orderItems: IProductOrder[] = Array.isArray(cartData?.items) ? cartData.items : [];

        const enrichedItems = await Promise.all(
          orderItems.map(async (item: IProductOrder) => {
            const product = await fetchProduct(item.productId);
            return { ...item, product };
          })
        );

        setItems(enrichedItems);

        // carregar endereços do usuário logado
        const addrRes = await AddressService.findAll(userId);
        const allAddrs = Array.isArray(addrRes.data) ? addrRes.data : [];
        setAddresses(allAddrs);
      } catch (err) {
        console.error("Erro ao carregar checkout:", err);
        toast.current?.show({ severity: "error", summary: "Erro", detail: "Falha ao carregar itens do carrinho. Veja console para detalhes.", life: 4000 });
      }
    };

    loadOrders();
  }, [authenticatedUser]);

  const total = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4 md:p-6 mt-20">
      <h1 className="text-3xl font-bold mb-5">Checkout{items.length > 0 ? ` — ${items.length} itens` : ""}</h1>
      <Toast ref={toast} />

      {/* Sem itens */}
      {items.length === 0 && (
        <Card className="p-4 text-center shadow-md">
          <h2 className="text-xl font-semibold mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-3">
            Adicione alguns produtos para continuar.
          </p>
          <Button label="Voltar para Home" onClick={() => navigate("/")} />
        </Card>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">

        {/* LISTA DE PRODUTOS */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item: any) => (
            <Card
              key={item.id}
              className="shadow-md border-round-xl p-4 w-full">
              <div className="flex gap-4">
                <img
                  src={
                    item.product.image
                      ? item.product.image
                      : "https://imgs.casasbahia.com.br/55058059/1g.jpg?imwidth=500"
                  }
                  alt={item.product.name}
                  className="w-28 h-28 object-cover rounded-lg"
                />                
                <div className="flex flex-1 justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">
                      {item.product.name}
                    </span>

                    <span className="text-sm text-gray-500">
                      {item.product.description}
                    </span>

                    <span className="text-sm mt-1">
                      Quantidade: <strong>{item.quantity}</strong>
                    </span>

                    <span className="text-xl font-bold mt-2">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <Button
                      icon="pi pi-trash"
                      className="p-button-danger p-button-rounded"
                      onClick={() => removeItem(item.id)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

      <Card className="shadow-lg border-round-xl p-5 h-fit sticky top-24">

        <h2 className="text-2xl font-bold mb-4">Resumo da compra</h2>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Endereço de entrega</label>
          <Dropdown
            value={selectedAddress}
            options={addresses.map((a) => ({
              label: `${a.street}, ${a.number} - ${a.city}`,
              value: a.id,
            }))}
            onChange={(e) => setSelectedAddress(e.value)}
            placeholder={
              addresses.length === 0
                ? "Nenhum endereço cadastrado"
                : "Selecione um endereço"
            }
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Forma de pagamento</label>
          <div className="flex flex-column gap-2">
            {[
              { label: "PIX", value: "PIX" },
              { label: "Cartão de crédito", value: "CREDIT_CARD" },
              { label: "Boleto", value: "BOLETO" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer text-gray-700"
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={paymentMethod === opt.value}
                  onChange={() => setPaymentMethod(opt.value as PaymentMethod)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mb-2 text-gray-700">
          <span>Produtos:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-2 text-gray-700">
          <span>Frete:</span>
          <span className="font-semibold text-green-600">Grátis</span>
        </div>

        <Divider />

        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>

        <Button
          label="Ir para checkout"
          icon="pi pi-credit-card"
          className="w-full p-button-lg"
          onClick={() => {
            if (items.length === 0) {
              toast.current?.show({
                severity: "warn",
                summary: "Carrinho vazio",
                detail: "Adicione produtos antes de continuar.",
                life: 2500,
              });
              return;
            }

            if (!selectedAddress) {
              toast.current?.show({
                severity: "warn",
                summary: "Atenção",
                detail: "Selecione um endereço antes de continuar.",
                life: 3000,
              });
              return;
            }

            navigate("/checkout", {
              state: { addressId: selectedAddress, paymentMethod },
            });
          }}
        />

        <Button
          label="Voltar para Home"
          className="w-full mt-3 p-button-text"
          icon="pi pi-arrow-left"
          onClick={() => navigate("/")}
        />
      </Card>

        </div>
      )}
    </div>
  );
};

export default Checkout;
