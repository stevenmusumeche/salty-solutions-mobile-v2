import { white } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function CloseButton() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <MaterialIcons name="close" size={24} color={white} />
    </TouchableOpacity>
  );
}
