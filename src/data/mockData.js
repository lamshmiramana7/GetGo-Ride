// GetGo Ride — Mock/Seed Data (Chennai-centric, Tamil Nadu pilot market)

export const MOCK_USER = {
  id: 'usr_001',
  name: 'Arjun Krishnamurthy',
  phone: '+91 98765 43210',
  email: 'arjun.k@gmail.com',
  avatar: null,
  rating: 4.8,
  totalRides: 47,
  memberSince: '2024-03',
  wallet: 450.00,
};

// Chennai city center coordinates
const CHENNAI = { lat: 13.0827, lng: 80.2707 };

function nearby(lat, lng, radiusKm = 5) {
  const r = radiusKm / 111;
  return {
    lat: lat + (Math.random() - 0.5) * 2 * r,
    lng: lng + (Math.random() - 0.5) * 2 * r,
  };
}

export const VEHICLE_CATEGORIES = [
  { id: 'bike', label: 'Bike', icon: '🏍️', image: 'assets/bike.png', capacity: 1, baseRate: 8, description: '1 passenger · Fast & quick' },
  { id: 'auto', label: 'Auto', icon: '🛺', image: 'assets/auto.png', capacity: 3, baseRate: 12, description: '3 passengers · Eco friendly' },
  { id: 'car',  label: 'Car',  icon: '🚗', image: 'assets/car.png',  capacity: 4, baseRate: 18, description: '4 passengers · AC comfort' },
  { id: 'van',  label: 'Van',  icon: '🚐', image: 'assets/van.png',  capacity: 5, baseRate: 24, description: '5 passengers · Extra space' },
];

