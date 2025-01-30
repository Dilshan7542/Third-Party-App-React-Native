import {useEffect, useRef, useState} from 'react';
import {Button, Text, View} from 'react-native';
import * as Notifications from 'expo-notifications';
import {registerForPushNotificationsAsync, sendPushNotification} from './push-notification';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => {
        console.log(token);
        setExpoPushToken(token ?? ''
        )})
      .catch((error: any) => setExpoPushToken(`${error}`));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {

      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);

    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (<View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
      <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>);
}
