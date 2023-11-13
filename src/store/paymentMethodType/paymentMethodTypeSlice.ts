import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface initialLoadingStateType {
  type: string
}

const initialState: initialLoadingStateType = {
  type: '',
}

const paymentType = createSlice({
  name: 'paymentType',
  initialState,
  reducers: {
    doSetPaymentType(
      state: initialLoadingStateType,
      action: PayloadAction<string>
    ) {
      state.type = action.payload
    },
    doResetWorkLog(state: initialLoadingStateType) {
      state.type = ''
    },
  },
})

export const paymentTypeActions = paymentType.actions
export default paymentType.reducer
