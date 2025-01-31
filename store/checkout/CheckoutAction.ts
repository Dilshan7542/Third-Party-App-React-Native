import {createAction} from "@reduxjs/toolkit";
import {IUser} from "@/store/user/UserReducer";
import {CheckoutTransaction} from "@/store/checkout/CheckoutReducer";

export const readyToCheckout= createAction<CheckoutTransaction>("[USER] READY TO CHECKOUT");
