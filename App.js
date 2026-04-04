import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import mobileAds, { BannerAd, BannerAdSize, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

const BANNER_ID = 'ca-app-pub-4931252110594348/4029288282';
const INTERSTITIAL_ID = 'ca-app-pub-4931252110594348/8750831610';

const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID);

export default function App() {
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    mobileAds().initialize();
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => setLoaded(true));
    interstitial.load();
    initGame();
    return unsubscribe;
  }, []);

  const initGame = () => {
    let arr = [...Array(15).keys()].map((x) => x + 1).concat(0);
    arr.sort(() => Math.random() - 0.5);
    setTiles(arr);
    setMoves(0);
  };

  const moveTile = (index) => {
    const emptyIndex = tiles.indexOf(0);
    const validMoves = [index - 1, index + 1, index - 4, index + 4];

    if (validMoves.includes(emptyIndex)) {
      let newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);
    }
  };

  const newGame = () => {
    if (loaded) {
      interstitial.show();
      setLoaded(false);
      interstitial.load();
    }
    initGame();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puzzle Master</Text>
      <Text style={{ color: '#fff' }}>Moves: {moves}</Text>

      <View style={styles.grid}>
        {tiles.map((num, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tile, num === 0 && { backgroundColor: 'transparent' }]}
            onPress={() => moveTile(i)}
          >
            {num !== 0 && <Text style={styles.tileText}>{num}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={newGame}>
        <Text>NEW GAME</Text>
      </TouchableOpacity>

      <BannerAd unitId={BANNER_ID} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1F44', alignItems: 'center', justifyContent: 'center' },
  title: { color: 'gold', fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
  grid: { width: 300, height: 300, flexDirection: 'row', flexWrap: 'wrap' },
  tile: { width: 70, height: 70, backgroundColor: '#1E3A8A', margin: 2, justifyContent: 'center', alignItems: 'center', borderRadius: 5 },
  tileText: { color: 'gold', fontSize: 20, fontWeight: 'bold' },
  button: { marginTop: 20, backgroundColor: 'gold', padding: 15, borderRadius: 10, marginBottom: 50 }
});
