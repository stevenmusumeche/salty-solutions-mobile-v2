import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { blue, gray } from "@/constants/colors";

export default function ModisInfoScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>What is MODIS?</Text>
        <Text style={styles.body}>
          MODIS (Moderate Resolution Imaging Spectroradiometer) is a NASA
          satellite system with two satellites - Terra and Aqua - that orbit
          Earth daily, capturing high-resolution images of the planet&apos;s
          surface. These satellites provide fresh imagery every day, making them
          perfect for tracking changing water conditions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Why Use MODIS for Fishing?</Text>
        <Text style={styles.body}>
          Clean, clear water is where you&apos;ll find the best fishing for
          speckled trout and redfish. MODIS satellite imagery helps you identify
          these productive fishing spots by showing water clarity from space.
        </Text>
        <View style={styles.bulletContainer}>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={blue[500]}
            style={styles.bulletIcon}
          />
          <Text style={styles.bulletText}>
            Find clear water areas with high fish activity
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={blue[500]}
            style={styles.bulletIcon}
          />
          <Text style={styles.bulletText}>
            Avoid muddy, unproductive water zones
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={blue[500]}
            style={styles.bulletIcon}
          />
          <Text style={styles.bulletText}>
            Save time and fuel by targeting the right areas
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Common Questions</Text>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Why is my image all white?</Text>
          <Text style={styles.faqAnswer}>
            White areas in MODIS images can be clouds covering the water, but
            often the satellite images simply have large white areas that
            can&apos;t be avoided. This is a limitation of the satellite imagery
            itself - there&apos;s nothing the app can do about it. Try checking
            the other satellite (Terra vs Aqua) or wait for the next day&apos;s
            image.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Why do images look hazy?</Text>
          <Text style={styles.faqAnswer}>
            MODIS creates &ldquo;true color&rdquo; images by combining red,
            green, and blue light wavelengths - similar to how your eye sees.
            Atmospheric moisture, dust, or thin clouds can create a hazy
            appearance, but you can still often see water clarity patterns
            underneath.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>What do the colors mean?</Text>
          <Text style={styles.faqAnswer}>
            • <Text style={styles.colorText}>Deep blue</Text> = Clear, deep
            water (great fishing){"\n"}•{" "}
            <Text style={styles.colorText}>Light blue/turquoise</Text> = Shallow
            or sediment-rich water{"\n"}•{" "}
            <Text style={styles.colorText}>Brown/muddy</Text> = High sediment,
            poor fishing{"\n"}• <Text style={styles.colorText}>Green</Text> =
            Plankton blooms or coastal runoff
          </Text>
        </View>

        <View style={[styles.faqItem, { marginBottom: 0 }]}>
          <Text style={styles.faqQuestion}>How fresh is this data?</Text>
          <Text style={styles.faqAnswer}>
            MODIS satellites pass over your area twice daily (morning and
            afternoon). You can see the exact date and how many days ago each
            image was taken right on the satellite screen. Images are typically
            from yesterday or today, giving you near real-time water conditions
            for planning your fishing trip.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Pro Tips</Text>
        <View style={styles.bulletContainer}>
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={16}
            color={gray[600]}
            style={styles.bulletIcon}
          />
          <Text style={styles.bulletText}>
            Compare multiple days to see water movement patterns
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={16}
            color={gray[600]}
            style={styles.bulletIcon}
          />
          <Text style={styles.bulletText}>
            Look for color boundaries - these edges often hold fish
          </Text>
        </View>
        <View style={styles.bulletContainer}>
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={16}
            color={gray[600]}
            style={styles.bulletIcon}
          />
          <Text style={styles.bulletText}>
            Check both Terra (morning) and Aqua (afternoon) satellites
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          MODIS data courtesy of NASA&apos;s Terra and Aqua satellites
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: gray[900],
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: gray[700],
    marginBottom: 10,
  },
  bulletContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingLeft: 10,
  },
  bulletIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 22,
    color: gray[700],
    flex: 1,
  },
  faqItem: {
    marginBottom: 20,
    paddingBottom: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: gray[900],
  },
  faqAnswer: {
    fontSize: 15,
    lineHeight: 22,
    color: gray[700],
  },
  colorText: {
    fontWeight: "500",
  },
  footer: {
    marginTop: 20,
    marginBottom: 60,
    // paddingTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: gray[500],
    textAlign: "center",
    fontStyle: "italic",
  },
});
