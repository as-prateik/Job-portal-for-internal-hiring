const bcrypt = require("bcrypt");
const Auth = require("../models/auth.model");

const User = require("../models/user.model"); // Add this import at the top

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

module.exports = {
  registerUser,
  loginUser,
};
