export const get3DigitComma = (nValue: number): string => nValue.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
