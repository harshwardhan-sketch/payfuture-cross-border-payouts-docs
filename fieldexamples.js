/* What a valid value looks like in each country, shown as the example under each parameter on the API pages.
   Emails use example.com and IPs the documentation range (203.0.113.x), so no example points at a real person or server.
   This site has no dummy-data rules: merchants send real values. */
const FIELD_EXAMPLES = {
  India: {city: 'Mumbai', address: '12 MG Road', state: 'Maharashtra', postCode: '400001', firstName: 'Rahul', lastName: 'Sharma', email: 'rahul.sharma@example.com', phone: '9876543210', ipAddress: '203.0.113.24',
    account_number: '123456789012', account_name: 'Rahul Sharma', bank_name: 'Example Bank', bank_ifsc: 'ABCD0001234', payout_type: 'Individual'},
  Pakistan: {city: 'Karachi', address: '12 Shahrah-e-Faisal', state: 'Sindh', postCode: '75400', wallet_number: '03001234567', phone: '03001234567', account_number: 'PK36SCBL0000001123456702', account_name: 'Ali Khan', bank_code: 'PK035', firstName: 'Ali', lastName: 'Khan', ipAddress: '203.0.113.24'},
  Egypt: {city: 'Cairo', address: '15 Tahrir Street', state: 'Cairo', postCode: '11511', phone: '01012345678', wallet_number: '01012345678', account_number: '100012345678', account_name: 'Ahmed Hassan', firstName: 'Ahmed', lastName: 'Hassan', email: 'ahmed.hassan@example.com', ipAddress: '203.0.113.24'},
  Morocco: {customField2: 'iVBORw0KGgoAAAANSUhEUgAA… (the receipt image, Base64)', city: 'Casablanca', address: '12 Rue Mohammed V', state: 'Casablanca-Settat', postCode: '20000', ipAddress: '203.0.113.24', firstName: 'Youssef', lastName: 'Alaoui', phone: '0612345678', wallet_number: '0612345678', account_number: '011780000012345678901234', account_name: 'Youssef Alaoui'},
  Nigeria: {city: 'Lagos', address: '12 Awolowo Road', state: 'Lagos', postCode: '100001', firstName: 'Chinedu', lastName: 'Okafor', email: 'chinedu.okafor@example.com', phone: '08031234567', ipAddress: '203.0.113.24', account_number: '0123456789', account_name: 'Chinedu Okafor'},
  Philippines: {city: 'Quezon City', address: '12 Rizal Street', state: 'Metro Manila', postCode: '1100', firstName: 'Juan', lastName: 'Dela Cruz', email: 'juan.delacruz@example.com', phone: '09171234567', wallet_number: '09171234567', account_name: 'Juan Dela Cruz', ipAddress: '203.0.113.24'},
  Bangladesh: {city: 'Dhaka', address: '12 Gulshan Avenue', state: 'Dhaka', postCode: '1212', firstName: 'Rahim', lastName: 'Uddin', email: 'rahim.uddin@example.com', phone: '01712345678', wallet_number: '01712345678', ipAddress: '203.0.113.24'},
};
