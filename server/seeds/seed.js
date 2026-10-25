require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
const RentalInquiry = require('../models/RentalInquiry');
const Favorite = require('../models/Favorite');
const ContactMessage = require('../models/ContactMessage');
const PropertyReport = require('../models/PropertyReport');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rental_portal';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for data seeding...');

    // 1. Seed or Upsert Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@rentalportal.com').toLowerCase().trim();
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: process.env.ADMIN_NAME || 'Platform Administrator',
        email: adminEmail,
        phone: process.env.ADMIN_PHONE || '+91 9876543210',
        password: process.env.ADMIN_PASSWORD || 'Admin@12345',
        role: 'admin',
        isActive: true
      });
      console.log('Admin account created.');
    }

    // 2. Seed Owners
    const ownersData = [
      {
        name: 'Rajesh Sharma',
        email: 'rajesh.owner@example.com',
        phone: '+91 9811122334',
        password: 'Password@123',
        role: 'owner',
        isActive: true
      },
      {
        name: 'Priya Varma',
        email: 'priya.owner@example.com',
        phone: '+91 9822233445',
        password: 'Password@123',
        role: 'owner',
        isActive: true
      },
      {
        name: 'Kiran Kumar',
        email: 'kiran.owner@example.com',
        phone: '+91 9833344556',
        password: 'Password@123',
        role: 'owner',
        isActive: true
      }
    ];

    const owners = [];
    for (const data of ownersData) {
      let owner = await User.findOne({ email: data.email });
      if (!owner) {
        owner = await User.create(data);
      }
      owners.push(owner);
    }
    console.log(`Seeded/verified ${owners.length} owners.`);

    // 3. Seed Tenants
    const tenantsData = [
      {
        name: 'Rahul Verma',
        email: 'rahul.tenant@example.com',
        phone: '+91 9744455667',
        password: 'Password@123',
        role: 'tenant',
        isActive: true
      },
      {
        name: 'Sneha Patel',
        email: 'sneha.tenant@example.com',
        phone: '+91 9755566778',
        password: 'Password@123',
        role: 'tenant',
        isActive: true
      }
    ];

    const tenants = [];
    for (const data of tenantsData) {
      let tenant = await User.findOne({ email: data.email });
      if (!tenant) {
        tenant = await User.create(data);
      }
      tenants.push(tenant);
    }
    console.log(`Seeded/verified ${tenants.length} tenants.`);

    // 4. Seed Properties
    // Check if properties already exist to prevent duplicate seed spam
    const existingCount = await Property.countDocuments();
    if (existingCount < 5) {
      const sampleProperties = [
        {
          title: 'Modern 1 BHK Apartment in Hitech City',
          description:
            'A beautifully finished modern 1 BHK apartment situated close to Mindspace IT Park and Cyber Towers. Features modular kitchen, high-speed fiber internet provision, 24/7 security, power backup, and dedicated bike parking. Perfect for IT professionals working in Madhapur.',
          propertyType: 'Apartment',
          monthlyRent: 18000,
          address: 'Flat 402, Sunshine Heights, Madhapur',
          city: 'Hyderabad',
          state: 'Telangana',
          pinCode: '500081',
          bedrooms: 1,
          bathrooms: 1,
          furnishingStatus: 'Semi-Furnished',
          parkingAvailable: true,
          amenities: ['Power Backup', 'Security', 'Lift', 'WiFi Provision', 'Modular Kitchen'],
          images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
          ],
          owner: owners[0]._id,
          availabilityStatus: 'available',
          listingStatus: 'approved'
        },
        {
          title: 'Sea-Facing 2 BHK Flat in MVP Colony',
          description:
            'Spacious 2 BHK coastal apartment overlooking the Bay of Bengal in the prime residential neighborhood of MVP Colony. Open balcony with breezy views, granite countertops, master bedroom with attached bathroom, covered car parking, and round-the-clock water supply.',
          propertyType: 'Apartment',
          monthlyRent: 24000,
          address: 'Plot 88, Sector 4, MVP Colony',
          city: 'Visakhapatnam',
          state: 'Andhra Pradesh',
          pinCode: '530017',
          bedrooms: 2,
          bathrooms: 2,
          furnishingStatus: 'Furnished',
          parkingAvailable: true,
          amenities: ['Sea View', 'Covered Parking', 'Lift', 'Balcony', '24/7 Water Supply', 'Security'],
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
          ],
          owner: owners[1]._id,
          availabilityStatus: 'available',
          listingStatus: 'approved'
        },
        {
          title: 'Spacious 3 BHK Independent House near Benz Circle',
          description:
            'Independent duplex house located right in the heart of Vijayawada near Benz Circle. Large living hall, private garden courtyard, spacious terrace, 3 master bedrooms, separate pooja room, and ample space for 2 car parking.',
          propertyType: 'Independent House',
          monthlyRent: 32000,
          address: 'House No. 12-4, Ring Road, Near Benz Circle',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          pinCode: '520010',
          bedrooms: 3,
          bathrooms: 3,
          furnishingStatus: 'Semi-Furnished',
          parkingAvailable: true,
          amenities: ['Private Garden', 'Terrace', 'Car Parking', 'Pooja Room', 'Security Cameras'],
          images: [
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
          ],
          owner: owners[2]._id,
          availabilityStatus: 'available',
          listingStatus: 'approved'
        },
        {
          title: 'Fully Furnished Luxury 2 BHK in Koramangala',
          description:
            'Architect-designed 2 BHK apartment in Koramangala 4th Block. Complete with Italian marble flooring, smart TV, inverter ACs in both rooms, microwave, washing machine, modular kitchen, and clubhouse access with swimming pool and gymnasium.',
          propertyType: 'Apartment',
          monthlyRent: 42000,
          address: 'Tower B - 601, Green Acres, Koramangala 4th Block',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '560034',
          bedrooms: 2,
          bathrooms: 2,
          furnishingStatus: 'Furnished',
          parkingAvailable: true,
          amenities: ['Swimming Pool', 'Gym', 'Clubhouse', 'Air Conditioned', 'Power Backup', 'Lift'],
          images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
          ],
          owner: owners[0]._id,
          availabilityStatus: 'available',
          listingStatus: 'approved'
        },
        {
          title: 'Executive PG & Co-living Space in Gachibowli',
          description:
            'Premium air-conditioned single and twin-sharing PG rooms tailored for tech professionals in Gachibowli Financial District. Includes 3 times nutritious meals, daily housekeeping, 300 Mbps Wi-Fi, gaming lounge, and laundry service.',
          propertyType: 'PG/Hostel',
          monthlyRent: 9500,
          address: 'Building 14, Telecom Nagar, Gachibowli',
          city: 'Hyderabad',
          state: 'Telangana',
          pinCode: '500032',
          bedrooms: 1,
          bathrooms: 1,
          furnishingStatus: 'Furnished',
          parkingAvailable: true,
          amenities: ['Food Included', 'Daily Housekeeping', 'High-Speed WiFi', 'AC', 'Laundry Facility'],
          images: [
            'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'
          ],
          owner: owners[1]._id,
          availabilityStatus: 'available',
          listingStatus: 'approved'
        },
        {
          title: 'Royal 4 BHK Luxury Villa in Jubilee Hills',
          description:
            'Ultra-luxurious 4 BHK independent villa in prime Jubilee Hills Road No. 36. Boasts a private plunge pool, landscaped lawn, home theatre setup, servant quarters, and advanced biometric smart lock security.',
          propertyType: 'Villa',
          monthlyRent: 85000,
          address: 'Villa 7, Hilltop Enclave, Jubilee Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          pinCode: '500033',
          bedrooms: 4,
          bathrooms: 4,
          furnishingStatus: 'Furnished',
          parkingAvailable: true,
          amenities: ['Private Pool', 'Home Theatre', 'Lawn Garden', 'Servant Room', 'Smart Security'],
          images: [
            'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
          ],
          owner: owners[2]._id,
          availabilityStatus: 'available',
          listingStatus: 'approved'
        },
        {
          title: 'Peaceful 2 BHK Flat in Seethammadhara',
          description:
            'Well-ventilated 2 BHK flat situated in the serene locality of Seethammadhara. Walkable distance to banks, super markets, and reputed schools. Ideal for small families seeking a peaceful residential ambiance.',
          propertyType: 'Apartment',
          monthlyRent: 20000,
          address: 'Door 50-1-12, North Extension, Seethammadhara',
          city: 'Visakhapatnam',
          state: 'Andhra Pradesh',
          pinCode: '530013',
          bedrooms: 2,
          bathrooms: 2,
          furnishingStatus: 'Semi-Furnished',
          parkingAvailable: true,
          amenities: ['Lift', '24/7 Security', 'Balcony', 'Covered Parking', 'Municipal Water'],
          images: [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
          ],
          owner: owners[0]._id,
          availabilityStatus: 'available',
          listingStatus: 'approved'
        },
        {
          title: 'Student & Working Professional PG in Electronic City',
          description:
            'Affordable, sanitized hostel and PG with high speed WiFi, biometric entry, North & South Indian meals, and washing machines. Walking distance to Infosys and Wipro gate.',
          propertyType: 'PG/Hostel',
          monthlyRent: 8000,
          address: 'Phase 1, Near Infosys Gate 4, Electronic City',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '560100',
          bedrooms: 1,
          bathrooms: 1,
          furnishingStatus: 'Furnished',
          parkingAvailable: false,
          amenities: ['WiFi', 'Food Included', 'CCTV', 'RO Drinking Water'],
          images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
          ],
          owner: owners[1]._id,
          availabilityStatus: 'available',
          listingStatus: 'approved'
        }
      ];

      const insertedProperties = await Property.insertMany(sampleProperties);
      console.log(`Inserted ${insertedProperties.length} realistic sample properties.`);

      // 5. Seed sample inquiry
      await RentalInquiry.create({
        tenant: tenants[0]._id,
        property: insertedProperties[0]._id,
        owner: insertedProperties[0].owner,
        message: 'Hello, I am interested in visiting this 1 BHK property this Saturday afternoon. Is that time convenient for you?',
        preferredVisitDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'pending'
      });
      console.log('Sample inquiry seeded.');

      // 6. Seed sample favorite
      await Favorite.create({
        tenant: tenants[0]._id,
        property: insertedProperties[1]._id
      });
      console.log('Sample favorite seeded.');

      // 7. Seed sample contact message
      await ContactMessage.create({
        name: 'Venkatesh Rao',
        email: 'venkatesh.rao@example.com',
        subject: 'Listing Inquiry for Multiple Commercial/Residential Units',
        message: 'Hello, I have 5 rental flats in Visakhapatnam that I would like to list simultaneously on your portal. Do you offer bulk listing services?'
      });
      console.log('Sample contact message seeded.');
    } else {
      console.log(`Database already has ${existingCount} properties. Skipping property insertion.`);
    }

    console.log('Seed process completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Data seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
