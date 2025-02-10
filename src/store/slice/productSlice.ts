import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "../../interface/product";
 
const API_URL = "https://your-api.com/api/products"; // Update with your actual API

// Define state type
interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch all products
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  }
);

// Add a new product
export const addProduct = createAsyncThunk<Product, Product, { rejectValue: string }>(
  "products/add",
  async (product, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, product);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add product");
    }
  }
);

// Update an existing product
export const updateProduct = createAsyncThunk<Product, { id: string; productData: Partial<Product> }, { rejectValue: string }>(
  "products/update",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, productData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update product");
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk<string, string, { rejectValue: string }>(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete product");
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add product";
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const index = state.items.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update product";
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter((product) => product.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete product";
      });
  },
});

export default productSlice.reducer;
