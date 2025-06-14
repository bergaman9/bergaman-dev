# 🐉 Bergaman Portfolio v2.0 - The Dragon's Domain

A cutting-edge, full-stack portfolio website with integrated admin panel, MongoDB backend, and real-time content management. Built with Next.js 15, featuring AI & Blockchain developer content, dynamic blog system, and advanced admin capabilities.

## ✨ What's New in v2.0

- 🗄️ **MongoDB Integration**: Full database backend with dynamic content
- 🛠️ **Admin Panel**: Complete content management system
- ✏️ **Live Edit Mode**: Edit content directly on the site
- 📊 **Real-time Analytics**: Dynamic views, likes, and engagement tracking
- 🔄 **Auto Migration**: Seamless data migration from static to dynamic
- 🎯 **Advanced SEO**: Dynamic metadata and structured data
- 🚀 **GitHub Actions**: Automated versioning and deployment

## 🚀 Key Features

### 🎨 Frontend Excellence
- **Modern Design**: Circuit board animated background with cyberpunk aesthetics
- **Responsive**: Mobile-first design optimized for all devices
- **Interactive UI**: Advanced hover effects, animations, and smooth transitions
- **Performance**: Optimized images, fonts, and code splitting
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation

### 🗄️ Backend Power
- **MongoDB Database**: Scalable document storage
- **RESTful API**: Complete CRUD operations
- **Real-time Updates**: Live content synchronization
- **Data Migration**: Automated legacy data import
- **Analytics Tracking**: View counts, likes, and engagement metrics

### 🛠️ Admin System
- **Dashboard**: Comprehensive overview with statistics
- **Content Management**: Create, edit, delete blog posts
- **Live Preview**: Real-time content preview
- **Edit Mode**: On-site editing capabilities
- **SEO Management**: Meta tags, descriptions, and keywords
- **Media Management**: Image uploads and optimization

### 📊 Analytics & SEO
- **Dynamic Metadata**: Auto-generated SEO tags
- **Structured Data**: Schema.org markup for search engines
- **Sitemap Generation**: Automatic XML sitemap updates
- **Performance Monitoring**: Core Web Vitals tracking
- **Social Sharing**: Open Graph and Twitter Cards

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: Next.js 15+ (App Router)
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS
- **Authentication**: Custom admin authentication
- **Deployment**: Vercel with GitHub Actions

### Libraries & Tools
- **Fonts**: Inter (Google Fonts) + Geist (Local)
- **Icons**: FontAwesome 6.5.1
- **Analytics**: Vercel Analytics
- **Image Optimization**: Next.js Image component
- **Form Handling**: React Hook Form
- **State Management**: React Hooks

## 📁 Project Structure

```
bergaman-dev/
├── .github/
│   └── workflows/        # GitHub Actions
├── public/
│   ├── images/          # Static images
│   ├── favicon.ico      # Favicon
│   └── site.webmanifest # PWA manifest
├── src/
│   ├── app/
│   │   ├── (admin)/     # Admin panel routes
│   │   │   └── admin/   # Admin pages
│   │   ├── api/         # API routes
│   │   │   └── admin/   # Admin API endpoints
│   │   ├── blog/        # Blog pages
│   │   ├── portfolio/   # Portfolio page
│   │   ├── about/       # About page
│   │   ├── suggestions/ # Suggestions page
│   │   ├── components/  # Reusable components
│   │   ├── fonts/       # Local font files
│   │   ├── layout.js    # Root layout
│   │   ├── page.js      # Home page
│   │   ├── globals.css  # Global styles
│   │   ├── sitemap.js   # Dynamic sitemap
│   │   └── robots.js    # Robots.txt
│   ├── data/
│   │   └── blogPosts.js # Legacy blog content (for migration)
│   ├── hooks/
│   │   └── useAdminMode.js # Admin mode hook
│   ├── lib/
│   │   ├── constants.js # Site configuration
│   │   └── mongodb.js   # Database connection
│   └── models/
│       └── BlogPost.js  # MongoDB schemas
└── ...
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/bergaman9/bergaman-dev.git
cd bergaman-dev

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB connection string

# Start development server
npm run dev
```

