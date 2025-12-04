# Secure Event Booking & Management System - Frontend

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Security Features](#security-features)
- [Setup Instructions](#setup-instructions)
- [Pages and Routes](#pages-and-routes)
- [Code Quality & Security](#code-quality--security)
- [Testing](#testing)
- [Directory Structure](#directory-structure)
- [Contributing](#contributing)

## Overview

This is the frontend application for a secure event booking and management system. Built with React and Vite, it provides a modern, responsive user interface for browsing events, managing bookings, and administering the system. The application communicates with a secure backend API and implements client-side security best practices.

The frontend handles user authentication flows, event browsing and booking, profile management, and provides administrative interfaces for system management. All API communications are secured with proper authentication tokens and error handling.

## Features

### User Features

#### Authentication
- User registration with validation
- Secure login with token-based authentication
- Automatic logout on token expiration
- Protected route navigation

#### Event Browsing
- Browse all available events
- Search events by title or category
- Filter events by category
- View detailed event information
- See available seats and ticket types

#### Booking Management
- Book events with ticket type selection
- Select quantity for bookings
- View booking history
- Cancel confirmed bookings
- See booking status and details

#### Profile Management
- Update profile information (name, email)
- Change password securely
- View account details

#### Reviews
- Submit reviews and ratings for events
- View approved reviews on event pages
- One review per event per user

### Admin Features

#### Event Management
- Create new events with details
- Update existing events
- Delete events
- Upload event images
- Set event capacity and ticket types
- Manage event categories

#### Booking Oversight
- View all bookings across all users
- See user information for each booking
- Monitor booking statuses

#### Review Moderation
- View pending reviews
- Approve or reject reviews
- Manage review visibility

#### System Logs
- View comprehensive activity logs
- Filter and paginate logs
- See user actions and IP addresses
- Monitor system activity

## Security Features

The frontend implements several security measures:

### Authentication Security
- JWT tokens stored in HttpOnly cookies (handled by backend)
- Automatic token refresh handling
- Protected routes require authentication
- Admin routes require admin role

### Input Validation
- Client-side validation for all forms
- Email format validation
- Password strength requirements
- Input sanitization

### Secure API Communication
- All API calls use HTTPS in production
- Credentials included in requests
- Proper error handling without exposing sensitive data
- Automatic redirect on authentication failure

### XSS Prevention
- React's built-in XSS protection
- No direct HTML injection
- Safe rendering of user content

### Route Protection
- Protected routes check authentication
- Admin routes verify user role
- Automatic redirect to login when needed
- Prevents unauthorized access

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```
   
   Production files will be in the `dist` directory

### Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality and style

### Default Test Accounts

- **Admin**: `admin@ems.com` / `Admin@2024`
- **User**: `user@ems.com` / `User@2024`

**Note:** These passwords meet the strong password requirements (8+ characters, uppercase, lowercase, number, and special character).

## Pages and Routes

### Public Routes

- `/` - Redirects to events page
- `/login` - User login page
- `/register` - User registration page
- `/events` - Browse all events
- `/events/:id` - Event details and booking

### Protected Routes (Requires Authentication)

- `/bookings` - User booking history
- `/profile` - User profile management

### Admin Routes (Requires Admin Role)

- `/admin/events` - Event management
- `/admin/categories` - Category management
- `/admin/bookings` - All bookings view
- `/admin/reviews` - Review moderation
- `/admin/logs` - Activity logs

## Code Quality & Security

### ESLint

The project uses ESLint with React plugins for code quality and consistency. Run linting checks with:

```bash
npm run lint
```

ESLint is configured to:
- Enforce React best practices and hooks rules
- Check for unused variables and imports
- Ensure consistent code style
- Validate JSX patterns
- Prevent common React mistakes

All code should pass ESLint checks before committing. Unused variables can be prefixed with `_` to indicate intentional non-use.

### npm audit

Regular security audits are performed to check for vulnerable dependencies:

```bash
npm audit
```

To automatically fix vulnerabilities (when possible):

```bash
npm audit fix
```

**Current Status**: All dependencies are secure with no known vulnerabilities. Vite has been updated to version 6.x to address previous esbuild vulnerabilities.

## Testing

### Manual Testing

#### User Flow Testing
1. Register a new user account
2. Login with credentials
3. Browse events and use search/filter
4. View event details
5. Create a booking
6. View booking history
7. Cancel a booking
8. Update profile information
9. Submit a review

#### Admin Flow Testing
1. Login as admin user
2. Create a new event
3. Upload event image
4. Manage categories
5. View all bookings
6. Moderate reviews
7. View activity logs

#### Security Testing
- Try accessing protected routes without login
- Try accessing admin routes as regular user
- Test form validation with invalid inputs
- Verify automatic logout on token expiration
- Test error handling and display

### Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Directory Structure

```
event-management-frontend/
├── src/
│   ├── components/
│   │   ├── AdminRoute.jsx       # Admin-only route wrapper
│   │   ├── Navbar.jsx           # Navigation bar component
│   │   └── ProtectedRoute.jsx   # Authenticated route wrapper
│   ├── pages/
│   │   ├── AdminBookings.jsx    # Admin bookings view
│   │   ├── AdminCategories.jsx  # Category management
│   │   ├── AdminEvents.jsx      # Event management
│   │   ├── AdminLogs.jsx        # Activity logs view
│   │   ├── AdminReviews.jsx     # Review moderation
│   │   ├── Bookings.jsx         # User bookings view
│   │   ├── EventDetail.jsx      # Event details and booking
│   │   ├── Events.jsx            # Events listing page
│   │   ├── Login.jsx            # Login page
│   │   ├── Profile.jsx          # User profile management
│   │   └── Register.jsx         # Registration page
│   ├── services/
│   │   ├── api.js               # Axios instance configuration
│   │   ├── authService.js       # Authentication API calls
│   │   ├── bookingService.js    # Booking API calls
│   │   ├── categoryService.js   # Category API calls
│   │   ├── eventService.js      # Event API calls
│   │   ├── logService.js         # Log API calls
│   │   ├── reviewService.js     # Review API calls
│   │   └── userService.js       # User API calls
│   ├── App.jsx                  # Main app component and routing
│   ├── index.css                # Global styles
│   └── main.jsx                # Application entry point
├── index.html                   # HTML template
├── package.json
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint configuration
└── README.md
```

## Contributing

### Code Style

- Use functional components with hooks
- Follow React best practices
- Use meaningful component and variable names
- Keep components focused and reusable
- Use CSS for styling (no inline styles for complex styles)

### Component Guidelines

- Create reusable components in the components directory
- Keep page components in the pages directory
- Use service layer for all API calls
- Implement proper error handling
- Add loading states for async operations

### Styling Guidelines

- Use consistent color scheme
- Maintain responsive design
- Follow accessibility best practices
- Use semantic HTML elements
- Keep styles organized in index.css

### Adding New Features

1. Create page component in pages directory
2. Add route in App.jsx
3. Create service functions for API calls
4. Add proper authentication checks
5. Implement error handling
6. Add loading states
7. Run ESLint and fix any issues
8. Update this README if adding new routes

### State Management

- Use React hooks (useState, useEffect) for local state
- Pass props for component communication
- Use context if needed for global state
- Keep state as local as possible

### API Integration

- All API calls go through service layer
- Use the configured axios instance from api.js
- Handle errors gracefully
- Show user-friendly error messages
- Implement proper loading states

### Reporting Issues

When reporting bugs or issues:
- Describe the steps to reproduce
- Include browser and version information
- Provide screenshots if applicable
- Include console errors if any
- Specify the page or component affected
