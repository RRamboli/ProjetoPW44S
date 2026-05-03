export interface IUserRegister {
    display_name: string;
    username: string;
    password: string;
}

export interface IResponse {
    status?: number;
    success?: boolean;
    message?: string;
    data?: object
}

export interface IUserLogin {
    username: string;
    password: string;
}

export interface Authorities {
  authority: string;
}

export interface AuthenticatedUser {
  displayName: string;
  username: string;
  authorities: Authorities[];
    id?: number;
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
    userId?: number;

}

export  interface  ICategory {
    id?:  number;
    categoryName:  string;
}
export interface IAddress {
    id?: number;
    userId: number;
    street: string;
    complement: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
    number: string;
    isDefault: boolean;
}

export interface IOrder {
    id?: number;
    dateTime: string;
    userId: number;
    status: string;
    address: number;
    paymentMethod?: PaymentMethod;
    totalAmount?: number;
}

export interface IProduct {
    productId?: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: ICategory;
}

export interface IProductOrder {
    id?: number;
    orderId?: number;
    userId: number;
    productId: number;
    quantity: number;
    price: number;
}

export type PaymentMethod = "PIX" | "CREDIT_CARD" | "BOLETO";

export interface IUser {
    id?: number;
    username: string;
    displayName: string;
    password: string;
}

export interface IAddress {
    id?: number;
    userId: number;
    street: string;
    complement: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
    number: string;
    isDefault: boolean;
}