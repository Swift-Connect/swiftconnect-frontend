const BASE_URL = 'https://aesthetic-mandi-swiftconnect-a9332357.koyeb.app/'

// Generic GET function
export async function getData (url) {
  try {
    const token = localStorage.getItem('access_token') // Retrieve token from localStorage
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Use the token from localStorage
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`GET request failed: ${response.statusText}`)
    }
    console.log('GET function called')
    return await response.json()
  } catch (error) {
    console.error('Error in GET function:', error)
    throw error
  }
}

// Generic POST function
export async function postData (url, data) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`POST request failed: ${response.statusText}`)
    }
    console.log('POST function called')
    return await response.json()
  } catch (error) {
    console.error('Error in POST function:', error)
    throw error
  }
}

// Generic PUT function
export async function updateData (url, data) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`PUT request failed: ${response.statusText}`)
    }
    console.log('PUT function called')
    return await response.json()
  } catch (error) {
    console.error('Error in PUT function:', error)
    throw error
  }
}

// Generic DELETE function
export async function deleteData (url) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`DELETE request failed: ${response.statusText}`)
    }
    console.log('DELETE function called')
    return await response.json()
  } catch (error) {
    console.error('Error in DELETE function:', error)
    throw error
  }
}

export async function validateSmartCard (smartCardNumber, cableName) {
  console.log('validate triggered...')
  const url = `https://vtukonnect.com/ajax/validate_iuc?smart_card_number=${smartCardNumber}&cablename=${cableName}`
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Token ${process.env.CABLE_VALIDATOR}`,
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`Validation failed: ${response.statusText}`)
    }
    console.log('response....', await response.json())
    return await response.json()
  } catch (error) {
    console.error('Error in smart card validation:', error)
    throw error
  }
}

// User API functions
export async function getUserProfile() {
  return getData('users/me/');
}

export async function updateUserProfile(data) {
  // PATCH /users/edit-profile/
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${BASE_URL}users/edit-profile/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { detail: response.statusText };
    }
    const error = new Error('Profile update failed');
    error.data = errorData;
    throw error;
  }
  return await response.json();
}

export async function changePassword(data) {
  // POST /users/reset-password/
  return postData('users/reset-password/', data);
}

export async function requestPasswordReset(data) {
  // POST /users/request-password-reset/
  return postData('users/request-password-reset/', data);
}

export async function changeTransactionPin(data) {
  // POST /users/change-transaction-pin/
  const token = localStorage.getItem('access_token');
  console.log('API CALL: /users/change-transaction-pin/', data);
  const response = await fetch(`${BASE_URL}users/change-transaction-pin/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { detail: response.statusText };
    }
    const error = new Error('Change PIN failed');
    error.data = errorData;
    throw error;
  }
  return await response.json();
}

/**
 * @dev
 * BELOW IS AN EXAMPLE USAGE OF THE FUNCTIONS IN VARIOUS COMPONETS AND PAGES
 */

// import { getData, postData, updateData, deleteData } from './apiCalls';

// async function fetchData() {
//     const data = await getData('/endpoint');
//     console.log(data);
// }

// async function createItem() {
//     const newItem = { name: 'SwiftConnect' };
//     const response = await postData('/endpoint', newItem);
//     console.log(response);
// }

// async function updateItem() {
//     const updatedData = { name: 'Updated SwiftConnect' };
//     const response = await updateData('/endpoint/1', updatedData);
//     console.log(response);
// }

// async function deleteItem() {
//     const response = await deleteData('/endpoint/1');
//     console.log(response);
// }
