import React, { useRef, useState } from 'react'
import {
	Animated as RNAnimated,
	Dimensions,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	useAnimatedGestureHandler,
} from 'react-native-reanimated'

const flashcards = [
	{
		question: 'What is React Native?',
		answer: 'A framework for building native apps using React.',
	},
	{
		question: 'What is JSX?',
		answer: 'A syntax extension for JavaScript, used in React.',
	},
	{
		question: 'What is a Hook?',
		answer:
			'A special function that lets you use state and other React features.',
	},
]

interface FlashcardProps {
	question: string
	answer: string
}

const Flashcard: React.FC<FlashcardProps> = ({ question, answer }) => {
	const [flipped, setFlipped] = useState(false)
	const flipAnimation = useRef(new RNAnimated.Value(0)).current

	const frontInterpolate = flipAnimation.interpolate({
		inputRange: [0, 180],
		outputRange: ['0deg', '360deg'],
	})

	const backInterpolate = flipAnimation.interpolate({
		inputRange: [0, 180],
		outputRange: ['0deg', '180deg'],
	})

	const flipCard = () => {
		if (flipped) {
			RNAnimated.spring(flipAnimation, {
				toValue: 0,
				friction: 8,
				tension: 10,
				useNativeDriver: true,
			}).start()
		} else {
			RNAnimated.spring(flipAnimation, {
				toValue: 180,
				friction: 8,
				tension: 10,
				useNativeDriver: true,
			}).start()
		}
		setFlipped(!flipped)
	}

	return (
		<TouchableOpacity onPress={flipCard}>
			<View>
				<RNAnimated.View
					style={[
						flashcardStyles.card,
						{ transform: [{ rotateY: frontInterpolate }] },
					]}
				>
					<Text style={flashcardStyles.text}>{answer}</Text>
				</RNAnimated.View>
				<RNAnimated.View
					style={[
						flashcardStyles.card,
						flashcardStyles.cardBack,
						{ transform: [{ rotateY: backInterpolate }] },
					]}
				>
					<Text style={flashcardStyles.text}>{question}</Text>
				</RNAnimated.View>
			</View>
		</TouchableOpacity>
	)
}

const flashcardStyles = StyleSheet.create({
	card: {
		width: 300,
		height: 200,
		alignItems: 'center',
		justifyContent: 'center',
		backfaceVisibility: 'hidden',
		position: 'absolute',
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#ccc',
	},
	cardBack: {
		backgroundColor: '#f8f8f8',
	},
	text: {
		fontSize: 20,
	},
})

const FlashcardSwiper = () => {
	const translateX = useSharedValue(0)
	const currentIndex = useSharedValue(0)

	const width = Dimensions.get('window').width

	const gestureHandler = useAnimatedGestureHandler({
		onStart: (_, ctx) => {
			ctx.startX = translateX.value
		},
		onActive: (event, ctx) => {
			translateX.value = (ctx.startX as number) + event.translationX
		},
		onEnd: (event) => {
			if (event.translationX > 50 && currentIndex.value > 0) {
				currentIndex.value -= 1
			} else if (
				event.translationX < -50 &&
				currentIndex.value < flashcards.length - 1
			) {
				currentIndex.value += 1
			}
			translateX.value = withSpring(-currentIndex.value * width)
		},
	})

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value + 230 }],
		}
	})

	return (
		<Animated.View>
			<PanGestureHandler onGestureEvent={gestureHandler}>
				<Animated.View style={[swiperStyles.container, animatedStyle]}>
					{flashcards.map((card, index) => (
						<View key={index} style={swiperStyles.flashcardContainer}>
							<Flashcard question={card.question} answer={card.answer} />
						</View>
					))}
				</Animated.View>
			</PanGestureHandler>
		</Animated.View>
	)
}

const swiperStyles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		width: Dimensions.get('window').width * flashcards.length,
	},
	flashcardContainer: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height * 0.6, // Adjust height for responsiveness
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default FlashcardSwiper
