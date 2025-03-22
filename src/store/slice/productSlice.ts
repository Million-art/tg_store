import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "../../interface/product"
import { db } from "../../firebase/firebase"
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import type { Category } from "../../interface/Category"

interface ProductState {
  items: Product[]
  loading: boolean
  error: string | null
  lastVisible: QueryDocumentSnapshot<DocumentData> | null
  hasMore: boolean
  categories: Category[]
  categoriesLoading: boolean
  categoriesError: string | null
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
  lastVisible: null,
  hasMore: true,
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
}

// Fetch all products
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const productsQuery = query(collection(db, "products"), orderBy("name"), limit(20))

      const querySnapshot = await getDocs(productsQuery)

      if (querySnapshot.empty) {
        return []
      }

      const products: Product[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        products.push({
          id: doc.id,
          name: data.name || "Unknown Product",
          price: data.price || 0,
          image: Array.isArray(data.image) ? data.image : [],
          quantity: data.quantity || 0,
          description: data.description || "",
          category: data.category || null,
        })
      })

      return products
    } catch (error: any) {
      console.error("Error fetching products:", error)
      return rejectWithValue(error.message || "Failed to fetch products")
    }
  },
)

// Fetch products with pagination
export const fetchMoreProducts = createAsyncThunk<
  { products: Product[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null; hasMore: boolean },
  { lastVisible: QueryDocumentSnapshot<DocumentData> | null },
  { rejectValue: string }
>("products/fetchMore", async ({ lastVisible }, { rejectWithValue }) => {
  try {
    let productsQuery

    if (lastVisible) {
      productsQuery = query(collection(db, "products"), orderBy("name"), startAfter(lastVisible), limit(10))
    } else {
      productsQuery = query(collection(db, "products"), orderBy("name"), limit(10))
    }

    const querySnapshot = await getDocs(productsQuery)

    const products: Product[] = []
    let newLastVisible: QueryDocumentSnapshot<DocumentData> | null = null

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        products.push({
          id: doc.id,
          name: data.name || "Unknown Product",
          price: data.price || 0,
          image: Array.isArray(data.image) ? data.image : [],
          quantity: data.quantity || 0,
          description: data.description || "",
          category: data.category || null,
        })
      })

      // Get the last document
      newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
    }

    return {
      products,
      lastVisible: newLastVisible,
      hasMore: products.length === 10, // If we got less than the limit, there are no more products
    }
  } catch (error: any) {
    console.error("Error fetching more products:", error)
    return rejectWithValue(error.message || "Failed to fetch more products")
  }
})

// Fetch products by category
export const fetchProductsByCategory = createAsyncThunk<Product[], string, { rejectValue: string }>(
  "products/fetchByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      if (!categoryId) {
        return rejectWithValue("Category ID is required")
      }

      // Modified query to avoid the composite index requirement
      // We're only using the where clause without orderBy
      const productsQuery = query(
        collection(db, "products"),
        where("category.id", "==", categoryId),
        limit(50), // Increased limit to get more results since we'll sort them in memory
      )

      const querySnapshot = await getDocs(productsQuery)

      if (querySnapshot.empty) {
        return []
      }

      const products: Product[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        products.push({
          id: doc.id,
          name: data.name || "Unknown Product",
          price: data.price || 0,
          image: Array.isArray(data.image) ? data.image : [],
          quantity: data.quantity || 0,
          description: data.description || "",
          category: data.category || null,
        })
      })

      // Sort the products by name in memory instead of in the query
      products.sort((a, b) => a.name.localeCompare(b.name))

      return products
    } catch (error: any) {
      console.error("Error fetching products by category:", error)

      // If the error is about missing index, provide a more helpful message
      if (error.message && error.message.includes("requires an index")) {
        return rejectWithValue(
          "Database index not set up. Please contact the administrator to set up the required index.",
        )
      }

      return rejectWithValue(error.message || "Failed to fetch products by category")
    }
  },
)

// Fetch all categories
export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const categoriesQuery = query(collection(db, "categories"), orderBy("name"))

      const querySnapshot = await getDocs(categoriesQuery)

      if (querySnapshot.empty) {
        return []
      }

      const categories: Category[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        categories.push({
          id: doc.id,
          name: data.name || "Unknown Category",
        })
      })

      return categories
    } catch (error: any) {
      console.error("Error fetching categories:", error)
      return rejectWithValue(error.message || "Failed to fetch categories")
    }
  },
)

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.items = []
      state.lastVisible = null
      state.hasMore = true
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch products"
      })

      // Fetch more products
      .addCase(fetchMoreProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMoreProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = [...state.items, ...action.payload.products]
        state.lastVisible = action.payload.lastVisible
        state.hasMore = action.payload.hasMore
      })
      .addCase(fetchMoreProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch more products"
      })

      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch products by category"
      })

      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true
        state.categoriesError = null
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.categoriesLoading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false
        state.categoriesError = action.payload || "Failed to fetch categories"
      })
  },
})

export const { clearProducts } = productSlice.actions
export default productSlice.reducer

