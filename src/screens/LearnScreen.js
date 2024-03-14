import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

export default function LearnScreen() {
  const navigation = useNavigation();
  const authUser = auth.currentUser;
  const video = useRef(null);
  const [greeting, setGreeting] = useState("");
  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState({});

  const fetchUserData = async () => {
    try {
      if (authUser) {
        const userDocRef = doc(db, "users", authUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserData(userData);
        } else {
          console.log("User document does not exist");
        }
      } else {
        console.log("User is not authenticated");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const currentTime = new Date().getHours();

    if (currentTime >= 5 && currentTime < 12) {
      setGreeting("Good morning");
    } else if (currentTime >= 12 && currentTime < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [userData]);

  const gameItem = [
    {
      image: require("../../assets/logo1.png"),
      path: "QuizGameStart",
    },
    {
      image: require("../../assets/monsterMath.png"),
      path: "TurnBasedStart",
    },
    {
      image: require("../../assets/mathyMatching.png"),
      path: "MatchNumberStart",
    },
  ];

  const renderGameItem = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      style={DashboardStyles.gameDiv}
      onPress={() => navigation.push(item.path)}
    >
      <Image source={item.image} style={DashboardStyles.gameImage} />
    </TouchableOpacity>
  );

  return (
    <>
      {userData ? (
        <SafeAreaView style={DashboardStyles.container}>
          <ImageBackground
            resizeMode="cover"
            source={require("../../assets/secondary-background.png")}
            style={{ flex: 1 }}
          >
            <View style={DashboardStyles.userInfo}>
              <View>
                <Text style={{ color: "#fff" }}>{greeting} 👋</Text>
                <Text style={DashboardStyles.userName}>
                  {`${userData.firstName} ${userData.lastName}`}
                </Text>
              </View>
              <Image
                source={{
                  uri:
                    (userData && userData.profilePicture) ||
                    "https://i.stack.imgur.com/l60Hf.png",
                }}
                style={DashboardStyles.profileImage}
              />
            </View>
            <View style={DashboardStyles.videoContainer}>
              <Video
                ref={video}
                style={DashboardStyles.video}
                source={{
                  uri: "https://firebasestorage.googleapis.com/v0/b/matwise-142e6.appspot.com/o/417182316_6763227370466551_5278646030600281179_n.mp4?alt=media&token=3c8ac514-6ebe-4602-a4ea-7aa97956361c",
                }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              />
            </View>
            <View style={DashboardStyles.gameContainerOutline}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.8)', 'transparent']}
                style={DashboardStyles.gameContainer}
              >
                <Text style={DashboardStyles.title}>Popular Games</Text>

                <FlatList
                  numColumns={3}
                  data={gameItem}
                  renderItem={renderGameItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </LinearGradient>
            </View>
          </ImageBackground>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={DashboardStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#09814A" />
        </SafeAreaView>
      )}
    </>
  );
}

const DashboardStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
    overflow: "hidden",
    borderRadius: 20,
  },
  gameContainerOutline: {
    borderRadius: 20,
    margin: 20,
  },
  gameContainer: {
    padding: 20,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  header: {
    height: 250,
    objectFit: "cover",
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: "bold",
    color: "#000",
  },
  videoContainer: {
    margin: 20,
    borderRadius: 20,
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 20,
  },
  button: {
    width: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FD8D14",
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 20,
    marginHorizontal: 20,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#469FF5",
    backgroundColor: "#0078EB",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: 12,
    padding: 20,
  },
  userName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#469FF5",
    shadowColor: "#191919",
    shadowRadius: 2,
  },
  notificationBtn: {
    width: 35,
    height: 35,
    borderRadius: 60,
    borderColor: "#707070",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameDiv: {
    width: "30%",
    height: 150,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginHorizontal: 6,
    marginBottom: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  gameImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },

  blackContainer: {
    width: "90%",
    height: 200,
    objectFit: "cover",
    backgroundColor: "#F5F7F8",
    alignSelf: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
