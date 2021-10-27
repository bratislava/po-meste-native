import { colors } from '@utils/theme'
import React, { useState } from 'react'
import { View, StyleSheet, LayoutRectangle } from 'react-native'

import Svg, { G, Line } from 'react-native-svg'

type Props = {
  color?: string
  strokeWidth?: number
  dashLength?: number
  spacing?: number
}

const DashedLine = ({
  color = colors.gray,
  strokeWidth = 2,
  dashLength = 6,
  spacing = 2,
}: Props) => {
  const [layout, setlayout] = useState<LayoutRectangle>()
  // TODO think it through
  const dashes = new Array(Math.floor(layout?.height || 5 / 100)).fill(null)
  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        setlayout(event.nativeEvent.layout)
      }}
    >
      <Svg height={layout?.height ? layout?.height : 15} width="100%">
        <G>
          {dashes.map((_, index) => (
            <Line
              key={index}
              x1={layout?.width ? layout?.width / 2 : 10}
              x2={layout?.width ? layout?.width / 2 : 10}
              y1={index * dashLength * spacing + 3}
              y2={index * dashLength * spacing + 3 + dashLength}
              stroke={color}
              strokeLinecap="round"
              strokeWidth={strokeWidth}
            />
          ))}
        </G>
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default DashedLine
