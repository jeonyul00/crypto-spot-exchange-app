import React from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import Chart from "./chart";
import OrderBook from "./orderBook";
import { useLocalSearchParams, useNavigation } from "expo-router";

const TradingScreen = () => {
  const { symbol } = useLocalSearchParams() as { symbol: string };
  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Chart" },
    { key: "second", title: "Order Book" },
  ]);

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

  React.useEffect(() => {
    const title = routes[index].title;
    navigation.setOptions({ headerTitle: title });
  }, [index, navigation]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
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
