import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { black, blue, gray, white } from "../constants/colors";
import { DataSite } from "../types";
import BrandButton from "../components/BrandButton";
import { useSiteSelectionContext } from "../context/SiteSelectionContext";

export default function SiteSelectorModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { actions } = useSiteSelectionContext();
  
  const sites: DataSite[] = JSON.parse(params.sites as string);
  const initialSelectedId = params.selectedId as string;
  const componentType = params.componentType as 'wind' | 'water-temp' | 'salinity';
  
  const [selectedSiteId, setSelectedSiteId] = useState(initialSelectedId);

  const handleSave = () => {
    if (selectedSiteId && componentType) {
      const selectedSite = sites.find(site => site.id === selectedSiteId);
      if (selectedSite) {
        actions.setSelectedSite(componentType, selectedSite);
      }
    }
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSiteChange = (siteId: string) => {
    setSelectedSiteId(siteId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Observation Site</Text>
          <Text style={styles.sectionDescription}>
            Select the site for real-time data observations
          </Text>
          {sites.map((site) => (
            <TouchableOpacity
              key={site.id}
              style={[
                styles.option,
                selectedSiteId === site.id && styles.selectedOption,
              ]}
              onPress={() => handleSiteChange(site.id)}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionTitle,
                    selectedSiteId === site.id && styles.selectedOptionText,
                  ]}
                >
                  {site.name}
                </Text>
              </View>
              {selectedSiteId === site.id && (
                <MaterialIcons
                  name="check-circle"
                  size={20}
                  color={blue[600]}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <BrandButton
          title="Apply Changes"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  section: {
    marginTop: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: black,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: gray[600],
    marginBottom: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: gray[400],
    marginBottom: 8,
    backgroundColor: white,
  },
  selectedOption: {
    borderColor: blue[600],
    backgroundColor: blue[100],
  },
  optionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionTitle: {
    fontSize: 16,
    color: black,
    flex: 1,
  },
  selectedOptionText: {
    color: blue[800],
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: gray[400],
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gray[400],
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: gray[700],
  },
  saveButton: {
    flex: 1,
  },
});