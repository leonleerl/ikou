# IKOU - Japanese Hiragana & Katakana Learning Platform

IKOU is an interactive web application designed to help users learn and practice Japanese hiragana and katakana characters through engaging exercises and a user-friendly interface.

## Features

- 📝 Learn both hiragana and katakana character sets
- 🔊 Audio pronunciation for each character
- 🎮 Interactive practice modes with real-time feedback
- 📊 Track your learning progress and scores
- 📱 Responsive design for desktop and mobile devices

## Technologies

- Next.js 15.3
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM with PostgreSQL
- Shadcn UI components

## Getting Started

### Prerequisites

- Node.js 18.x or later
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
   ```

3. Set up environment variables by creating a `.env` file in the root directory:

   ```
   DATABASE_URL="your-database-connection-string"
   NEXT_PUBLIC_AUDIO_PATH="/audio"
   ```

4. Set up the database:

   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
ikou/
├── public/           # Static files and audio
│   └── audio/        # Character pronunciation audio files
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # Reusable UI components
│   │   └── jp/       # Japanese learning components
│   ├── lib/          # Utility functions and shared logic
│   └── prisma/       # Database schema and migrations
└── ...
```

## Usage

- Navigate to the practice section to start learning
- Select characters to hear their pronunciation
- Complete exercises to test your knowledge
- Track your progress through the scoring system

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## Deployment

The application can be deployed to Vercel or any other Next.js compatible hosting service:

```bash
npm run build
npm run start
```

## Contributing

Contributions are welcome! Please feel free to make issues and to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped with the development
- Japanese language resources and audio materials

```bash
npm run dev
```

## Deployments
