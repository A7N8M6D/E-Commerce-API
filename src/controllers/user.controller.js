import { User } from "../models/user.model.js";

/*
 
 
-----------------        GenerAccessToken        -----------------


*/
const GenerAccessToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    console.log(user);
    const accessToken = user.generatorAccesssToken();
    console.log("start");
    console.log("accesstoken" + JSON.stringify(accessToken));
    console.log("1 accesss Token" + accessToken);
    user.refreshToken = accessToken;
    await user.save({
      validateBeforeSave: false,
    });
    console.log(user);
    return { accessToken };
  } catch (error) {
    console.error("Error while generating refresh and access tokens:", error);
    // If this is part of an Express route, you can return res.status(500).json(), otherwise throw the error
    throw new Error(
      "Something went wrong while generating refresh and access token"
    );
  }
};

/*
 
 
-----------------        SignUp User        -----------------


*/
const registerUser = async (req, res) => {
  const { username, email, userType, password, location, number, fullname } =
    req.body;

  // Debugging logs
  console.log("email", email);
  console.log("location", location);
  console.log("username", username);
  console.log("userType", userType);
  console.log("password", password);
  console.log("number", number);

  // Validate required fields
  if (
    [username, email, password, userType, location].some(
      (field) => field?.trim() === ""
    )
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!number) {
    return res.status(400).json({ error: "Number field is required" });
  }

  try {
    // Check if user already exists by username or email
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) {
      return res
        .status(409)
        .json({ error: "User with this email or username already exists" });
    }

    // Validate userType
    if (userType !== "user") {
      return res.status(400).json({ error: "Invalid userType" });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      fullname,
      userType,
      password,
      location,
      number,
    });

    // Remove sensitive fields and return the user object
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      return res
        .status(500)
        .json({ error: "Something went wrong with the registration" });
    }

    // Return success response
    return res
      .status(201)
      .json({ message: "User created successfully", user: createdUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
/*
 
 
-----------------        Sign Ip User        -----------------


*/
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate request
  if (!email) {
    return res.status(400).json({ error: "Email is required!" });
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "User does not exist!" });
  }

  // Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid password!" });
  }

  // Generate tokens
  const { accessToken } = await GenerAccessToken(user.id);

  // Fetch logged-in user data, excluding sensitive fields
  const loggedInUser = await User.findById(user._id).select("-password ");

  // Set cookies with options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  };

  // Send response with tokens and user data
  return res.status(200).cookie("accessToken", accessToken, options).json({
    message: "User logged in successfully!",
    user: loggedInUser,
    accessToken,
  });
};
/*
 
 
-----------------        Get User Profile       -----------------


*/
const GetCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    console.log("user in controler", user);

    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }
    console.log("User in Controller of Profile Level 0");
    // Fetch bonds associated with the user
    return res.status(200).json({ user, message: "User fetched successfully" });
  } catch (error) {
    return res.status(500).json("An error occurred");
  }
};

export { registerUser, loginUser, GetCurrentUser };
