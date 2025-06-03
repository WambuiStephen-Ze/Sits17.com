# Roor-level project overview

run npm install to install all dependencies
# Roor-level project overview

# Developer 1: Database & Models
# Task 1: Database Design
Sitter Profile Table:
	name (String)
	profilePic (String - URL or file path)
	experience (String or Array - e.g., years or skills)
	location (String or GeoJSON for coordinates)
	availability (Boolean or Array of time slots)
User Profile Table:
	name (String)
	profilePic (String - URL or file path)
	location (String or GeoJSON)
	numberOfChildren (Integer)
Booking Confirmation Table:
	 bookedSitters (Array of sitter IDs)
	userId (Foreign key to user profile)
	confirmationEmail (Boolean or Timestamp)
	bookingDate (Date)
	status (Enum - e.g., pending, confirmed, completed)
Using  the right relational database

# Developer 3: Dependencies & Security
# Task 3: Node.js Dependencies
Express.js: For building the RESTful API.
	 Sequelize: ORM for database interaction (depending on DB choice).
	Nodemailer: For sending confirmation emails.
	jsonwebtoken: For user authentication and securing endpoints.
	bcryptjs: For hashing user passwords.
	cors: To handle cross-origin requests.
	dotenv: For environment variable management.
# Task 4: Authentication & Security
Implement JWT (JSON Web Tokens) for user authentication.
	Use environment variables for sensitive data (e.g., API keys, database credentials).
	Validate input data to prevent SQL injection or other vulnerabilities.

# Developer 4: Business Logic & Matching
# Task 5: Business Logic
Matching Algorithm: Logic to match sitters with users based on location, availability, and number of children.
Booking Confirmation: Automate email notifications using Nodemailer when a sitter is booked.
Report Feature: Generate and store reports (e.g., booking history) if feasible.
Zoom Integration: API integration for video calls with sitters (requires Zoom API credentials).

# Developer 6: Testing, Scaling & Error Handling
# Task 8: Additional Considerations
Scalability: Use a load balancer or cluster module for handling multiple requests.
Error Handling: Implement middleware for consistent error responses.
Testing: Use Jest or Mocha for unit and integration tests.