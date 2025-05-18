# Ikou - Japanese Learning Platform

Ikou is a modern web application designed to help users learn Japanese through interactive games and exercises. The app features an engaging hiragana/katakana recognition game, detailed performance analytics, and personalized learning paths.

![Ikou Screenshot](public/images/robot.jpg)

## Features

- **Interactive Japanese Language Games**: Practice recognizing hiragana, katakana, and romaji characters through engaging gameplay
- **User Authentication**: Secure login system with Google OAuth and email/password options
- **Personalized Dashboard**: Track your progress with detailed statistics and insights
- **Performance Analytics**: Visualize your accuracy and identify challenging characters
- **Responsive Design**: Beautiful UI that works across desktop and mobile devices
- **Audio Pronunciation**: Listen to correct pronunciations of Japanese characters

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI
- **Styling**: TailwindCSS, Radix Themes
- **Charts**: Chart.js, React-Chartjs-2
- **Form Handling**: React Hook Form, Zod

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ikou.git
   cd ikou
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following environment variables:

   ```
   # DATABASE CONFIGURATION
   # Format: postgresql://username:password@hostname:port/database_name
   DATABASE_URL="postgresql://postgres:password@localhost:5432/ikou_db"

   # NEXTAUTH CONFIGURATION
   # Base URL of your application
   NEXTAUTH_URL="http://localhost:3000"
   # A secret key used to encrypt tokens
   NEXTAUTH_SECRET="your-nextauth-secret-key"

   # GOOGLE OAUTH (if using Google authentication)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # APPLICATION PATH (for file operations)
   ROOT_PATH="/absolute/path/to/your/ikou/project"
   ```

4. Set up the database:

   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables Configuration

### Required Variables

- **DATABASE_URL**: The connection string for your PostgreSQL database. You should replace:

  - `postgres`: with your database username
  - `password`: with your database password
  - `localhost`: with your database host (usually localhost for development)
  - `5432`: with your database port (default is 5432 for PostgreSQL)
  - `ikou_db`: with your database name

- **NEXTAUTH_URL**: The base URL of your application. In development, this will be `http://localhost:3000`

- **NEXTAUTH_SECRET**: A secure secret key used to encrypt tokens. You can generate one with:
  ```bash
  openssl rand -base64 32
  ```

### Optional Variables

- **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET**: Required if using Google authentication. To set up Google OAuth:

  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select an existing one
  3. Navigate to "APIs & Services" > "Credentials"
  4. Click "Create Credentials" > "OAuth client ID"
  5. Select "Web application" and provide a name
  6. Add authorized JavaScript origins: `http://localhost:3000` (for development)
  7. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
  8. Copy the provided Client ID and Client Secret to your `.env` file

- **ROOT_PATH**: The absolute path to your project directory. This is used for file operations such as audio file access. Examples:
  - macOS/Linux: `/Users/yourusername/projects/ikou`
  - Windows: `C:\Users\yourusername\projects\ikou`

### Development vs Production

For production deployment, you'll need to update these values:

- **DATABASE_URL**: Should point to your production database
- **NEXTAUTH_URL**: Should be your production domain (e.g., `https://your-domain.com`)
- **NEXTAUTH_SECRET**: Should be different from development for security
- **ROOT_PATH**: Should point to your production server path

### Testing Your Environment

After setting up your environment variables, you can verify they're working correctly by:

1. Running the application with `npm run dev`
2. Checking that you can connect to the database (no database connection errors)
3. Testing the authentication flow (sign in/sign up should work)
4. Verifying that audio files play correctly in the game (requires proper ROOT_PATH)

## Database Setup

The application uses Prisma ORM with a PostgreSQL database. The schema includes:

- Users with authentication information
- Japanese characters (hiragana, katakana, romaji)
- Game sessions and round details
- Performance statistics

## Project Structure

- `/src/app`: Main application routes and API endpoints
- `/src/components`: Reusable UI components
- `/src/components/game.tsx`: Core game functionality
- `/public`: Static assets including images and audio files
- `/prisma`: Database schema and migrations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- The Next.js team for the amazing framework
- Radix UI for the accessible component library
- All contributors who have helped make this project better
