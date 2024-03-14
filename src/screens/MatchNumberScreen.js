import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ProgressBarAndroid,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../firebase";
import GameOverComponent from "../components/GameOverContainer";
import { Audio } from 'expo-av';


const MatchNumberScreen = () => {
  const [numbers, setNumbers] = useState([]);
  const [win, setWin] = useState(0);
  const [matchedIndexes, setMatchedIndexes] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [scoreAddedToLeaderboard, setScoreAddedToLeaderboard] = useState(false);
  const progressBarProgress = remainingTime / 60;
  const [sound, setSound] = useState();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('../../assets/match.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  const generateRandomNumbers = () => {
    const nums = [];
    for (let i = 1; i <= 10; i++) {
      nums.push(i);
      nums.push(i);
    }
    nums.sort(() => Math.random() - 0.5);
    setNumbers(nums);
    setMatchedIndexes([]);
    setSelectedIndexes([]);
    setFlippedIndexes([]);
    setRemainingTime(60 - win * 20);
    setGameOver(false);
    setScoreAddedToLeaderboard(false);
    playSound()
  };

  const handleNumberPress = (index) => {
    if (matchedIndexes.includes(index) || flippedIndexes.includes(index)) {
      return;
    }

    if (selectedIndexes.includes(index)) {
      return;
    }

    if (selectedIndexes.length === 1) {
      setFlippedIndexes([...flippedIndexes, index]);
      setSelectedIndexes([...selectedIndexes, index]);
    } else {
      setSelectedIndexes([index]);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (remainingTime > 0 && !gameOver) {
        setRemainingTime((prevTime) => prevTime - 1);
      } else {
        setGameOver(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime, gameOver]);

  useEffect(() => {
    if (selectedIndexes.length === 2) {
      const [index1, index2] = selectedIndexes;
      if (numbers[index1] === numbers[index2]) {
        setMatchedIndexes([...matchedIndexes, index1, index2]);
        setScore(score + 20);
      }
      setTimeout(() => {
        setSelectedIndexes([]);
        setFlippedIndexes([]);
      }, 1000);
    }
  }, [selectedIndexes]);

  useEffect(() => {
    if (matchedIndexes.length === numbers.length && !gameOver) {
      setWin(win + 1);
      generateRandomNumbers();
    }
  }, [matchedIndexes, gameOver]);

  useEffect(() => {
    if (gameOver && !scoreAddedToLeaderboard) {
      addDoc(collection(db, "leaderboards"), {
        userId: auth.currentUser.uid,
        score: score,
        category: "Memory Game",
      });
      setScoreAddedToLeaderboard(true);
    }
  }, [matchedIndexes, gameOver, score, scoreAddedToLeaderboard]);

  const restartGame = () => {
    generateRandomNumbers();
    setRemainingTime(60);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        source={require("../../assets/match.png")}
        style={{ flex: 1 }}
      >
        <View style={styles.game}>
          {gameOver ? (
            <GameOverComponent score={score} restartGame={restartGame} />
          ) : (
            <View style={styles.gameContainer}>
              <View style={styles.grid}>
                {numbers.map((number, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.numberButton,
                      matchedIndexes.includes(index) && styles.matched,
                      (selectedIndexes.includes(index) ||
                        flippedIndexes.includes(index)) &&
                        styles.selected,
                    ]}
                    onPress={() => handleNumberPress(index)}
                    disabled={
                      matchedIndexes.includes(index) ||
                      selectedIndexes.length === 2 ||
                      gameOver
                    }
                  >
                    <Text style={styles.numberText}>
                      {selectedIndexes.includes(index) ||
                      flippedIndexes.includes(index)
                        ? number
                        : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={{ padding: 20 }}>
                <Text style={styles.score}>Score: {score}</Text>
                <ProgressBarAndroid
                  styleAttr="Horizontal"
                  indeterminate={false}
                  progress={progressBarProgress}
                  color="#fff"
                  style={{ width: 300 }}
                />
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  game: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gameOverContainer: {
    width: "100%",
    borderWidth: 1,
    alignItems: "center",
    borderColor: "#5BD1FF",
    backgroundColor: "#0078EB",
    padding: 20,
  },
  gameOverText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  totalScore: {
    fontSize: 18,
    color: "#fff",
  },
  score: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  timer: {
    fontSize: 18,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    borderColor: "#5BD1FF",
    backgroundColor: "#0078EB",
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    margin: 20,
  },
  numberButton: {
    width: 60,
    height: 60,
    margin: 5,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  numberText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  matched: {
    backgroundColor: "#8f8",
  },
  selected: {
    backgroundColor: "#aaf",
  },
});

export default MatchNumberScreen;
