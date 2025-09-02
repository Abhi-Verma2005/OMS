// API utility functions for the filter page
// This file provides API integration with the outreachdeal.com webhook

const API_BASE_URL = "https://agents.outreachdeal.com/webhook/dummy-data";

/**
 * Fetch sites data from the API with optional filters
 * @param {Object} filters - Filter parameters
 * @param {number} limit - Maximum number of results
 * @returns {Promise<Array>} Array of site data
 */
export async function fetchSitesData(filters = {}, limit = 100) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filters, limit }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle the array structure from the API
    if (Array.isArray(data)) {
      return data.map(item => item.json || item);
    }
    
    // If it's a single object, wrap it in an array
    if (data && typeof data === 'object') {
      return [data.json || data];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching sites data:", error);
    return [];
  }
}

/**
 * Convert filter parameters to API-compatible format
 * @param {Object} filters - Filter parameters from the UI
 * @returns {Object} API-compatible filters
 */
export function convertFiltersToAPI(filters) {
  const apiFilters = {};
  
  // Authority filters
  if (filters.domainAuthority) {
    apiFilters.domainAuthority = filters.domainAuthority;
  }
  if (filters.pageAuthority) {
    apiFilters.pageAuthority = filters.pageAuthority;
  }
  if (filters.domainRating) {
    apiFilters.domainRating = filters.domainRating;
  }
  if (filters.spamScore) {
    apiFilters.spamScore = filters.spamScore;
  }
  
  // Price filters
  if (filters.costPrice) {
    apiFilters.costPrice = filters.costPrice;
  }
  if (filters.sellingPrice) {
    apiFilters.sellingPrice = filters.sellingPrice;
  }
  
  // Traffic filters
  if (filters.semrushTraffic) {
    apiFilters.semrushTraffic = filters.semrushTraffic;
  }
  if (filters.semrushOrganicTraffic) {
    apiFilters.semrushOrganicTraffic = filters.semrushOrganicTraffic;
  }
  
  // Basic filters
  if (filters.niche) apiFilters.niche = filters.niche;
  if (filters.contentCategories) apiFilters.contentCategories = filters.contentCategories;
  if (filters.priceCategory) apiFilters.priceCategory = filters.priceCategory;
  if (filters.linkAttribute) apiFilters.linkAttribute = filters.linkAttribute;
  if (filters.availability !== undefined) apiFilters.availability = filters.availability;
  if (filters.websiteStatus) apiFilters.websiteStatus = filters.websiteStatus;
  if (filters.language) apiFilters.language = filters.language;
  if (filters.webCountry) apiFilters.webCountry = filters.webCountry;
  if (filters.turnAroundTime) apiFilters.turnAroundTime = filters.turnAroundTime;
  if (filters.websiteRemark) apiFilters.websiteRemark = filters.websiteRemark;
  
  return apiFilters;
}

// Example usage:
// const sites = await fetchSitesData({ domainAuthority: { min: 50 }, limit: 10 });
// const apiFilters = convertFiltersToAPI({ daMin: 50, niche: "Technology" });
