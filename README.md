# Event Management Frontend

Secure Event Booking & Management System Frontend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with:
```
VITE_API_URL=http://localhost:5000
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Folder Structure

```
frontend/
  src/
    pages/          # Page components
    components/      # Reusable components
    services/       # API service layer
  README.md
```

## Technologies Used

- React 18
- Vite
- React Router DOM
- Axios
- CSS3

## Features

### User Features
- User registration and login
- Browse events with category filtering and search
- Book events with ticket type selection
- Cancel bookings
- View booking history
- Update profile (name, email, password)
- Add reviews and ratings for events

### Admin Features
- Manage events (CRUD operations)
- Manage event categories
- Set event capacity and ticket types
- Upload event images
- View all bookings
- Moderate reviews (approve/reject)
- View system activity logs

## Security Features

- Protected routes for authenticated users
- Admin-only routes with role verification
- Secure API communication with credentials
- Automatic token refresh handling
- Input validation on client side

## Pages

- `/login` - User login
- `/register` - User registration
- `/events` - Browse all events
- `/events/:id` - Event details and booking
- `/bookings` - User booking history
- `/profile` - User profile management
- `/admin/events` - Manage events (admin)
- `/admin/categories` - Manage categories (admin)
- `/admin/bookings` - View all bookings (admin)
- `/admin/reviews` - Moderate reviews (admin)
- `/admin/logs` - View activity logs (admin)
