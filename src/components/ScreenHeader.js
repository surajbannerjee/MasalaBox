import { StyleSheet, Text, View } from 'react-native'

const ScreenHeader = () => {
  return (
    <View style={styles.container}>
      <Text>ScreenHeader</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12, paddingHorizontal: 16 },
})

export default ScreenHeader