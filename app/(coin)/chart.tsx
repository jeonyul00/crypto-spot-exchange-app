import React from "react";
import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
import Svg, { Rect, Line } from "react-native-svg";
import { useQuery } from "@tanstack/react-query";
import { fetchKlineData, KlineData } from "@/api";
import ErrorScreen from "@/components/ErrorScreen";
import LoadingScreen from "@/components/ui/Loading";

const Chart = ({ symbol }: { symbol: string }) => {
  const { width, height } = Dimensions.get("window");
  const chartHeight = height; // 화면 전체 높이를 차트 높이로 설정
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

  const maxPrice = Math.max(...data.map((item) => item.high));
  const minPrice = Math.min(...data.map((item) => item.low));

  const normalizeY = (price: number) =>
    chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.container}
    >
      <Svg width={width} height={chartHeight}>
        {data.map((item, index) => {
          const x = index * (width / data.length);
          const candleWidth = (width / data.length) * 0.6;

          const color = item.close > item.open ? "green" : "red";

          return (
            <React.Fragment key={index}>
              <Line
                x1={x + candleWidth / 2}
                x2={x + candleWidth / 2}
                y1={normalizeY(item.high)}
                y2={normalizeY(item.low)}
                stroke={color}
                strokeWidth={1}
              />
              <Rect
                x={x}
                y={normalizeY(Math.max(item.open, item.close))}
                width={candleWidth}
                height={Math.abs(
                  normalizeY(item.open) - normalizeY(item.close)
                )}
                fill={color}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </ScrollView>
  );
};

export default Chart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
