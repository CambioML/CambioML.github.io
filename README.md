# CambioML Website

## Technologies Used

- **Next.js 14** - React framework for production-ready applications
- **TypeScript** - Static type-checking for JavaScript
- **Tailwind CSS** - A utility-first CSS framework
- **Framer Motion** - Animation library for React
- **Lucide React** - Beautiful & consistent icons
- **Bun** - A fast JavaScript runtime & package manager
- **Auth0** - Authentication and authorization platform
- **PostHog** - Product analytics and feature flags
- **Stripe** - Payment processing
- **React Hook Form** - Forms with easy validation
- **Zustand** - State management
- **React Hot Toast** - Toast notifications
- **React Markdown** - Markdown to React component renderer

## Getting Started

### Prerequisites

- Bun (latest version)

### Local Environment

1. Install bun

   **macOS and Linux:**

   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

   After installation, restart your terminal and verify:

   ```bash
   bun --version
   ```

2. Clone the repository

   ```bash
   git clone https://github.com/CambioML/CambioML.github.io
   cd CambioML.github.io
   ```

3. Install dependencies

   ```bash
   bun install
   ```

4. Set up environment variables (see Environment Variables section below)

5. Start the development server

   ```bash
   bun run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Environment Variables

The application uses environment variables prefixed with `NEXT_PUBLIC_` for client-side configuration. Create a `.env.local` file in the project root with the following variables:

### ✅ Required Environment Variables (Currently Used)

```bash
# Auth0 Configuration (required for authentication)
NEXT_PUBLIC_AUTH0_DOMAIN=your-auth0-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id

# PostHog Analytics Configuration
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=your-google-tag-manager-id

# API Endpoints
NEXT_PUBLIC_PLAYGROUND_API_URL=https://api.cambioml.com
NEXT_PUBLIC_PRE_PROD_PLAYGROUND_API_URL=https://preprod-api.cambioml.com
NEXT_PUBLIC_API_VERIFICATION_EMAIL_URL=https://api.cambioml.com/verification

# Stripe Configuration
NEXT_PUBLIC_STRIPE_SESSION_URL=https://api.cambioml.com/stripe/
NEXT_PUBLIC_STRIPE_RETURN_URL=https://www.cambioml.com/account
NEXT_PUBLIC_STRIPE_PORTAL_RETURN_URL=https://www.cambioml.com/account

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your-emailjs-public-key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your-emailjs-service-id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your-emailjs-template-id
NEXT_PUBLIC_EMAILJS_PLAYGROUND_TEMPLATE_ID=your-playground-template-id

# Calendly Integration
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-calendly-url

# OpenAI API (for AI features)
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
```

### ⚠️ Unused Environment Variables (Consider Removing)

The following environment variables are configured in the CI/CD pipeline but not actually used in the codebase:

```bash
# These can be removed from GitHub Actions secrets
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_OAUTH_GOOGLE_CLIENT_ID
NEXT_PUBLIC_AUTH0_REDIRECT_URI
NEXT_PUBLIC_PLAYGROUND_API_KEY
NEXT_PUBLIC_PRE_PROD_AUTH0_REDIRECT_URI
NEXT_PUBLIC_AWS_ACCESS_KEY
NEXT_PUBLIC_AWS_SECRET_KEY
NEXT_PUBLIC_AWS_REGION
NEXT_PUBLIC_LOGOUT_URL_PLAYGROUND
NEXT_PUBLIC_LOGOUT_URL_ACCOUNT_PRE_PROD
NEXT_PUBLIC_LOGOUT_URL_ACCOUNT
NEXT_PUBLIC_LOGOUT_URL_PLAYGROUND_PRE_PROD
NEXT_PUBLIC_API_KEY_ENDPOINT
NEXT_PUBLIC_STRIPE_SECRET_KEY
NEXT_PUBLIC_PRODUCT_AUTH0_REDIRECT_URI
```

### Variable Descriptions

#### **NEXT_PUBLIC_AUTH0_DOMAIN & NEXT_PUBLIC_AUTH0_CLIENT_ID**

Auth0 domain and client ID for user authentication and management. Used throughout the application for secure user login, registration, and session management.

```typescript
// Used in: app/components/auth/LoginButton.tsx
const { loginWithPopup } = useAuth0();
loginWithPopup({
  authorizationParams: {
    scope: 'openid profile email',
  },
});
```

#### **NEXT_PUBLIC_POSTHOG_KEY & NEXT_PUBLIC_POSTHOG_HOST**

PostHog project API key and instance URL for product analytics, user behavior tracking, and feature flags. Enables comprehensive user journey tracking and A/B testing capabilities.

```typescript
// Used in: app/providers.tsx
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  person_profiles: 'identified_only',
  capture_pageview: false,
});
```

#### **NEXT_PUBLIC_PLAYGROUND_API_URL**

Main API endpoint for the CambioML AnyParser playground and document processing features. Different environments use different API endpoints for development and production.

```typescript
// Used in: app/components/playground/ProductionContext.tsx
const apiURL = isProduction
  ? process.env.NEXT_PUBLIC_PLAYGROUND_API_URL || ''
  : process.env.NEXT_PUBLIC_PRE_PROD_PLAYGROUND_API_URL || '';
