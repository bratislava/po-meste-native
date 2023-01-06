import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

export const useStateWithStorage = <Type>(
  storageKey: string,
  initialValue: Type,
  validation?: (item: unknown) => Type
): [Type, React.Dispatch<React.SetStateAction<Type>>, () => void] => {
  const storageHandle = useAsyncStorage(storageKey)

  const [internalState, setInternalState] = useState<Type>(initialValue)

  useEffect(() => {
    storageHandle
      .getItem((error, item) => {
        if (!item || error) return
        const parsedItem = JSON.parse(item)
        if (validation) {
          try {
            const validatedItem = validation(parsedItem)
            if (validatedItem) setInternalState(validatedItem)
          } catch (e: any) {
            console.error(e)
            storageHandle.setItem(JSON.stringify(initialValue))
          }
        } else if (parsedItem) setInternalState(parsedItem)
      })
      .catch(() => {
        storageHandle.setItem(JSON.stringify(initialValue))
      })
  }, [])

  useEffect(() => {
    storageHandle.setItem(JSON.stringify(internalState))
  }, [internalState, storageHandle])

  const refreshState = async () => {
    const item = await storageHandle.getItem()
    if (!item) return
    const refreshedState = JSON.parse(item)
    setInternalState(refreshedState)
  }

  return [internalState, setInternalState, refreshState]
}
