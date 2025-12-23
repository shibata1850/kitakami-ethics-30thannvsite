import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as db from "../db";
import { ENV } from "../_core/env";

const router = Router();

// JWT secret (should be in environment variables)
const JWT_SECRET = ENV.jwtSecret || "your-secret-key-change-this";
const JWT_EXPIRES_IN = "7d"; // 7 days

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with pending_approval status
    await db.upsertUser({
      name,
      email,
      password: hashedPassword,
      companyName: companyName || null,
      loginMethod: "email",
      role: "user",
      status: "pending_approval",
    });

    // Get the created user
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    // Send approval request emails to all admins
    const admins = await db.getAdminUsers();
    // TODO: Implement email sending to admins
    console.log(`[Auth] New user registration: ${email}, awaiting approval from ${admins.length} admins`);

    res.status(201).json({
      message: "Registration successful. Your account is pending approval from administrators.",
      userId: user.id,
    });
  } catch (error) {
    console.error("[Auth] Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Get user by email
    const user = await db.getUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if user is approved
    if (user.status !== "active") {
      return res.status(403).json({ error: "Your account is pending approval" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role } as JWTPayload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Update last signed in
    await db.upsertUser({
      email: user.email,
      name: user.name,
      lastSignedIn: new Date(),
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    console.error("[Auth] Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get current user (requires authentication)
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    const user = await db.getUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      companyName: user.companyName,
    });
  } catch (error) {
    console.error("[Auth] Get current user error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Get pending approval users (admin only)
router.get("/pending-users", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const pendingUsers = await db.getPendingApprovalUsers();
    res.json(pendingUsers);
  } catch (error) {
    console.error("[Auth] Get pending users error:", error);
    res.status(500).json({ error: "Failed to get pending users" });
  }
});

// Approve user (admin only)
router.post("/approve/:userId", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const userId = parseInt(req.params.userId);
    const { comment } = req.body;

    await db.approveUser(userId, decoded.userId, comment);

    // TODO: Send approval notification email to the user

    res.json({ message: "User approved successfully" });
  } catch (error) {
    console.error("[Auth] Approve user error:", error);
    res.status(500).json({ error: "Failed to approve user" });
  }
});

export default router;
