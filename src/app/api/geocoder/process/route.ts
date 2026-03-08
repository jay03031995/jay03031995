import { NextResponse } from 'next/server';
import axios from 'axios';

// To comply with Nominatim's usage policy of 1 request per second
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const { row } = await request.json();

    // 1 second delay to respect rate limits
    await delay(1000);

    const keys = Object.keys(row);
    const lowerKeys = keys.map(k => k.toLowerCase());

    // Determine if we should do geocoding or reverse geocoding
    const hasLat = lowerKeys.some(k => k.includes('lat') || k.includes('latitude'));
    const hasLon = lowerKeys.some(k => k.includes('lon') || k.includes('longitude'));

    if (hasLat && hasLon) {
      // Reverse Geocoding
      const latKey = keys.find(k => k.toLowerCase().includes('lat') || k.toLowerCase().includes('latitude'));
      const lonKey = keys.find(k => k.toLowerCase().includes('lon') || k.toLowerCase().includes('longitude'));

      const lat = row[latKey!];
      const lon = row[lonKey!];

      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'GeoSwift/1.0 (jay03031995@gmail.com)'
        }
      });

      const data = response.data;
      if (data.error) {
        return NextResponse.json({ status: 'error', error: data.error });
      }

      return NextResponse.json({
        status: 'success',
        display_name: data.display_name,
        address_line_1: data.address?.road || data.address?.suburb || '',
        city: data.address?.city || data.address?.town || data.address?.village || '',
        state: data.address?.state || '',
        postal_code: data.address?.postcode || '',
        country: data.address?.country || ''
      });

    } else {
      // Forward Geocoding
      let query = '';

      const addressFields = [
        'address', 'address line 1', 'address line 2', 'street',
        'city', 'town', 'state', 'province', 'postal code', 'zip', 'country'
      ];

      // Try to build query from specific fields
      const parts = [];
      const city = row[keys.find(k => k.toLowerCase() === 'city')!] || '';
      const state = row[keys.find(k => k.toLowerCase() === 'state')!] || '';
      const street = row[keys.find(k => k.toLowerCase() === 'address line 1' || k.toLowerCase() === 'street')!] || '';
      const country = row[keys.find(k => k.toLowerCase() === 'country')!] || '';

      if (street || city || state) {
        if (street) parts.push(street);
        if (city) parts.push(city);
        if (state) parts.push(state);
        if (country) parts.push(country);
        query = parts.filter(p => !!p).join(', ');
      } else {
        // Fallback: look for ANY field that looks like address data
        const foundValues = Object.entries(row)
          .filter(([key]) => addressFields.some(f => key.toLowerCase().includes(f)))
          .map(([_, val]) => val);

        if (foundValues.length > 0) {
          query = foundValues.join(', ');
        } else {
          // Absolute fallback: use all fields
          query = Object.values(row).join(', ');
        }
      }

      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: query,
          format: 'json',
          limit: 1,
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'GeoSwift/1.0 (jay03031995@gmail.com)'
        }
      });

      const data = response.data;
      if (!data || data.length === 0) {
        return NextResponse.json({ status: 'error', error: 'No results found' });
      }

      const result = data[0];
      return NextResponse.json({
        status: 'success',
        lat: result.lat,
        lon: result.lon,
        formatted_address: result.display_name,
        type: result.type,
        importance: result.importance
      });
    }

  } catch (error: any) {
    console.error('Geocoding processing error:', error.message);
    return NextResponse.json({ status: 'error', error: 'Service unavailable' }, { status: 500 });
  }
}
