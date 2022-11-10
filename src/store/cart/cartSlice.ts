/**
 * @Copyright 2020, Exnodes. All Rights Reserved.
 * @date 2022/02/08 21:48
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartResponseType, CartType } from './cartModels'

interface initialCartStateType {
  data: CartType
}

const initialState: initialCartStateType = {
  data: {
    amountItems: undefined,
    cartId: undefined,
    totalPrice: undefined,
    items: [],
  },
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    doCart(state: initialCartStateType) {},
    doCartSuccess(
      state: initialCartStateType,
      action: PayloadAction<CartResponseType>
    ) {
      const { data }: CartResponseType = action.payload
      state.data = data
    },
    doCartFailure(state: initialCartStateType) {},
  },
})

export const cartActions = cartSlice.actions
export default cartSlice.reducer