```

## Auth0 Integration

The application uses Auth0 for comprehensive user authentication and authorization, providing secure user management across the platform.

### Features

- **User Registration & Login**: Email-based authentication with social login options
- **Session Management**: Automatic token refresh and secure session handling
- **Profile Management**: User profile data and preferences
- **API Authentication**: Secure API access using Auth0 tokens

### Configuration

Authentication is configured throughout the application using the `@auth0/auth0-react` provider:

```typescript
// Used in account pages
<Auth0Provider
  domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
  clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
  authorizationParams={{
    audience: `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/api/v2/`,
  }}
>
  {children}
</Auth0Provider>
```

### Usage

Authentication state is managed through:

- **`app/components/auth/LoginButton.tsx`** - Login interface with Auth0 integration
- **`app/components/auth/LogoutButton.tsx`** - Logout functionality
- **`app/hooks/useUserProfile.ts`** - User profile and session state management

## PostHog Analytics Integration

PostHog provides comprehensive product analytics, user behavior tracking, and feature flags for data-driven decision making.

> [!CAUTION]
> The PostHog API key is currently not working. Analytics tracking may be unavailable until the API key configuration is resolved.

### Features

- **Event Tracking**: Custom event tracking for user actions and feature usage
- **User Identification**: Authenticated user tracking with profile data
- **Feature Flags**: A/B testing and gradual feature rollouts
- **Session Recording**: User session analysis for UX optimization

### Configuration

PostHog is initialized as a React context provider in `app/providers.tsx`:

```typescript
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: false, // Manual pageview capture
  });
}
```

### Usage

PostHog tracking is available throughout the application:

```typescript
import { usePostHog } from 'posthog-js/react';

const posthog = usePostHog();
posthog.capture('user_action', {
  feature: 'playground',
  action: 'file_upload',
});
```

## Internationalization (i18n)

The application supports 22 languages with automated translation workflows and comprehensive localization features.

### 📚 Documentation

- **[How to Add a Blog Post](https://github.com/CambioML/www.energent.ai/blob/main/doc/add-blog-post.md)** - Complete guide for adding new blog posts
- **[How to Modify Page Content](https://github.com/CambioML/www.energent.ai/blob/main/doc/modify-page-content.md)** - Guide for updating existing page content

### Automated CI/CD Translation

The project features **automatic translation workflows** that trigger when content is updated:

#### Blog Post Auto-Translation

- **Trigger**: When English blog posts are added or modified in `blog/en/`
- **Workflow**: `.github/workflows/translate-blog.yml`
- **Process**:
  1. Detects changes to English blog posts in pull requests
  2. Automatically translates content to all 21 supported languages using Azure OpenAI
  3. Commits translated files back to the same pull request
  4. Adds a comment to the PR confirming completion

#### Resource Auto-Translation

- **Trigger**: When English resources are updated in `resources/en/`
- **Workflow**: `.github/workflows/translate-resources.yml`
- **Process**: Similar to blog translation but for resource files

#### Translation Property Change Detection

- **Trigger**: When `lib/translations/en.ts` is modified in pull requests
- **Workflow**: `.github/workflows/check-translations.yml`
- **Script**: `scripts/i18n-diff-checker.ts`
- **Process**:
  1. Analyzes changes in the English translation properties using git diff
  2. Identifies which specific translation keys were added, modified, or deleted
  3. Reports property changes in GitHub status checks and PR comments
  4. Validates that all corresponding language files are complete and up-to-date
  5. Blocks deployment if translations are incomplete

#### **Translation Completeness Validation**

The enhanced translation check workflow ensures comprehensive multilingual support:

- **File Coverage**: Verifies all TypeScript translation files exist (`lib/translations/{lang}.ts`)
- **Content Coverage**: Checks blog posts and resources in all supported languages
- **Property Tracking**: Uses intelligent diff analysis to detect translation property changes
- **Automated Reporting**: Provides detailed feedback on missing translations and property changes

### Translation Management Scripts

#### **Available Commands**

```bash
# Translate TypeScript interface files
bun run translate

