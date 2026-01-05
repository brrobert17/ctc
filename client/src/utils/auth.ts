export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  provider: string;
  profilePicture?: string;
  tier?: 'FREE' | 'LIFETIME';
}

export interface AuthTokens {
  token: string;
  user: User;
}

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      removeToken();
      return false;
    }
    
    return true;
  } catch {
    removeToken();
    return false;
  }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
};

export const deleteUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetchWithAuth('http://localhost:3000/api/user/delete', {
      method: 'DELETE',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete user');
    }

    // Clear local storage after successful deletion
    removeToken();
    
    return data;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

// Save estimation to database
export const saveEstimation = async (inputData: any, result: any): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const response = await fetchWithAuth('http://localhost:3000/api/user/estimations', {
      method: 'POST',
      body: JSON.stringify({
        // Car input data
        ...inputData,
        // Estimation result
        predicted_price: result.predicted_price,
        currency: result.currency,
        original_price_usd: result.original_price_usd
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save estimation');
    }
    
    return data;
  } catch (error) {
    console.error('Save estimation error:', error);
    throw error;
  }
};

// Get user's saved estimations
export const getSavedEstimations = async (): Promise<{ success: boolean; data: any[] }> => {
  try {
    const response = await fetchWithAuth('http://localhost:3000/api/user/estimations');

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch saved estimations');
    }
    
    return data;
  } catch (error) {
    console.error('Get saved estimations error:', error);
    throw error;
  }
};

// Delete a saved estimation
export const deleteSavedEstimation = async (estimationId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetchWithAuth(`http://localhost:3000/api/user/estimations/${estimationId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete estimation');
    }
    
    return data;
  } catch (error) {
    console.error('Delete estimation error:', error);
    throw error;
  }
};
