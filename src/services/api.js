import cacheManager from '../utils/cache';

// API endpoints for Dog CEO API
const BASE_URL = 'https://dog.ceo/api';

/**
 * Function to handle retries for API requests
 * @param {Function} apiCall - The function to call
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise<any>} - Promise that resolves with the API response
 */
const withRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      console.log(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error.message);
      lastError = error;
      
      // If it's the last attempt, don't wait anymore
      if (attempt === maxRetries) break;
      
      // Check for rate limiting errors (typically 429 status code)
      if (error.message.includes('429')) {
        console.log(`Rate limit hit, waiting longer before retry...`);
        // Wait longer for rate limits
        await new Promise(resolve => setTimeout(resolve, delay * 2));
      } else {
        // Normal backoff for other errors
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Exponential backoff - increase delay for next attempt
      delay *= 2;
    }
  }
  
  throw lastError;
};

/**
 * Fetch all breeds with caching and retry logic
 */
export const fetchBreeds = async () => {
  const cacheKey = 'all_breeds';
  const cachedBreeds = cacheManager.get(cacheKey);
  
  if (cachedBreeds) {
    console.log('Using cached breed list');
    return cachedBreeds;
  }
  
  try {
    const fetchApi = async () => {
      const response = await fetch(`${BASE_URL}/breeds/list/all`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      
      // Convert the object of breeds to a flat array of breed names
      return Object.keys(data.message);
    };
    
    const breeds = await withRetry(fetchApi);
    
    // Cache the breeds list for 1 hour (3600000 ms)
    cacheManager.set(cacheKey, breeds, 3600000);
    
    return breeds;
  } catch (error) {
    console.error('Error fetching breeds:', error);
    throw error;
  }
};

/**
 * Fetch random images for a specific breed with caching and retry logic
 */
export const fetchRandomImages = async (breed, count = 3) => {
  const cacheKey = `breed_images_${breed}_${count}`;
  const cachedImages = cacheManager.get(cacheKey);
  
  if (cachedImages) {
    console.log(`Using cached images for ${breed}`);
    return cachedImages;
  }
  
  try {
    const fetchApi = async () => {
      const response = await fetch(`${BASE_URL}/breed/${breed}/images/random/${count}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data.message;
    };
    
    const images = await withRetry(fetchApi);
    
    // Cache the images for 5 minutes (300000 ms)
    // Images are cached for a shorter time since they're random
    cacheManager.set(cacheKey, images, 300000);
    
    return images;
  } catch (error) {
    console.error(`Error fetching images for ${breed}:`, error);
    throw error;
  }
};