### Environment Variables
```bash
# .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bergaman-dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_PASSWORD=your-secure-password
```

## 🎯 Usage Guide

### Admin Panel Access
1. Navigate to `/admin`
2. Enter admin credentials
3. Access dashboard with full content management

### Content Management
- **Create Posts**: Use the rich editor to create new blog posts
- **Edit Content**: Modify existing posts with live preview
- **Manage Media**: Upload and organize images
- **SEO Optimization**: Set meta tags and descriptions

### Edit Mode
1. Enable "Edit Mode" from admin panel
2. Navigate to any page on the site
3. Click edit buttons to modify content directly
4. Changes save automatically to MongoDB

### Data Migration
- Use "Migrate Posts" button in admin panel
- Automatically imports legacy static content
- Preserves all metadata and formatting

## 📊 API Endpoints

### Blog Posts
- `GET /api/admin/posts` - List all posts
- `POST /api/admin/posts` - Create new post
- `GET /api/admin/posts/[id]` - Get specific post
- `PUT /api/admin/posts/[id]` - Update post
- `DELETE /api/admin/posts/[id]` - Delete post

### Migration
- `POST /api/admin/migrate` - Migrate legacy data

### Analytics
- `PUT /api/admin/posts/[id]` - Update views/likes

## 🎨 Design System

### Color Palette
- **Primary**: `#e8c547` (Dragon Gold)
- **Background**: `#0e1b12` (Deep Forest)
- **Secondary**: `#2e3d29` (Forest Green)
- **Border**: `#3e503e` (Sage Green)
- **Text**: `#d1d5db` (Silver)

### Typography
- **Primary**: Inter (Google Fonts)
- **Display**: Geist Sans (Local)
- **Monospace**: Geist Mono (Local)

### Components
- **Glass Morphism**: `bg-[#2e3d29]/30 backdrop-blur-md`
- **Hover Effects**: Scale, glow, and color transitions
- **Circuit Animation**: CSS keyframes with flowing effects

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Database Schema
```javascript
// BlogPost Model
{
  title: String,
  slug: String,
  description: String,
  content: String,
  category: String,
  tags: [String],
  image: String,
  author: String,
  readTime: String,
  views: Number,
  likes: Number,
  published: Boolean,
  featured: Boolean,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### GitHub Actions
- Automated versioning with semantic releases
- Build and test on pull requests
- Automatic deployment to production

## 📱 Progressive Web App

- Web app manifest with theme colors
- Offline-ready structure
- Responsive design for all devices
- Fast loading with optimized assets

## 🔒 Security Features

- Admin authentication system
- Input validation and sanitization
- XSS protection
- CSRF protection
- Rate limiting on API endpoints

## 📈 Performance

- **Core Web Vitals**: Optimized for Google's performance metrics
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based splitting
- **Font Optimization**: Preloaded and optimized fonts
- **Bundle Analysis**: Webpack bundle analyzer integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ömer (Bergaman)**
- Website: [bergaman.dev](https://bergaman.dev)
- GitHub: [@bergaman9](https://github.com/bergaman9)
- LinkedIn: [Ömer Bergaman](https://linkedin.com/in/omerbergaman)
- Email: contact@bergaman.dev

## 🙏 Acknowledgments

- Next.js team for the incredible framework
- MongoDB for the robust database solution
- Vercel for seamless hosting and deployment
- FontAwesome for comprehensive icon library
- Tailwind CSS for utility-first styling

## 📊 Version History

### v2.0.0 (Current)
- 🗄️ Full MongoDB integration
- 🛠️ Complete admin panel
- ✏️ Live edit mode
- 📊 Real-time analytics
- 🚀 GitHub Actions workflow

### v1.0.0
- 🎨 Static portfolio website
- 📝 Basic blog functionality
- 🎯 SEO optimization
- 📱 Responsive design

---

🐉 **Built with dragon-like precision and wisdom** 🐉

*Crafting technology inspired by the strength and wisdom of a dragon*
