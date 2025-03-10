import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface PriceInputProps {
  price: number;
  setPrice: (val: number) => void;
}

export function PriceInput({ price, setPrice }: PriceInputProps) {
  const handlePriceChange = (text: string) => {
    // Allow only numbers & dot
    const sanitizedText = text.replace(/[^0-9.]/g, '');
    // Prevent multiple decimals
    const formattedText = sanitizedText.replace(/(\..*)\./g, '$1');
    setPrice(parseFloat(formattedText) || 0);
  };

  return (
    <View style={styles.priceContainer}>
      <Text style={[styles.priceSymbol, { color: price === 0 ? '#aaa' : '#000' }]}>$</Text>
      <TextInput
        style={[styles.priceInput, { color: price === 0 ? '#aaa' : '#000' }]}
        placeholder="0"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={price.toString()}
        onChangeText={handlePriceChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  priceSymbol: {
    color: '#000',
    fontSize: 18,
    marginRight: 5,
  },
  priceInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
});
