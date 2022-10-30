import { useEffect, useRef, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { PositionChoice } from '../components/PositionChoice';
import * as Sharing from 'expo-sharing';
import { styles } from './styles';
import { POSITIONS, PositionProps } from '../utils/positions';
import { Camera, CameraType } from 'expo-camera';
import { captureRef } from 'react-native-view-shot';

export function Home() {
  const [photo, setPhoto] = useState<null | string>(null);
  const [positionSelected, setPositionSelected] = useState<PositionProps>(
    POSITIONS[0],
  );
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const cameraRef = useRef<Camera>(null);
  const screenShotRef = useRef(null);

  async function handleTakePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    setPhoto(photo.uri);
  }

  async function shareScreenShot() {
    const screenshot = await captureRef(screenShotRef);
    await Sharing.shareAsync('file://' + screenshot);
  }

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then((response) =>
      setHasCameraPermission(response.granted),
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View ref={screenShotRef} style={styles.share}>
          <Header position={positionSelected} />

          <View style={styles.picture}>
            {hasCameraPermission && !photo ? (
              <Camera
                style={styles.camera}
                type={CameraType.front}
                ref={cameraRef}
              />
            ) : (
              <Image
                source={{
                  uri: photo
                    ? photo
                    : 'https://media.istockphoto.com/vectors/no-camera-icon-vector-id1202407074?k=20&m=1202407074&s=170667a&w=0&h=vk73jggd8Aq5QdQOYdH35vXYE3fkj4plVRkQV4ibHSo=',
                }}
                style={styles.camera}
                onLoad={shareScreenShot}
              />
            )}

            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui"
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />

        <TouchableOpacity onPress={() => setPhoto(null)}>
          <Text style={styles.retry}>Tirar uma nova foto</Text>
        </TouchableOpacity>

        <Button title="Compartilhar" onPress={handleTakePicture} />
      </ScrollView>
    </SafeAreaView>
  );
}
