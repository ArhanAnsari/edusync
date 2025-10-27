import { account, databases, ID, config, Permission, Role } from './appwrite';
import { UserRole, User } from './types';
import { OAuthProvider } from 'appwrite';
import { getBaseUrl } from './utils';

export async function signup(
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<User> {
  try {
    // Create account
    const response = await account.create(ID.unique(), email, password, name);

    // Create session
    await account.createEmailPasswordSession(email, password);

    // Create user profile in database with proper permissions
    const userProfile = await databases.createDocument(
      config.databaseId,
      config.collections.users,
      response.$id,
      {
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        email,
        role,
        username: name.toLowerCase().replace(/\s+/g, ''),
        passwordHash: password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      [
        Permission.read(Role.user(response.$id)),
        Permission.update(Role.user(response.$id)),
        Permission.delete(Role.user(response.$id)),
      ]
    );

    return {
      $id: userProfile.$id,
      name: name, // Return the original name parameter
      email: userProfile.email,
      role: userProfile.role,
      createdAt: userProfile.createdAt,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up');
  }
}

export async function login(email: string, password: string): Promise<User> {
  try {
    await account.createEmailPasswordSession(email, password);
    return await getCurrentUser();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to log in');
  }
}

export async function logout(): Promise<void> {
  try {
    await account.deleteSession('current');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to log out');
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const accountData = await account.get();

    // Get user profile from database
    const userProfile = await databases.getDocument(
      config.databaseId,
      config.collections.users,
      accountData.$id
    );

    // Combine firstName and lastName to create the full name
    const fullName = [userProfile.firstName, userProfile.lastName].filter(Boolean).join(' ') || accountData.name;

    return {
      $id: userProfile.$id,
      name: fullName,
      email: userProfile.email || accountData.email,
      role: userProfile.role,
      avatar: userProfile.avatar,
      createdAt: userProfile.createdAt,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get current user');
  }
}

export async function loginWithGitHub(): Promise<void> {
  try {
    const appUrl = getBaseUrl();

    // Get OAuth token instead of auto redirect
    const oauthResponse = await account.createOAuth2Token(
      OAuthProvider.Github,
      `${appUrl}/auth/callback/github`,
      `${appUrl}/login`
    );

    // Redirect the user manually (for SSR/Next.js routing safety)
    if (oauthResponse?.url) {
      window.location.href = oauthResponse.url;
    }
  } catch (error: any) {
    console.error("GitHub OAuth initiation failed:", error);
    throw new Error(error.message || "Failed to initiate GitHub OAuth");
  }
}

export async function updateProfile(userId: string, data: Partial<User>): Promise<User> {
  try {
    const updated = await databases.updateDocument(
      config.databaseId,
      config.collections.users,
      userId,
      data
    );

    return {
      $id: updated.$id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      avatar: updated.avatar,
      createdAt: updated.createdAt,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update profile');
  }
}
