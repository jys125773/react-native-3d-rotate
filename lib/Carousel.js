import React, { Component } from 'react';
import { StyleSheet, View, Animated, PanResponder, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  item: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default class Carousel extends Component {
  static defaultProps = {
    width: Dimensions.get('window').width,
    height: 360,
  };

  constructor(props) {
    super(props);

    const { data, radio, containerWidth, containerHeight, cardWidth, cardHeight } = props;

    this.itemsCount = data.length;

    const midIndex = Math.floor(this.itemsCount / 2);
    const halfHorizontalPadding = (containerWidth - cardWidth) / 2;
    const times = radio * (1 - Math.pow(radio, midIndex)) / (1 - radio);
    const partOpacity = (1 - 0.5) / midIndex;

    let lessMid, zIndex, scale, relativeRadio, offsetX, opacity;
    const list = data.map((rowData, index) => {
      lessMid = index <= midIndex;
      zIndex = lessMid ? midIndex - index : index - 1 - midIndex;
      scale = Math.pow(radio, midIndex - zIndex);
      relativeRadio = radio * (1 - scale) / (1 - radio) / times;
      offsetX = (relativeRadio * halfHorizontalPadding + cardWidth * (1 - scale) / 2) / scale;
      opacity = 1 - (midIndex - zIndex) * partOpacity;

      return {
        rowData,
        style: { zIndex, scale, opacity, translateX: lessMid ? offsetX : -offsetX },
      };
    });

    this.state = {
      list,
      ...this.getTransformData(list),
    };

    this.positionValuesMap = {};

    this.state.positions.forEach((position, index) => {
      position.addListener(v => {
        this.positionValuesMap[index] = v.value;
      });
    });
  }

  getTransformData(list) {
    return list.reduce((acc, { style }, index) => {
      const { zIndex, scale, opacity, translateX } = style;

      acc.indexs.push(index);
      acc.positions.push(new Animated.Value(index));
      acc.translateXs.push(translateX);
      acc.zIndexs.push(zIndex);
      acc.scales.push(scale);
      acc.opacities.push(opacity);

      return acc;
    }, {
        indexs: [],
        positions: [],
        translateXs: [],
        scales: [],
        opacities: [],
        zIndexs: [],
      });
  }

  responder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderTerminationRequest: () => false,

    onPanResponderGrant: () => {

    },

    onPanResponderMove: (evt, { dx }) => {
      const { indexs } = this.state;
      this.state.positions.forEach((position, index) => {
        position.setValue(indexs[index] + dx / this.props.cardWidth);
      });
    },

    onPanResponderRelease: (evt, { vx }) => {
      this.state.positions.forEach((position, index) => {
        const acurateValue = this.positionValuesMap[index];
        const left = Math.floor(acurateValue);
        const right = left + 1;

        if (vx > 0.05) {
          result = right;
        } else if (vx < -0.05) {
          result = left;
        } else {
          result = Math.round(acurateValue);
        }

        if (result < 0) {
          result += this.itemsCount;
          position.setValue(acurateValue + this.itemsCount);
        } else if (result >= this.itemsCount) {
          result -= this.itemsCount;
          position.setValue(acurateValue - this.itemsCount);
        }

        Animated.spring(position, {
          toValue: result,
        }).start();
      });

    },
  });

  render() {
    const {
      containerWidth,
      containerHeight,
      cardWidth,
      cardHeight,
      renderItem,
       } = this.props;

    return (
      <View
        style={[styles.container, { width: containerWidth, height: containerHeight }]}>
        <View
          style={{ width: cardWidth, height: cardHeight }}
          {...this.responder.panHandlers}>
          {
            this.state.list.map(({ rowData, style: { zIndex } }, index) => {

              return (
                <Animated.View
                  style={[
                    styles.item,
                    {
                      zIndex,
                      opacity: this.state.positions[index].interpolate({
                        inputRange: this.state.indexs,
                        outputRange: this.state.opacities,
                      }),
                    },
                    {
                      transform: [
                        {
                          scale: this.state.positions[index].interpolate({
                            inputRange: this.state.indexs,
                            outputRange: this.state.scales,
                          }),
                        },
                        {
                          translateX: this.state.positions[index].interpolate({
                            inputRange: this.state.indexs,
                            outputRange: this.state.translateXs,
                          }),
                        },
                      ],
                    }
                  ]}
                  key={index}>
                  {renderItem(rowData)}
                </Animated.View>
              )
            })
          }
        </View>
      </View>
    );
  }
};