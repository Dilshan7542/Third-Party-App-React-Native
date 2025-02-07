import React from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Button} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {RegisterReq, registerUser} from "@/service/user-service";
import {ThemedView} from "@/components/ThemedView";
import {Link, useRouter} from "expo-router";
import {ThemedText} from "@/components/ThemedText";

// Validation schema
const schema = yup.object().shape({
  nic: yup.string().required('NIC is required'),
  firstname: yup.string().required('First Name is required'),
  lastname: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobileNumber: yup.string().required('Mobile Number is required'),
  password: yup.string().min(4, 'Password must be at least 4 characters').required('Password is required'),
});

export default function Register() {
 const navigation = useRouter();;
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data:RegisterReq) => {
    registerUser(data).then(resp=>{
    Alert.alert('Registration Successful', JSON.stringify(resp));
    navigation.navigate({pathname:"/pages/login",params:{nic:data.nic}});
    }).catch(e=>{
    Alert.alert('Registration Failed', JSON.stringify(e));
    navigation.navigate({pathname:"/pages/login",params:{nic:data.nic}});
    })
  };
  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="NIC"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="nic"
        defaultValue=""
      />
      {errors.nic && <Text style={styles.errorText}>{errors.nic.message}</Text>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="First Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="firstname"
        defaultValue=""
      />
      {errors.firstname && <Text style={styles.errorText}>{errors.firstname.message}</Text>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="lastname"
        defaultValue=""
      />
      {errors.lastname && <Text style={styles.errorText}>{errors.lastname.message}</Text>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
          />
        )}
        name="email"
        defaultValue=""
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="phone-pad"
          />
        )}
        name="mobileNumber"
        defaultValue=""
      />
      {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber.message}</Text>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
        name="password"
        defaultValue=""
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
      <ThemedView style={{display:"flex",justifyContent:"space-between",gap:10}}>
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
        <Link href={"/pages/login"} style={styles.buttonLogin}>
            <ThemedText style={{fontWeight:"bold",textAlign:"center"}}>Login</ThemedText>
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius:6,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#00a4fd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonLogin: {
    backgroundColor:"rgba(225,222,222,0.32)",
    fontWeight:"bold",
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
