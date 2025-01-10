# CinemaTech Website Project

Welcome to the Movie Website project! This repository contains the code and assets for a comprehensive platform where users can browse, review, and discover movies.

## Features

- **Movie Database**: Detailed information about movies including descriptions, genres, release dates, and more.
- **Search Functionality**: Quickly find movies by title, genre, or other criteria.
- **User Reviews**: Users can leave reviews and ratings for movies.
- **Dynamic Content**: Interactive and visually engaging UI with dynamically loaded content.
- **Responsive Design**: Fully optimized for desktop and mobile devices.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Vite.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (or any other database system if different)
- **APIs**: Integration with movie-related APIs like TMDB (The Movie Database) for fetching movie data.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (if used)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/OFEKve/CinemaTech.git
   cd movie-website
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following:

   ```env
   DATABASE_URL=your-database-url
   API_KEY=your-api-key
   PORT=3000
   ```

4. Start the development server:

   ```bash
   npm run client
   ```

5. Access the client at `https://cinematech-1.onrender.com`.

6. Start the server:
   ```bash
   npm run server
   ```

### Building for Production

To create a production build:

```bash
npm run build
```

The build files will be generated in the `dist` folder. You can then serve them using a static file server.

## Usage

- Browse movies by categories or search for specific titles.
- Click on a movie to view detailed information and reviews.
- Sign in to leave a review or rating.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for their amazing API.
- Open-source contributors and libraries that made this project possible.
