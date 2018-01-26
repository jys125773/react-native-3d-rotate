import React, { Component } from 'react';
import { StyleSheet, View, Animated, PanResponder, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    marginTop: 60,
  },
  item: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
});

export default class Swiper extends Component {
  static defaultProps = {
    width: Dimensions.get('window').width,
    height: 360,
  };

  constructor(props) {
    super(props);

    this.itemsLength = props.data.length;

    this.position = new Animated.Value(0);
    this.positionValue = 0;
    this.position.addListener(v => {
      this.positionValue = v.value;
    });
  }

  responder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderTerminationRequest: () => false,

    onPanResponderGrant: () => {
      this.position.setOffset(this.positionValue);
      this.position.setValue(0);
    },

    onPanResponderMove: (evt, { dx }) => {
      this.position.setValue(dx / -this.props.width);
    },

    onPanResponderRelease: (evt, { vx }) => {
      this.position.flattenOffset();

      const left = Math.floor(this.positionValue);
      const right = left + 1;

      let result;

      if (vx > 0.05) {
        result = left;
      } else if (vx < -0.05) {
        result = right;
      } else {
        result = Math.round(this.positionValue);
      }

      if (result < 0) {
        result += this.itemsLength;
        this.position.setValue(this.positionValue + this.itemsLength);
      } else if (result >= this.itemsLength) {
        result -= this.itemsLength;
        this.position.setValue(this.positionValue - this.itemsLength);
      }

      Animated.spring(this.position, {
        toValue: result,
      }).start();
    },
  });

  render() {
    const { style, data, width, height, renderItem } = this.props;
    const r = width / 2 / (Math.tan((Math.PI / 180 * (180 / this.itemsLength))));

    return (
      <View
        {...this.responder.panHandlers}
        style={[styles.container, { width, height }, style]}>
        {
          data.map((item, index) => {
            return (
              <Animated.View key={index}
                style={[
                  styles.item,
                  {
                    transform: [
                      { scale: 1 },
                      { perspective: width * 3 },
                      { rotateY: '90deg' },
                      { translateX: r },
                      { rotateY: '-90deg' },
                      {
                        rotateY: this.position.interpolate({
                          inputRange: [index, index + 1],
                          outputRange: ['0deg', `-${360 / this.itemsLength}deg`],
                        })
                      },
                      { rotateY: '-90deg' },
                      { translateX: r },
                      { rotateY: '90deg' },
                    ]
                  }
                ]}>
                {renderItem(item)}
              </Animated.View>
            )
          })
        }
      </View>
    );
  }
};