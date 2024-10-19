import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: './tests/.env' });

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || '';
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || '';
const AUTH0_SANDBOX_CLIENT_ID = process.env.AUTH0_SANDBOX_CLIENT_ID || '';
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET || '';
const AUTH0_AUDIENCE = `https://${AUTH0_DOMAIN}/api/v2/`;
const AUTH0_TOKEN_URL = `https://${AUTH0_DOMAIN}/oauth/token`;

// Define the shape of a user from the Auth0 API response
interface Auth0User {
  user_id: string;
  email: string;
  password: string;
}

// Define the response type for the token request
interface TokenResponse {
  access_token: string;
}

// Function to request an access token
async function getAccessToken(): Promise<string> {
  try {
    const response = await axios.post<TokenResponse>(AUTH0_TOKEN_URL, {
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: AUTH0_AUDIENCE,
      grant_type: 'client_credentials',
    });

    return response.data.access_token;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Error getting access token:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

// Function to create a new user in Auth0
export async function createUser(email: string, password: string): Promise<string> {
  try {
    console.log(`Creating user with email: ${email}`);
    const token = await getAccessToken(); // Get access token

    // Create the user
    const response = await axios.post<Auth0User>(
      `https://${AUTH0_DOMAIN}/api/v2/users`,
      {
        email,
        password,
        connection: 'Username-Password-Authentication', // Specify the connection for user creation
        email_verified: true, // Set email as verified by default
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const userId = response.data.user_id; // Get the newly created user's ID
    console.log(`User created: ${userId}`);

    // Example: Directly update user metadata to include application access
    await axios.patch(
      `https://${AUTH0_DOMAIN}/api/v2/users/${userId}`,
      {
        app_metadata: {
          authorized_applications: [AUTH0_SANDBOX_CLIENT_ID], // Add application ID to user metadata
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`User ${userId} authorized for application ${AUTH0_SANDBOX_CLIENT_ID}`);

    return userId; // Return the newly created user's ID
  } catch (error: unknown) {
    console.error(
      'Error creating user or authorizing application:',
      error instanceof AxiosError ? error.response?.data : 'Unknown error'
    );
    throw error;
  }
}

// Function to delete a user from Auth0
export async function deleteUser(userEmail: string): Promise<void> {
  try {
    const token = await getAccessToken(); // Get access token

    // Get the user ID from the email
    const response = await axios.get<Auth0User[]>(`https://${AUTH0_DOMAIN}/api/v2/users-by-email`, {
      params: {
        email: userEmail,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userId = response.data[0].user_id; // Get the user ID from the response

    await axios.delete(`https://${AUTH0_DOMAIN}/api/v2/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`User with ID ${userId} deleted.`);
  } catch (error: unknown) {
    console.error(
      `Error deleting user with email ${userEmail}:`,
      error instanceof AxiosError ? error.response?.data : 'Unknown error'
    );
    throw error;
  }
}
