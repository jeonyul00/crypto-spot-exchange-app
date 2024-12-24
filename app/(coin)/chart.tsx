import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchKlineData, KlineData } from "@/api";
import { CartesianChart, Line } from "victory-native";

// TODO: chart 디테일하게 만들것
const Chart = ({ symbol }: { symbol: string }) => {
  const { width } = useWindowDimensions();
  const { data, isLoading, isError } = useQuery<KlineData[]>({
    queryKey: ["klineData", symbol],
    queryFn: () => fetchKlineData(symbol),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text>Error loading chart data.</Text>
      </View>
    );
  }

  const chartData = data.map((item, index) => ({
    x: index,
    y: item.close,
  }));

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width }}>
        <CartesianChart data={chartData} xKey="x" yKeys={["y"]}>
          {({ points }) => (
            <Line points={points.y} color="blue" strokeWidth={2} />
          )}
        </CartesianChart>
      </View>
    </View>
  );
};

export default Chart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
