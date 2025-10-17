/**
 * @param {string} fullAddress -   (: "Rothschild Blvd 12, Tel Aviv-Yafo, Israel")
 * @param {object} locationData -   lat/lng (optional)
 * @returns {object} 
 */

export function parseAddressToComponents(fullAddress, locationData = null) {
  if (!fullAddress) {
    return {
      street: '',
      city: 'Tel Aviv-Yafo',
      country: 'Israel - IL',
      entrance: '',
      apt: '',
      postalCode: ''
    }
  }

  const cleanAddress = fullAddress.trim()

  const parts = cleanAddress.split(',').map(p => p.trim())

  let street = ''
  let city = ''
  let country = 'Israel - IL'

  if (parts.length >= 1) {
    street = parts[0]
  }

  if (parts.length >= 2) {
    city = parts[1]

    if (city.includes('Tel Aviv')) {
      city = 'Tel Aviv-Yafo'
    } else if (city.includes('Jerusalem')) {
      city = 'Jerusalem'
    } else if (city.includes('Haifa')) {
      city = 'Haifa'
    }
  }

  if (parts.length >= 3) {
    const lastPart = parts[parts.length - 1].toLowerCase()

    if (lastPart.includes('israel')) {
      country = 'Israel - IL'
    } else if (lastPart.includes('united states') || lastPart.includes('usa')) {
      country = 'United States - US'
    } else if (lastPart.includes('united kingdom') || lastPart.includes('uk')) {
      country = 'United Kingdom - GB'
    } else if (lastPart.includes('france')) {
      country = 'France - FR'
    } else if (lastPart.includes('germany')) {
      country = 'Germany - DE'
    } else if (lastPart.includes('spain')) {
      country = 'Spain - ES'
    } else if (lastPart.includes('italy')) {
      country = 'Italy - IT'
    }
  }

  let apt = ''
  const aptMatch = street.match(/(?:apt|apartment|unit|#)\s*(\d+[a-zA-Z]?)/i)
  if (aptMatch) {
    apt = aptMatch[1]
    street = street.replace(aptMatch[0], '').trim()
  }

  return {
    street: street || '',
    city: city || 'Tel Aviv-Yafo',
    country: country,
    entrance: '',
    apt: apt,
    postalCode: ''
  }
}

/**
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<object>} 
 */
export async function reverseGeocode(lat, lng) {
  try {
    // Google Maps API:
    // const geocoder = new google.maps.Geocoder()
    // const result = await geocoder.geocode({ location: { lat, lng } })

    // Free alternative: Nominatim (OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'AirbnbClone/1.0'
        }
      }
    )

    if (!response.ok) throw new Error('Geocoding failed')

    const data = await response.json()
    const addr = data.address || {}

    const street = [
      addr.house_number,
      addr.road || addr.street
    ].filter(Boolean).join(' ')

    const city = addr.city || addr.town || addr.village || 'Tel Aviv-Yafo'

    let country = 'Israel - IL'
    if (addr.country) {
      const countryLower = addr.country.toLowerCase()
      if (countryLower.includes('israel')) country = 'Israel - IL'
      else if (countryLower.includes('united states')) country = 'United States - US'
      else if (countryLower.includes('united kingdom')) country = 'United Kingdom - GB'
    }

    return {
      street: street || '',
      city: city,
      country: country,
      entrance: '',
      apt: addr.house_number || '',
      postalCode: addr.postcode || ''
    }
  } catch (error) {
    console.warn('Reverse geocoding failed:', error)
    return {
      street: '',
      city: 'Tel Aviv-Yafo',
      country: 'Israel - IL',
      entrance: '',
      apt: '',
      postalCode: ''
    }
  }
}

/**
 * @param {string} address - text add 
 * @param {object} location - {lat, lng}
 * @returns {Promise<object>} 
 */
export async function smartAddressParse(address, location) {
  const parsedFromText = parseAddressToComponents(address, location)

  if (location && location.lat && location.lng && !parsedFromText.street) {
    try {
      const geoResult = await reverseGeocode(location.lat, location.lng)
      return {
        street: geoResult.street || parsedFromText.street,
        city: geoResult.city || parsedFromText.city,
        country: geoResult.country || parsedFromText.country,
        entrance: parsedFromText.entrance,
        apt: geoResult.apt || parsedFromText.apt,
        postalCode: geoResult.postalCode || parsedFromText.postalCode
      }
    } catch (error) {
      console.warn('Smart parse fallback to text parsing')
      return parsedFromText
    }
  }

  return parsedFromText
}