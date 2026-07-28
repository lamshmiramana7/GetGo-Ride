// GetGo Super-App — Seed Data & All-India Geography

export const MOCK_USER = {
  id: 'usr_001',
  name: 'Arjun Krishnamurthy',
  phone: '9876543210',
  email: 'arjun.k@gmail.com',
  avatar: null,
  rating: 4.8,
  totalRides: 47,
  memberSince: '2024-03',
  wallet: 450.00,
};

export const SAVED_ADDRESSES = [
  { id: 'addr_1', label: 'Home', icon: '🏠', address: '14, Kasturba Nagar, Adyar, Chennai - 600020', lat: 13.0067, lng: 80.2572 },
  { id: 'addr_2', label: 'Office / Tech Park', icon: '💼', address: 'Ramanujan IT City, OMR, Taramani, Chennai - 600113', lat: 12.9863, lng: 80.2432 },
  { id: 'addr_3', label: 'Parents House', icon: '🏡', address: '42, 1st Main Road, Anna Nagar West, Chennai - 600040', lat: 13.0850, lng: 80.2101 },
];

export const CHENNAI_LOCATIONS = [
  { name: 'Chennai Central Railway Station', lat: 13.0827, lng: 80.2707 },
  { name: 'T. Nagar (Pondy Bazaar), Chennai', lat: 13.0418, lng: 80.2341 },
  { name: 'Chennai International Airport (MAA)', lat: 12.9941, lng: 80.1709 },
  { name: 'Adyar Signal, Chennai', lat: 13.0067, lng: 80.2572 },
  { name: 'Velachery Bus Depot, Chennai', lat: 12.9815, lng: 80.2180 },
  { name: 'Anna Nagar Roundtana, Chennai', lat: 13.0850, lng: 80.2101 },
];

export const BUS_ROUTES = [
  { id: 'b001', operator: 'KPN Travels Volvo A/C', busType: 'AC Sleeper 2+1', departureTime: '21:30', arrivalTime: '05:30', duration: '8h 00m', fare: 850, seatsLeft: 12 },
  { id: 'b002', operator: 'SRS Travels Multi-Axle', busType: 'AC Seater 2+2', departureTime: '22:00', arrivalTime: '06:15', duration: '8h 15m', fare: 650, seatsLeft: 8 },
  { id: 'b003', operator: 'Parveen Express Gold', busType: 'Volvo AC Sleeper', departureTime: '22:45', arrivalTime: '06:30', duration: '7h 45m', fare: 950, seatsLeft: 15 },
];

