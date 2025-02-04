import React, {useEffect, useState} from "react";
import {Alert, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "@/store/Store";
import RNPickerSelect from "react-native-picker-select";
import {CheckoutTransaction} from "@/store/checkout/CheckoutReducer";
import {ThemedText} from "@/components/ThemedText";
import {processPaymentApi} from "@/service/client-service";
import {SUCCESS} from "@/constants/ResponseCode";
import {ThemedView} from "@/components/ThemedView";

interface LabelAccount {
  label: string,
  value: string
}

const Test3Screen = () => {
  const useStore = useSelector((store: RootState) => store.user);
  const checkoutStore = useSelector((store: RootState) => store.checkout);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [bankList, setBankList] = useState<LabelAccount[]>([])
  const [detail, setDetail] = useState<CheckoutTransaction | undefined>();
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
      Alert.alert("Error :  ",JSON.stringify(e));
    }

  }, []);
  const processPayment=()=>{
    if(useStore.user && detail){
      processPaymentApi({
        nic:useStore.user.nic,
        amount:detail.amount,
        transactionRef:detail.ref
      }).then(resp=>{
        console.log(resp);
        if (resp.status === SUCCESS) {
          openBrowser(resp.content.webUrl);
        }
      }).catch(e=>{
        console.error(e);
      });
    }

  }
  useEffect(() => {
    Alert.alert("data  detail USER EFFECT 2:  ",JSON.stringify(detail));
  }, [detail]);
  const openBrowser = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("An error occurred", err));
  };
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={processPayment}>
        <Text style={styles.buttonText}>Proceed to pay</Text>
        <TextInput editable={false}/>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
    color: "#000",
  },
  subText: {
    fontSize: 12,
    color: "gray",
  },
  input: {
    height: 40,
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Test3Screen;
