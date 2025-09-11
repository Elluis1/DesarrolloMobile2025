import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  searchRow: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  centered: {
    padding: 24,
    alignItems: "center",
  },
  hint: {
    marginTop: 8,
    color: "#666",
  },
  errorText: {
    color: "#a00",
    fontWeight: "700",
  },
  item: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    paddingHorizontal: 16,
  },
  itemText: {
    fontSize: 16,
    textTransform: "capitalize",
  },
  flatEmpty: {
    flex: 1,
  },
});
