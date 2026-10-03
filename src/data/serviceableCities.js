/**
 * serviceableCities.js
 * Defines the supported metropolitan cities and heavy traffic hubs where VeloxPark operates.
 * All other locations (e.g. Changa, rural areas, unsupported towns) show the Unserviceable Area view.
 */

export const SERVICEABLE_CITIES = [
  {
    id: 'anand',
    name: 'Anand & VV Nagar',
    shortName: 'Anand',
    state: 'Gujarat',
    center: { lat: 22.5645, lng: 72.9289 },
    radiusKm: 16,
    aliases: ['anand', 'vidyanagar', 'vallabh vidyanagar', 'vv nagar', 'karamsad', 'vitthal udyognagar', 'mogar'],
    stations: [
      {
        id: 'anand_central_lot_a',
        name: 'Central Campus Lot A',
        address: 'Shastri Maidan Marg, VV Nagar, Anand',
        street: 'Shastri Maidan Marg',
        lat: 22.5539,
        lng: 72.9242,
        rate: 40,
        slots: 28,
        totalSlots: 50,
        tag: 'ANPR',
        feature: 'Fast Gate',
      },
      {
        id: 'anand_station_rd',
        name: 'Station Road Covered Deck',
        address: 'Near Railway Station, Station Rd, Anand',
        street: 'Station Rd',
        lat: 22.5645,
        lng: 72.9289,
        rate: 35,
        slots: 18,
        totalSlots: 40,
        tag: 'CCTV',
        feature: 'Covered Roof',
      },
      {
        id: 'anand_mota_bazaar',
        name: 'Mota Bazaar Heritage Bay',
        address: 'Mota Bazaar Main Rd, VV Nagar, Anand',
        street: 'Mota Bazaar',
        lat: 22.5512,
        lng: 72.9210,
        rate: 30,
        slots: 22,
        totalSlots: 45,
        tag: 'Live Gate',
        feature: 'Market Bay',
      },
      {
        id: 'anand_amul_dairy_bay',
        name: 'Amul Dairy Road Smart Bay',
        address: 'Amul Dairy Rd, Anand',
        street: 'Amul Dairy Rd',
        lat: 22.5610,
        lng: 72.9340,
        rate: 25,
        slots: 35,
        totalSlots: 60,
        tag: 'EV',
        feature: 'EV Charging ⚡',
      },
      {
        id: 'anand_bhaikaka_plaza',
        name: 'Bhaikaka Library Plaza',
        address: 'Bhaikaka Marg, VV Nagar, Anand',
        street: 'Bhaikaka Marg',
        lat: 22.5568,
        lng: 72.9295,
        rate: 20,
        slots: 25,
        totalSlots: 40,
        tag: 'FastPass',
        feature: 'Express Entry',
      },
    ],
  },
  {
    id: 'nadiad',
    name: 'Nadiad',
    shortName: 'Nadiad',
    state: 'Gujarat',
    center: { lat: 22.6916, lng: 72.8634 },
    radiusKm: 14,
    aliases: ['nadiad', 'santram', 'piplag', 'nadiad junction', 'mill road'],
    stations: [
      {
        id: 'nadiad_santram_deck',
        name: 'Santram Temple Parking Plaza',
        address: 'Santram Rd, Near Temple, Nadiad',
        street: 'Santram Rd',
        lat: 22.6950,
        lng: 72.8580,
        rate: 35,
        slots: 42,
        totalSlots: 70,
        tag: 'Valet',
        feature: 'Valet Assisted',
      },
      {
        id: 'nadiad_junction_lot',
        name: 'Nadiad Junction Smart Bay',
        address: 'Station Rd, Near Railway Station, Nadiad',
        street: 'Station Rd',
        lat: 22.6916,
        lng: 72.8634,
        rate: 30,
        slots: 28,
        totalSlots: 45,
        tag: 'ANPR',
        feature: 'Express Entry',
      },
      {
        id: 'nadiad_college_rd',
        name: 'DDU College Road Tech Bay',
        address: 'College Rd, Near DDU Campus, Nadiad',
        street: 'College Rd',
        lat: 22.6820,
        lng: 72.8790,
        rate: 25,
        slots: 20,
        totalSlots: 35,
        tag: 'EV',
        feature: 'Fast EV Pod',
      },
      {
        id: 'nadiad_mill_rd',
        name: 'Mill Road Commercial Lot',
        address: 'Mill Rd, Nadiad',
        street: 'Mill Rd',
        lat: 22.6975,
        lng: 72.8690,
        rate: 25,
        slots: 32,
        totalSlots: 50,
        tag: 'CCTV',
        feature: 'Covered Bay',
      },
      {
        id: 'nadiad_piplag_express',
        name: 'Piplag Highway Express Bay',
        address: 'Piplag Junction, NH48 Cross, Nadiad',
        street: 'NH48 Piplag Cross',
        lat: 22.6730,
        lng: 72.8460,
        rate: 20,
        slots: 55,
        totalSlots: 80,
        tag: 'FastPass',
        feature: 'Express Toll Gate',
      },
    ],
  },
  {
    id: 'surat',
    name: 'Surat',
    shortName: 'Surat',
    state: 'Gujarat',
    center: { lat: 21.1702, lng: 72.8311 },
    radiusKm: 22,
    aliases: ['surat', 'varachha', 'adajan', 'vesu', 'dumas', 'ring road', 'athwa', 'textile market'],
    stations: [
      {
        id: 'surat_millennium_market',
        name: 'Millennium Textile Market Deck',
        address: 'Ring Road, Near Millennium Market, Surat',
        street: 'Ring Rd',
        lat: 21.1890,
        lng: 72.8420,
        rate: 60,
        slots: 85,
        totalSlots: 150,
        tag: 'ANPR',
        feature: 'Multi-Level Deck',
      },
      {
        id: 'surat_varachha_bourse',
        name: 'Varachha Diamond Bourse Bay',
        address: 'Varachha Main Rd, Mini Bazaar, Surat',
        street: 'Varachha Rd',
        lat: 21.2150,
        lng: 72.8590,
        rate: 55,
        slots: 60,
        totalSlots: 100,
        tag: 'CCTV',
        feature: 'Secure Multi-Tier',
      },
      {
        id: 'surat_vesu_vip',
        name: 'Vesu VIP Road Smart Bay',
        address: 'VIP Road, Vesu, Surat',
        street: 'VIP Rd',
        lat: 21.1420,
        lng: 72.7780,
        rate: 50,
        slots: 38,
        totalSlots: 60,
        tag: 'EV',
        feature: 'Supercharger ⚡',
      },
      {
        id: 'surat_athwa_gate',
        name: 'Athwa Gate Multi-Bay',
        address: 'Athwa Lines, Near Chowk, Surat',
        street: 'Athwa Lines',
        lat: 21.1820,
        lng: 72.8120,
        rate: 40,
        slots: 45,
        totalSlots: 70,
        tag: 'CCTV',
        feature: 'Covered Bay',
      },
      {
        id: 'surat_adajan_central',
        name: 'Adajan Central Plaza',
        address: 'Adajan Hazira Main Rd, Surat',
        street: 'Adajan Main Rd',
        lat: 21.1960,
        lng: 72.7930,
        rate: 35,
        slots: 52,
        totalSlots: 80,
        tag: 'Fast Gate',
        feature: 'Automated Gate',
      },
    ],
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad & Gandhinagar',
    shortName: 'Ahmedabad',
    state: 'Gujarat',
    center: { lat: 23.0225, lng: 72.5714 },
    radiusKm: 30,
    aliases: ['ahmedabad', 'ahmadabad', 'amhdavad', 'gandhinagar', 'sabarmati', 'sg highway', 'prahlad nagar', 'bopal', 'maninagar', 'vastrapur', 'navrangpura', 'cg road', 'sbr', 'sindhu bhavan'],
    stations: [
      {
        id: 'ahd_sbr_premium',
        name: 'Sindhu Bhavan Road Premium Deck',
        address: 'SBR, Bodakdev, Ahmedabad',
        street: 'Sindhu Bhavan Rd',
        lat: 23.0450,
        lng: 72.5020,
        rate: 65,
        slots: 90,
        totalSlots: 140,
        tag: 'ANPR',
        feature: 'VIP Valet Deck',
      },
      {
        id: 'ahd_sg_highway_deck',
        name: 'SG Highway Corporate Tech Deck',
        address: 'SG Highway, Prahlad Nagar Cross Rd, Ahmedabad',
        street: 'SG Highway',
        lat: 23.0110,
        lng: 72.5080,
        rate: 55,
        slots: 75,
        totalSlots: 120,
        tag: 'EV',
        feature: 'Dual 60kW DC EV',
      },
      {
        id: 'ahd_cg_road_lot',
        name: 'CG Road Multi-Level Facility',
        address: 'CG Road, Navrangpura, Ahmedabad',
        street: 'CG Road',
        lat: 23.0360,
        lng: 72.5560,
        rate: 50,
        slots: 45,
        totalSlots: 80,
        tag: 'Covered',
        feature: 'Automated Lift',
      },
      {
        id: 'ahd_riverfront_west',
        name: 'Sabarmati Riverfront Smart Bay',
        address: 'Riverfront West, Near Nehru Bridge, Ahmedabad',
        street: 'Riverfront West',
        lat: 23.0275,
        lng: 72.5735,
        rate: 45,
        slots: 110,
        totalSlots: 160,
        tag: 'ANPR',
        feature: 'Express ANPR',
      },
      {
        id: 'ahd_vastrapur_lake',
        name: 'Vastrapur Lake Alpha Bay',
        address: 'Vastrapur Lake Rd, Ahmedabad',
        street: 'Vastrapur Lake Rd',
        lat: 23.0370,
        lng: 72.5290,
        rate: 40,
        slots: 50,
        totalSlots: 85,
        tag: 'CCTV',
        feature: 'Covered Deck',
      },
      {
        id: 'ahd_gift_city_deck',
        name: 'GIFT City Express Deck',
        address: 'GIFT City Rd, Gandhinagar',
        street: 'GIFT City Rd',
        lat: 23.1610,
        lng: 72.6840,
        rate: 35,
        slots: 65,
        totalSlots: 100,
        tag: 'Smart Sensor',
        feature: 'AI Flow Control',
      },
    ],
  },
  {
    id: 'bangalore',
    name: 'Bengaluru (Bangalore)',
    shortName: 'Bangalore',
    state: 'Karnataka',
    center: { lat: 12.9716, lng: 77.5946 },
    radiusKm: 32,
    aliases: ['bangalore', 'bengaluru', 'benglor', 'koramangala', 'indiranagar', 'whitefield', 'hsr layout', 'electronic city', 'bellandur', 'mg road', 'marathahalli'],
    stations: [
      {
        id: 'blr_mg_road_cbd',
        name: 'MG Road CBD Automated Facility',
        address: 'MG Road, Near Trinity Metro, Bengaluru',
        street: 'MG Road',
        lat: 12.9750,
        lng: 77.6080,
        rate: 95,
        slots: 105,
        totalSlots: 160,
        tag: 'ANPR',
        feature: 'Robotic Lift',
      },
      {
        id: 'blr_indiranagar_deck',
        name: 'Indiranagar 100ft Smart Deck',
        address: '100 Feet Rd, HAL 2nd Stage, Indiranagar, Bengaluru',
        street: '100 Feet Rd',
        lat: 12.9719,
        lng: 77.6412,
        rate: 85,
        slots: 45,
        totalSlots: 75,
        tag: 'EV',
        feature: '120kW Supercharger',
      },
      {
        id: 'blr_koramangala_hub',
        name: 'Koramangala 80ft Road Hub',
        address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
        street: '80 Feet Rd',
        lat: 12.9345,
        lng: 77.6265,
        rate: 80,
        slots: 58,
        totalSlots: 90,
        tag: 'FastPass',
        feature: 'FastPass Gate',
      },
      {
        id: 'blr_hsr_layout_bay',
        name: 'HSR Sector 4 Commercial Bay',
        address: '27th Main Road, Sector 4, HSR Layout, Bengaluru',
        street: '27th Main Rd',
        lat: 12.9120,
        lng: 77.6380,
        rate: 70,
        slots: 40,
        totalSlots: 65,
        tag: 'CCTV',
        feature: 'Multi-Floor Bay',
      },
      {
        id: 'blr_whitefield_tech',
        name: 'Whitefield ITPL Multi-Bay',
        address: 'ITPL Main Rd, Whitefield, Bengaluru',
        street: 'ITPL Main Rd',
        lat: 12.9860,
        lng: 77.7340,
        rate: 60,
        slots: 120,
        totalSlots: 190,
        tag: 'CCTV',
        feature: 'Multi-Floor Covered',
      },
      {
        id: 'blr_electronic_city_bay',
        name: 'Electronic City Phase 1 Deck',
        address: 'Hosur Road, Electronic City Phase 1, Bengaluru',
        street: 'Hosur Rd',
        lat: 12.8450,
        lng: 77.6620,
        rate: 55,
        slots: 80,
        totalSlots: 130,
        tag: 'ANPR',
        feature: 'Express Toll Gate',
      },
    ],
  },
  {
    id: 'mumbai',
    name: 'Mumbai & MMR',
    shortName: 'Mumbai',
    state: 'Maharashtra',
    center: { lat: 19.0760, lng: 72.8777 },
    radiusKm: 35,
    aliases: ['mumbai', 'bombay', 'bandra', 'andheri', 'bkc', 'powai', 'thane', 'navi mumbai', 'dadar', 'worli', 'borivali', 'colaba', 'lower parel', 'nariman point'],
    stations: [
      {
        id: 'mum_nariman_point',
        name: 'Nariman Point Financial Tower Lot',
        address: 'Free Press Journal Marg, Nariman Point, Mumbai',
        street: 'Nariman Point',
        lat: 18.9280,
        lng: 72.8220,
        rate: 130,
        slots: 80,
        totalSlots: 120,
        tag: 'Valet',
        feature: 'VIP Valet & ANPR',
      },
      {
        id: 'mum_bkc_complex',
        name: 'BKC Corporate Plaza Bay',
        address: 'G Block, Bandra Kurla Complex, Mumbai',
        street: 'BKC Avenue',
        lat: 19.0657,
        lng: 72.8688,
        rate: 120,
        slots: 140,
        totalSlots: 220,
        tag: 'ANPR',
        feature: 'Multi-Floor AI Bay',
      },
      {
        id: 'mum_lower_parel',
        name: 'Lower Parel Grand High Street Deck',
        address: 'Senapati Bapat Marg, Lower Parel, Mumbai',
        street: 'Senapati Bapat Marg',
        lat: 18.9950,
        lng: 72.8250,
        rate: 105,
        slots: 65,
        totalSlots: 110,
        tag: 'Valet',
        feature: 'Valet Assisted',
      },
      {
        id: 'mum_bandra_linking',
        name: 'Bandra Linking Road Smart Bay',
        address: 'Linking Rd, Bandra West, Mumbai',
        street: 'Linking Rd',
        lat: 19.0600,
        lng: 72.8330,
        rate: 90,
        slots: 42,
        totalSlots: 70,
        tag: 'CCTV',
        feature: 'Covered Bay',
      },
      {
        id: 'mum_andheri_link',
        name: 'Andheri West Metro Hub',
        address: 'New Link Rd, Near Infinity Mall, Andheri West, Mumbai',
        street: 'New Link Rd',
        lat: 19.1410,
        lng: 72.8315,
        rate: 80,
        slots: 70,
        totalSlots: 120,
        tag: 'EV',
        feature: 'EV Fast Pod',
      },
      {
        id: 'mum_powai_central',
        name: 'Powai Tech Central Deck',
        address: 'Central Ave, Hiranandani Gardens, Powai, Mumbai',
        street: 'Central Ave',
        lat: 19.1190,
        lng: 72.9080,
        rate: 75,
        slots: 55,
        totalSlots: 90,
        tag: 'ANPR',
        feature: 'ANPR Fast Gate',
      },
    ],
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    shortName: 'Delhi',
    state: 'Delhi NCR',
    center: { lat: 28.6139, lng: 77.2090 },
    radiusKm: 40,
    aliases: ['delhi', 'new delhi', 'gurgaon', 'gurugram', 'noida', 'dwarka', 'connaught place', 'cp', 'saket', 'aerocity', 'faridabad', 'ghaziabad', 'south ex'],
    stations: [
      {
        id: 'del_cp_inner_circle',
        name: 'Connaught Place Smart Underground',
        address: 'Block B, Inner Circle, Connaught Place, New Delhi',
        street: 'Connaught Place',
        lat: 28.6327,
        lng: 77.2195,
        rate: 115,
        slots: 150,
        totalSlots: 240,
        tag: 'ANPR',
        feature: 'Underground Multi-Tier',
      },
      {
        id: 'del_cyber_city',
        name: 'Cyber City DLF Smart Deck',
        address: 'DLF Cyber City, Phase 2, Gurugram, NCR',
        street: 'Cyber City Rd',
        lat: 28.4950,
        lng: 77.0890,
        rate: 105,
        slots: 110,
        totalSlots: 180,
        tag: 'EV',
        feature: 'Ultra-Fast EV Pod',
      },
      {
        id: 'del_aerocity_terminal',
        name: 'Aerocity Terminal Multi-Bay',
        address: 'Hospitality District, Aerocity, New Delhi',
        street: 'Asset Area',
        lat: 28.5510,
        lng: 77.1210,
        rate: 95,
        slots: 75,
        totalSlots: 130,
        tag: 'ANPR',
        feature: 'Flight Synced ANPR',
      },
      {
        id: 'del_south_ex_deck',
        name: 'South Extension Ring Road Deck',
        address: 'Ring Road, South Extension Part 2, New Delhi',
        street: 'Ring Rd',
        lat: 28.5720,
        lng: 77.2210,
        rate: 85,
        slots: 60,
        totalSlots: 95,
        tag: 'Covered',
        feature: 'Multi-Level Lift',
      },
      {
        id: 'del_saket_district',
        name: 'Saket District Centre Plaza',
        address: 'Press Enclave Marg, Saket, New Delhi',
        street: 'Press Enclave Marg',
        lat: 28.5280,
        lng: 77.2180,
        rate: 75,
        slots: 80,
        totalSlots: 130,
        tag: 'CCTV',
        feature: 'Covered Bay',
      },
      {
        id: 'del_noida_sec18',
        name: 'Noida Sector 18 Central Bay',
        address: 'Sector 18 Market, Atta Market, Noida',
        street: 'Sector 18 Rd',
        lat: 28.5700,
        lng: 77.3230,
        rate: 65,
        slots: 95,
        totalSlots: 150,
        tag: 'FastPass',
        feature: 'Automated Gate',
      },
    ],
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    shortName: 'Vadodara',
    state: 'Gujarat',
    center: { lat: 22.3072, lng: 73.1812 },
    radiusKm: 18,
    aliases: ['vadodara', 'baroda', 'alkapuri', 'sayaji baug', 'gotri', 'makarpura', 'old padra'],
    stations: [
      {
        id: 'bdq_alkapuri_hub',
        name: 'Alkapuri RC Dutt Smart Bay',
        address: 'RC Dutt Rd, Alkapuri, Vadodara',
        street: 'RC Dutt Rd',
        lat: 22.3140,
        lng: 73.1750,
        rate: 45,
        slots: 45,
        totalSlots: 70,
        tag: 'EV',
        feature: 'EV Charge Pod',
      },
      {
        id: 'bdq_sayaji_baug',
        name: 'Sayaji Baug Central Deck',
        address: 'Sayaji Baug, Vinoba Bhave Rd, Vadodara',
        street: 'Sayaji Rd',
        lat: 22.3120,
        lng: 73.1880,
        rate: 40,
        slots: 55,
        totalSlots: 85,
        tag: 'ANPR',
        feature: 'Central Access ANPR',
      },
      {
        id: 'bdq_station_east',
        name: 'Vadodara Station East Deck',
        address: 'Station Rd, Near Railway Station, Vadodara',
        street: 'Station Rd',
        lat: 22.3100,
        lng: 73.1815,
        rate: 35,
        slots: 40,
        totalSlots: 65,
        tag: 'Covered',
        feature: 'Rail Transit Shaded',
      },
      {
        id: 'bdq_old_padra_bay',
        name: 'Old Padra Road Commercial Bay',
        address: 'Old Padra Rd, Near Bird Circle, Vadodara',
        street: 'Old Padra Rd',
        lat: 22.2980,
        lng: 73.1680,
        rate: 30,
        slots: 35,
        totalSlots: 55,
        tag: 'CCTV',
        feature: 'Covered Bay',
      },
      {
        id: 'bdq_gotri_medical',
        name: 'Gotri Medical Corridor Lot',
        address: 'Gotri Main Rd, Near GMERS, Vadodara',
        street: 'Gotri Main Rd',
        lat: 22.3250,
        lng: 73.1490,
        rate: 25,
        slots: 48,
        totalSlots: 80,
        tag: 'FastPass',
        feature: 'Express Entry',
      },
    ],
  },
];

