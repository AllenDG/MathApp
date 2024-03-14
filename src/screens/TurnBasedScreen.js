import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ProgressBarAndroid,
  Alert,
  ImageBackground,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import { auth, db } from "../../firebase";
import GameOverComponent from "../components/GameOverContainer";
import { Audio } from "expo-av";

const bosses = [
  {
    name: "Addition",
    health: 100,
    points: 20,
    bossImage: require("../../assets/addition-animation.json"),
    difficulty: "easy",
    operation: "+",
  },
  {
    name: "Subtraction",
    health: 100,
    points: 40,
    bossImage: require("../../assets/Animation - 1709478763998.json"),
    difficulty: "medium",
    operation: "-",
  },
];

const generateQuestion = (boss) => {
  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  let num1, num2, answer;
  do {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
    switch (boss.difficulty) {
      case "easy":
        answer = num1 + num2;
        break;
      case "medium":
        answer = num1 - num2;
        break;
      default:
        answer = 0;
    }
  } while (answer < 0);

  const possibleAnswers = [answer - 1, answer, answer + 1];
  const shuffledAnswers = shuffle(possibleAnswers);

  return { num1, num2, answer, possibleAnswers: shuffledAnswers };
};

export default function TurnBasedScreen() {
  const animation = useRef(null);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [boss, setBoss] = useState(bosses[0]);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(generateQuestion(boss));
  const [sound, setSound] = useState();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft === 0) {
      setGameOver(true);
      Alert.alert("Time's up!");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/monster.mp3")
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
    setQuestion(generateQuestion(boss));
  }, []);

  const checkAnswer = (userAnswer) => {
    if (userAnswer === question.answer) {
      setBoss({ ...boss, health: boss.health - 20 });
      setMessage(`Correct! Boss takes damage.`);
    } else {
      setPlayerHealth(playerHealth - 20);
      setMessage(`Incorrect! You take damage.`);
    }
    setQuestion(generateQuestion(boss));
  };

  useEffect(() => {
    if (playerHealth <= 0 && lives > 0) {
      setLives(lives - 1);
      setPlayerHealth(100);
      setBoss(bosses[Math.floor(Math.random() * bosses.length)]);
    } else if (timeLeft <= 0 || (playerHealth <= 0 && lives <= 0)) {
      setGameOver(true);
      console.log("tite");
      addDoc(collection(db, "leaderboards"), {
        userId: auth.currentUser.uid,
        score: score,
        category: "Combat Based",
      });
    } else if (boss.health <= 0) {
      setScore(score + boss.points);
      Alert.alert(`You win against ${boss.name}`);
      setBoss(bosses[Math.floor(Math.random() * bosses.length)]);
    }
  }, [timeLeft, playerHealth, boss.health, lives, score]);

  const resetGame = () => {
    setPlayerHealth(100);
    setBoss(bosses[0]);
    setMessage("");
    setGameOver(false);
    setLives(3);
    setScore(0);
    setQuestion(generateQuestion(boss));
  };

  useEffect(() => {
    const playAnimationWithDelay = () => {
      setTimeout(() => {
        animation.current.reset();
        animation.current.play();
      }, 2000);
    };
    playAnimationWithDelay();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        source={require("../../assets/secondary-background.png")}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <View style={{ width: "60%" }}>
            <Text style={styles.title}>Player Health:</Text>
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={playerHealth / 100}
              style={{ width: "80%", marginTop: 10, color: "red" }}
            />
          </View>
          <View style={styles.livesContainer}>
            {Array.from(Array(lives), (e, i) => (
              <Ionicons key={i} name="heart" size={25} color="red" />
            ))}
          </View>
        </View>
        <Text
          style={{
            marginTop: 20,
            fontSize: 20,
            alignSelf: "center",
          }}
        >
          Score: {score}
        </Text>
        <Text style={{ fontSize: 20, alignSelf: "center" }}>
          Time Left: {timeLeft}
        </Text>
        <View style={styles.gameContainer}>
          <Text>{message}</Text>
          <LottieView
            ref={animation}
            style={{
              width: 200,
              height: 200,
            }}
            source={boss.bossImage}
          />
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={boss.health / 100}
            style={{ width: "100%", marginTop: 20, color: "red" }}
            size="large"
          />
          {gameOver ? (
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <GameOverComponent score={score} restartGame={resetGame} />
            </View>
          ) : (
            <View>
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>
                  {question.num1} {boss.operation} {question.num2} = ?
                </Text>
              </View>
              <View style={styles.answerContainer}>
                {question.possibleAnswers.map((answer) => (
                  <TouchableOpacity
                    key={answer}
                    onPress={() => checkAnswer(answer)}
                    style={styles.answerButton}
                  >
                    <Text style={styles.buttonText}>{answer}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  livesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  gameContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  questionContainer: {
    marginTop: 20,
  },
  questionText: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  answerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 20,
    marginTop: 50,
  },
  answerButton: {
    backgroundColor: "#0078EB",
    padding: 10,
    borderRadius: 10,
    width: 80,
    height: 60,
    alignItems: "center",
  },
  button: {
    width: "100vw",
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 30,
  },
});
