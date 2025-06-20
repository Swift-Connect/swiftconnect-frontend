import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function CreateNewKey ({
  onClose,
  onSubmit,
  editData,
  isSubmitting
}) {
  const [formData, setFormData] = useState({
    active_gateway: '',
    is_active: true
  })

  const [errors, setErrors] = useState({})

  // Initialize form with edit data if available
  useEffect(() => {
    if (editData) {
      const activeGateway = editData.gateway_info[editData.active_gateway]
      setFormData({
        active_gateway: editData.active_gateway || '',
        is_active: activeGateway?.is_active ?? true
      })
    }
  }, [editData])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.active_gateway) {
      newErrors.active_gateway = 'Please select a payment gateway'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Transform the form data to match the new structure
    const submitData = {
      active_gateway: formData.active_gateway,
      gateway_info: {
        flutterwave: {
          name: 'Flutterwave',
          is_active:
            formData.active_gateway === 'flutterwave' && formData.is_active,
          updated_at:
            formData.active_gateway === 'flutterwave'
              ? new Date().toISOString()
              : null
        },
        paystack: {
          name: 'Paystack',
          is_active:
            formData.active_gateway === 'paystack' && formData.is_active,
          updated_at:
            formData.active_gateway === 'paystack'
              ? new Date().toISOString()
              : null
        },
        monify: {
          name: 'Monnify',
          is_active: formData.active_gateway === 'monify' && formData.is_active,
          updated_at:
            formData.active_gateway === 'monify'
              ? new Date().toISOString()
              : null
        }
      }
    }

    onSubmit(submitData)
  }

  const getFieldError = fieldName => {
    return errors[fieldName] ? (
      <p className='mt-1 text-sm text-red-600 flex items-center'>
        <AlertCircle className='w-4 h-4 mr-1' />
        {errors[fieldName]}
      </p>
    ) : null
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-black text-xl'
          disabled={isSubmitting}
        >
          &times;
        </button>
        <h2 className='text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2'>
          {editData ? 'Edit Payment Gateway' : 'Configure Payment Gateway'}{' '}
          <span>🔑</span>
        </h2>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex flex-col'>
            <label className='font-medium mb-2'>Select Gateway</label>
            <select
              className={`w-full border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.active_gateway ? 'border-red-500' : ''
              }`}
              value={formData.active_gateway}
              onChange={e => {
                setFormData({ ...formData, active_gateway: e.target.value })
                setErrors({ ...errors, active_gateway: null })
              }}
              required
              disabled={isSubmitting}
            >
              <option value=''>Select Gateway</option>
              <option value='flutterwave'>Flutterwave</option>
              <option value='paystack'>Paystack</option>
              <option value='monify'>Monify</option>
            </select>
            {getFieldError('active_gateway')}
          </div>

          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='is_active'
              checked={formData.is_active}
              onChange={e =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className='w-4 h-4 text-green-600 focus:ring-green-500'
              disabled={isSubmitting}
            />
            <label htmlFor='is_active' className='font-medium'>
              Activate this gateway
            </label>
          </div>

          <div className='flex justify-end gap-4 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='px-6 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50'
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-6 py-2 bg-[#00613A] text-white rounded-lg hover:bg-[#004d2e] disabled:opacity-50 flex items-center'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  {editData ? 'Updating...' : 'Saving...'}
                </>
              ) : editData ? (
                'Update Configuration'
              ) : (
                'Save Configuration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
