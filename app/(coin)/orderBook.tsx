import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderBookData } from "@/api";
import { useWindowDimensions } from "react-native";

const OrderBook = ({ symbol }: { symbol: string }) => {
  const [bids, setBids] = useState<string[][]>([]);
  const [asks, setAsks] = useState<string[][]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orderBook", symbol],
    queryFn: () => fetchOrderBookData(symbol),
  });

  useEffect(() => {
    if (data) {
      setBids(data.bids.slice(0, 10));
      setAsks(data.asks.slice(0, 10));
    }
  }, [data]);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth`
    );

    ws.onmessage = (event) => {
      try {
        const webSocketData = JSON.parse(event.data);
        console.log("WebSocket data:", webSocketData);

        if (Array.isArray(webSocketData.b) && Array.isArray(webSocketData.a)) {
          setBids(webSocketData.b.slice(0, 10));
          setAsks(webSocketData.a.slice(0, 10));
        } else {
          console.error("Invalid WebSocket data format:", webSocketData);
        }
      } catch (error) {
        console.error("WebSocket parsing error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  const renderOrder = ({ item }: { item: string[] }) => (
    <View style={styles.row}>
      <Text style={[styles.text, { color: "red" }]}>{item[0]}</Text>
      <Text style={[styles.text, { color: "green" }]}>{item[1]}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Error loading order book data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{symbol}</Text>
      <View style={styles.orderContainer}>
        <Text style={styles.subHeader}>매도 호가</Text>
        <FlatList
          data={asks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderOrder}
        />
      </View>
      <View style={styles.orderContainer}>
        <Text style={styles.subHeader}>매수 호가</Text>
        <FlatList
          data={bids}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderOrder}
        />
      </View>
    </View>
  );
};

export default OrderBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  orderContainer: {
    flex: 1,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  text: {
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
