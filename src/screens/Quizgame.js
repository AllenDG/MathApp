import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  FlatList,
  ImageBackground,
  Image,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Audio } from "expo-av";
import Ionicons from "react-native-vector-icons/Ionicons";
import GameOverComponent from "../components/GameOverContainer";

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(60);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [scoreAddedToLeaderboard, setScoreAddedToLeaderboard] = useState(false);
  const [sound, setSound] = useState();

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/quiz.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  
  useEffect(() => {
    playSound();
  }, []);

  useEffect(() => {
    const initialQuestions = [
      { question: "2 + 2?", choices: ["2", "3", "4", "5"], correctAnswer: "4" },

      {
        question: "5 + 5?",
        choices: ["10", "11", "12", "15"],
        correctAnswer: "10",
      },

      { question: "3 + 1?", choices: ["1", "2", "3", "4"], correctAnswer: "4" },

      {
        question: "12 + 1?",
        choices: ["13", "15", "14", "12"],
        correctAnswer: "13",
      },

      {
        question: "5 * 3?",
        choices: ["12", "15", "18", "20"],
        correctAnswer: "15",
      },
      {
        question: "10 / 2?",
        choices: ["2", "3", "4", "5"],
        correctAnswer: "5",
      },
      {
        question: "12 - 7?",
        choices: ["3", "5", "6", "7"],
        correctAnswer: "5",
      },
    ];

    const moreQuestions = Array.from(
      { length: 16 },
      () => initialQuestions
    ).flat();
    shuffleArray(moreQuestions);

    setQuestions(initialQuestions.concat(moreQuestions));

    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) return prevTimer - 1;
        else return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0 || lives === 0) {
      setIsGameOver(true);
    }
  }, [timer, lives]);

  useEffect(() => {
    if (isGameOver && !scoreAddedToLeaderboard) {
      addDoc(collection(db, "leaderboards"), {
        userId: auth.currentUser.uid,
        score: score,
        category: "Quiz Game",
      });
      setScoreAddedToLeaderboard(true);
    }
  }, [isGameOver, score, scoreAddedToLeaderboard]);

  const handleAnswer = (choice, correctAnswer) => {
    if (choice === correctAnswer) {
      setScore((prevScore) => prevScore + 20);
    } else {
      setLives((prevLives) => prevLives - 1);
    }
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsGameOver(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const restartGame = () => {
    setIsGameOver(false);
    setQuestions([...questions].sort(() => Math.random() - 0.5));
    setCurrentQuestionIndex(0);
    setTimer(120);
    setLives(3);
    setScore(0);
    setScoreAddedToLeaderboard(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const renderButton = ({ item }) => (
    <TouchableOpacity
      style={styles.choiceButton}
      onPress={() => handleAnswer(item, currentQuestion.correctAnswer)}
    >
      <Text style={styles.choiceText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        source={require("../../assets/quiz.png")}
        style={{ flex: 1 }}
      >
        {isGameOver ? (
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <GameOverComponent score={score} restartGame={restartGame} />
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.timerText}>Timer: {timer}</Text>
              <View style={styles.livesContainer}>
                {Array.from(Array(lives), (e, i) => (
                  <Ionicons key={i} name="heart" size={25} color="red" />
                ))}
              </View>
            </View>

            <View style={styles.questionDiv}>
              <Text style={styles.scoreText}>Score: {score}</Text>
              {currentQuestion && (
                <Animated.View
                  style={[styles.questionContainer, { opacity: animation }]}
                >
                  <Text style={styles.questionText}>
                    {currentQuestion.question}
                  </Text>
                  <View style={styles.ballContainer}>
                    {Array.from({
                      length: parseInt(currentQuestion.correctAnswer),
                    }).map((_, index) => (
                      <Image
                        source={require("../../assets/apple.png")}
                        style={{
                          width: 62,
                          height: 80,
                          objectFit: "cover",
                          padding: 12,
                        }}
                      />
                    ))}
                  </View>
                  <View style={styles.choiceContainer}>
                    <FlatList
                      data={currentQuestion.choices}
                      renderItem={renderButton}
                      keyExtractor={(item, index) => index.toString()}
                      numColumns={2}
                    />
                  </View>
                </Animated.View>
              )}
            </View>
          </>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 12,
    borderColor: "#5BD1FF",
    backgroundColor: "#0078EB",
    padding: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
    alignSelf: "center",
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  ballContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  restartButton: {
    backgroundColor: "#0078EB",
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  restartButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  livesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  questionDiv: {
    flex: 1,
    justifyContent: "flex-end",
  },
  questionContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },
  choiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 20,
  },
  choiceButton: {
    backgroundColor: "#0078EB",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
    margin: 8,
    width: "45%",
  },
  choiceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export default QuizGame;
