import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BannerAd, BannerAdSize, InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import * as Device from 'expo-device';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.9;
const TILE_SIZE = BOARD_SIZE / 4;

// --- AdMob Configuration ---
// Production IDs (Your specific IDs from the prompt)
const BANNER_AD_ID = 'ca-app-pub-4931252110594348/4029288282';
const INTERSTITIAL_AD_ID = 'ca-app-pub-4931252110594348/8750831610';

// Interstitial Ad Instance
const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_ID, {
  requestNonPersonalizedAdsOnly: Platform.OS === 'web',
  keywords: ['game', 'puzzle', 'fun'],
});

// --- Helper Functions ---
const getInitialTiles = () => {
  const tiles = Array.from({ length: 16 }, (_, i) => (i + 1) % 16);
  // Shuffle the tiles (Fisher-Yates)
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  // Ensure puzzle is solvable
  if (!isSolvable(tiles)) {
    return getInitialTiles();
  }
  return tiles;
};

const isSolvable = (tiles) => {
  let inversions = 0;
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) inversions++;
    }
  }
  const blankRow = Math.floor(tiles.indexOf(0) / 4);
  // For even grid, solvability depends on blank row from bottom
  return (inversions + blankRow) % 2 === 1;
};

export default function App() {
  const [tiles, setTiles] = useState(getInitialTiles());
  const [moves, setMoves] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // --- AdMob Lifecycle ---
  useEffect(() => {
    // Load initial interstitial ad
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setIsAdLoaded(true);
    });
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setIsAdLoaded(false);
      interstitial.load(); // Pre-load the next ad
    });

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  // Check for win condition
  useEffect(() => {
    const isWin = tiles.every((tile, index) => {
      if (index === tiles.length - 1) return tile === 0;
      return tile === index + 1;
    });

    if (isWin && !isGameComplete) {
      setIsGameComplete(true);
      Alert.alert('Congratulations!', `You solved the puzzle in ${moves} moves!`);
    }
  }, [tiles, moves, isGameComplete]);

  const handleTilePress = (index) => {
    if (isGameComplete) return;

    const emptyIndex = tiles.indexOf(0);
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    const isAdjacent = (Math.abs(row - emptyRow) + Math.abs(col - emptyCol)) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);
    }
  };

  const showInterstitialAndReset = () => {
    const resetGame = () => {
      setTiles(getInitialTiles());
      setMoves(0);
      setIsGameComplete(false);
    };

    if (isAdLoaded && !isInitialLoad) {
      // Show the pre-loaded ad
      interstitial.show();
      // Reset the game after the ad is closed (handled by the CLOSED event listener, but we need to reset specifically)
      // We'll use a one-time listener for the close event of THIS showing.
      const closeListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        resetGame();
        closeListener();
      });
    } else {
      // If ad isn't ready, just reset
      resetGame();
    }
    if (isInitialLoad) setIsInitialLoad(false);
  };

  const renderTile = (value, index) => {
    if (value === 0) return <View key={index} style={styles.emptyTile} />;

    return (
      <TouchableOpacity
        key={index}
        style={styles.tile}
        onPress={() => handleTilePress(index)}
        activeOpacity={0.7}
      >
        <Text style={styles.tileText}>{value}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SLIDE PUZZLE</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsLabel}>MOVES</Text>
          <Text style={styles.statsValue}>{moves}</Text>
        </View>
      </View>

      {/* Game Board */}
      <View style={styles.board}>
        {tiles.map((tile, idx) => renderTile(tile, idx))}
      </View>

      {/* New Game Button */}
      <TouchableOpacity style={styles.button} onPress={showInterstitialAndReset}>
        <Text style={styles.buttonText}>NEW GAME</Text>
      </TouchableOpacity>

      {/* Banner Ad */}
      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={BANNER_AD_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A192F', // Dark Blue
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700', // Gold
    letterSpacing: 2,
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-CondensedBlack' : 'sans-serif-condensed',
  },
  statsContainer: {
    alignItems: 'center',
    backgroundColor: '#112240',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  statsLabel: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
    letterSpacing: 1,
  },
  statsValue: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 42,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#112240',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  tile: {
    width: TILE_SIZE - 6,
    height: TILE_SIZE - 6,
    margin: 3,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  tileText: {
    fontSize: TILE_SIZE * 0.4,
    fontWeight: 'bold',
    color: '#0A192F',
  },
  emptyTile: {
    width: TILE_SIZE - 6,
    height: TILE_SIZE - 6,
    margin: 3,
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 40,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A192F',
    letterSpacing: 1,
  },
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#0A192F',
  },
});
