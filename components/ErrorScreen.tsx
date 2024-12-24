import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorMessage}>
        {message || "에러가 발생했습니다."}
      </Text>
      {onRetry && (
        <Button title="다시 시도" onPress={onRetry} color="#ff0000" />
      )}
    </View>
  );
};

export default ErrorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  errorMessage: {
    marginBottom: 16,
    fontSize: 18,
    color: "#ff0000",
    textAlign: "center",
  },
});
