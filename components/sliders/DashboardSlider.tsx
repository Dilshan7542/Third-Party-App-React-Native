import React from 'react';
import { View, Text, Dimensions, Image, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";

const { width } = Dimensions.get('window');
type Data={
  title:string;
  imageUrl:string;
}
const data:Data []= [
  { title: 'Item 1', imageUrl: 'https://www.genie.lk/wp-content/uploads/2024/10/Dialog-in-app-biller-discount-for-any-Mastercardv2-1890x1100-1.jpg' },
  { title: 'Item 2', imageUrl: 'https://www.genie.lk/wp-content/uploads/2025/01/Exclusive-25-Discount-1890x1100-1.jpg' },
  { title: 'Item 3', imageUrl: 'https://www.genie.lk/wp-content/uploads/2023/11/genie-X-MasterCard-iPhone-15-Bonanza-1890x1100-2.jpg '},
  // Add more items as needed
];

const renderItem = ({ item }:{item:Data}) => (
  <ThemedView style={styles.carouselItem}>
    <Image source={{ uri: item.imageUrl }} style={styles.imageStyle} />
 {/*   <ThemedText style={styles.textStyle}>{item.title}</ThemedText>*/}
  </ThemedView>
);

export default function DashboardSlider() {
  return (
    <View style={styles.container}>
      <Carousel
        data={data}
        renderItem={renderItem}
        width={width}
        height={230}
        loop={true} // Optional: Infinite scrolling
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display:"flex",
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: width - 40,
    height: 200,
    borderRadius: 10,
  },
  textStyle: {
    fontSize: 16,
    marginTop: 10,
  },
});
