import React, {useEffect, useState} from "react";
import {Alert, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/Store";
import {CheckoutTransaction} from "@/store/checkout/CheckoutReducer";
import {ThemedText} from "@/components/ThemedText";
import {processPaymentApi} from "@/service/client-service";
import {SUCCESS} from "@/constants/ResponseCode";
import {ThemedView} from "@/components/ThemedView";
import DropDownPicker from "react-native-dropdown-picker";
import {loadingStatus} from "@/store/user/UserAction";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {getColor} from "@/constants/Colors";

interface LabelAccount {
  label: string,
  value: string
}

const FundTransferScreen = () => {
  const useStore = useSelector((store: RootState) => store.user);
  const checkoutStore = useSelector((store: RootState) => store.checkout);
  const dispatch = useDispatch<AppDispatch>();
  const [isClick, setIsClick] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [bankList, setBankList] = useState<LabelAccount[]>([])
  const [detail, setDetail] = useState<CheckoutTransaction | undefined>();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const data = checkoutStore.data;
      if (data) {
        const labelAccount: LabelAccount[] = [];
        data.fromAccountList.map(m => {
          labelAccount.push({label: m, value: m});
        });
        setBankList(labelAccount);
        setDetail(data);
      }
    }catch (e){
      Alert.alert("Error checkout :  ",JSON.stringify(e));
    }

  }, [checkoutStore]);
  const processPayment=()=>{
    setIsClick(true);
    if (!useStore.user) {
    Alert.alert("user not exist :  ",JSON.stringify(useStore));
    }
    if(!detail){
    Alert.alert("detail not exist:  ",JSON.stringify(detail));
    }
    if(useStore.user && detail){
      setIsClick(true);
     const req= {
        nic:useStore.user.nic,
          amount:detail.amount,
        transactionRef:detail.ref
      }
      dispatch(loadingStatus(true));
      processPaymentApi(req).then(resp=>{

        if (resp.status === SUCCESS) {
          openBrowser(resp.content.webUrl);
        }else{
          setIsClick(false);
        }
      }).catch(e=>{
        console.error(e);
        setIsClick(false);
        Alert.alert("response payment failed:  ",JSON.stringify(e));
      }).finally(()=>{
        setIsClick(false);
        dispatch(loadingStatus(false));
      });
    }

  }
  const openBrowser = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("An error occurred", err));
  };
  if(!detail){
   return (
     <SafeAreaView>
       <ThemedText>Test</ThemedText>
       <TouchableOpacity style={styles.button} onPress={()=>{
         if(detail){
         Alert.alert("checkout data :  ",JSON.stringify(detail));
         }else{
           alert("Detail undefined");
         }
       }}>
         <ThemedText style={styles.buttonText}>Test</ThemedText>
       </TouchableOpacity>
     </SafeAreaView>)
  }
  return (
    <ThemedView style={styles.container}>
    <ThemedView>
      <ThemedText style={styles.title}>Fund Transfer</ThemedText>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.label}>From</ThemedText>
        <DropDownPicker
          open={open}
          value={selectedAccount}
          items={bankList}
          setOpen={setOpen}
          setValue={setSelectedAccount}
          setItems={setBankList}
          placeholder="Select an account"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.label}>To Account</ThemedText>
        <TextInput style={styles.input} placeholder="To account" value={detail.toAccount} editable={false}  />
      </ThemedView>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.label}>Amount</ThemedText>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={detail.amount.toString()}
          editable={false}
        />
      </ThemedView>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.label}>Date</ThemedText>
        <ThemedText style={styles.value}>{detail.date}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.label}>Receiver's Name</ThemedText>
        <TextInput
          style={styles.input}
          value={detail.accountName}
          editable={false}
        />
      </ThemedView>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.label}>Ref Number</ThemedText>
        <TextInput
          style={styles.input}
          value={detail.ref}
          editable={false}
        />
      </ThemedView>


      <TouchableOpacity style={styles.button} disabled={isClick}  onPress={processPayment}>
        <ThemedText style={styles.buttonText}>Proceed to pay</ThemedText>
      </TouchableOpacity>
    </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
  },
  subText: {
    fontSize: 12,
    color: "gray",
  },
  dropdown: { borderColor: "#ccc", borderWidth: 1, borderRadius: 8 },
  dropdownContainer: { borderColor: "#ccc" },
  input: {
    height: 40,
    color:getColor().text,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontSize: 16,
    paddingVertical: 5,
  },
  picker: {
    height: 40,
  },
  button: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FundTransferScreen;
