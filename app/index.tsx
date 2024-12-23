import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchTickerPrices, TickerPrice } from "@/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const index = () => {
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tickerPrices"],
    queryFn: fetchTickerPrices,
  });

  const render = React.useCallback(
    ({ item }: { item: TickerPrice }) => (
      <TouchableOpacity style={styles.listItem}>
        <Text>{item.symbol}</Text>
        <Text>{item.price}</Text>
      </TouchableOpacity>
    ),
    [router]
  );

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // TODO: 로딩화면
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // TODO: 에러 화면
  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Error fetching data</Text>
      </View>
    );
  }
  const ListHeaderComponent = (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>Coin List</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search coins"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredData}
        keyExtractor={(item) => item.symbol}
        renderItem={render}
        ListHeaderComponent={ListHeaderComponent}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    marginBottom: 16,
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
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    alignSelf: "stretch",
  },
});