// Explicit unserviceable keyword blacklist (e.g. Changa, rural areas, outskirts)
const EXPLICIT_UNSERVICEABLE = [
  'changa',
  'padgol',
  'charusat',
  'petlad',
  'tarapur',
  'khambhat',
  'sojitra',
  'borsad',
  'anklav',
  'dakor',
  'umreth',
];

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Checks whether an entered location string and/or coordinates are in our supported service area.
 * @param {string} query 
 * @param {number|null} lat 
 * @param {number|null} lng 
 * @returns {{ isServiceable: boolean, city: object|null, reason?: string, formattedLocation: string }}
 */
export function checkLocationServiceability(query = '', lat = null, lng = null) {
  const q = String(query || '').trim().toLowerCase();

  // 1. Explicit unserviceable keyword check (e.g., Changa, Padgol, Charusat)
  const isExplicitlyUnserviceable = EXPLICIT_UNSERVICEABLE.some((keyword) => q.includes(keyword));
  if (isExplicitlyUnserviceable) {
    return {
      isServiceable: false,
      city: null,
      reason: 'rural_unsupported',
      formattedLocation: query || 'Changa, Gujarat, 388421, India',
    };
  }

  // 2. Text alias match against our selected cities
  for (const city of SERVICEABLE_CITIES) {
    const matched = city.aliases.some((alias) => q.includes(alias));
    if (matched) {
      return {
        isServiceable: true,
        city,
        formattedLocation: query || city.name,
      };
    }
  }

  // 3. Coordinate distance check
  const numLat = Number(lat);
  const numLng = Number(lng);
  if (Number.isFinite(numLat) && Number.isFinite(numLng)) {
    // Check distance to each city center
    let closestCity = null;
    let minDistance = Infinity;

    for (const city of SERVICEABLE_CITIES) {
      const dist = getDistanceKm(numLat, numLng, city.center.lat, city.center.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestCity = city;
      }
    }

    if (closestCity && minDistance <= closestCity.radiusKm) {
      return {
        isServiceable: true,
        city: closestCity,
        formattedLocation: query || closestCity.name,
      };
    }

    // Coordinates are too far from any serviceable city (e.g. Changa is ~28km from Anand/Nadiad)
    return {
      isServiceable: false,
      city: null,
      reason: 'outside_coverage_radius',
      formattedLocation: query || `${numLat.toFixed(4)}, ${numLng.toFixed(4)}`,
    };
  }

  // 4. Default if query is empty
  if (!q) {
    return {
      isServiceable: true,
      city: SERVICEABLE_CITIES[0], // default to Anand
      formattedLocation: SERVICEABLE_CITIES[0].name,
    };
  }

  // 5. Query does not match any allowed city
  return {
    isServiceable: false,
    city: null,
    reason: 'city_not_covered',
    formattedLocation: query,
  };
}

