import React from 'react'
import { SafeAreaView, StyleSheet, useWindowDimensions } from 'react-native'
import FlashcardSwiper from './src/app/ui/FlashcardSwiper'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const App = () => {
	const { height, width } = useWindowDimensions()

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView style={[styles.container, { height, width }]}>
				<FlashcardSwiper />
			</SafeAreaView>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default App
