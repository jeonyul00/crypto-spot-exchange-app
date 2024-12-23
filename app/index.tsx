import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/atom/userAtom";
import { useQuery } from "@tanstack/react-query";
import { fetchTickerPrices } from "@/api";

// main
const index = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tickerPrices"],
    queryFn: fetchTickerPrices,
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Error fetching data</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={styles.container}>
        <Text style={styles.header}>Binance Ticker Prices</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text>{item.symbol}</Text>
              <Text>{item.price}</Text>
            </View>
          )}
        />
      </View>

      <Button title="Go to Not Found" onPress={() => router.push("chart")} />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
});
