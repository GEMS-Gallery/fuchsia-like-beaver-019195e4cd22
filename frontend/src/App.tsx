import React, { useState } from 'react';
import { Button, Container, Grid, Paper, TextField, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
}));

const DisplayTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    textAlign: 'right',
    fontSize: '1.5rem',
    padding: theme.spacing(1),
  },
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperationClick = (op: string) => {
    if (firstOperand === null) {
      setFirstOperand(parseFloat(display));
      setOperation(op);
      setDisplay('0');
    } else {
      handleEqualsClick();
      setOperation(op);
    }
  };

  const handleEqualsClick = async () => {
    if (firstOperand !== null && operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, firstOperand, parseFloat(display));
        switch (result.tag) {
          case 'ok':
            setDisplay(result.value.toString());
            break;
          case 'err':
            setDisplay('Error: ' + result.value);
            break;
        }
      } catch (error) {
        setDisplay('Error');
      }
      setLoading(false);
      setFirstOperand(null);
      setOperation(null);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
  };

  const renderButton = (label: string, onClick: () => void, color: 'primary' | 'secondary' | 'success' = 'primary') => (
    <Grid item xs={3}>
      <Button variant="contained" color={color} fullWidth onClick={onClick}>
        {label}
      </Button>
    </Grid>
  );

  return (
    <Container maxWidth="xs">
      <CalculatorPaper elevation={3}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DisplayTextField
              fullWidth
              variant="outlined"
              value={display}
              InputProps={{
                readOnly: true,
                endAdornment: loading ? <CircularProgress size={20} /> : null,
              }}
            />
          </Grid>
          {renderButton('7', () => handleNumberClick('7'))}
          {renderButton('8', () => handleNumberClick('8'))}
          {renderButton('9', () => handleNumberClick('9'))}
          {renderButton('/', () => handleOperationClick('/'))}
          {renderButton('4', () => handleNumberClick('4'))}
          {renderButton('5', () => handleNumberClick('5'))}
          {renderButton('6', () => handleNumberClick('6'))}
          {renderButton('*', () => handleOperationClick('*'))}
          {renderButton('1', () => handleNumberClick('1'))}
          {renderButton('2', () => handleNumberClick('2'))}
          {renderButton('3', () => handleNumberClick('3'))}
          {renderButton('-', () => handleOperationClick('-'))}
          {renderButton('0', () => handleNumberClick('0'))}
          {renderButton('.', () => handleNumberClick('.'))}
          {renderButton('=', handleEqualsClick, 'success')}
          {renderButton('+', () => handleOperationClick('+'))}
          <Grid item xs={12}>
            <Button variant="outlined" color="secondary" fullWidth onClick={handleClear}>
              Clear
            </Button>
          </Grid>
        </Grid>
      </CalculatorPaper>
    </Container>
  );
};

export default App;