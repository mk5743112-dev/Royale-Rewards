import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import mobileAds, { BannerAd, BannerAdSize, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

const BANNER_ID = 'ca-app-pub-4931252110594348/4029288282';
const INTERSTITIAL_ID = 'ca-app-pub-4931252110594348/8750831610';

const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID);

const SIZE = 4;

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
    let arr = [...Array(15).keys()].map(x => x + 1);
    arr.push(0);
    shuffle(arr);
    setTiles(arr);
    setMoves(0);
  };

  const shuffle = (array) => {
    for (let i = 0; i < 100; i++) {
      const empty = array.indexOf(0);
      const moves = getValidMoves(empty);
      const rand = moves[Math.floor(Math.random() * moves.length)];
      [array[empty], array[rand]] = [array[rand], array[empty]];
    }
  };

  const getValidMoves = (index) => {
    const moves = [];
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;

    if (row > 0) moves.push(index - SIZE);
    if (row < SIZE - 1) moves.push(index + SIZE);
    if (col > 0
