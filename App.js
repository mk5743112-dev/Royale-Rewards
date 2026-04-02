import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function App() {
  const [points, setPoints] = useState(0);
  const [gameResult, setGameResult] = useState("Ready to Play?");

  // Mini Game Logic
  const playMiniGame = () => {
    const luckyNum = Math.floor(Math.random() * 10) + 1;
    setGameResult(`System chose: ${luckyNum}!`);
    setPoints(points + 20);
    Alert.alert("Game Over", `You won 20 points! Lucky Number was ${luckyNum}`);
  };

  const addPoints = (amount, task) => {
    setPoints(points + amount);
    Alert.alert("Success!", `You earned ${amount} points from ${task}`);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>ROYALE REWARDS</Text>
          <Text style={styles.subtitle}>Premium Gaming & Rewards</Text>
        </View>

        <View style={styles.meterContainer}>
           <Text style={styles.meterLabel}>YOUR BALANCE</Text>
           <Text style={styles.pointsValue}>{points}</Text>
           <Text style={styles.pointsUnit}>POINTS</Text>
        </View>

        <View style={styles.gameSection}>
          <Text style={styles.gameTitle}>🎮 MINI GAME: LUCKY NUMBER</Text>
          <Text style={styles.gameStatus}>{gameResult}</Text>
          <TouchableOpacity style={styles.playBtn} onPress={playMiniGame}>
            <Text style={styles.playBtnText}>PLAY & WIN</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.cardBtn} onPress={() => addPoints(10, "Daily Bonus")}>
            <Text style={styles.iconText}>📅</Text>
            <View style={styles.textCol}>
              <Text style={styles.cardText}>Daily Check-in</Text>
              <Text style={styles.rewardText}>+10 Points</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.cardBtn, {borderColor: '#FFD700'}]} onPress={() => addPoints(50, "Video Task")}>
            <Text style={styles.iconText}>🎬</Text>
            <View style={styles.textCol}>
              <Text style={styles.cardText}>Watch & Earn</Text>
              <Text style={styles.rewardText}>+50 Points</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.adBanner}>
          <Text style={{color: '#444', fontWeight: 'bold'}}>ADS BY GOOGLE</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000' },
  container: { alignItems: 'center', paddingBottom: 50 },
  header: { marginTop: 60, alignItems: 'center' },
  title: { fontSize: 30, color: '#FFD700', fontWeight: '900', letterSpacing: 2 },
  subtitle: { color: '#888', fontSize: 12, marginTop: 5, textTransform: 'uppercase' },
  meterContainer: {
    marginTop: 25, width: 200, height: 200, borderRadius: 100,
    borderWidth: 5, borderColor: '#FFD700', backgroundColor: '#0a0a0a',
    justifyContent: 'center', alignItems: 'center', elevation: 20,
  },
  meterLabel: { color: '#666', fontSize: 12, fontWeight: 'bold' },
  pointsValue: { fontSize: 50, color: '#fff', fontWeight: 'bold' },
  pointsUnit: { color: '#4CAF50', fontSize: 14, fontWeight: 'bold' },
  gameSection: { backgroundColor: '#111', width: '90%', marginTop: 30, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  gameTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  gameStatus: { color: '#FFD700', fontSize: 18, marginBottom: 15 },
  playBtn: { backgroundColor: '#FFD700', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 10 },
  playBtnText: { color: '#000', fontWeight: 'bold' },
  buttonArea: { width: '100%', paddingHorizontal: 20, marginTop: 30 },
  cardBtn: { flexDirection: 'row', backgroundColor: '#111', padding: 18, borderRadius: 15, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  iconText: { fontSize: 30, marginRight: 20 },
  textCol: { flex: 1 },
  cardText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  rewardText: { color: '#FFD700', fontSize: 13, fontWeight: 'bold' },
  adBanner: { marginTop: 30, width: '90%', height: 50, backgroundColor: '#0a0a0a', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#333' }
});
