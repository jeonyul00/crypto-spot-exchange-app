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
import LoadingScreen from "@/components/ui/Loading";
import ErrorScreen from "@/components/ErrorScreen";

// TODO: 라우트 대신 네비게이션으로 바꾸기
// TODO: 백버튼 넣기
// TODO: recoil 어디에 적용해야되냐
// TODO: chart 디테일하게 만들것
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
      <TouchableOpacity
        style={styles.listItem}
        onPress={() =>
          router.push({
            pathname: "/trading",
            params: { symbol: item.symbol },
          })
        }
      >
        <Text>{item.symbol}</Text>
        <Text>{item.price}</Text>
      </TouchableOpacity>
    ),
    [router]
  );

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

  const ListEmptyComponent = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No coins found.</Text>
    </View>
  );

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <ErrorScreen />;
  }

  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredData}
        keyExtractor={(item) => item.symbol}
        renderItem={render}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
});
