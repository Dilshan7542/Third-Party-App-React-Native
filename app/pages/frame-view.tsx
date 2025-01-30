import {Linking, SafeAreaView, StyleSheet} from "react-native";
import WebView from "react-native-webview";
import {Stack, useLocalSearchParams} from "expo-router";
import {ThemedView} from "@/components/ThemedView";

export default function frameView() {
  const params = useLocalSearchParams();
  const url:string=params['url'] ? params["url"].toString():"";
  const nic:string=params['nic'] ? params["nic"].toString():"";
  console.log(params);
  const temp=(
    <ThemedView>
      <SafeAreaView style={styles.container}>
        <WebView
          style={styles.webView}
          source={{
            uri:url
          }}
          onNavigationStateChange={(state) => {
          }}
          startInLoadingState={true}
        />
      </SafeAreaView>
    </ThemedView>
  );
  const openBrowser = (url:string) => {
    Linking.openURL(url).catch((err) => console.error("An error occurred", err));
  };

  return (
    <ThemedView>
      <SafeAreaView style={styles.container}>
        <WebView
          style={styles.webView}
          source={{
            uri:url
          }}
          onNavigationStateChange={(state) => {
          }}
          startInLoadingState={true}
        />
      </SafeAreaView>
    </ThemedView>
)
}
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  stepContainer: {
    gap: 8, marginBottom: 8,
  },
  reactLogo: {
    height: 178, width: 290, bottom: 0, left: 0, position: 'absolute',
  },
  container: {
    flex: 1, // Make the container fill the entire screen
  },
  webView: {
    flex: 1, // Make the WebView fill the entire container
  },

});
