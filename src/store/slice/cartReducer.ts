import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { collection, addDoc, getDocs, deleteDoc, query, where, updateDoc } from "firebase/firestore"
import { db } from "../../firebase/firebase"
import type { CartItem } from "../../interface/cart"
import { setShowMessage } from "./messageReducer"

interface CartState {
  items: CartItem[]
  loading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
}

// Add product to Firestore and Redux state
export const addToCart = createAsyncThunk<CartItem, { userId: string; product: CartItem }, { rejectValue: string }>(
  "cart/addToCart",
  async ({ userId, product }, { rejectWithValue, dispatch }) => {
    try {
      if (!userId) {
        dispatch(
          setShowMessage({
            message: "User ID is required to add items to cart",
            color: "red",
          }),
        )
        return rejectWithValue("User ID is required")
      }

      // Check if product already exists in cart
      const cartQuery = query(
        collection(db, "carts"),
        where("userId", "==", userId),
        where("productId", "==", product.id),
      )

      const existingItems = await getDocs(cartQuery)

      if (!existingItems.empty) {
        dispatch(
          setShowMessage({
            message: "Item already in cart",
            color: "blue",
          }),
        )
        return rejectWithValue("Item already in cart")
      }

      // Add new item to cart
      const cartItem = {
        userId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      }

      const docRef = await addDoc(collection(db, "carts"), cartItem)

      dispatch(
        setShowMessage({
          message: "Item added to cart successfully",
          color: "green",
        }),
      )

      return {
        ...cartItem,
        id: docRef.id,
      } as CartItem
    } catch (error) {
      console.error("Error adding to cart:", error)
      dispatch(
        setShowMessage({
          message: "Failed to add item to cart",
          color: "red",
        }),
      )
      return rejectWithValue("Failed to add item to cart")
    }
  },
)

// Fetch cart items from Firestore for the user
export const fetchCart = createAsyncThunk<CartItem[], string, { rejectValue: string }>(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue("User ID is required")
      }

      const q = query(collection(db, "carts"), where("userId", "==", userId))
      const querySnapshot = await getDocs(q)

      const cartItems: CartItem[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        cartItems.push({
          id: doc.id,
          name: data.name || "",
          price: data.price || 0,
          image: data.image || [],
          quantity: data.quantity || 1,
        })
      })

      return cartItems
    } catch (error) {
      console.error("Error fetching cart:", error)
      return rejectWithValue("Failed to fetch cart items")
    }
  },
)

// Remove product from Firestore
export const removeFromCart = createAsyncThunk<string, { id: string; userId: string }, { rejectValue: string }>(
  "cart/removeFromCart",
  async ({ id, userId }, { rejectWithValue, dispatch }) => {
    try {
      if (!userId) {
        return rejectWithValue("User ID is required")
      }

      const q = query(collection(db, "carts"), where("userId", "==", userId))

      const querySnapshot = await getDocs(q)

      let itemFound = false

      for (const document of querySnapshot.docs) {
        if (document.id === id) {
          await deleteDoc(document.ref)
          itemFound = true
          break
        }
      }

      if (!itemFound) {
        return rejectWithValue("Item not found in cart")
      }

      dispatch(
        setShowMessage({
          message: "Item removed from cart",
          color: "green",
        }),
      )

      return id
    } catch (error) {
      console.error("Error removing from cart:", error)
      dispatch(
        setShowMessage({
          message: "Failed to remove item from cart",
          color: "red",
        }),
      )
      return rejectWithValue("Failed to remove item from cart")
    }
  },
)

