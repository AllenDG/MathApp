import React, { useEffect, useState } from 'react';
import { Text, FlatList, TouchableOpacity, Alert, View, StyleSheet, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db } from '../../firebase'; 

export default function Leaderboards() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Quiz Game');

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const q = query(collection(db, "leaderboards"), where("category", "==", category));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        data.sort((a, b) => b.score - a.score);
        const top20Data = data.slice(0, 20);
        setLeaderboardData(top20Data);
      } catch (error) {
        console.error("Error fetching leaderboard data: ", error);
      }
    };

    fetchLeaderboardData();
  }, [category]);

  useEffect(() => {
    const fetchUserData = async (id) => {
      try {
        const userDocRef = doc(db, 'users', id);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserData(prevState => ({
            ...prevState,
            [id]: userData
          }));
        } else {
          Alert.alert('User document does not exist');
        }
      } catch (error) {
        Alert.alert('Error fetching user data:', error);
      } finally {
        setLoading(false); 
      }
    };

    leaderboardData.forEach(item => {
      fetchUserData(item.userId);
    });
  }, [leaderboardData]);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        resizeMode="cover"
        source={require('../../assets/leaderboards.gif')}
        style={styles.header}
      >
        <Text style={styles.headerText}>Leaderboards</Text>
      </ImageBackground>
      <View style={styles.categories}>
          <TouchableOpacity onPress={() => handleCategoryChange('Quiz Game')}>
            <Text style={category === 'Quiz Game' ? styles.selectedCategory : styles.category}>Quiz Game</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCategoryChange('Combat Based')}>
            <Text style={category === 'Combat Based' ? styles.selectedCategory : styles.category}>Combat Based</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleCategoryChange('Memory Game')}>
            <Text style={category === 'Memory Game' ? styles.selectedCategory : styles.category}>Memory Game</Text>
          </TouchableOpacity>
        </View>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Rank</Text>
        <Text style={styles.headerCell}>Profile</Text>

        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Score</Text>
      </View>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <View style={styles.tableCell}>
              <Image
                source={{
                  uri:
                    (userData[item.userId]?.profilePicture) ||
                    "https://i.stack.imgur.com/l60Hf.png",
                }}
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.tableCell}>{userData[item.userId]?.firstName} {userData[item.userId]?.lastName}</Text>
            <Text style={styles.tableCell}>{item.score}</Text>
          </View>        
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 200,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  categories: {
    marginVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  category: {
    marginRight: 10,
    fontSize: 16,
    color: 'gray',
  },
  selectedCategory: {
    marginRight: 10,
    fontSize: 16,
    color: 'orange',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 30, 
    shadowColor: "#191919",
    shadowRadius: 2,
  },
});
