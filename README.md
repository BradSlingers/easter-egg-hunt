# Easter Egg Hunt

An Easter-themed hint hunt web application. Players follow sequential clues to real-world locations, using GPS to find virtual Easter eggs — culminating in a final golden egg.

Built for a local Cape Town business as a neighbourhood scavenger hunt experience.

## How It Works

1. Player signs up and logs in
2. A hint is displayed pointing to a real-world location
3. Player travels to where they think the egg is hidden and presses the "Check Location" button
4. The app reads the player's GPS coordinates and sends them to the API, which uses the **Haversine formula** to calculate the distance between the player and the egg
5. If the player is within range, the egg is found and the next hint is revealed
6. Eggs are found sequentially until the player discovers the final **golden egg**

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | HTML, CSS, Vanilla JavaScript, Leaflet.js | I wanted to learn JavaScript fundamentals without a framework abstracting things away |
| **Backend** | Python, FastAPI | Lightweight, fast, and well-suited for building REST APIs with automatic docs |
| **Database** | SQLite with SQLAlchemy Core (raw SQL) | I deliberately chose raw SQL over an ORM to build a solid understanding of SQL fundamentals |
| **Auth** | JWT + bcrypt | Token-based authentication with secure password hashing |
| **Web app vs mobile app** | Progressive web app served over HTTPS | This is a small, once-off event app — players can access it instantly from a browser without downloading anything |

## Getting Started

### Prerequisites

- [Python 3.12+](https://www.python.org/)
- [uv](https://docs.astral.sh/uv/) (Python package manager)

### Installation

```bash
git clone https://github.com/BradSlingers/easter-egg-hunt.git
cd easter-egg-hunt
uv sync
```

### Configuration

Create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key-here

# Egg GPS coordinates (example values — replace with real locations)
LAT_1=-33.9186
LON_1=18.4233
LAT_2=-33.9258
LON_2=18.4232
LAT_3=-33.9308
LON_3=18.4185
```

> **Note:** The GPS coordinates in the `.env` file are the real hunt locations. The example values above point to Cape Town landmarks for testing purposes.

You will also need to add your own egg images to the `static/` directory and reference them in `index.html`.

### Seed the Database

```bash
uv run python seed.py
```

### Run the App

```bash
uv run uvicorn main:app --reload
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

> **Note:** GPS-based location checking requires HTTPS in production. For local testing on a mobile device, you may need to enable insecure origins in Chrome (`chrome://flags` → Insecure origins treated as secure).
## Deployment
The app is currently in development and will be deployed to a production server with HTTPS ahead of its launch date. HTTPS is required for the browser's Geolocation API to function outside of localhost. During development, Cloudflare Tunnel is used to expose the local server over HTTPS for testing on mobile devices.

## What I Learned

**Data flow and API design** — Building every endpoint from scratch gave me a clear understanding of how data moves from the frontend through HTTP requests to API endpoints and back. The more endpoints I built, the more intuitive the request-response cycle became.

**Authentication** — Implementing JWT auth and bcrypt hashing myself gave me a real appreciation for how authentication works. I had to debug and fix my auth flow multiple times, which taught me more than any tutorial could about token management, protected routes, and the difference between authentication and authorisation.

**SQL fundamentals** — Writing raw SQL queries (parameterised with `:param` syntax, not f-strings) forced me to understand exactly what the database is doing, rather than relying on an ORM to handle it behind the scenes.

## Project Structure

```
easter-egg-hunt/
├── main.py            # FastAPI app entry point and static file serving
├── auth.py            # Signup, login, JWT token management
├── hunt.py            # Game endpoints — hints, location checking, progress
├── database.py        # Database connection and table creation
├── models.py          # Pydantic models for request/response validation
├── seed.py            # Seeds the database with egg data
├── test.py            # API tests
├── pyproject.toml     # Project dependencies (managed with uv)
├── static/            # Frontend — HTML, CSS, JS, images
└── .env               # GPS coordinates and secret key (not committed)
```

## License

[MIT](LICENSE)
