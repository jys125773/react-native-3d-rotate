import React from 'react';
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';

import MerryCarousel from './lib/Carousel';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        {/* <SnapSwiper
          width={375}
          height={190}
          visibleCount={5}
          data={[
            'https://img.alicdn.com/tfs/TB16uDSnv6H8KJjy0FjXXaXepXa-520-280.jpg_q90',
            'https://aecpm.alicdn.com/simba/img/TB1XotJXQfb_uJkSnhJSuvdDVXa.jpg',
            'https://aecpm.alicdn.com/simba/img/TB1JNHwKFXXXXafXVXXSutbFXXX.jpg',
            'https://aecpm.alicdn.com/tfscom/TB1dhUMeKLM8KJjSZFqXXa7.FXa.jpg',
            'https://img.alicdn.com/tps/i4/TB1FC81nv2H8KJjy0FcSuuDlFXa.jpg_q90',
          ]}
          renderItem={uri => {
            return (
              <Image source={{ uri }} style={{ width: 375, height: 190 }} />
            )
          }
          }
        >
        </SnapSwiper>*/}

        <MerryCarousel
          containerWidth={375}
          containerHeight={200}
          cardWidth={280}
          cardHeight={150}
          radio={0.9}
          visibleCount={5}
          data={[
            'https://img.alicdn.com/tfs/TB16uDSnv6H8KJjy0FjXXaXepXa-520-280.jpg_q90',
            'https://aecpm.alicdn.com/simba/img/TB1XotJXQfb_uJkSnhJSuvdDVXa.jpg',
            'https://aecpm.alicdn.com/simba/img/TB1JNHwKFXXXXafXVXXSutbFXXX.jpg',
            'https://aecpm.alicdn.com/tfscom/TB1dhUMeKLM8KJjSZFqXXa7.FXa.jpg',
            'https://img.alicdn.com/tps/i4/TB1FC81nv2H8KJjy0FcSuuDlFXa.jpg_q90',
            'https://aecpm.alicdn.com/tfscom/TB1dhUMeKLM8KJjSZFqXXa7.FXa.jpg',
            'https://img.alicdn.com/tps/i4/TB1FC81nv2H8KJjy0FcSuuDlFXa.jpg_q90',
          ]}
          renderItem={uri => {
            return (
              <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
            )
          }
          }
        >
        </MerryCarousel>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
