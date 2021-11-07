declare module 'react-owl-carousel3';

declare type IProduct = {
  id: string;
  image: string;
  price: number;
  name: string;
};

declare type ICart = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

declare type IImage = {
  image: string;
  category: string;
  title: string;
};

declare type StartpRootState = {
  total: number;
  cart: ICart[];
  products: IProduct[];
};

declare let __webpack_public_path__: string;
