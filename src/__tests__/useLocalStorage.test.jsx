import { useEffect, useState } from "react";
import { render, screen } from "@testing-library/react";

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const localValue = window.localStorage.getItem(key);
      return localValue ? JSON.parse(localValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;

if (process.env.NODE_ENV === 'test') {
  describe('useLocalStorage Hook', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test('returns initial value when no stored value', () => {
      const TestComponent = () => {
        const [value] = useLocalStorage('test', 'initial');
        return <div data-testid="value">{value}</div>;
      };
      
      render(<TestComponent />);
      expect(screen.getByTestId('value')).toHaveTextContent('initial');
    });

    test('returns stored value when exists', () => {
      localStorage.setItem('test', JSON.stringify('stored'));
      
      const TestComponent = () => {
        const [value] = useLocalStorage('test', 'initial');
        return <div data-testid="value">{value}</div>;
      };
      
      render(<TestComponent />);
      expect(screen.getByTestId('value')).toHaveTextContent('stored');
    });
  });
}
