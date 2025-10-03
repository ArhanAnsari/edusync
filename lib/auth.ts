import { account, databases, ID, config } from './appwrite';
import { UserRole, User } from './types';

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

    // Create user profile in database
    const userProfile = await databases.createDocument(
      config.databaseId,
      config.collections.users,
      response.$id,
      {
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
      }
    );

    return {
      $id: userProfile.$id,
      name: userProfile.name,
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

    return {
      $id: userProfile.$id,
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
      avatar: userProfile.avatar,
      createdAt: userProfile.createdAt,
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get current user');
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
