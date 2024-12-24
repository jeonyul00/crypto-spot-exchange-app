import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchOrderBookData } from "@/api";
import { useRouter } from "expo-router";
import { useDebounce } from "@/hooks/useDebounce";
import { useRecoilState } from "recoil";

import LoadingScreen from "@/components/ui/Loading";
import ErrorScreen from "@/components/ErrorScreen";
import { priceState, purposeState } from "@/atom";

const OrderBook = ({ symbol }: { symbol: string }) => {
  const [bids, setBids] = useState<string[][]>([]);
  const [asks, setAsks] = useState<string[][]>([]);
  const [purpose, setPurpose] = useRecoilState(purposeState);
  const [price, setPrice] = useRecoilState(priceState);
  const { debounce } = useDebounce(500);

  const router = useRouter();

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

        if (Array.isArray(webSocketData.b) && Array.isArray(webSocketData.a)) {
          setBids(webSocketData.b.slice(0, 10));
          setAsks(webSocketData.a.slice(0, 10));
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

  const handleSelect = (type: "buy" | "sell", selectedPrice: string) => {
    setPurpose(type);
    setPrice(selectedPrice);

    debounce(() => {
      router.push("/trade");
    });
  };

  const renderOrder =
    (type: "buy" | "sell") =>
    ({ item }: { item: string[] }) =>
      (
        <TouchableOpacity onPress={() => handleSelect(type, item[0])}>
          <View style={styles.row}>
            <Text
              style={[
                styles.text,
                type === "sell" ? { color: "red" } : { color: "green" },
              ]}
            >
              {item[0]}
            </Text>
            <Text style={styles.text}>{item[1]}</Text>
          </View>
        </TouchableOpacity>
      );

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <ErrorScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{symbol}</Text>
      <View style={styles.orderContainer}>
        <Text style={styles.subHeader}>매도 호가</Text>
        <FlatList
          data={asks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderOrder("sell")}
        />
      </View>
      <View style={styles.orderContainer}>
        <Text style={styles.subHeader}>매수 호가</Text>
        <FlatList
          data={bids}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderOrder("buy")}
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
