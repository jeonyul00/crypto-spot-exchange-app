import React, { useState, useCallback } from "react";
import { StyleSheet, View, useWindowDimensions, Text } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Chart from "./chart";
import OrderBook from "./orderBook";
import { useLocalSearchParams } from "expo-router";
import type { SceneRendererProps } from "react-native-tab-view";

const TradingScreen = () => {
  const { symbol } = useLocalSearchParams() as { symbol: string };
  const insets = useSafeAreaInsets();
  const FirstRoute = () => (
    <View style={{ flex: 1 }}>
      <Chart symbol={symbol} />
    </View>
  );

  const SecondRoute = () => (
    <View style={{ flex: 1 }}>
      <OrderBook symbol={symbol} />
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "chart" },
    { key: "second", title: "order book" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      style={{ paddingTop: insets.top }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "blue", height: 1 }}
          style={{ backgroundColor: "#fff" }}
          activeColor="blue"
          inactiveColor="gray"
        />
      )}
    />
  );
};

export default TradingScreen;

const styles = StyleSheet.create({});
