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

// TODO: 라우트 대신 네비게이션으로 바꾸기
// TODO: useRouter 페이지마다 선언해야되나? 프롭스로 넘길 수 있을 것 같은데 알아보기
// TODO: 탑 탭 안예쁨
// TODO: 백버튼 넣기
// TODO: 트레이드 시 메인 화면으로 넘어가면서 pop
// TODO: recoil 어디에 적용해야되냐
// TODO: url env로 숨기기
// TODO: chart 디테일하게 만들것
// TODO: 로딩화면
// TODO: 에러 화면
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
