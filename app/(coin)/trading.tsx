import React, { useState, useCallback } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Chart from "./chart";
import OrderBook from "./orderBook";
import { useLocalSearchParams } from "expo-router";

const routes = [
  { key: "chart", title: "차트" },
  { key: "orderBook", title: "호가창" },
];

const TradingScreen = () => {
  const { symbol } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [selectedScreen, setSelectedScreen] = useState("chart");

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
    setSelectedScreen(routes[newIndex].key);
  };

  const renderScene = useCallback(() => {
    switch (selectedScreen) {
      case "chart":
        return <Chart symbol={symbol as string} />;
      case "orderBook":
        return <OrderBook symbol={symbol as string} />;
      default:
        return null;
    }
  }, [selectedScreen, symbol]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "blue", height: 3 }}
      style={{ backgroundColor: "#fff" }}
      labelStyle={{ fontSize: 14, fontWeight: "bold" }}
      activeColor="blue"
      inactiveColor="gray"
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        animationEnabled={false}
      />
    </View>
  );
};

export default TradingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