# Check for translation property changes
bun run translate:diff

# Translate blog posts to all languages
bun run translate:blog

# Translate resource files to all languages
bun run translate:resources
```

#### **Property Change Analysis**

The `i18n-diff-checker.ts` script provides intelligent analysis of translation changes:

```typescript
// Detects property changes in en.ts
import { analyzeTranslationChanges } from './scripts/i18n-diff-checker.ts';

const result = analyzeTranslationChanges();
console.log(`Modified properties: ${result.modifiedProperties.length}`);
result.changes.forEach((change) => {
  console.log(`${change.action}: ${change.path}`);
});
```

**Features:**

- **Git Integration**: Compares current changes with previous commits
- **Property Flattening**: Converts nested objects to dot notation for precise tracking
- **Change Detection**: Identifies additions, modifications, and deletions
- **JSON Output**: Machine-readable output for CI/CD integration

#### Example Workflows

**When you add a new blog post in English:**

1. Create: `blog/en/my-new-post.md`
2. Open a pull request
3. GitHub Actions automatically creates:
   - `blog/es/my-new-post.md` (Spanish)
   - `blog/fr/my-new-post.md` (French)
   - `blog/de/my-new-post.md` (German)
   - ... and 18 more languages
4. All translations are committed to your PR automatically

**When you modify translation properties:**

1. Update: `lib/translations/en.ts`
2. Open a pull request
3. GitHub Actions automatically:
   - Analyzes which properties changed using `i18n-diff-checker.ts`
   - Reports specific properties modified (e.g., `nav.pricing`, `auth.login`)
   - Validates all language files have corresponding translations
   - Blocks deployment if any translations are missing
   - Provides detailed feedback in PR comments and status checks

## Building For Production

### Static Export

The application is configured for static export to GitHub Pages:

```bash
bun run build
```

The build creates a static export in the `out` directory that can be deployed to any static hosting service.

### Next.js Configuration

```javascript
// next.config.js
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
  staticPageGenerationTimeout: 300,
};
```

## CI/CD

The project uses GitHub Actions for automated deployment to GitHub Pages.

### Deployment Workflow

The deployment is configured in `.github/workflows/nextjs.yml`:

1. **Build Trigger**: Automatically deploys on pushes to `main` branch
2. **Environment Setup**: Installs dependencies and configures build environment
3. **Static Build**: Creates optimized static build with all environment variables
4. **GitHub Pages Deploy**: Deploys to GitHub Pages with proper permissions

### Environment Variables in CI

All environment variables are securely stored as GitHub repository secrets and injected during the build process:

```yaml
env:
  NEXT_PUBLIC_AUTH0_DOMAIN: ${{ secrets.NEXT_PUBLIC_AUTH0_DOMAIN }}
  NEXT_PUBLIC_POSTHOG_KEY: ${{ secrets.NEXT_PUBLIC_POSTHOG_KEY }}
  NEXT_PUBLIC_STRIPE_SECRET_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_SECRET_KEY }}
  # ... additional environment variables
