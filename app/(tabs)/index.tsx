import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [ticker, setTicker] = useState('');
  
  const [macdLine, setMacdLine] = useState([]);
  const [signalLine, setSignalLine] = useState([]);
  const [histogram, setHistogram] = useState([]);

  const [lineMax, setLineMax] = useState(0);
  const [lineMin, setLineMin] = useState(0);
  const [barMax, setBarMax] = useState(0);
  const [barMin, setBarMin] = useState(0);

  // THE FIX: Increased the subtraction from 80 to 130 to perfectly account for 
  // the app padding, the card padding, AND the Y-Axis numbers.
  const chartWidth = Math.min(Dimensions.get('window').width - 130, 800); 

  useEffect(() => {
    fetch('http://3.131.128.17:3000/technical-analysis/macd/AAPL.BA')
      .then((response) => response.json())
      .then((data) => {
        setTicker(data.ticker);

        const formattedMacdLine = data.data.map((item: any) => ({
          value: item.macdLine,
          label: item.date.substring(5, 10), 
        }));
        
        const formattedSignalLine = data.data.map((item: any) => ({
          value: item.signalLine,
        }));

        const formattedHistogram = data.data.map((item: any) => ({
          value: item.histogram,
          frontColor: item.histogram >= 0 ? '#26a69a' : '#ef5350', 
        }));
        
        // 1. Line Chart Math
        const allLineVals = data.data.flatMap((item: any) => [item.macdLine, item.signalLine]);
        const absoluteMaxLine = Math.max(...allLineVals.map(Math.abs));
        const lineBoundary = absoluteMaxLine + (absoluteMaxLine * 0.1); 

        setLineMax(lineBoundary); 
        setLineMin(-lineBoundary); 

        // 2. Bar Chart Math
        const allBarVals = data.data.map((item: any) => item.histogram);
        const absoluteMaxBar = Math.max(...allBarVals.map(Math.abs));
        const barBoundary = absoluteMaxBar + (absoluteMaxBar * 0.1);

        setBarMax(barBoundary);
        setBarMin(-barBoundary);

        setMacdLine(formattedMacdLine);
        setSignalLine(formattedSignalLine);
        setHistogram(formattedHistogram);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2979FF" />
        <Text style={styles.loadingText}>Analyzing Market Data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{ticker} - MACD</Text>
        <Text style={styles.subtitle}>Moving Average Convergence Divergence</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.chartTitle}>MACD & Signal Lines</Text>
        <View style={styles.legend}>
           <View style={[styles.legendDot, { backgroundColor: '#2979FF' }]} /><Text style={styles.legendText}>MACD</Text>
           <View style={[styles.legendDot, { backgroundColor: '#FFA000', marginLeft: 15 }]} /><Text style={styles.legendText}>Signal</Text>
        </View>
        <LineChart
          data={macdLine}
          data2={signalLine}
          width={chartWidth}
          height={120} 
          spacing={45}
          initialSpacing={20}
          endSpacing={30}    // <-- NEW: Adds a nice visual buffer to the right of the last point
          scrollToEnd={true} // <-- NEW: Automatically pans to the newest data on load!
          maxValue={lineMax}          
          mostNegativeValue={lineMin} 
          noOfSections={3} 
          yAxisLabelWidth={40} // <-- THE FIX: Explicitly reserves 40px for the text
          color1="#2979FF" 
          color2="#FFA000" 
          dataPointsColor1="#2979FF"
          dataPointsColor2="#FFA000"
          thickness1={3}
          thickness2={3}
          hideRules
          yAxisTextStyle={{ color: '#888', fontSize: 10 }}
          xAxisLabelTextStyle={{ color: '#888', fontSize: 10 }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.chartTitle}>MACD Histogram</Text>
        <Text style={styles.subtitle}>Momentum Indicator</Text>
        <View style={{ marginTop: 20 }}>
          <BarChart
            data={histogram}
            width={chartWidth}
            height={80} 
            barWidth={12}
            spacing={45}
            initialSpacing={20}
            endSpacing={30}    // <-- NEW: Must match the LineChart!
            scrollToEnd={true} // <-- NEW: Must match the LineChart!
            maxValue={barMax}          
            mostNegativeValue={barMin} 
            yAxisLabelWidth={40} // <-- THE FIX: Matches the LineChart above
            roundedTop
            roundedBottom
            hideRules
            xAxisThickness={1}
            yAxisThickness={0}
            yAxisTextStyle={{ color: '#888', fontSize: 10 }}
            noOfSections={3}
          />
        </View>
      </View>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
  header: {
    marginTop: 40,
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  chartTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: '#ccc',
    fontSize: 12,
  },
});