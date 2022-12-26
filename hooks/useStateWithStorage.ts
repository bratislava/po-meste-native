import { useAsyncStorage } from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

export const useStateWithStorage = <Type>(
  storageKey: string,
  initialValue: Type
): [Type, React.Dispatch<React.SetStateAction<Type>>, () => void] => {
  const storageHandle = useAsyncStorage(storageKey)

  const [state, setState] = useState<Type>(initialValue)

  useEffect(() => {
    storageHandle.getItem((error, item) => {
      if (!item) {
        setState(initialValue)
      }
      setState(JSON.parse(item ?? '{}'))
    })
  }, [])

  useEffect(() => {
    storageHandle.setItem(JSON.stringify(state))
  }, [state, storageHandle])

  const refreshState = async () => {
    const refreshedState = JSON.parse((await storageHandle.getItem()) ?? '')
    setState(refreshedState)
  }

  return [state, setState, refreshState]
}
