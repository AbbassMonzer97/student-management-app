# Student Management App

A modern React application for managing students and their class enrollments. Built with React, Vite, Tailwind CSS, and Axios.

## Features

- **Student Listing**: View paginated list of students with their enrolled classes
- **Add Student**: Create new students and assign them to classes
- **Edit Student**: Update student information and class enrollments
- **Delete Student**: Remove students with confirmation dialog
- **Responsive Design**: Works on desktop and tablet devices
- **Modern UI**: Clean, minimal interface with loading states and error handling

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client for API calls

## Project Structure

```
src/
├── api/
│   ├── client.js          # Axios instance with base configuration
│   ├── studentsApi.js     # Student-related API calls (CRUD operations)
│   └── classesApi.js      # Class-related API calls
├── components/
│   ├── Layout.jsx         # Main layout wrapper
│   ├── StudentTable.jsx   # Table displaying students list
│   ├── StudentForm.jsx    # Form for creating/editing students
│   ├── Pagination.jsx    # Pagination controls
│   ├── ConfirmDialog.jsx # Delete confirmation dialog
│   └── Toast.jsx         # Toast notification component
├── pages/
│   └── StudentsPage.jsx  # Main page with student management logic
├── App.jsx               # Root component
├── main.jsx              # Application entry point
└── index.css             # Global styles and Tailwind imports
```

## Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure API URL (if needed):**
   The API base URL is configured in `src/api/client.js`. Update the `BASE_URL` constant if your API endpoint changes.

## Running the Application

**Start the development server:**

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

**Build for production:**

```bash
npm run build
```

**Preview production build:**

```bash
npm run preview
```

## API Integration

The application connects to the Student Management API. The API base URL is:

```
https://app-inttask-api-g2axe2gvgqgadyha.westeurope-01.azurewebsites.net
```

### API Endpoints Used

- `GET /api/Student` - Get paginated list of students
- `GET /api/Class` - Get all available classes
- `POST /api/Student` - Create a new student
- `PUT /api/Student/{id}` - Update an existing student
- `DELETE /api/Student/{id}` - Delete a student

**Note:** The API client includes fallback logic to try alternative endpoint patterns (`/api/students`, `/api/classes`) if the primary endpoints return 404.

## Main Features

### Students Page (`src/pages/StudentsPage.jsx`)

- Fetches and displays students with pagination (5 students per page)
- Handles loading, error, and empty states
- Manages modal dialogs for add/edit forms and delete confirmation
- Shows toast notifications for success/error messages

### Student Form (`src/components/StudentForm.jsx`)

- Supports both "name" field and "firstName/lastName" fields (adapts to API structure)
- Multi-select class enrollment with checkboxes
- Form validation (required fields, email format)
- Loading states during submission

### Student Table (`src/components/StudentTable.jsx`)

- Displays student information in a responsive table
- Shows enrolled classes as badges/pills
- Edit and Delete action buttons
- Loading skeleton and empty state handling

## Configuration

### Changing the API Base URL

Edit `src/api/client.js`:

```javascript
const BASE_URL = "https://your-api-url.com";
```

### Adjusting Pagination

Edit `src/pages/StudentsPage.jsx`:

```javascript
const pageSize = 5; // Change this value
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- All components use functional components with React hooks
- The API client includes error interceptors for consistent error handling
- The application handles various API response structures for flexibility
- Form validation is performed on the client side before submission

## API Improvements

See `API_IMPROVEMENTS.md` for suggestions on improving the backend API, including security, structure, data modeling, and documentation recommendations.
