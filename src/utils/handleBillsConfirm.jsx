import { data } from 'autoprefixer'

export const handleBillsConfirm = async (pin, dataa, url, setIsLoading) => {
  // setTransactionPin(pin);
  // setIsPinModalOpen(false);

  // Make the API request with the entered PIN
  setIsLoading(true)
  let errorMessage = ''

  try {
    console.log('my data', dataa)
    const response = await fetch(
      `https://aesthetic-mandi-swiftconnect-a9332357.koyeb.app/services/${url}`,
      // "https://aesthetic-mandi-swiftconnect-a9332357.koyeb.app/services/airtime-topups-transactions/",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Transaction-PIN': pin,
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(dataa)
      }
    )
    console.log('api response:::::', response)
    const data = await response.json()
    console.log('API Response:', data)

    if (response.ok) {
      console.log('response okay...')
      setIsLoading(false)
      return { success: true, data }
    } else {
      // Handle array of error messages
      console.log('response not okay')
      console.log('error message:::::', data.error)

      if (data.detail) {
        errorMessage = data.detail
      } else if (typeof data === 'object') {
        // Handle validation errors like {"plan_id":["A valid integer is required."]}
        const fieldErrors = Object.entries(data)
          .map(
            ([field, messages]) =>
              `${field}: ${Array.isArray(messages) ? messages[0] : messages}`
          )
          .join('\n')
        errorMessage = fieldErrors || data.detail || 'Failed to process payment'
      } else if (Array.isArray(data)) {
        errorMessage = data[0]
      } else {
        errorMessage = data.detail || 'Failed to process payment'
      }

      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  } catch (err) {
    console.error('Payment error:', err)
    errorMessage = 'An error occurred while processing payment'

    if (err.response?.data) {
      if (typeof err.response.data === 'object') {
        const fieldErrors = Object.entries(err.response.data)
          .map(
            ([field, messages]) =>
              `${field}: ${Array.isArray(messages) ? messages[0] : messages}`
          )
          .join('\n')
        errorMessage = fieldErrors || err.response.data.detail || errorMessage
      } else if (Array.isArray(err.response.data)) {
        errorMessage = err.response.data[0]
      } else if (typeof err.response.data === 'string') {
        errorMessage = err.response.data
      }
    } else if (err.message) {
      errorMessage = err.message
    }

    setIsLoading(false)
    return { success: false, error: errorMessage }
  }
}
