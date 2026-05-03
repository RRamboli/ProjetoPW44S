import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Toast } from "primereact/toast";
import { useLocation, useNavigate } from "react-router-dom";
import ProductService from "@/services/products-service";
import AddressService from "@/services/address-services";
import OrderService from "@/services/order-service";
import type { IAddress, IProductOrder, PaymentMethod } from "@/commons/types";
import { useAuth } from "@/context/hooks/use-auth";

interface CardData {
  holder: string;
  number: string;
  expiry: string;
  cvv: string;
}

interface CheckoutLocationState {
  addressId?: number;
  paymentMethod?: PaymentMethod;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useRef<Toast | null>(null);
  const { authenticatedUser } = useAuth();

  const [items, setItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const [closing, setClosing] = useState(false);
  const [cardData, setCardData] = useState<CardData>({
    holder: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [pixCode] = useState(
    "00020101021226940014BR.GOV.BCB.PIX0136pix@bitewize.com5204000053039865802BR5914BiteWize Loja6009Curitiba62070503***6304ABCD"
  );
  const [boletoCode] = useState(
    "34191.79001 01043.510047 91020.150008 8 85870000012345"
  );

  const locationState = (location.state || {}) as CheckoutLocationState;

  const pixQrUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
        pixCode
      )}`,
    [pixCode]
  );

  const fetchProduct = async (productId: number) => {
    const res = await ProductService.findById(productId);
    return res.data;
  };

  useEffect(() => {
    if (!authenticatedUser?.id) return;

    const loadCheckoutData = async () => {
      const userId = authenticatedUser!.id as number;
      try {
        const cartRes = await OrderService.getCart(userId);
        const cartData = cartRes.data as any;
        const orderItems: IProductOrder[] = Array.isArray(cartData?.items)
          ? cartData.items
          : [];

        const enrichedItems = await Promise.all(
          orderItems.map(async (item: IProductOrder) => {
            const product = await fetchProduct(item.productId);
            return { ...item, product };
          })
        );

        setItems(enrichedItems);

        const addrRes = await AddressService.findAll(userId);
        const allAddrs = Array.isArray(addrRes.data) ? addrRes.data : [];
        setAddresses(allAddrs);

        if (locationState.addressId) {
          setSelectedAddress(locationState.addressId);
        } else if (allAddrs.length > 0) {
          const defaultAddr = allAddrs.find((addr) => addr.isDefault);
          setSelectedAddress(defaultAddr?.id ?? allAddrs[0].id ?? null);
        }

        if (locationState.paymentMethod) {
          setPaymentMethod(locationState.paymentMethod);
        }
      } catch (err) {
        console.error("Erro ao carregar checkout:", err);
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao carregar checkout. Veja console para detalhes.",
          life: 4000,
        });
      }
    };

    loadCheckoutData();
  }, [authenticatedUser, locationState.addressId, locationState.paymentMethod]);

  const total = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.current?.show({
        severity: "success",
        summary: "Copiado",
        detail: "Código copiado para a área de transferência.",
        life: 2000,
      });
    } catch (err) {
      console.error("Erro ao copiar:", err);
      toast.current?.show({
        severity: "warn",
        summary: "Aviso",
        detail: "Não foi possível copiar. Copie manualmente.",
        life: 2500,
      });
    }
  };

  const handleFinalize = async () => {
    if (items.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Carrinho vazio",
        detail: "Adicione produtos antes de finalizar.",
        life: 2500,
      });
      return;
    }

    if (!selectedAddress) {
      toast.current?.show({
        severity: "warn",
        summary: "Selecione um endereço",
        detail: "Escolha um endereço para entrega.",
        life: 2500,
      });
      return;
    }

    if (paymentMethod === "CREDIT_CARD") {
      const missing = Object.entries(cardData).find(([, value]) => !value.trim());
      if (missing) {
        toast.current?.show({
          severity: "warn",
          summary: "Dados do cartão",
          detail: "Preencha todos os campos do cartão.",
          life: 2500,
        });
        return;
      }
    }

    setClosing(true);
    try {
      const userId = authenticatedUser!.id as number;
      const checkoutItems = items.map((item: any) => ({
        id: item.id,
        orderId: item.orderId,
        userId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      const payload = {
        userId,
        addressId: selectedAddress,
        paymentMethod,
        items: checkoutItems,
      };
''
      const res = await OrderService.checkout(payload);
      if (res.success) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Pedido finalizado!",
          life: 2000,
        });
        navigate("/");
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: res.message ?? "Falha ao finalizar pedido.",
          life: 3000,
        });
      }
    } catch (err) {
      console.error("Erro ao finalizar pedido:", err);
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao finalizar pedido.",
        life: 3000,
      });
    } finally {
      setClosing(false);
    }
  };

  const renderPaymentSection = () => {
    if (paymentMethod === "PIX") {
      return (
        <div className="space-y-3">
          <p className="text-gray-600">Escaneie o QR Code ou copie o código PIX para pagar.</p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <img
              src={pixQrUrl}
              alt="QR Code PIX"
              className="w-48 h-48 border border-gray-200 rounded-lg shadow-sm"
            />
            <div className="flex-1 w-full">
              <label className="block mb-2 font-semibold">Código PIX</label>
              <div className="flex gap-2">
                <InputText value={pixCode} readOnly className="w-full" />
                <Button
                  type="button"
                  icon="pi pi-copy"
                  label="Copiar"
                  onClick={() => copyToClipboard(pixCode)}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (paymentMethod === "BOLETO") {
      return (
        <div className="space-y-3">
          <p className="text-gray-600">Use o código de barras abaixo para pagar em seu banco ou lotérica.</p>
          <div>
            <label className="block mb-2 font-semibold">Linha digitável</label>
            <div className="flex gap-2">
              <InputText value={boletoCode} readOnly className="w-full" />
              <Button
                type="button"
                icon="pi pi-copy"
                label="Copiar"
                onClick={() => copyToClipboard(boletoCode)}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-2 font-semibold">Nome impresso no cartão</label>
          <InputText
            value={cardData.holder}
            onChange={(e) => setCardData((prev) => ({ ...prev, holder: e.target.value }))}
            placeholder="Nome completo"
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Número do cartão</label>
          <InputMask
            value={cardData.number}
            onChange={(e) => setCardData((prev) => ({ ...prev, number: e.value || "" }))}
            mask="9999 9999 9999 9999"
            placeholder="0000 0000 0000 0000"
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Validade (MM/AA)</label>
          <InputMask
            value={cardData.expiry}
            onChange={(e) => setCardData((prev) => ({ ...prev, expiry: e.value || "" }))}
            mask="99/99"
            placeholder="MM/AA"
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">CVV</label>
          <InputMask
            value={cardData.cvv}
            onChange={(e) => setCardData((prev) => ({ ...prev, cvv: e.value || "" }))}
            mask="999"
            placeholder="000"
            className="w-full"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 mt-20">
      <Toast ref={toast} />
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-gray-500">Revise seu pedido e escolha a forma de pagamento.</p>
        </div>
        <Button
          icon="pi pi-arrow-left"
          label="Voltar para o carrinho"
          className="p-button-text"
          onClick={() => navigate("/cart")}
        />
      </div>

      {items.length === 0 ? (
        <Card className="p-4 text-center shadow-md">
          <h2 className="text-xl font-semibold mb-2">Nenhum item encontrado</h2>
          <p className="text-gray-500 mb-3">Seu carrinho está vazio.</p>
          <Button label="Voltar para Home" onClick={() => navigate("/")} />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-6 items-start">
          <Card className="shadow-md border-round-xl p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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

              <div>
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
            </div>

            <Divider />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Dados de pagamento</h2>
              {renderPaymentSection()}
            </div>
          </Card>

          <Card className="shadow-md border-round-xl p-5 h-fit sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Resumo</h2>

            <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3">
                  <div className="flex-1">
                    <div className="font-semibold">{item.product.name}</div>
                    <div className="text-sm text-gray-500">x{item.quantity}</div>
                  </div>
                  <div className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <Divider />

            <div className="flex justify-between mb-2 text-gray-700">
              <span>Produtos:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Frete:</span>
              <span className="font-semibold text-green-600">Grátis</span>
            </div>
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            <Button
              label={closing ? "Finalizando..." : "Finalizar compra"}
              icon="pi pi-check"
              className="w-full p-button-lg"
              onClick={handleFinalize}
              disabled={closing}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
