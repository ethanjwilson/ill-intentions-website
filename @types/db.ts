export enum Countries {
  nzl = "nzl",
  // jap = "jap",
  // usa = "usa",
  // sp = "sp",
}

export enum Sizes {
  l = "l",
  m = "m",
}

export type Item = {
  createdAt: Date;
  description: string[];
  drop: string;
  images: string[];
  name: string;
  nameDashified: string;
  price: number;
  shipping: {
    [key in Countries]: number;
  };
  stock: {
    [key in Sizes]: number;
  };
};

export type CheckoutSessions = {
  clientSecret: string;
  complete: boolean;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    shippingAddress: {
      area: string;
      city: string;
      code: number;
      country: Countries;
      streetAddress: string;
    };
  };
  itemId: string;
  paymentIntentId: string;
  price: number;
  priceSet: boolean;
  size: Sizes;
};
