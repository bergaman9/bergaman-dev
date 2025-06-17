# 🐉 Bergaman Portfolio - The Dragon's Domain

[![Version](https://img.shields.io/badge/version-2.4.0-blue.svg)](https://github.com/bergaman9/bergaman-dev)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/bergaman9/bergaman-dev/blob/main/LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black.svg)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)

> **Crafting technology inspired by the strength and wisdom of a dragon** 🐉

A cutting-edge portfolio website featuring a sophisticated admin panel, real-time content management, newsletter system, and dragon-themed UI effects. Built with Next.js 15, MongoDB, and modern web technologies.

## 🌟 **Live Demo**

- **🚀 Current Version (v2.4.0)**: [bergaman.dev](https://bergaman.dev)
- **🕰️ Legacy Version (v1.0.0)**: [bergaman-v1.vercel.app](https://bergaman-v1.vercel.app/)

## ✨ **Key Features**

### 🎨 **Dragon-Themed Design**
- **Mystical Background Effects**: Floating orbs, energy streams, and dragon breath animations
- **Dragon Scale Patterns**: Custom SVG patterns for authentic dragon aesthetics  
- **Golden Color Palette**: Inspired by dragon gold with deep forest backgrounds
- **Responsive Design**: Optimized for all devices with smooth animations

### 🛠️ **Advanced Admin Panel**
- **Bergasoft Portal**: Professional admin interface with dragon-themed effects
- **Real-time Dashboard**: Live statistics, recent activity, and system monitoring
- **Content Management**: Create, edit, and manage blog posts with rich editor
- **User Management**: Admin authentication and role-based access control
- **Analytics Tracking**: View counts, engagement metrics, and performance data
- **Newsletter Management**: Complete subscriber and campaign management system
- **Enhanced UI Components**: Reusable components with multiple design variants
- **Consistent Layout**: PageHeader components across all admin pages

### 📝 **Dynamic Blog System**
- **MongoDB Integration**: Full database-driven content management
- **SEO Optimization**: Dynamic meta tags, structured data, and sitemap generation
- **Comment System**: Advanced commenting with IP tracking and moderation
- **Categories & Tags**: Organized content with filtering and search capabilities

### 📧 **Newsletter System**
- **Subscriber Management**: Complete newsletter signup and management system
- **Campaign Creation**: Rich markdown-based email campaigns with templates
- **Audience Targeting**: Segment subscribers by preferences and activity
- **Real-time Statistics**: Track subscriber counts, open rates, and engagement
- **Unsubscribe Management**: One-click unsubscribe with preference center
- **Email Templates**: Professional dragon-themed email designs
- **Batch Sending**: Efficient email delivery with rate limiting

### 🚀 **DevOps & Automation**
- **GitHub Actions**: Automated version management and releases
- **Semantic Versioning**: Automatic version bumping based on commit messages
- **Environment Management**: Dynamic version tracking and deployment
- **Performance Monitoring**: Core Web Vitals and analytics integration
- **Dependabot Integration**: Automated security updates and dependency management

### 🧩 **UI Component Library**
- **Modal System**: 15+ design variants including modern, elegant, glass, and more
- **Button Components**: Consistent button styling with multiple variants
- **Select Components**: Versatile dropdown selects with multiple variants, sizes, and icon support
- **Loading Components**: Customizable loading spinners with overlay and full-screen options
- **Tabs Components**: Interactive tab navigation with multiple styles and animations
- **Tooltip Components**: Rich tooltip system with positioning and interactive content
- **PageHeader**: Flexible page headers with actions, stats, and filters
- **Form Elements**: Styled inputs, selects, and form controls
- **Card Components**: Versatile card layouts for content display
- **Component Showcase**: Interactive component library for testing and demonstration

## 🛠️ **Tech Stack**

### **Core Technologies**
- **Framework**: Next.js 15+ (App Router)
- **Database**: MongoDB Atlas with Mongoose ODM
- **Styling**: Tailwind CSS with custom dragon themes
- **Authentication**: Custom admin authentication system
- **Deployment**: Vercel with GitHub Actions CI/CD

### **Libraries & Tools**
- **Icons**: FontAwesome 6.5.1
- **Analytics**: Vercel Analytics
- **Email**: Nodemailer for contact forms and newsletters
- **Fonts**: Inter (Google) + Geist (Local)
- **Image Optimization**: Next.js Image component
- **Markdown**: Marked for rich content rendering
- **Security**: bcryptjs for password hashing

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- MongoDB Atlas account
- Git
- Gmail account (for email functionality)

### **Installation**

```bash
# Clone the repository
git clone https://github.com/bergaman9/bergaman-dev.git
cd bergaman-dev

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### **Environment Variables**

```env
# .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bergaman-dev
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_VERSION=2.1.1
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
VERCEL_TOKEN=your-vercel-token (optional)
VERCEL_ORG_ID=your-org-id (optional)
VERCEL_PROJECT_ID=your-project-id (optional)
```

> **⚠️ Security Note**: The `.env.example` file uses placeholder values to prevent GitHub's secret scanning alerts. Always replace these with your actual credentials in your local `.env.local` file.

## 📁 **Project Structure**

```
bergaman-dev/
├── .github/workflows/     # GitHub Actions & Dependabot
├── public/images/         # Static assets
├── src/
│   ├── app/
│   │   ├── (admin)/      # Admin panel routes
│   │   ├── api/          # API endpoints
│   │   ├── blog/         # Blog pages
│   │   ├── newsletter/   # Newsletter pages
│   │   ├── components/   # Reusable components
│   │   └── ...
│   ├── lib/              # Utilities and constants
│   ├── models/           # MongoDB schemas
│   └── data/             # Static data files
└── ...
```

## 🎯 **Usage Guide**

### **Admin Panel Access**
1. Navigate to `/admin`
2. Enter credentials: `bergasoft` / `tE0&5A3&DBb!c55dm98&`
3. Access the dragon-themed dashboard

### **Content Management**
- **Create Posts**: Rich editor with live preview
- **Manage Comments**: Approve, reject, and moderate
- **View Analytics**: Track engagement and performance
- **System Monitoring**: Real-time server status

### **Newsletter Management**
- **Subscriber Overview**: View all subscribers with status tracking
- **Campaign Creation**: Create rich markdown-based email campaigns
- **Audience Targeting**: Send to active subscribers or specific segments
- **Performance Tracking**: Monitor open rates and engagement metrics

### **Version Management**
- **Automatic Versioning**: Based on commit message patterns
- **Release Generation**: Automated GitHub releases
- **Environment Sync**: Version updates across all environments

## 🎨 **Design System**

### **Color Palette**
- **Primary**: `#e8c547` (Dragon Gold)
- **Background**: `#0e1b12` (Deep Forest)
- **Secondary**: `#2e3d29` (Forest Green)
- **Accent**: `#3e503e` (Sage Green)

### **Dragon Effects**
- **Floating Orbs**: Mystical particles with shadows
- **Energy Streams**: Vertical gradient animations
- **Dragon Breath**: Rotating conic gradients
- **Scale Patterns**: Custom SVG textures

## 📊 **API Endpoints**

### **Blog Management**
- `GET /api/admin/posts` - List all posts
- `POST /api/admin/posts` - Create new post
- `PUT /api/admin/posts/[id]` - Update post
- `DELETE /api/admin/posts/[id]` - Delete post

### **Comments System**
- `GET /api/admin/comments` - List comments
- `PUT /api/admin/comments/[id]` - Moderate comment

### **Newsletter System**
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter/stats` - Get subscriber statistics
- `GET /api/admin/newsletter/subscribers` - List all subscribers
- `GET /api/admin/newsletter/campaigns` - List all campaigns
- `POST /api/admin/newsletter/campaigns` - Create new campaign
- `POST /api/admin/newsletter/campaigns/[id]/send` - Send campaign

### **Analytics**
- `GET /api/admin/analytics` - Get statistics
- `PUT /api/posts/[id]/view` - Track page views

## 🚀 **Deployment**

### **Vercel Deployment**
1. Connect GitHub repository to Vercel
2. Set environment variables in dashboard
3. Deploy automatically on push to main

### **GitHub Actions Workflow**
- **Version Bumping**: Automatic semantic versioning
- **Release Creation**: Generated changelogs and tags
- **Build Validation**: Tests and quality checks
- **Dependency Updates**: Automated security patches

### **Required GitHub Secrets**
```
MONGODB_URI - MongoDB Atlas connection string
NEXTAUTH_SECRET - Authentication secret key
EMAIL_USER - Gmail address for email functionality
EMAIL_PASS - Gmail app password
VERCEL_TOKEN - Vercel deployment token
VERCEL_ORG_ID - Vercel organization ID
VERCEL_PROJECT_ID - Vercel project ID
```

## 🔒 **Security Features**

- **Admin Authentication**: Secure login system with bcrypt
- **Input Validation**: XSS and injection protection
- **Rate Limiting**: API endpoint protection
- **Environment Security**: Sensitive data encryption
- **Newsletter Security**: Email validation and unsubscribe protection

## 📈 **Performance**

- **Core Web Vitals**: Optimized for Google metrics
- **Image Optimization**: Next.js Image with lazy loading
- **Code Splitting**: Route-based bundle optimization
- **Caching Strategy**: Efficient data fetching
- **Email Delivery**: Batch processing with rate limiting

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Commit Convention**
- `feat:` - New features (minor version bump)
- `fix:` - Bug fixes (patch version bump)
- `BREAKING CHANGE:` - Major changes (major version bump)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Ömer (Bergaman)**
- 🌐 Website: [bergaman.dev](https://bergaman.dev)
- 🐙 GitHub: [@bergaman9](https://github.com/bergaman9)
- 💼 LinkedIn: [Ömer Güler](https://www.linkedin.com/in/omerguler/)
- 📧 Email: contact@bergaman.dev

## 🙏 **Acknowledgments**

- Next.js team for the incredible framework
- MongoDB for robust database solutions
- Vercel for seamless deployment
- FontAwesome for comprehensive icons
- Tailwind CSS for utility-first styling

## 📊 **Version History**

### **v2.1.1** (Current)
- 📧 Complete newsletter system with subscriber management
- 📨 Email campaign creation and sending functionality
- 📊 Real-time newsletter statistics and analytics
- 🔧 Enhanced GitHub Actions with Dependabot integration
- 🐛 Fixed hydration errors and build issues
- 🎨 Improved admin panel with green dragon theme
- 🔒 Enhanced security with better error handling

### **v2.0.0** (Previous)
- 🗄️ Full MongoDB integration
- 🛠️ Advanced admin panel with dragon effects
- ✏️ Real-time content management
- 📊 Analytics and monitoring
- 🚀 Automated version management

### **v1.0.0** (Legacy)
- 🎨 Static portfolio website
- 📝 Basic blog functionality
- 🎯 SEO optimization
- 📱 Responsive design

---

## 🔗 **Links**

- **📚 Repository**: [github.com/bergaman9/bergaman-dev](https://github.com/bergaman9/bergaman-dev)
- **🏷️ Releases**: [github.com/bergaman9/bergaman-dev/releases](https://github.com/bergaman9/bergaman-dev/releases)
- **📖 Documentation**: [bergaman.dev/docs](https://bergaman.dev/docs)
- **🐛 Issues**: [github.com/bergaman9/bergaman-dev/issues](https://github.com/bergaman9/bergaman-dev/issues)
- **📧 Newsletter**: [bergaman.dev/newsletter](https://bergaman.dev/newsletter)

---

<div align="center">

**🐉 Built with dragon-like precision and wisdom 🐉**

*Crafting technology inspired by the strength and wisdom of a dragon*

[![GitHub stars](https://img.shields.io/github/stars/bergaman9/bergaman-dev?style=social)](https://github.com/bergaman9/bergaman-dev)
[![GitHub forks](https://img.shields.io/github/forks/bergaman9/bergaman-dev?style=social)](https://github.com/bergaman9/bergaman-dev)

</div>
