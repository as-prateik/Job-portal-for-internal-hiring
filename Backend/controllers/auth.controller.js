const bcrypt = require("bcrypt");
const Auth = require("../models/auth.model");

const User = require("../models/user.model"); 

const registerUser = async (req, res) => {
  try {
    const { username, password, role, name, email, phone, skills, certifications } = req.body;

    // Check if user exists
    const existingUser = await Auth.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in Auth collection
    const newUser = new Auth({ username, password: hashedPassword, role });
    await newUser.save();

    // Auto-generate email if not provided
    const userEmail = email && email.trim() !== "" ? email : `${username}@infosys.com`;

    // Create user profile in User collection
    const userProfile = new User({
      authId: newUser._id,
      name: name || username,
      role: role || "employee",
      email: userEmail,
      phone: phone || "",
      skills: skills || [],
      certifications: certifications || []
    });
    await userProfile.save();
    console.log('User profile created:', userProfile);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// const registerUser = async (req, res) => {
//   try {
//     const { username, password, role, name, email, phone, skills, certifications } = req.body;

//     // Check if user exists
//     const existingUser = await Auth.findOne({ username });
//     if (existingUser)
//       return res.status(400).json({ message: "Username already exists" });

//     // Hash the password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Create user in Auth collection
//     const newUser = new Auth({ username, password: hashedPassword, role });
//     await newUser.save();

//     // Create user profile in User collection
//     const userProfile = new User({
//       authId: newUser._id,
//       name: name || username,
//       email: email || "",
//       phone: phone || "",
//       skills: skills || [],
//       certifications: certifications || []
//     });
//     await userProfile.save();
//     console.log('User profile created:', userProfile);
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Registration failed" });
//   }
// };

// const registerUser = async (req, res) => {
//   try {
//     const { username, password, role } = req.body;

//     // Check if user exists
//     const existingUser = await Auth.findOne({ username });
//     if (existingUser)
//       return res.status(400).json({ message: "Username already exists" });

//     // Hash the password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Create user
//     const newUser = new Auth({ username, password: hashedPassword, role });
//     // const newUser = new Auth({ username, password: password, role });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Registration failed" });
//   }
// };

const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Auth.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId; // Populated from JWT middleware
    const { oldPassword, newPassword } = req.body;

    // 1. Fetch user
    const user = await Auth.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect old password' });

    // 3. Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // 4. Update
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error in changePassword:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword
};
