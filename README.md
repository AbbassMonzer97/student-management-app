# Student Management System

A modern React application for managing students and their class enrollments with a clean, intuitive interface.

## ✨ Features

- **Student Management**: Create, read, update, and delete student records
- **Class Management**: Assign multiple classes to students
- **Pagination**: Navigate through student records efficiently
- **Interactive Chatbot**: AI-powered assistant for help and guidance
- **Form Validation**: Real-time validation with React Hook Form
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## 🛠 Technologies

- **React 18.2.0** - UI library
- **Vite 5.0.8** - Build tool
- **React Hook Form** - Form management
- **Axios 1.6.0** - HTTP client
- **Tailwind CSS 3.4.0** - Styling

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Create .env file
VITE_API_BASE_URL=http://your-api-base-url
VITE_CHATBOT_API=https://your-chatbot-webhook-url

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # API service layer
└── types/          # Data transfer objects
```

## 🔄 Recent Improvements

1. **React Hook Form Integration** - Migrated from manual form state to React Hook Form for better performance
2. **Optimized State Management** - Grouped related states to minimize re-renders
3. **Service Layer Refactoring** - Renamed `api/` to `services/` with cleaner naming
4. **Enhanced Error Handling** - Improved error interceptor with HTML response handling
5. **Component Improvements** - Added forwardRef support, fixed event handlers

### Design Decisions

For simplicity, I intentionally choose not to use:

- **API Context or State Management Libraries** (Redux, Zustand, etc.) - The project is small enough that local state management is sufficient
- **useReducer** - While it could reduce useState calls, the current grouped state approach is simpler for this scale
- **Separate UI Component Folders** - Could create `forms/` or `inputs/` folders for reusable components, but the current structure is adequate for the project size

These decisions were made consciously to keep the codebase simple and maintainable for a small-scale application, while still following React best practices.

## ⚙️ Configuration

### Environment Variables

- `VITE_API_BASE_URL` - Base URL for student management API
- `VITE_CHATBOT_API` - Webhook URL for chatbot service

### API Endpoints

- `GET /api/Student` - Get students (with pagination)
- `GET /api/Student/:id` - Get single student
- `POST /api/Student` - Create student
- `PUT /api/Student/:id` - Update student
- `DELETE /api/Student/:id` - Delete student
- `GET /api/Class` - Get all classes

### Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

**Last Updated**: January 2025