```

## Project Structure

### Pages & Routing

The application uses Next.js 14 App Router with internationalized routing:

- **Localized Routes**: `/[locale]/` - All pages support multiple languages
- **Homepage**: `/[locale]/page.tsx` - Main landing page
- **Playground**: `/[locale]/playground/page.tsx` - Interactive document processing
- **Account Management**: `/[locale]/account/page.tsx` - User dashboard and API keys
- **Blog**: `/[locale]/blog/` - Multi-language blog system
- **Pricing**: `/[locale]/pricing-rt/page.tsx` - Real-time pricing information
- **Solutions**: `/[locale]/solutions/` - Industry-specific solutions
- **Company**: `/[locale]/company/about-us/page.tsx` - About us page

### Component Architecture

#### Core Components

- `app/components/Button.tsx` - Reusable button component with variants
- `app/components/Card.tsx` - Card component for content display
- `app/components/CodeBlock.tsx` - Syntax-highlighted code display
- `app/components/DocumentViewer.tsx` - PDF and document preview

#### Feature Components

- `app/components/playground/` - Interactive document processing interface
- `app/components/pricing/` - Pricing cards and Stripe integration
- `app/components/blog/` - Blog post rendering and navigation
- `app/components/navbar/` - Navigation with language switching
- `app/components/footer/` - Site footer with links and information

#### Authentication Components

- `app/components/auth/LoginButton.tsx` - Auth0 login integration
- `app/components/auth/LogoutButton.tsx` - Logout functionality
- `app/components/account/` - Account management interface

#### Utility Components

- `app/components/animations/` - Framer Motion animation components
- `app/components/modals/` - Modal dialogs for various features
- `app/components/inputs/` - Form input components with validation

### State Management

The application uses Zustand for state management with multiple specialized stores:

#### Store Architecture

- `app/hooks/useAccountStore.ts` - User account and profile state
- `app/hooks/useCompareModal.ts` - Comparison modal state
- `app/hooks/useAccessToken.ts` - Auth0 token management
- Theme state managed through React Context (`app/contexts/ThemeContext.tsx`)

### API Integration

#### Actions Layer

- `app/actions/` - Server actions for data fetching and mutations
- `app/actions/account/` - Account-related API calls
- `app/actions/preprod/` - Pre-production API endpoints
- Secure API key management and user authentication

#### External Integrations

- **EmailJS**: Contact form and notification emails
- **Stripe**: Payment processing and subscription management
- **OpenAI**: AI-powered content generation and translation
- **AWS**: File storage and processing
- **Google Analytics**: Website analytics and tracking

### Styling & Design

#### Tailwind CSS Configuration

- Custom color palette for CambioML branding
- Extended spacing and typography scales
- Dark mode support with theme switching
- Responsive design utilities

#### Design System

- Consistent component styling with Tailwind classes
- Custom gradient utilities for brand elements
- Accessible color contrast ratios
- Mobile-first responsive design

### Content Management

#### Blog System

- Markdown-based blog posts with frontmatter
- Multi-language blog support with automated translation
- Dynamic routing for blog posts
- LaTeX support for mathematical content

#### Static Content

- Solutions and case studies
- Company information and team profiles
- Pricing information and feature comparisons
- Legal documents and policies

## Testing

The project includes comprehensive testing with Playwright:

```bash
# Run playground tests
bun run test:playground
```

### Test Configuration

- **End-to-End Testing**: Playwright tests for critical user journeys
- **Authentication Testing**: Auth0 integration testing
- **API Testing**: Playground API functionality tests
- **Cross-browser Testing**: Chrome, Firefox, and Safari support

## Performance Optimization

### Build Optimizations

- **Static Site Generation**: Pre-rendered pages for optimal performance
- **Image Optimization**: Optimized images with Next.js Image component
- **Code Splitting**: Automatic code splitting for faster page loads
- **Bundle Analysis**: Webpack bundle optimization

### Runtime Optimizations

- **Lazy Loading**: Components and images loaded on demand
- **Caching Strategy**: Static asset caching with proper cache headers
- **CDN Integration**: Static assets served from CDN
- **Performance Monitoring**: PostHog performance tracking

## License

This project is licensed under the MIT License.
