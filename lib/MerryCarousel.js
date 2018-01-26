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

export default class Swiper extends Component {
  static defaultProps = {
    width: Dimensions.get('window').width,
    height: 360,
  };

  constructor(props) {
    super(props);

    this.itemsMap = {};

    this.position = new Animated.Value(0);
    this.positionValue = 0;
    this.position.addListener(({ value }) => {
      // console.log(this.itemsMap['0'].setNativeProps)
      const { list } = this.state;
      Object.keys(this.itemsMap).forEach((index) => {
        const itemNode = this.itemsMap[index];

        if (value >= 0) {
          let target = list[index + 1];
          let cur = list[index];

          if (!target) {
            target = list[0];
          }

          const { translateX, opacity, scale } = target.style;

          itemNode.setNativeProps({
            style: {
              opacity: cur.style.opacity + value * (opacity - cur.style.opacity),
              transform: [
                {
                  scale: cur.style.scale + value * (scale - cur.style.scale)
                },
                {
                  translateX: cur.style.translateX + value * (translateX - cur.style.translateX)
                }
              ]

            }
          });
          // console.log(target)

        } else {

        }
      });

      this.positionValue = value;
    });

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
        zIndex,
        style: { scale, opacity, translateX: lessMid ? offsetX : -offsetX },
      };
    });

    this.setListData(list);
  }

  setListData(list) {
    const head = list.slice(0, 1);
    const tail = list.slice(-1);
    const rest = list.slice(1, -1);
    const back = [...rest, tail[0], head[0]];
    const forward = [tail[0], head[0], ...rest];

    this.state = { list, back, forward };
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
      const positionValue = dx / -this.props.cardWidth;

      this.position.setValue(positionValue);
    },

    onPanResponderRelease: (evt, { vx }) => {

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
            this.state.list.map(({ rowData, zIndex, style }, index) => {
              const { opacity, scale, translateX } = style;

              return (
                <Animated.View
                  ref={ref => this.itemsMap[index] = ref}
                  style={[
                    styles.item,
                    {
                      zIndex,
                      opacity,
                    },
                    {
                      transform: [
                        { scale },
                        { translateX },
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