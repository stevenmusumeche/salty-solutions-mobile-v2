import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { gray } from '../../constants/colors';
import { 
  TideDetailFieldsFragment, 
  SunDetailFieldsFragment, 
  SolunarDetailFieldsFragment 
} from '../../graphql/generated';

interface Props {
  tideData: TideDetailFieldsFragment[];
  stationName: string;
  date: Date;
  sunData: SunDetailFieldsFragment[];
  solunarData: SolunarDetailFieldsFragment[];
}

const ForecastTide: React.FC<Props> = ({ 
  tideData, 
  stationName, 
  date, 
  sunData, 
  solunarData 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Tide Chart</Text>
        <Text style={styles.placeholderSubtext}>Coming Soon</Text>
        {stationName && (
          <Text style={styles.stationText}>{stationName}</Text>
        )}
      </View>
    </View>
  );
};

export default ForecastTide;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    marginTop: 15,
  },
  placeholder: {
    height: 200,
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
    marginBottom: 8,
  },
  stationText: {
    fontSize: 12,
    color: gray[500],
    fontStyle: 'italic',
  },
});