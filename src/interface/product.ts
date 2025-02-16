export interface Product {
    id: string;
    name: string;
    price: number;
    image:string[],
    quantity: number; 
    description?: string;
    category?: string;
  }
  