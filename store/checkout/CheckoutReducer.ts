import {createReducer} from "@reduxjs/toolkit";
import {readyToCheckout} from "@/store/checkout/CheckoutAction";
export interface CheckoutTransaction {
  fromAccountList: string[];
  toAccount: string;
  accountName: string;
  date: string; // Consider using Date type if you will handle date objects
  amount: number;
  ref:string
}

export interface CheckoutState {
 data?:CheckoutTransaction,
  error?:string
}
const init:CheckoutState={
}
export const checkoutReducer= createReducer(init,(stateBuilder)=>{
   stateBuilder.addCase(readyToCheckout,(state, action)=>{
    return {
      data:action.payload,
      error:undefined
    }
  })
})
