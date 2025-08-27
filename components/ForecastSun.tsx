import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { gray } from '../constants/colors';
import { 
  SunDetailFieldsFragment, 
  SolunarDetailFieldsFragment 
} from '../graphql/generated';

interface Props {
  sunData: SunDetailFieldsFragment[];
  date: Date;
  solunarData: SolunarDetailFieldsFragment[];
}

const ForecastSun: React.FC<Props> = ({ sunData, date, solunarData }) => {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Sun & Solunar</Text>
        <Text style={styles.placeholderSubtext}>Coming Soon</Text>
      </View>
    </View>
  );
};

export default ForecastSun;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  placeholder: {
    height: 150,
    backgroundColor: gray[100],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: gray[200],
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: gray[600],
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: gray[500],
  },
});