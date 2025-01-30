import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import {useLocalSearchParams} from "expo-router";
interface Data{
  amount:number,
  ref:string,
  name:string
}

const FundTransferScreen = () => {
  const params = useLocalSearchParams();
  const dataParam: string = params['data']?.toString();
  const data=JSON.parse(dataParam) as Data;
  const [amount, setAmount] = useState(data.amount || 0);
  const [beneficiaryReference, setBeneficiaryReference] = useState(data.name || "dev user");
  const [yourReference, setYourReference] = useState(data.ref || "Test Ref 0000");
  const [transactionPurpose, setTransactionPurpose] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fund Transfer</Text>

      <View style={styles.section}>
        <Text style={styles.label}>From</Text>
        <Text style={styles.value}>{}</Text>
        <Text style={styles.subText}>0670 13512741 125</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>To</Text>
        <TextInput style={styles.input} placeholder="Select your beneficiary account" />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="LKR Enter amount"
          keyboardType="numeric"
          value={amount.toString()}
        />
        <Text style={styles.subText}>Your available balance, LKR {amount}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>When</Text>
        <Text style={styles.value}>Today, 30 Jan 2025</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Beneficiary Reference *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter beneficiary reference"
          value={beneficiaryReference}
          onChangeText={setBeneficiaryReference}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Your Reference</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your reference"
          value={yourReference}
          onChangeText={setYourReference}
        />
      </View>

      <TouchableOpacity style={styles.button}>
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
