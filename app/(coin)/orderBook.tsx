import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

const OrderBook = ({ symbol }: { symbol: string }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width }}>
        {/* TODO: 실시간 호가창 데이터 추가 */}
      </View>
    </View>
  );
};

export default OrderBook;

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
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