// Rate band: base ±15%/+25% per GetGo Partner policy
function rateInBand(base) {
  const min = base * 0.85;
  const max = base * 1.25;
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

export const MOCK_DRIVERS = [
  // BIKES (6)
  { id: 'd001', vehicle: 'bike', vehicleNo: 'TN09 BK 4521', vehicleModel: 'Honda Activa', color: 'Black', rating: 4.9, trips: 1240, rate: rateInBand(8), pos: nearby(13.0827, 80.2707), name: 'Murugan Selvam', photo: 'assets/driver_avatar.png', verified: true },
  { id: 'd002', vehicle: 'bike', vehicleNo: 'TN09 BK 7732', vehicleModel: 'TVS Jupiter', color: 'Blue', rating: 4.7, trips: 890, rate: rateInBand(8), pos: nearby(13.0827, 80.2707), name: 'Karthik Rajan', photo: 'assets/driver_avatar.png', verified: true },
  { id: 'd003', vehicle: 'bike', vehicleNo: 'TN04 BK 2290', vehicleModel: 'Bajaj Pulsar', color: 'Red', rating: 4.5, trips: 560, rate: rateInBand(8), pos: nearby(13.0827, 80.2707, 3), name: 'Senthil Kumar', photo: 'assets/driver_avatar.png', verified: true },
  { id: 'd004', vehicle: 'bike', vehicleNo: 'TN22 BK 8810', vehicleModel: 'Honda Shine', color: 'Silver', rating: 4.2, trips: 320, rate: rateInBand(8), pos: nearby(13.0827, 80.2707, 4), name: 'Anbu Arasan', photo: 'assets/driver_avatar.png', verified: true },
  { id: 'd005', vehicle: 'bike', vehicleNo: 'TN07 BK 9941', vehicleModel: 'Hero Splendor', color: 'Black', rating: 4.8, trips: 1510, rate: rateInBand(8), pos: nearby(13.0827, 80.2707, 2), name: 'Vijay Anand', photo: 'assets/driver_avatar.png', verified: true },
  { id: 'd006', vehicle: 'bike', vehicleNo: 'TN10 BK 3314', vehicleModel: 'Yamaha FZ', color: 'White', rating: 4.6, trips: 780, rate: rateInBand(8), pos: nearby(13.0827, 80.2707, 3), name: 'Pravin Kumar', photo: 'assets/driver_avatar.png', verified: true },

  // AUTOS (5)
  { id: 'd007', vehicle: 'auto', vehicleNo: 'TN01 AU 1234', vehicleModel: 'Bajaj RE Auto', color: 'Yellow', rating: 4.9, trips: 2100, rate: rateInBand(12), pos: nearby(13.0827, 80.2707), name: 'Ramasamy V.', photo: 'assets/driver_avatar.png', verified: true },
  { id: 'd008', vehicle: 'auto', vehicleNo: 'TN05 AU 5678', vehicleModel: 'Piaggio Ape', color: 'Green', rating: 4.6, trips: 1450, rate: rateInBand(12), pos: nearby(13.0827, 80.2707, 2), name: 'Dhanush M.', photo: 'assets/driver_avatar.png', verified: true },
  { id: 'd009', vehicle: 'auto', vehicleNo: 'TN09 AU 9101', vehicleModel: 'Bajaj Maxima', color: 'Yellow', rating: 4.4, trips: 920, rate: rateInBand(12), pos: nearby(13.0827, 80.2707, 3), name: 'Velu Swamy', photo: 'assets/driver_avatar.png', verified: true },
  { id: 'd010', vehicle: 'auto', vehicleNo: 'TN02 AU 3456', vehicleModel: 'Mahindra Alfa', color: 'Black/Yellow', rating: 4.1, trips: 410, rate: rateInBand(12), pos: nearby(13.0827, 80.2707, 5), name: 'Srinivasan K.', photo: 'assets/driver_avatar.png', verified: true },
  { id: 'd011', vehicle: 'auto', vehicleNo: 'TN07 AU 7890', vehicleModel: 'Bajaj Compact', color: 'Yellow', rating: 5.0, trips: 3100, rate: rateInBand(12), pos: nearby(13.0827, 80.2707, 1), name: 'Mani Kandan', photo: 'assets/driver_avatar.png', verified: true },

  // CARS (5)
  { id: 'd013', vehicle: 'car', vehicleNo: 'TN04 CR 8832', vehicleModel: 'Hyundai i20', color: 'Grey', rating: 4.7, trips: 2140, rate: rateInBand(18), pos: nearby(13.0827, 80.2707, 3), name: 'Sureshkumar A', photo: null, verified: true },
  { id: 'd014', vehicle: 'car', vehicleNo: 'TN22 CR 1190', vehicleModel: 'Honda City', color: 'Silver', rating: 4.5, trips: 1560, rate: rateInBand(18), pos: nearby(13.0827, 80.2707, 4), name: 'Venkatesan G', photo: null, verified: true },
  { id: 'd015', vehicle: 'car', vehicleNo: 'TN01 CR 3347', vehicleModel: 'Maruti Dzire', color: 'Blue', rating: 4.2, trips: 890, rate: rateInBand(18), pos: nearby(13.0827, 80.2707, 5), name: 'Jayaraman T', photo: null, verified: true },
  { id: 'd016', vehicle: 'car', vehicleNo: 'TN07 CR 9912', vehicleModel: 'Tata Nexon', color: 'Red', rating: 4.0, trips: 340, rate: rateInBand(18), pos: nearby(13.0827, 80.2707, 6), name: 'Palaniswamy D', photo: null, verified: true },

  // VANS (4)
  { id: 'd017', vehicle: 'van', vehicleNo: 'TN09 VN 2234', vehicleModel: 'Force Traveller', color: 'White', rating: 4.8, trips: 1100, rate: rateInBand(24), pos: nearby(13.0827, 80.2707, 4), name: 'Chandrasekaran M', photo: null, verified: true },
  { id: 'd018', vehicle: 'van', vehicleNo: 'TN04 VN 7710', vehicleModel: 'Toyota Innova', color: 'Silver', rating: 4.6, trips: 780, rate: rateInBand(24), pos: nearby(13.0827, 80.2707, 5), name: 'Subramanian K', photo: null, verified: true },
  { id: 'd019', vehicle: 'van', vehicleNo: 'TN22 VN 4490', vehicleModel: 'Maruti Eeco', color: 'White', rating: 4.3, trips: 560, rate: rateInBand(24), pos: nearby(13.0827, 80.2707, 5), name: 'Arunachalam P', photo: null, verified: true },
  { id: 'd020', vehicle: 'van', vehicleNo: 'TN01 VN 8821', vehicleModel: 'Tempo Traveller', color: 'Beige', rating: 4.1, trips: 290, rate: rateInBand(24), pos: nearby(13.0827, 80.2707, 7), name: 'Natarajan V', photo: null, verified: true },
];

export const MOCK_TRIPS = [
  {
    id: 'tr001',
    type: 'ride',
    vehicle: 'car',
    driver: { name: 'Sureshkumar A', vehicleNo: 'TN04 CR 8832', vehicleModel: 'Hyundai i20', rating: 4.7 },
    pickup: 'Anna Nagar, Chennai',
    dropoff: 'T. Nagar, Chennai',
    distance: 8.4,
    fare: 165,
    status: 'completed',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    rating: 5,
  },
  {
    id: 'tr002',
    type: 'parcel',
    vehicle: 'bike',
    driver: { name: 'Murugan Selvam', vehicleNo: 'TN09 BK 4521', vehicleModel: 'Honda Activa', rating: 4.9 },
    pickup: 'Velachery, Chennai',
    dropoff: 'Tambaram, Chennai',
    distance: 12.1,
    fare: 98,
    status: 'completed',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Cash',
    rating: 5,
  },
  {
    id: 'tr003',
    type: 'ride',
    vehicle: 'auto',
    driver: { name: 'Selvakumar M', vehicleNo: 'TN09 AT 1123', vehicleModel: 'Bajaj RE', rating: 4.8 },
    pickup: 'Egmore, Chennai',
    dropoff: 'Mylapore, Chennai',
    distance: 4.2,
    fare: 55,
    status: 'completed',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Wallet',
    rating: 4,
  },
  {
    id: 'tr004',
    type: 'ride',
    vehicle: 'bike',
    driver: { name: 'Karthik Rajan', vehicleNo: 'TN09 BK 7732', vehicleModel: 'TVS Jupiter', rating: 4.7 },
    pickup: 'Adyar, Chennai',
    dropoff: 'OMR, Chennai',
    distance: 6.8,
    fare: 58,
    status: 'completed',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    rating: 4,
  },
  {
    id: 'tr005',
    type: 'ride',
    vehicle: 'van',
    driver: { name: 'Chandrasekaran M', vehicleNo: 'TN09 VN 2234', vehicleModel: 'Force Traveller', rating: 4.8 },
    pickup: 'Chennai Airport',
    dropoff: 'Porur, Chennai',
    distance: 18.3,
    fare: 480,
    status: 'completed',
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Card',
    rating: 5,
  },
  {
    id: 'tr006',
    type: 'travel',
    vehicle: 'bus',
    operator: 'KPN Travels',
    pickup: 'Chennai Central',
    dropoff: 'Madurai',
    distance: 460,
    fare: 750,
    status: 'completed',
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    rating: 4,
    seatNo: '12A',
  },
  {
    id: 'tr007',
    type: 'ride',
    vehicle: 'car',
    driver: { name: 'Balasubramanian N', vehicleNo: 'TN09 CR 5521', vehicleModel: 'Maruti Swift', rating: 4.9 },
    pickup: 'Nungambakkam, Chennai',
    dropoff: 'Guindy, Chennai',
    distance: 7.5,
    fare: 142,
    status: 'completed',
    date: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'UPI',
    rating: 5,
  },
  {
    id: 'tr008',
    type: 'parcel',
    vehicle: 'bike',
    driver: { name: 'Prabu Raj', vehicleNo: 'TN01 BK 5590', vehicleModel: 'Suzuki Access', rating: 4.6 },
    pickup: 'Kodambakkam, Chennai',
    dropoff: 'Chromepet, Chennai',
    distance: 9.2,
    fare: 78,
    status: 'completed',
    date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: 'Wallet',
    rating: 4,
  },
];

export const SAVED_ADDRESSES = [
  { id: 'a001', label: 'Home', icon: '🏠', address: '14, 3rd Cross Street, Anna Nagar West, Chennai – 600040', lat: 13.0878, lng: 80.2100 },
  { id: 'a002', label: 'Work', icon: '💼', address: 'Tidel Park, Old Mahabalipuram Road, Taramani, Chennai – 600113', lat: 13.0082, lng: 80.2454 },
  { id: 'a003', label: "Mom's Place", icon: '👩', address: '7, Nehru Street, Mylapore, Chennai – 600004', lat: 13.0336, lng: 80.2673 },
  { id: 'a004', label: 'College', icon: '🎓', address: 'IIT Madras, Sardar Patel Road, Adyar, Chennai – 600036', lat: 12.9914, lng: 80.2336 },
];

export const BUS_ROUTES = [
  {
    id: 'rt001',
    from: 'Chennai',
    to: 'Madurai',
    distance: 462,
    duration: '8h 30m',
    departures: [
      { id: 'dep001', operator: 'KPN Travels', type: 'A/C Sleeper', time: '21:00', arrival: '05:30', fare: 850, seatsLeft: 12, rating: 4.6 },
      { id: 'dep002', operator: 'SRS Travels', type: 'A/C Semi-Sleeper', time: '22:00', arrival: '06:30', fare: 650, seatsLeft: 7, rating: 4.4 },
      { id: 'dep003', operator: 'SETC', type: 'Non-A/C Sleeper', time: '20:30', arrival: '05:00', fare: 380, seatsLeft: 22, rating: 4.2 },
    ],
  },
  {
    id: 'rt002',
    from: 'Chennai',
    to: 'Coimbatore',
    distance: 497,
    duration: '9h 00m',
    departures: [
      { id: 'dep004', operator: 'Parveen Travels', type: 'A/C Sleeper', time: '21:30', arrival: '06:30', fare: 900, seatsLeft: 5, rating: 4.7 },
      { id: 'dep005', operator: 'KPN Travels', type: 'A/C Semi-Sleeper', time: '22:30', arrival: '07:30', fare: 720, seatsLeft: 18, rating: 4.5 },
      { id: 'dep006', operator: 'TNSTC', type: 'Non-A/C Express', time: '06:00', arrival: '15:00', fare: 280, seatsLeft: 35, rating: 4.0 },
    ],
  },
  {
    id: 'rt003',
    from: 'Chennai',
    to: 'Trichy',
    distance: 330,
    duration: '6h 00m',
    departures: [
      { id: 'dep007', operator: 'Chartered Bus', type: 'A/C Sleeper', time: '22:00', arrival: '04:00', fare: 680, seatsLeft: 9, rating: 4.5 },
      { id: 'dep008', operator: 'SRS Travels', type: 'A/C Semi-Sleeper', time: '23:00', arrival: '05:00', fare: 520, seatsLeft: 14, rating: 4.3 },
    ],
  },
  {
    id: 'rt004',
    from: 'Chennai',
    to: 'Bangalore',
    distance: 346,
    duration: '6h 30m',
    departures: [
      { id: 'dep009', operator: 'Sugama Travels', type: 'A/C Volvo', time: '22:00', arrival: '04:30', fare: 1100, seatsLeft: 3, rating: 4.8 },
      { id: 'dep010', operator: 'VRL Travels', type: 'A/C Sleeper', time: '20:00', arrival: '02:30', fare: 950, seatsLeft: 11, rating: 4.6 },
      { id: 'dep011', operator: 'KSRTC', type: 'Non-A/C Express', time: '07:00', arrival: '13:30', fare: 450, seatsLeft: 28, rating: 4.1 },
    ],
  },
  {
    id: 'rt005',
    from: 'Chennai',
    to: 'Hyderabad',
    distance: 627,
    duration: '11h 00m',
    departures: [
      { id: 'dep012', operator: 'Orange Tours', type: 'A/C Sleeper', time: '19:00', arrival: '06:00', fare: 1400, seatsLeft: 8, rating: 4.7 },
      { id: 'dep013', operator: 'IntrCity SmartBus', type: 'A/C Semi-Sleeper', time: '20:00', arrival: '07:00', fare: 1200, seatsLeft: 15, rating: 4.5 },
    ],
  },
  {
    id: 'rt006',
    from: 'Chennai',
    to: 'Pondicherry',
    distance: 162,
    duration: '3h 00m',
    departures: [
      { id: 'dep014', operator: 'SETC', type: 'A/C Express', time: '07:00', arrival: '10:00', fare: 280, seatsLeft: 20, rating: 4.3 },
      { id: 'dep015', operator: 'TNSTC', type: 'Non-A/C Express', time: '08:30', arrival: '11:30', fare: 120, seatsLeft: 42, rating: 4.0 },
    ],
  },
];

export const PAYMENT_METHODS = [
  { id: 'pm001', type: 'upi',  label: 'Google Pay',      detail: 'arjun@okaxis',          icon: '📱', default: true  },
  { id: 'pm002', type: 'card', label: 'HDFC Debit Card', detail: '•••• •••• •••• 4521',   icon: '💳', default: false },
  { id: 'pm003', type: 'wallet', label: 'GetGo Wallet',  detail: '₹450.00 available',     icon: '👛', default: false },
  { id: 'pm004', type: 'netbanking', label: 'SBI Net Banking', detail: 'Linked',           icon: '🏦', default: false },
  { id: 'pm005', type: 'cod',  label: 'Cash on Delivery', detail: 'Pay driver in cash',   icon: '💵', default: false },
];

export const PROMO_BANNERS = [
  { id: 'promo1', title: '50% OFF your next ride!', subtitle: 'Use code GETGO50 · Valid till 31 July', color: '#00A651', textColor: '#fff' },
  { id: 'promo2', title: 'Free parcel delivery', subtitle: 'First delivery free for new users', color: '#2563EB', textColor: '#fff' },
  { id: 'promo3', title: 'Travel smart', subtitle: 'Book bus tickets, save up to ₹200', color: '#7C3AED', textColor: '#fff' },
];

// ── Notifications seed data ──────────────────────────────────
export const NOTIFICATIONS = [
  {
    id: 'n001',
    type: 'promo',
    icon: '🎉',
    title: '50% OFF your next ride!',
    body: 'Use code GETGO50 before 31 July. Valid on all vehicle types.',
    time: '2 min ago',
    read: false,
    color: '#00A651',
  },
  {
    id: 'n002',
    type: 'trip',
    icon: '🚗',
    title: 'Trip completed — T. Nagar',
    body: 'Your ride to T. Nagar was completed. Fare: ₹165. Rate your experience.',
    time: '2 days ago',
    read: false,
    color: '#2563EB',
  },
  {
    id: 'n003',
    type: 'parcel',
    icon: '📦',
    title: 'Parcel delivered successfully',
    body: 'Your parcel to Tambaram was delivered and confirmed by the recipient.',
    time: '5 days ago',
    read: true,
    color: '#7C3AED',
  },
  {
    id: 'n004',
    type: 'system',
    icon: '🛡️',
    title: 'Safety check complete',
    body: 'Your emergency contacts are up to date. GetGo cares about your safety.',
    time: '1 week ago',
    read: true,
    color: '#F59E0B',
  },
  {
    id: 'n005',
    type: 'promo',
    icon: '🚌',
    title: 'New bus route: Chennai → Pondicherry',
    body: 'Book seats on the new SETC express. Fares starting ₹120.',
    time: '1 week ago',
    read: true,
    color: '#00A651',
  },
  {
    id: 'n006',
    type: 'system',
    icon: '💳',
    title: 'Payment confirmed',
    body: 'Your UPI payment of ₹750 for Chennai–Madurai bus was successful.',
    time: '3 weeks ago',
    read: true,
    color: '#10B981',
  },
  {
    id: 'n007',
    type: 'promo',
    icon: '👛',
    title: 'GetGo Wallet credited',
    body: 'Cashback of ₹50 has been added to your GetGo Wallet. Keep riding!',
    time: '4 weeks ago',
    read: true,
    color: '#FFD700',
  },
];

export const CHENNAI_LOCATIONS = [
  { name: 'Chennai Central Station', lat: 13.0827, lng: 80.2707 },
  { name: 'Chennai Airport', lat: 12.9941, lng: 80.1709 },
  { name: 'T. Nagar', lat: 13.0418, lng: 80.2341 },
  { name: 'Anna Nagar', lat: 13.0878, lng: 80.2100 },
  { name: 'Adyar', lat: 13.0060, lng: 80.2565 },
  { name: 'OMR (Old Mahabalipuram Road)', lat: 12.9082, lng: 80.2271 },
  { name: 'Velachery', lat: 12.9784, lng: 80.2218 },
  { name: 'Tambaram', lat: 12.9229, lng: 80.1275 },
  { name: 'Guindy', lat: 13.0065, lng: 80.2206 },
  { name: 'Mylapore', lat: 13.0336, lng: 80.2673 },
  { name: 'Egmore', lat: 13.0732, lng: 80.2609 },
  { name: 'Nungambakkam', lat: 13.0569, lng: 80.2425 },
  { name: 'Kodambakkam', lat: 13.0499, lng: 80.2244 },
  { name: 'Chromepet', lat: 12.9514, lng: 80.1447 },
  { name: 'Porur', lat: 13.0359, lng: 80.1588 },
];
