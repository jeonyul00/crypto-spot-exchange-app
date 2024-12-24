import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchKlineData, KlineData } from "@/api";
import { CartesianChart, Line } from "victory-native";
import ErrorScreen from "@/components/ErrorScreen";
import LoadingScreen from "@/components/ui/Loading";

const Chart = ({ symbol }: { symbol: string }) => {
  const { width } = useWindowDimensions();
  const { data, isLoading, isError } = useQuery<KlineData[]>({
    queryKey: ["klineData", symbol],
    queryFn: () => fetchKlineData(symbol),
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError || !data) {
    return <ErrorScreen />;
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
