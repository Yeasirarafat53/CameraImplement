import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {Camera, CameraType} from 'react-native-camera-kit';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import Modal from 'react-native-modal';
import RNFS from 'react-native-fs';

import {Switch} from 'react-native-switch';

const CameraScreen = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const cameraRef = useRef(null);

  const [value, setValue] = useState(true);

  const checkCameraPermission = async () => {
    try {
      const permissionStatus = await check(PERMISSIONS.ANDROID.CAMERA);

      if (permissionStatus === RESULTS.GRANTED) {
        setIsCameraActive(true);
      } else {
        requestCameraPermission();
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const permissionStatus = await request(PERMISSIONS.ANDROID.CAMERA);

      if (permissionStatus === RESULTS.GRANTED) {
        setIsCameraActive(true);
      } else {
        Alert.alert(
          'Permission Denied',
          'Please grant camera permission to use this feature.',
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };

  const handleScan = () => {
    checkCameraPermission();
  };

  // const handleCapture = async () => {
  //   if (cameraRef.current) {
  //     const image = await cameraRef.current.capture();
  //     console.log('image response ---- >>> ', JSON.stringify(image, null, 2));
  //     setCapturedImage(image.uri);
  //     setIsCameraActive(false);
  //   }
  // };

  const handleCapture = async () => {
    if (cameraRef.current) {
      const image = await cameraRef.current.capture();
      const base64String = await convertImageToBase64(image.uri);
      setCapturedImage(image.uri);
      setBase64Image(base64String);
      setIsCameraActive(false);
      console.log('Base64 String:', base64String);
    }
  };

  const convertImageToBase64 = async uri => {
    try {
      const base64String = await RNFS.readFile(uri, 'base64');
      return base64String;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{backgroundColor: '#168aad', padding: 15}}>
        <Text style={{color: '#ffffff', fontSize: 22, textAlign: 'center'}}>
          Self Attendance
        </Text>
      </View>
      {/* --------------- */}
      <View style={{marginTop: 50, padding: 10}}>
        {/* TODAY */}
        <View style={{alignSelf: 'center'}}>
          <Text style={{color: '#000000', fontSize: 18, textAlign: 'center'}}>
            Today
          </Text>
          <Text style={{color: '#000000', fontSize: 28}}>19/05/2024</Text>
        </View>

        {/* checkin out status */}
        <View style={{gap: 5, marginVertical: 15}}>
          <Text style={{color: '#000000', fontSize: 17, textAlign: 'center'}}>
            Checked In/Out Status
          </Text>
          <View style={{alignSelf: 'center'}}>
            <Switch
              value={value}
              onValueChange={val => setValue(val)}
              disabled={false}
              activeText={'In'}
              inActiveText={'Out'}
              circleSize={30}
              barHeight={35}
              circleBorderWidth={3}
              backgroundActive={'#004e64'}
              backgroundInactive={'#660708'}
              circleActiveColor={'#2b9348'}
              circleInActiveColor={'#e5383b'}
              changeValueImmediately={true}
              innerCircleStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              outerCircleStyle={{}}
              renderActiveText={true}
              renderInActiveText={true}
              switchLeftPx={3}
              switchRightPx={5}
              switchWidthMultiplier={2.5}
              switchBorderRadius={30}
            />
          </View>
        </View>

        {/* checked out time */}

        <View style={{alignSelf: 'center', marginVertical: 15}}>
          <Text style={{color: '#000000', fontSize: 18, textAlign: 'center'}}>
            Checked In/Out Time
          </Text>
          <Text style={{color: '#000000', fontSize: 28, textAlign: 'center'}}>
            2:00 PM
          </Text>
        </View>

        {/* image */}

        <View
          style={{
            alignSelf: 'center',
            //   display: 'flex',
            //   justifyContent: 'center',
            //   flex: 1,

            marginTop: 10,
          }}>
          {capturedImage && (
            <View
              style={{
                borderWidth: 1.5,
                borderColor: '#6096ba',
                borderRadius: 10,
                overflow: 'hidden',
                // marginTop: 50,
                alignSelf: 'center',
                marginVertical: 10,
              }}>
              <Image
                // source={{uri: capturedImage}}

                source={{uri: `data:image/jpeg;base64,${base64Image}`}}
                // style={styles.capturedImage}
                style={{height: 150, width: 150}}
                resizeMode="cover"
              />
            </View>
          )}

          <Button title="Open Camera" onPress={handleScan} />
        </View>

        {/* button */}
        <View
          style={{
            // gap: 5,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',

            marginTop:50
          }}>
          <TouchableOpacity
            //   onPress={() => navigation.navigate('Home')}
            style={[styles.button, {backgroundColor: 'tomato'}]}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => Alert.alert('successfully added')} >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isCameraActive && (
        <Modal
          transparent={true}
          visible={isCameraActive}
          onRequestClose={() => setIsCameraActive(false)}
          style={styles.modal}>
          <Camera
            ref={cameraRef}
            cameraType={CameraType.Front}
            flashMode="auto"
            style={{flex: 1}}
          />
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity
              onPress={handleCapture}
              style={styles.captureButton}>
              <View style={styles.innerCaptureButton} />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCaptureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
  },
  capturedImage: {
    width: 300,
    height: 300,
    marginTop: 20,

    resizeMode: 'contain',
  },

  // button

  button: {
    backgroundColor: '#55a630',
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
