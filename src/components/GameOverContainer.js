import { View, Text, StyleSheet } from "react-native";
import Button from "./button/Button";

const GameOverComponent = ({ score, restartGame }) => {
  return (
    <View style={styles.gameOverContainer}>
      <Text style={styles.gameOverText}>Game Over!</Text>
      <Text style={styles.totalScore}>Total Score: {score}</Text>
      <Button title="Restart Game" variant="secondary" onPress={restartGame} />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default GameOverComponent;
