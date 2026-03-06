// Utility function to convert numbers to Indian currency words
// Converts numbers like 25000 to "Twenty Five Thousand Rupees Only"

const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const scales = ['', 'Thousand', 'Lakh', 'Crore'];

function convertHundreds(num: number): string {
  let result = '';

  const hundreds = Math.floor(num / 100);
  if (hundreds > 0) {
    result += ones[hundreds] + ' Hundred ';
  }

  const remainder = num % 100;
  if (remainder >= 10 && remainder < 20) {
    result += teens[remainder - 10];
  } else {
    const tenDigit = Math.floor(remainder / 10);
    const oneDigit = remainder % 10;
    if (tenDigit > 0) {
      result += tens[tenDigit] + ' ';
    }
    if (oneDigit > 0) {
      result += ones[oneDigit];
    }
  }

  return result.trim();
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  if (num < 0) return 'Negative ' + numberToWords(Math.abs(num));

  // Handle decimal points for paise
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let result = '';

  const crores = Math.floor(integerPart / 10000000);
  const lakhs = Math.floor((integerPart % 10000000) / 100000);
  const thousands = Math.floor((integerPart % 100000) / 1000);
  const remainder = integerPart % 1000;

  if (crores > 0) {
    result += convertHundreds(crores) + ' Crore ';
  }

  if (lakhs > 0) {
    result += convertHundreds(lakhs) + ' Lakh ';
  }

  if (thousands > 0) {
    result += convertHundreds(thousands) + ' Thousand ';
  }

  if (remainder > 0) {
    result += convertHundreds(remainder);
  }

  result = result.trim() + ' Rupees';

  if (decimalPart > 0) {
    result += ' and ' + convertHundreds(decimalPart) + ' Paise';
  }

  result += ' Only';

  return result;
}

// Format amount to Indian currency format (e.g., 25,00,000.00)
export function formatIndianCurrency(amount: number): string {
  const parts = amount.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '00';

  // Add commas in Indian style: 10,00,000
  const lastThree = integerPart.slice(-3);
  const remaining = integerPart.slice(0, -3);

  if (remaining === '') {
    return integerPart + '.' + decimalPart.padEnd(2, '0');
  }

  const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  return formatted + '.' + decimalPart.padEnd(2, '0');
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (10 digits for India)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[^\d]/g, ''));
}

// Validate UAN number
export function isValidUAN(uan: string): boolean {
  const uanRegex = /^[A-Z]{2}[0-9]{10}$/;
  return uanRegex.test(uan.replace(/\s/g, ''));
}

// Validate ESI number
export function isValidESI(esi: string): boolean {
  const esiRegex = /^[0-9]{17}$/;
  return esiRegex.test(esi.replace(/[^\d]/g, ''));
}

// Format date as DD/MM/YYYY
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Generate a unique payslip ID
export function generatePayslipId(employeeId: string, date: Date): string {
  const dateString = date.toISOString().split('T')[0].replace(/-/g, '');
  return `PSL-${employeeId}-${dateString}`;
}

// Sanitize file name for safe file saving
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-z0-9.]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}
