import { ScrollView, StyleSheet, Text, View } from "react-native";

import { mockDeriveQuestionResponse } from "@derive/api-contracts";
import { anonymousAccessPolicy, describeAuthMode } from "@derive/auth";
import { appName } from "@derive/config";
import { inactiveGeoRegionHint } from "@derive/geo";
import { redactQuestionPreview } from "@derive/privacy";

export default function MobileApp() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Mobile channel</Text>
        <Text style={styles.title}>{appName} mobile</Text>
        <Text style={styles.body}>
          Mobile is reserved for quick question capture and lightweight answer review while desktop and web carry the
          primary derivation flow.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Question preview</Text>
        <Text style={styles.body}>
          {redactQuestionPreview(mockDeriveQuestionResponse.receivedQuestion.text)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Current posture</Text>
        <Text style={styles.body}>{describeAuthMode(anonymousAccessPolicy.authMode)}</Text>
        <Text style={styles.subtle}>{inactiveGeoRegionHint.note}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    minHeight: "100%",
    padding: 24,
    gap: 18,
    backgroundColor: "#f6f1e8"
  },
  hero: {
    gap: 10
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#0b6a88"
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#0f1720"
  },
  card: {
    gap: 10,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.85)"
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f1720"
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#18212c"
  },
  subtle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#5b6775"
  }
});