// Clear all cart items for the user
export const clearCart = createAsyncThunk<void, string, { rejectValue: string }>(
  "cart/clearCart",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      if (!userId) {
        return rejectWithValue("User ID is required")
      }

      const q = query(collection(db, "carts"), where("userId", "==", userId))
      const querySnapshot = await getDocs(q)

      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref))
      await Promise.all(deletePromises)

      dispatch(
        setShowMessage({
          message: "Cart cleared successfully",
          color: "green",
        }),
      )
    } catch (error) {
      console.error("Error clearing cart:", error)
      dispatch(
        setShowMessage({
          message: "Failed to clear cart",
          color: "red",
        }),
      )
      return rejectWithValue("Failed to clear cart")
    }
  },
)

// Update quantity in Firestore and Redux store
export const updateCartItemQuantity = createAsyncThunk<
  { id: string; quantity: number },
  { id: string; quantity: number; userId: string },
  { rejectValue: string }
>("cart/updateQuantity", async ({ id, quantity, userId }, { rejectWithValue }) => {
  try {
    if (!userId) {
      return rejectWithValue("User ID is required")
    }

    if (quantity < 1) {
      return rejectWithValue("Quantity must be at least 1")
    }

    const q = query(collection(db, "carts"), where("userId", "==", userId))

    const querySnapshot = await getDocs(q)

    let itemFound = false

    for (const document of querySnapshot.docs) {
      if (document.id === id) {
        await updateDoc(document.ref, { quantity })
        itemFound = true
        break
      }
    }

    if (!itemFound) {
      return rejectWithValue("Item not found in cart")
    }

    return { id, quantity }
  } catch (error) {
    console.error("Error updating quantity:", error)
    return rejectWithValue("Failed to update quantity")
  }
})

// Increment product quantity
export const incrementQuantity = createAsyncThunk<
  { id: string; quantity: number },
  { id: string; quantity: number; userId: string },
  { rejectValue: string }
>("cart/incrementQuantity", async ({ id, quantity, userId }, { dispatch }) => {
  const newQuantity = quantity + 1
  dispatch(updateCartItemQuantity({ id, quantity: newQuantity, userId }))
  return { id, quantity: newQuantity }
})

// Decrement product quantity
export const decrementQuantity = createAsyncThunk<
  { id: string; quantity: number } | string,
  { id: string; quantity: number; userId: string },
  { rejectValue: string }
>("cart/decrementQuantity", async ({ id, quantity, userId }, { dispatch }) => {
  if (quantity > 1) {
    const newQuantity = quantity - 1
    dispatch(updateCartItemQuantity({ id, quantity: newQuantity, userId }))
    return { id, quantity: newQuantity }
  } else {
    dispatch(removeFromCart({ id, userId }))
    return id
  }
})

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.items.push(action.payload)
        state.loading = false
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload || "Failed to add item to cart"
        state.loading = false
      })

      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch cart items"
        state.loading = false
      })

      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
        state.loading = false
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload || "Failed to remove item from cart"
        state.loading = false
      })

      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
        state.loading = false
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload || "Failed to clear cart"
        state.loading = false
      })

      // Update quantity
      .addCase(updateCartItemQuantity.fulfilled, (state, action: PayloadAction<{ id: string; quantity: number }>) => {
        const item = state.items.find((item) => item.id === action.payload.id)
        if (item) {
          item.quantity = action.payload.quantity
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.error = action.payload || "Failed to update quantity"
      })

      // Handle increment/decrement through the updateCartItemQuantity action
      .addCase(incrementQuantity.fulfilled, (state, action: PayloadAction<{ id: string; quantity: number }>) => {
        const item = state.items.find((item) => item.id === action.payload.id)
        if (item) {
          item.quantity = action.payload.quantity
        }
      })
      .addCase(
        decrementQuantity.fulfilled,
        (state, action: PayloadAction<{ id: string; quantity: number } | string>) => {
          if (typeof action.payload === "string") {
            state.items = state.items.filter((item) => item.id !== action.payload)
          } else {
            const { id, quantity } = action.payload
            const item = state.items.find((item) => item.id === id)
            if (item) {
              item.quantity = quantity
            }
          }
        },
      )
  },
})

export default cartSlice.reducer

