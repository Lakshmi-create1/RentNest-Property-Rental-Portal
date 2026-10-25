const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Property = require('../models/Property');

describe('Full-Stack Property Rental Portal REST API Tests', () => {
  let tenantToken = '';
  let ownerToken = '';
  let adminToken = '';
  let samplePropertyId = '';

  beforeAll(async () => {
    // Ensure DB connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rental_portal');
    }

    // Login Admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@rentalportal.com', password: 'Admin@12345' });
    if (adminRes.body.token) {
      adminToken = adminRes.body.token;
    }

    // Login Owner
    const ownerRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'rajesh.owner@example.com', password: 'Password@123' });
    if (ownerRes.body.token) {
      ownerToken = ownerRes.body.token;
    }

    // Login Tenant
    const tenantRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'rahul.tenant@example.com', password: 'Password@123' });
    if (tenantRes.body.token) {
      tenantToken = tenantRes.body.token;
    }

    // Get an existing property
    const prop = await Property.findOne({ isDeleted: false });
    if (prop) {
      samplePropertyId = prop._id.toString();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('1. System Health Check', () => {
    it('GET /api/health should return status 200 and success', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('healthy');
    });
  });

  describe('2. Authentication & Authorization Security', () => {
    it('POST /api/auth/register should create a new tenant', async () => {
      const uniqueEmail = `testuser_${Date.now()}@example.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Unit Test User',
          email: uniqueEmail,
          phone: '+91 9123456789',
          password: 'Password@123',
          role: 'tenant'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('tenant');
    });

    it('POST /api/auth/register should REJECT self-assigned admin role', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Hacker Admin',
          email: `hacker_${Date.now()}@example.com`,
          phone: '+91 9999999999',
          password: 'Password@123',
          role: 'admin'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Administrator registration cannot be performed');
    });

    it('POST /api/auth/register should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate User',
          email: 'rahul.tenant@example.com',
          phone: '+91 9999999999',
          password: 'Password@123',
          role: 'tenant'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    it('POST /api/auth/login should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'rahul.tenant@example.com',
          password: 'WrongPassword999'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/auth/me should return user details with valid JWT', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${tenantToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe('rahul.tenant@example.com');
      expect(res.body.user.password).toBeUndefined(); // never expose password
    });

    it('Role Guard: Tenant should be blocked (403) from accessing admin routes', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${tenantToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Role Guard: Admin should successfully access admin routes', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.users).toBeInstanceOf(Array);
    });
  });

  describe('3. Property Listings & Search Filters', () => {
    it('GET /api/properties should return list of approved properties', async () => {
      const res = await request(app).get('/api/properties');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.properties.length).toBeGreaterThan(0);
      expect(res.body.total).toBeGreaterThan(0);
    });

    it('GET /api/properties with city filter should filter correctly', async () => {
      const res = await request(app).get('/api/properties?city=Hyderabad');
      expect(res.statusCode).toBe(200);
      res.body.properties.forEach((p) => {
        expect(p.city.toLowerCase()).toContain('hyderabad');
      });
    });

    it('GET /api/properties/:id should return single property with details', async () => {
      const res = await request(app).get(`/api/properties/${samplePropertyId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.property._id).toBe(samplePropertyId);
      expect(res.body.property.owner).toBeDefined();
    });
  });

  describe('4. Favorites & Rental Inquiries Flow', () => {
    it('GET /api/favorites should return tenant favorites', async () => {
      const res = await request(app)
        .get('/api/favorites')
        .set('Authorization', `Bearer ${tenantToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.favorites).toBeInstanceOf(Array);
    });

    it('Owner should be able to get their own properties', async () => {
      const res = await request(app)
        .get('/api/properties/my')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.properties).toBeInstanceOf(Array);
    });

    it('Admin dashboard stats should return valid counts', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.stats).toBeDefined();
      expect(res.body.stats.users.total).toBeGreaterThan(0);
      expect(res.body.stats.properties.total).toBeGreaterThan(0);
    });
  });
});
