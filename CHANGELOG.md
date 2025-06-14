# 🐉 Bergaman Portfolio Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [2.4.0](https://github.com/bergaman9/bergaman-dev/compare/v2.3.0...v2.4.0) (2025-06-14)

### 🚀 Features

* convert admin newsletter page to green theme ([20e49c4](https://github.com/bergaman9/bergaman-dev/commit/20e49c435c2740b41e75cd5d99e53605bc6459fc))
* enhance test-webhook page and add Gmail forwarding support - Fix navbar overlap issue with proper padding - Add admin authentication check - Create Gmail webhook endpoint for forwarding - Implement email parsing with contact ID extraction - Add setup instructions for Gmail and Zapier integration ([5ff51be](https://github.com/bergaman9/bergaman-dev/commit/5ff51bef22581302b4caa1e0d32648a7d3ac2994))
* implement email webhook system and fix BlogImageGenerator error - Fix BlogImageGenerator undefined category error with proper null checks - Create email webhook endpoint at /api/webhook/email for handling email replies - Add contact ID tracking in email subjects for better reply matching - Update contact form and admin reply emails with proper reply-to headers - Create test page at /test-webhook for webhook testing - Implement smart email parsing with fallback to email-based contact lookup - Add admin notifications for incoming email replies - Support both JSON and form-encoded webhook data formats ([302e438](https://github.com/bergaman9/bergaman-dev/commit/302e4388e402ce4dd876d7cc4f037e60da04cc3d))
* remove newsletter sections and enhance homepage for portfolio site - Remove newsletter section from homepage and footer - Update version to v2.3.0 across all components - Enhance homepage with better portfolio-focused content - Update all version references to be dynamic from package.json - Remove newsletter links from admin footer quick actions - Improve mobile responsiveness and visual hierarchy ([776d952](https://github.com/bergaman9/bergaman-dev/commit/776d9528f7bc6b491a2efdaced4e8b787b3451fb))

## [2.3.0](https://github.com/bergaman9/bergaman-dev/compare/v2.2.0...v2.3.0) (2025-06-14)

### 🚀 Features

* enhance mobile responsiveness across all components - Improved footer layouts with better mobile breakpoints - Enhanced home page sections with responsive design - Added mobile-first approach with sm/lg breakpoints - Optimized text sizes and spacing for mobile devices - Fixed version display consistency in footers - Added newsletter link to footer navigation ([db6ab67](https://github.com/bergaman9/bergaman-dev/commit/db6ab673d6475676617a3bc3ead1fc6c921887fa))
* fix newsletter theme and optimize admin header layout ([d3bf21f](https://github.com/bergaman9/bergaman-dev/commit/d3bf21f96cc0f8e04b2bb9b912b7fb5a2db568f2))

### 🐛 Bug Fixes

* merge remote changes ([1984a2c](https://github.com/bergaman9/bergaman-dev/commit/1984a2cc77b8ea0ef32a146de18510e9f45c35ec))
* resolve JSX syntax error in Footer background pattern ([855f0b7](https://github.com/bergaman9/bergaman-dev/commit/855f0b79fdbfc20a875d8e46d091d8d5c9b2555d))

## [2.2.0](https://github.com/bergaman9/bergaman-dev/compare/v2.1.2...v2.2.0) (2025-06-14)

### 🚀 Features

* update professional title and site branding - Changed from AI & Blockchain Developer to Electrical & Electronics Engineer - Updated page title to Bergaman - The Dragon's Domain - Standardized title format across all pages and components - Updated meta descriptions and keywords - Enhanced brand consistency throughout the application ([a1bad83](https://github.com/bergaman9/bergaman-dev/commit/a1bad838953f768a5bd4c57502f9ce8fae73b146))

## [2.1.2](https://github.com/bergaman9/bergaman-dev/compare/v2.1.1...v2.1.2) (2025-06-14)

### 🐛 Bug Fixes

* comprehensive solution for .env.local commit issue - Enhanced git configuration in GitHub Actions workflow - Added aggressive environment file cleanup - Configured git user and disabled ignored file warnings - Added force ignore patterns for environment files - Enhanced semantic release configuration with explicit git settings ([600945b](https://github.com/bergaman9/bergaman-dev/commit/600945b12e2550fe4d7500acb1feccab404ddcac))
* prevent GitHub secret scanning alerts and update version references ([11cda55](https://github.com/bergaman9/bergaman-dev/commit/11cda55e2e6e19904b0a372c4dc5dc9356fa2502))

## [2.1.1](https://github.com/bergaman9/bergaman-dev/compare/v2.1.0...v2.1.1) (2025-06-14)

### 🐛 Bug Fixes

* correct import paths in newsletter stats API - Fixed module resolution error in newsletter stats route - Updated import paths to match project structure - Ensured consistent import pattern with other API routes - Build now succeeds on both local and Vercel environments ([297ec96](https://github.com/bergaman9/bergaman-dev/commit/297ec96af11f5271f37472a760c6f4ca1efd53f3))
* prevent .env.local from being committed during semantic release - Added cleanup step in GitHub Actions to remove environment files before semantic release - Enhanced .gitignore with more specific environment file patterns - Updated semantic release config to ensure only intended files are committed - Resolves GitHub Actions failure during version commit process ([f0cf777](https://github.com/bergaman9/bergaman-dev/commit/f0cf7772971605e9a8df7f3f3e7f7f093c935ad4))

## [2.1.0](https://github.com/bergaman9/bergaman-dev/compare/v2.0.1...v2.1.0) (2025-06-14)

### 🚀 Features

* add Dependabot configuration for automated security updates ([da461f6](https://github.com/bergaman9/bergaman-dev/commit/da461f676ef3b381c8e95e954281d6e337ccbbf5))
* Added public reply system for contact conversations - Created public reply API endpoint for users to respond - Added public reply page for web-based conversation continuation - Created contact fetch API for individual contact retrieval - Enhanced admin reply system with email notifications - Added reply link in admin notification emails - Implemented email verification for reply security - Added beautiful conversation thread display on public page - Enabled seamless conversation flow between admin and users ([33ef1ef](https://github.com/bergaman9/bergaman-dev/commit/33ef1efb1abaed61097b62bc8988e0be60cb3dd9))
* Complete admin panel redesign and fix migration errors - Redesign admin layout with modern slate theme, remove yellow glow effects, improve migration API with better error handling ([755783a](https://github.com/bergaman9/bergaman-dev/commit/755783af8af77b04fcaa4becceb9b85efa1faaba))
* Complete newsletter system with admin panel redesign and comprehensive email management ([1a1217b](https://github.com/bergaman9/bergaman-dev/commit/1a1217b03a7f0b68184b4e65d21bff92b40a014e))
* Enhanced admin panel with nested contact replies and improved background design - Fixed syntax errors in settings API route - Improved admin panel background with professional gradient design - Removed excessive glow effects from header and footer - Added nested conversation thread system for contact management - Updated Contact model to support reply threads - Created new API endpoint for adding replies to contacts - Enhanced admin contacts page with expandable conversation threads - Added visual distinction between admin and user replies - Improved reply modal with full conversation history - Maintained backward compatibility with legacy reply system ([f3a8bd3](https://github.com/bergaman9/bergaman-dev/commit/f3a8bd35ab80b7f17c1c9768869d56ce4cf40c30))
* Enhanced portfolio and blog with improved UI/UX - Added blog post images, redesigned footer, fixed search bar, improved responsive design, added MIT License, and enhanced overall user experience ([5548e50](https://github.com/bergaman9/bergaman-dev/commit/5548e5061bf516d3a882f0b2aaa3445c6ddbc436))
* implement advanced admin panel with dragon effects and automated version management ([dc30412](https://github.com/bergaman9/bergaman-dev/commit/dc30412e3a7819ea1b3f8e531991c25ce96c5692))
* implement advanced admin panel with dragon effects and automated version management ([ecf90f9](https://github.com/bergaman9/bergaman-dev/commit/ecf90f9674be3a8e1591022dfffd8ba6f2f8e871))
* merge v2-development branch with all improvements and new features ([a5013e7](https://github.com/bergaman9/bergaman-dev/commit/a5013e7547f49917f4390fddc04b3bdc956e2173))
* restore green theme and improve newsletter integration ([fcd4068](https://github.com/bergaman9/bergaman-dev/commit/fcd406883c7bdd439866cf44aea988611a584e05))
* update GitHub Actions workflow to use secrets for environment variables ([0b073f3](https://github.com/bergaman9/bergaman-dev/commit/0b073f3fcea679bd9b1e21bf157ec10670f5ca37))

### 🐛 Bug Fixes

* add .env.example and resolve MongoDB connection issues ([fd74122](https://github.com/bergaman9/bergaman-dev/commit/fd741221d3dbdfb380927ff8d85d6d5344e79b77))
* add missing bcryptjs dependency for admin members functionality ([07ac961](https://github.com/bergaman9/bergaman-dev/commit/07ac9616e4beaefc42bcd00a8d78df83e8ec5452))
* resolve build errors and improve functionality - Fixed useSearchParams Suspense boundary error in newsletter unsubscribe page - Fixed nodemailer createTransporter typo in newsletter and contact APIs - Removed duplicate email index from Newsletter model - Fixed double header/footer issue in newsletter pages - Added real subscriber count display from database - Enhanced jsconfig.json with comprehensive path mappings and compiler options - Removed unused imports to fix linter warnings - Added newsletter stats API endpoint for real-time subscriber count ([66d08c3](https://github.com/bergaman9/bergaman-dev/commit/66d08c3cd432f48bfee1683a5c8d9e83bdb165e2))
* resolve Dependabot config and MongoDB URI build issues ([801609f](https://github.com/bergaman9/bergaman-dev/commit/801609f6f822d3faac85d0f78ab25d8e035771e3))
* resolve hydration mismatch error in version display - Fixed server/client version inconsistency by using useState and useEffect in Footer components - Updated next.config.mjs to automatically read version from package.json - Made version display consistent across admin and public footers - Fixed newsletter stats API import paths - Eliminated hydration mismatch that was causing React errors ([84c4026](https://github.com/bergaman9/bergaman-dev/commit/84c40267b8b50df22c34c11b9acb2fb5d6ee8151))
* Resolve MongoDB issues and restore green theme to admin panel - Fix duplicate index warning in BlogPost model, prevent admin layout conflicts with main layout, restore original green dragon theme ([7e01c9d](https://github.com/bergaman9/bergaman-dev/commit/7e01c9d5e525500d223b29b5f5c40bc510f86eb6))
* resolve MongoDB URI build issues with fallback configuration ([1504ce9](https://github.com/bergaman9/bergaman-dev/commit/1504ce91cc2c112a914bda091558890bb025f6b9))
* resolve package-lock.json sync issues and update dependencies ([f5730fe](https://github.com/bergaman9/bergaman-dev/commit/f5730fe45744fe2b7e89bd432b2771de49898559))
* Update admin dashboard to match new slate theme design ([72b23b7](https://github.com/bergaman9/bergaman-dev/commit/72b23b7fc42f584d087f00e5fbb84f8a87c26511))

## [2.0.1](https://github.com/bergaman9/bergaman-dev/compare/v2.0.0...v2.0.1) (2025-06-14)

### 🐛 Bug Fixes

* add missing conventional-changelog-conventionalcommits dependency for semantic-release ([244537a](https://github.com/bergaman9/bergaman-dev/commit/244537aff04390b75adf982030f0d71cdfd07f41))
* Add next-sitemap config to resolve postbuild error ([c43edeb](https://github.com/bergaman9/bergaman-dev/commit/c43edeb43c6614807850664cc92f0ba88ccfdbff))
* Remove yellow hover effects and add comment counts to blog posts ([1a7d227](https://github.com/bergaman9/bergaman-dev/commit/1a7d227f8e105111e3cb92f3c2a029652f4e8ea7))
* Resolve MongoDB build errors and duplicate index warnings ([d8e69e3](https://github.com/bergaman9/bergaman-dev/commit/d8e69e35225952e3b13964ff4e6a65ef8d00c36c))

### 📚 Documentation

* enhance README with comprehensive project details, performance metrics, security features, and development workflow ([49dfcbb](https://github.com/bergaman9/bergaman-dev/commit/49dfcbbf1bc4463631ce537e7988293b5846e139))
* Update README.md with legacy version links and comparison table ([3155fae](https://github.com/bergaman9/bergaman-dev/commit/3155fae4bd2f1ae7319c13f24bdc2ed494379200))

### 👷 CI/CD

* fix semantic-release and ESLint configuration for auto-versioning ([235145b](https://github.com/bergaman9/bergaman-dev/commit/235145bf9d79d88f36e3ea49ffe5db97520b28f5))

## [2.0.0] - 2024-12-05

### 🚀 Features

- **MongoDB Integration**: Complete database backend with dynamic content management
- **Admin Panel**: Full-featured content management system with dashboard
- **Live Edit Mode**: Edit content directly on the site with real-time updates
- **Real-time Analytics**: Dynamic tracking of views, likes, and engagement metrics
- **Auto Migration**: Seamless data migration from static to dynamic content
- **Advanced SEO**: Dynamic metadata generation and structured data
- **GitHub Actions**: Automated versioning, testing, and deployment workflow
- **Enhanced Security**: Input validation, XSS protection, and admin authentication
- **Performance Optimization**: Improved loading times and Core Web Vitals

### 🛠️ Technical Improvements

- **Database**: MongoDB with Mongoose ODM for scalable data storage
- **API**: RESTful endpoints for complete CRUD operations
- **Authentication**: Custom admin authentication system
- **State Management**: React hooks for efficient state handling
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Code Organization**: Improved project structure and component architecture

### 🎨 Design Enhancements

- **Dragon Theme**: Enhanced branding with "The Dragon's Domain" concept
- **UI/UX**: Improved user interface with better accessibility
- **Responsive Design**: Optimized for all device sizes
- **Animation**: Smooth transitions and hover effects
- **Typography**: Enhanced font loading and optimization

### 📊 Content Management

- **Blog System**: Dynamic blog with rich text editing capabilities
- **Media Management**: Image upload and optimization system
- **SEO Tools**: Meta tag management and keyword optimization
- **Content Preview**: Real-time preview of content changes
- **Version Control**: Track content changes and updates

### 🔧 Developer Experience

- **Hot Reload**: Improved development workflow
- **Linting**: Enhanced code quality with ESLint
- **Testing**: Automated testing pipeline
- **Documentation**: Comprehensive README and inline documentation
- **Deployment**: Streamlined deployment process with Vercel

## [1.0.0] - 2024-11-01

### 🚀 Initial Release

- **Static Portfolio**: Basic portfolio website with static content
- **Blog Functionality**: Simple blog with static posts
- **SEO Optimization**: Basic metadata and sitemap generation
- **Responsive Design**: Mobile-first responsive layout
- **Performance**: Optimized images and fonts
- **Accessibility**: ARIA labels and semantic HTML

---

🐉 **Built with dragon-like precision and wisdom** 🐉
