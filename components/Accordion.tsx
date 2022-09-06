import React, { ReactNode, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import AccordionItem, { AccordionStyles } from './AccordionItem'

interface AccorionProps {
  items: {
    title: ReactNode | string
    body: ReactNode | string
  }[]
  overrideStyles?: AccordionStyles
  arrowIcon?: (isOpen: boolean) => JSX.Element
}

const Accordion = ({ items, overrideStyles, arrowIcon }: AccorionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const onItemPress = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null)
    } else {
      setActiveIndex(index)
    }
  }

  return (
    <View style={styles.container}>
      {items.map(({ title, body }, index) => (
        <AccordionItem
          key={index}
          onPress={() => onItemPress(index)}
          isOpen={activeIndex === index}
          title={title}
          body={body}
          overrideStyles={overrideStyles}
          arrowIcon={arrowIcon}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
})

export default Accordion