// All 28 Indian States & UTs with major cities & districts
export const INDIAN_GEOGRAPHY = [
  {
    state: 'Tamil Nadu',
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 'Thanjavur', 'Pondicherry', 'Kanchipuram', 'Nagercoil', 'Dindigul', 'Karur', 'Cuddalore']
  },
  {
    state: 'Karnataka',
    cities: ['Bangalore (Bengaluru)', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Davangere', 'Bellary', 'Shimoga', 'Tumkur', 'Gulbarga']
  },
  {
    state: 'Maharashtra',
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Navi Mumbai']
  },
  {
    state: 'Telangana',
    cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam']
  },
  {
    state: 'Andhra Pradesh',
    cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Kakinada', 'Rajahmundry']
  },
  {
    state: 'Kerala',
    cities: ['Kochi (Cochin)', 'Thiruvananthapuram', 'Kozhikode (Calicut)', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur', 'Alappuzha']
  },
  {
    state: 'Delhi NCR',
    cities: ['New Delhi', 'Gurugram', 'Noida', 'Faridabad', 'Ghaziabad']
  },
  {
    state: 'Gujarat',
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar']
  },
  {
    state: 'West Bengal',
    cities: ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol', 'Kharagpur']
  },
  {
    state: 'Uttar Pradesh',
    cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj (Allahabad)', 'Meerut', 'Noida', 'Ghaziabad', 'Bareilly']
  },
  {
    state: 'Rajasthan',
    cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara']
  },
  {
    state: 'Punjab',
    cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Mohali', 'Bathinda']
  },
  {
    state: 'Madhya Pradesh',
    cities: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain']
  },
  {
    state: 'Bihar',
    cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia']
  },
  {
    state: 'Odisha',
    cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur']
  },
  {
    state: 'Assam',
    cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur']
  }
];

export const VEHICLE_CATEGORIES = [
  { id: 'bike', label: 'Bike', icon: '🏍️', capacity: 1, baseRate: 25, perKmRate: 8, description: '1 passenger · Fast & quick city ride' },
  { id: 'auto', label: 'Auto', icon: '🛺', capacity: 3, baseRate: 35, perKmRate: 13, description: '3 passengers · Eco-friendly & comfortable' },
  { id: 'car',  label: 'Sedan Car', icon: '🚗', capacity: 4, baseRate: 60, perKmRate: 18, description: '4 passengers · AC comfort sedan' },
  { id: 'van',  label: 'XL Van', icon: '🚐', capacity: 6, baseRate: 90, perKmRate: 25, description: '6 passengers · Extra luggage & space' },
];

export const MOCK_DRIVERS = [
  // BIKES
  { id: 'd001', vehicle: 'bike', vehicleNo: 'TN09 BK 4521', vehicleModel: 'Honda Activa 6G', color: 'Black', rating: 4.9, trips: 1240, perKmRate: 8, distanceKm: 0.6, name: 'Murugan Selvam', verified: true },
  { id: 'd002', vehicle: 'bike', vehicleNo: 'TN09 BK 7732', vehicleModel: 'TVS Jupiter', color: 'Blue', rating: 4.7, trips: 890, perKmRate: 7.5, distanceKm: 1.2, name: 'Karthik Rajan', verified: true },
  { id: 'd003', vehicle: 'bike', vehicleNo: 'TN04 BK 2290', vehicleModel: 'Bajaj Pulsar 150', color: 'Red', rating: 4.8, trips: 1560, perKmRate: 8.5, distanceKm: 1.8, name: 'Senthil Kumar', verified: true },

  // AUTOS
  { id: 'd007', vehicle: 'auto', vehicleNo: 'TN01 AU 1234', vehicleModel: 'Bajaj RE Auto', color: 'Yellow/Black', rating: 4.9, trips: 2100, perKmRate: 13, distanceKm: 0.8, name: 'Ramasamy V.', verified: true },
  { id: 'd008', vehicle: 'auto', vehicleNo: 'TN05 AU 5678', vehicleModel: 'Piaggio Ape City', color: 'Green', rating: 4.6, trips: 1450, perKmRate: 12, distanceKm: 1.5, name: 'Dhanush M.', verified: true },
  { id: 'd009', vehicle: 'auto', vehicleNo: 'TN09 AU 9101', vehicleModel: 'Mahindra Alfa Auto', color: 'Yellow', rating: 4.8, trips: 1820, perKmRate: 13.5, distanceKm: 2.1, name: 'Velu Swamy', verified: true },

  // CARS
  { id: 'd013', vehicle: 'car', vehicleNo: 'TN04 CR 8832', vehicleModel: 'Hyundai Dzire AC', color: 'Silver', rating: 4.9, trips: 2140, perKmRate: 18, distanceKm: 1.1, name: 'Sureshkumar A.', verified: true },
  { id: 'd014', vehicle: 'car', vehicleNo: 'TN22 CR 1190', vehicleModel: 'Honda Amaze AC', color: 'White', rating: 4.8, trips: 1560, perKmRate: 19, distanceKm: 1.9, name: 'Venkatesan G.', verified: true },
  { id: 'd015', vehicle: 'car', vehicleNo: 'TN01 CR 3347', vehicleModel: 'Toyota Etios AC', color: 'Black', rating: 4.7, trips: 1890, perKmRate: 17.5, distanceKm: 2.4, name: 'Jayaraman T.', verified: true },

  // VANS
  { id: 'd017', vehicle: 'van', vehicleNo: 'TN09 VN 2234', vehicleModel: 'Maruti Ertiga XL', color: 'Grey', rating: 4.9, trips: 980, perKmRate: 25, distanceKm: 1.4, name: 'Chandrasekaran M.', verified: true },
  { id: 'd018', vehicle: 'van', vehicleNo: 'TN07 VN 5567', vehicleModel: 'Toyota Innova Crysta', color: 'White', rating: 5.0, trips: 1340, perKmRate: 28, distanceKm: 2.2, name: 'Balamurugan R.', verified: true },
];

export const PRIVATE_BUS_CHARTERS = [
  {
    id: 'charter_12',
    name: '12-Seater Force Tempo Traveller AC',
    capacity: 12,
    type: 'Tempo Traveller',
    perKmRate: 32,
    driverAllowancePerDay: 500,
    amenities: ['AC', 'Pushback Seats', 'Music System', 'Luggage Space'],
    minKmPerDay: 250,
  },
  {
    id: 'charter_30',
    name: '30-Seater Mini Bus AC (Eicher / Tata)',
    capacity: 30,
    type: 'Mini Bus',
    perKmRate: 52,
    driverAllowancePerDay: 800,
    amenities: ['AC', 'Reclining Seats', 'TV/Audio', 'Charging Ports'],
    minKmPerDay: 300,
  },
  {
    id: 'charter_50',
    name: '50-Seater Luxury Volvo Multi-Axle AC Coach',
    capacity: 50,
    type: 'Volvo Coach',
    perKmRate: 78,
    driverAllowancePerDay: 1000,
    amenities: ['A/C Sleeper/Seater', 'Pushback Premium Seats', 'Subwoofer Audio', 'Washroom', 'USB Chargers'],
    minKmPerDay: 300,
  }
];

export const PAYMENT_METHODS = [
  { id: 'pm001', type: 'upi',  label: 'Google Pay / PhonePe (UPI)', detail: 'Instant UPI Payment', icon: '📱', default: true },
  { id: 'pm002', type: 'cod',  label: 'Cash on Delivery / Ride', detail: 'Pay cash directly to driver', icon: '💵', default: false },
  { id: 'pm003', type: 'card', label: 'Debit / Credit Card', detail: 'Visa, MasterCard, RuPay', icon: '💳', default: false },
  { id: 'pm004', type: 'wallet', label: 'GetGo Wallet', detail: '₹450.00 balance', icon: '👛', default: false },
];

export const MOCK_TRIPS = [
  {
    id: 'tr001',
    type: 'ride',
    vehicle: 'car',
    driver: { name: 'Sureshkumar A.', vehicleNo: 'TN04 CR 8832', vehicleModel: 'Hyundai Dzire AC', rating: 4.9 },
    pickup: 'Chennai Central Station',
    dropoff: 'T. Nagar, Chennai',
    distance: 7.8,
    fare: 200,
    status: 'completed',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    rating: 5,
  },
  {
    id: 'tr002',
    type: 'parcel',
    vehicle: 'bike',
    driver: { name: 'Murugan Selvam', vehicleNo: 'TN09 BK 4521', vehicleModel: 'Honda Activa 6G', rating: 4.9 },
    pickup: 'Velachery, Chennai',
    dropoff: 'Tambaram, Chennai',
    distance: 12.1,
    fare: 122,
    status: 'completed',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Cash on Delivery',
    rating: 5,
  },
];
