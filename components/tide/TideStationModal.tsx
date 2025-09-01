import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { black, blue, gray, white } from "../../constants/colors";
import { DataSite, useTideContext } from "../../context/TideContext";
import BrandButton from "../BrandButton";

interface TideStationModalProps {
  visible: boolean;
  onClose: () => void;
}

const TideStationModal: React.FC<TideStationModalProps> = ({
  visible,
  onClose,
}) => {
  const { selectedTideStation, tideStations, selectedSite, sites, actions } =
    useTideContext();

  const [selectedTideStationId, setSelectedTideStationId] = useState(
    selectedTideStation?.id || ""
  );
  const [selectedDataSite, setSelectedDataSite] = useState<
    DataSite | undefined
  >(selectedSite);

  const handleSave = () => {
    if (selectedTideStationId) {
      actions.setSelectedTideStationId(selectedTideStationId);
    }
    if (selectedDataSite) {
      actions.setSelectedSite(selectedDataSite);
    }
    onClose();
  };

  const handleCancel = () => {
    // Reset to current selections
    setSelectedTideStationId(selectedTideStation?.id || "");
    setSelectedDataSite(selectedSite);
    onClose();
  };

  const handleTideStationChange = (stationId: string) => {
    setSelectedTideStationId(stationId);
  };

  const handleSiteChange = (siteId: string) => {
    const site = sites.find((s) => s.id === siteId);
    if (site) {
      setSelectedDataSite(site);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Change Tide Stations</Text>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={gray[600]} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tide Prediction Station</Text>
            <Text style={styles.sectionDescription}>
              Select the station used for tide predictions
            </Text>
            {tideStations.map((station) => (
              <TouchableOpacity
                key={station.id}
                style={[
                  styles.option,
                  selectedTideStationId === station.id && styles.selectedOption,
                ]}
                onPress={() => handleTideStationChange(station.id)}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionTitle,
                      selectedTideStationId === station.id &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {station.name}
                  </Text>
                </View>
                {selectedTideStationId === station.id && (
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color={blue[600]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Observation Station</Text>
            <Text style={styles.sectionDescription}>
              Select the station used for real-time water level observations
            </Text>
            {sites.map((site) => (
              <TouchableOpacity
                key={site.id}
                style={[
                  styles.option,
                  selectedDataSite?.id === site.id && styles.selectedOption,
                ]}
                onPress={() => handleSiteChange(site.id)}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionTitle,
                      selectedDataSite?.id === site.id &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {site.name}
                  </Text>
                </View>
                {selectedDataSite?.id === site.id && (
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: gray[200],
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: black,
  },
  closeButton: {
    padding: 8,
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

export default TideStationModal;
