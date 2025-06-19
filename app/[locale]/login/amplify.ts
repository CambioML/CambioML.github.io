import { Amplify } from 'aws-amplify';

// Check if we're in development mode
const localEnv = process.env.NODE_ENV === 'development';
const hostDomain = process.env.NEXT_PUBLIC_HOST_DOMAIN;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USERPOOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_APPCLIENT_ID,
      loginWith: {
        oauth: {
          domain: 'us-west-2aphyqjunu.auth.us-west-2.amazoncognito.com',
          scopes: ['email', 'profile', 'openid'],
          redirectSignIn: [localEnv ? 'http://localhost:5173' : hostDomain],
          redirectSignOut: [localEnv ? 'http://localhost:5173' : hostDomain],
          responseType: 'token',
        },
        email: true,
      },
    },
  },
});

// Define light theme for Amplify UI components
export const lightTheme = {
  name: 'energent-light-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#f0f9ff',
          20: '#e0f2fe',
          40: '#bae6fd',
          60: '#7dd3fc',
          80: '#38bdf8',
          90: '#0ea5e9',
          100: '#0284c7',
        },
      },
      font: {
        interactive: {
          value: '#000000',
        },
      },
      background: {
        primary: {
          value: '#ffffff',
        },
        secondary: {
          value: '#f9fafb',
        },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: '{colors.brand.primary.90}',
          _hover: {
            backgroundColor: '{colors.brand.primary.100}',
          },
        },
      },
      tabs: {
        item: {
          _active: {
            color: '{colors.brand.primary.100}',
            borderColor: '{colors.brand.primary.100}',
          },
          _hover: {
            color: '{colors.brand.primary.90}',
          },
          _focus: {
            color: '{colors.brand.primary.100}',
          },
        },
      },
      fieldcontrol: {
        _focus: {
          borderColor: '{colors.brand.primary.90}',
        },
      },
    },
  },
};

// Define dark theme for Amplify UI components
export const darkTheme = {
  name: 'energent-dark-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#1e293b',
          20: '#172554',
          40: '#1e40af',
          60: '#2563eb',
          80: '#3b82f6',
          90: '#60a5fa',
          100: '#93c5fd',
        },
      },
      font: {
        interactive: {
          value: '#ffffff',
        },
      },
      background: {
        primary: {
          value: '#111827',
        },
        secondary: {
          value: '#1f2937',
        },
      },
      border: {
        primary: {
          value: '#374151',
        },
      },
      neutral: {
        10: {
          value: '#111827',
        },
        20: {
          value: '#1f2937',
        },
        40: {
          value: '#374151',
        },
        80: {
          value: '#9ca3af',
        },
        90: {
          value: '#d1d5db',
        },
        100: {
          value: '#f3f4f6',
        },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: '{colors.brand.primary.60}',
          color: '#ffffff',
          _hover: {
            backgroundColor: '{colors.brand.primary.40}',
          },
        },
      },
      tabs: {
        item: {
          _active: {
            color: '{colors.brand.primary.80}',
            borderColor: '{colors.brand.primary.80}',
          },
          _hover: {
            color: '{colors.brand.primary.60}',
          },
          _focus: {
            color: '{colors.brand.primary.80}',
          },
        },
      },
      fieldcontrol: {
        borderColor: '{colors.border.primary}',
        color: '#ffffff',
        _focus: {
          borderColor: '{colors.brand.primary.60}',
        },
      },
    },
  },
};

// For backward compatibility
export const customTheme = lightTheme;

// Form fields configuration for Amplify UI
export const formFields = {
  signIn: {
    username: {
      label: 'Email',
      placeholder: 'Enter your email',
      isRequired: true,
    },
  },
  signUp: {
    email: {
      label: 'Email',
      placeholder: 'Enter your email',
      isRequired: true,
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password',
      isRequired: true,
    },
    confirm_password: {
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
      isRequired: true,
    },
  },
};