/**
 * Returns stations for a serviceable city or the first available city.
 */
export function getStationsForCity(cityId = 'anand') {
  const city = SERVICEABLE_CITIES.find((c) => c.id === cityId) || SERVICEABLE_CITIES[0];
  return city.stations;
}

/**
 * Returns formatted enterprise stations (5 to 6 per city) with realistic, traffic-calibrated pricing.
 * If user coordinates [lat, lng] are provided, sorts the stations by proximity so the closest one is primary.
 */
export function getEnterpriseStationsForCity(cityOrQuery = 'anand', userLat = null, userLng = null, currency = '₹') {
  let matchedCity = null;

  if (typeof cityOrQuery === 'object' && cityOrQuery?.stations) {
    matchedCity = cityOrQuery;
  } else {
    const q = String(cityOrQuery || '').trim().toLowerCase();
    matchedCity = SERVICEABLE_CITIES.find((c) =>
      c.id === q ||
      c.shortName.toLowerCase() === q ||
      c.name.toLowerCase() === q ||
      c.aliases.some((a) => q.includes(a))
    );
  }

  // If still not matched, check coordinates
  const nLat = Number(userLat);
  const nLng = Number(userLng);
  if (!matchedCity && Number.isFinite(nLat) && Number.isFinite(nLng)) {
    let minD = Infinity;
    for (const c of SERVICEABLE_CITIES) {
      const d = getDistanceKm(nLat, nLng, c.center.lat, c.center.lng);
      if (d < minD && d <= c.radiusKm) {
        minD = d;
        matchedCity = c;
      }
    }
  }

  if (!matchedCity) {
    matchedCity = SERVICEABLE_CITIES[0]; // Fallback to Anand
  }

  let list = matchedCity.stations.map((st, idx) => ({
    id: st.id,
    name: st.name,
    address: st.address,
    street: st.street || st.name,
    lat: st.lat,
    lng: st.lng,
    slots: st.slots,
    totalSlots: st.totalSlots,
    rate: st.rate,
    priceStr: `${currency}${st.rate}.00/h`,
    pinPrice: `${currency}${st.rate}`,
    tag: st.tag,
    feature: st.feature,
    cityId: matchedCity.id,
    cityName: matchedCity.name,
    isPrimary: idx === 0,
  }));

  // If user coordinates provided, sort by distance to user so nearest is first
  if (Number.isFinite(nLat) && Number.isFinite(nLng)) {
    list = list
      .map((st) => ({
        ...st,
        distanceKm: getDistanceKm(nLat, nLng, st.lat, st.lng),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    list = list.map((st, idx) => ({
      ...st,
      isPrimary: idx === 0,
    }));
  }

  return list;
}
