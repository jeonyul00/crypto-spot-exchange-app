import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

const Trade = () => {
  const { symbol, purpose, price } = useLocalSearchParams() as {
    symbol: string;
    purpose: "buy" | "sell";
    price: string;
  };

  const [quantity, setQuantity] = useState<string>("");

  const totalAmount = () => {
    const qty = Number(quantity);
    const selectedPrice = Number(price);
    return isNaN(qty) || isNaN(selectedPrice) ? 0 : qty * selectedPrice;
  };

  const handleTrade = () => {
    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert("유효한 수량을 입력하세요.");
      return;
    }

    Alert.alert(
      `${purpose === "buy" ? "구매" : "판매"} 확인`,
      `총 금액: ${totalAmount().toFixed(2)}\n${qty}개 ${
        purpose === "buy" ? "구매" : "판매"
      }하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "확인",
          onPress: () => {
            Alert.alert(
              "완료",
              `${qty}개 ${purpose === "buy" ? "구매" : "판매"}되었습니다.`
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {symbol} {purpose === "buy" ? "구매" : "판매"}
      </Text>
      <Text style={styles.info}>선택된 가격: {price}</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>수량:</Text>
        <TextInput
          style={styles.input}
          placeholder="수량 입력"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>
      <Text style={styles.totalAmount}>
        총 금액: {totalAmount().toFixed(2)}
      </Text>
      <TouchableOpacity style={styles.confirmButton} onPress={handleTrade}>
        <Text style={styles.confirmButtonText}>
          {purpose === "buy" ? "구매하기" : "판매하기"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Trade;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  info: {
    fontSize: 18,
    marginBottom: 16,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "blue",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
