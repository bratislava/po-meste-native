import Text from '@components/Text'
import WheelchairSvg from '@icons/wheelchair.svg'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import i18n from 'i18n-js'
import _ from 'lodash'
import React, { useState } from 'react'
import { Platform, StyleSheet, Switch, View } from 'react-native'

interface FilterProps {
  test?: string
}

const Filter = (props: FilterProps) => {
  const [accessibleOnly, setAccessibleOnly] = useState(false)
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={{ ...s.textLarge, fontWeight: '500' }}>Filter</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>
          {i18n.t('screens.FromToScreen.Planner.Filter.transit')}
        </Text>
        <View style={styles.row}>
          <Text style={{ flex: 0 }}>
            {i18n.t('screens.FromToScreen.Planner.Filter.maxTransfers')}
          </Text>
          <View
            style={[
              styles.row,
              {
                flex: 1,
                justifyContent: 'space-between',
              },
            ]}
          >
            {_.range(0, 4).map((index) => (
              <View
                key={index}
                style={[
                  styles.tranfersButton,
                  index !== 3 && { marginRight: 15 },
                  { justifyContent: 'center', alignItems: 'center' },
                ]}
              >
                <Text style={[s.textMedium, { color: colors.disabledGray }]}>
                  {index}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}
        >
          <View style={[styles.row, { alignItems: 'center' }]}>
            <WheelchairSvg
              fill={colors.primary}
              width={20}
              height={20}
              style={{ marginRight: 7 }}
            />
            <Text style={styles.text}>
              {i18n.t('screens.FromToScreen.Planner.accessibleVehicles')}
            </Text>
          </View>
          <Switch
            trackColor={{
              false: colors.disabledGray,
              true: colors.switchGreen,
            }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.disabledGray}
            onValueChange={(value) => setAccessibleOnly(value)}
            value={accessibleOnly}
            style={{
              flex: 0,
              marginLeft: Platform.select({
                ios: 10,
                android: 0,
              }),
            }}
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>
          {i18n.t('screens.FromToScreen.Planner.Filter.multimodalMode')}
        </Text>
        <Text>
          {i18n.t(
            'screens.FromToScreen.Planner.Filter.multimodalPrefferedProviders'
          )}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          {_.range(0, 4).map((index) => (
            <View
              key={index}
              style={[
                styles.providerButton,
                index !== 3 && { marginRight: 10 },
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.section}></View>
      <View style={styles.section}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    ...s.textMedium,
  },
  section: {
    marginBottom: 30,
  },
  providerButton: {
    height: 50,
    minWidth: 20,
    flex: 1,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 5,
  },
  marginBottom: {
    marginBottom: 10,
  },
  tranfersButton: {
    flex: 1,
    height: 40,
    borderWidth: 2,
    borderColor: colors.disabledGray,
    borderRadius: 10,
  },
})

export default Filter
