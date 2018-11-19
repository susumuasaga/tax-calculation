/**
 * Address Interface
 */
export interface Address {
  /**
   * Street Name
   */
  street?: string;
  /**
   * Neighborhood Name
   */
  neighborhood?: string;
  /**
   * Zip Code
   */
  zipcode?: string;
  /**
   * City Code
   */
  cityCode?: number;
  /**
   * City Name
   */
  cityName?: string;
  /**
   * State Code
   */
  state: string;
  /**
   * Country Code
   */
  countryCode?: number; // [0-9]{1,4}
  /**
   * Country Code - ISO 3166-1 alpha-3
   */
  country?: string; // [A-Z]{3}
  /**
   * House number
   */
  number?: string;
  /**
   * Complement
   */
  complement?: string;
  /**
   * Phone number
   */
  phone?: string; // \d{6,14}|\(\d{2}\)\s*\d{4,5}-*\d{4}
}
