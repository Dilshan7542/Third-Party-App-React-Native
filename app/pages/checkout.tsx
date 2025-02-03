import React, {useEffect, useState} from "react";
import {Alert, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "@/store/Store";
import RNPickerSelect from "react-native-picker-select";
import {CheckoutTransaction} from "@/store/checkout/CheckoutReducer";
import {ThemedText} from "@/components/ThemedText";
import {processPaymentApi} from "@/service/client-service";
import {SUCCESS} from "@/constants/ResponseCode";

interface LabelAccount {
  label: string,
  value: string
}

const FundTransferScreen = () => {
  const useStore = useSelector((store: RootState) => store.user);
  const checkoutStore = useSelector((store: RootState) => store.checkout);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [bankList, setBankList] = useState<LabelAccount[]>([])
  const [detail, setDetail] = useState<CheckoutTransaction | undefined>();
  useEffect(() => {
    const data = checkoutStore.data;
    console.log(data);
    Alert.alert("checkout data :  ",JSON.stringify(data));
    if (data) {
      const labelAccount: LabelAccount[] = [];
      data.fromAccountList.map(m => {
        labelAccount.push({label: m, value: m});
      });
      setBankList(labelAccount);
      setDetail(data);
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
  const openBrowser = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("An error occurred", err));
  };
  if(!detail){
   return (<ThemedText><ThemedText>Test</ThemedText></ThemedText>)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fund Transfer</Text>
      <View style={styles.section}>
        <Text style={styles.label}>From</Text>
        <RNPickerSelect
          value={detail.fromAccountList[0] || "no account"}
          onValueChange={(value) => setSelectedAccount(value)}
          items={bankList}
          placeholder={{label: "Select an option...", value: null}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>To Account</Text>
        <TextInput style={styles.input} placeholder="To account" value={detail.toAccount} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="LKR Enter amount"
          keyboardType="numeric"
          value={detail.amount.toString()}
          readOnly={true}
        />
       {/* <Text style={styles.subText}>Your available balance, LKR {detail.amount.toString()}</Text>*/}
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{detail.date}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Receiver's Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter beneficiary reference"
          value={detail.accountName}
          readOnly={true}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={processPayment}>
        <Text style={styles.buttonText}>Proceed to pay</Text>
      </TouchableOpacity>
    </View>
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

export default FundTransferScreen;
