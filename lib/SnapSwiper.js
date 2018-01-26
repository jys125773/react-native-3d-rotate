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
    const {
      data,
      radio,
      containerWidth,
      containerHeight,
      cardWidth,
      cardHeight,
     } = props;

    this.itemsRefs = {};

    this.itemsCount = data.length;
    this.middleIndex = Math.floor(this.itemsCount / 2);
    this.position = new Animated.Value(0);
    this.positionValue = 0;
    this.position.addListener(v => {
      this.positionValue = v.value;
    });

    const middleIndex = this.middleIndex;
    const halfHorizontalPadding = (containerWidth - cardWidth) / 2;
    const halfVerticalPadding = (containerHeight - cardHeight) / 2;
    const times = radio * (1 - Math.pow(radio, middleIndex)) / (1 - radio);
    const partOpacity = (1 - 0.5) / middleIndex;

    const list = data.map((rowData, index) => {
      const lessMid = index <= middleIndex;
      const zIndex = lessMid ? middleIndex - index : this.itemsCount - 1 - index;
      const scale = Math.pow(radio, middleIndex - zIndex);
      const relativeRadio = radio * (1 - scale) / (1 - radio) / times;
      const offsetX = relativeRadio * halfHorizontalPadding;
      const width = cardWidth * scale;
      const height = cardHeight * scale;
      const left = lessMid ? (cardWidth + offsetX) - width : -offsetX;
      const top = relativeRadio * halfVerticalPadding;
      const opacity = 1 - (middleIndex - zIndex) * partOpacity;

      return {
        rowData,
        style: {
          zIndex,
          width,
          height,
          left,
          top,
          opacity,
        }
      };
    });

    const head = list.slice(0, 1);
    const tail = list.slice(-1);
    const rest = list.slice(1, -1);

    this.state = {
      list,
      preList: [...rest, tail[0], head[0]],
      nextList: [tail[0], head[0], ...rest],
    };
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

  componentDidMount() {

  }

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
            this.state.list.map(({ rowData, style }, index) => {
              const { zIndex, width, height, left, top, opacity } = style;

              return (
                <Animated.View
                  key={index}
                  ref={ref => this.itemsRefs[index] = ref}
                  style={[
                    styles.item,
                    { zIndex, width, height, left, top, opacity },
                  ]}>
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