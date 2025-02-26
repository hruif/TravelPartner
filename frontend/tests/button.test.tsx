import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('Basic Hello World Test', () => {
    it('renders Hello, World! text', () => {
        const { getByText } = render(<Text>Hello, World!</Text>);
        expect(getByText('Hello, World!')).toBeTruthy();
    });
});
