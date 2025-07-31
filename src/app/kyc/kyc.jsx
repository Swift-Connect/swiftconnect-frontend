'use client'
import { useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import SuccessModal from '../dashboard/components/sendMoney/successModal'
import { fetchAndUpdateUserData } from '../../utils/userUtils'

const KYCForm = ({ setActiveSidebar }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    date_of_birth: '',
    residential_address: '',
    gender: '',
    document_type: 'DL',
    id_document: null
  })

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})

  // Handle input change
  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear errors when user types
    setErrors({ ...errors, [name]: '' })
  }

  // Handle file change
  const handleFileChange = e => {
    setFormData({ ...formData, id_document: e.target.files[0] })
    setErrors({ ...errors, id_document: '' })
  }

  // Validate Step 1 inputs
  const validateStepOne = () => {
    // const loadingToast = toast.loading("Sending OTP...");
    let newErrors = {}

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full Name is required'
      toast.error(newErrors.fullname)
    }
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of Birth is required'
      toast.error(newErrors.date_of_birth)
    }
    if (!formData.residential_address.trim()) {
      newErrors.residential_address = 'Address is required'
      toast.error(newErrors.residential_address)
    }

    // setErrors(newErrors);
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStepOne()) {
      setStep(2)
    }
  }

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault()
    const loadingToast = toast.loading('Submitting Data')
    setLoading(true)
    setMessage('')

    const submitData = new FormData()
    submitData.append('fullname', formData.fullname)
    submitData.append('date_of_birth', formData.date_of_birth)
    submitData.append('residential_address', formData.residential_address)
    submitData.append('gender', formData.gender)
    submitData.append('document_type', formData.document_type)
    submitData.append('id_document', formData.id_document)

    try {
      const response = await axios.post(
        'https://aesthetic-mandi-swiftconnect-a9332357.koyeb.app/users/submit-kyc/',
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('access_token')}` // Replace with actual token
          }
        }
      )
      console.log(response.data)

      // Fetch fresh user data after successful KYC submission
      try {
        const userData = await fetchAndUpdateUserData()
        console.log('Fresh user data fetched after KYC:', userData)
      } catch (userError) {
        console.error('Error fetching fresh user data:', userError)
      }

      toast.update(loadingToast, {
        render: response.data?.message || 'KYC Submitted Successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      })
      setMessage(response.data?.message || 'KYC Submitted Successfully!')
      setStep(3) // Move to success step
    } catch (error) {
      toast.update(loadingToast, {
        render: error.response?.data?.detail || 'Submission failed',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      })
      // setMessage(
      //   "Error: " + (error.response?.data?.detail || "Submission failed")
      // );
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg'>
      {message && (
        <div className="text-green-600 font-semibold text-center mb-2">
          {message}
        </div>
      )}

      <ToastContainer />
      {step < 3 && (
        <form onSubmit={handleSubmit} className='space-y-4'>
          {step === 1 && (
            <>
              <h2 className='text-xl text-center font-bold mb-4'>
                Add Personal Information
              </h2>

              <input
                type='text'
                name='fullname'
                placeholder='Full Name'
                value={formData.fullname}
                onChange={handleChange}
                className='w-full px-2 py-4 border rounded-lg '
              />
              {/* {errors.fullname && (
                <p className="text-red-500 text-sm">{errors.fullname}</p>
              )} */}

              <input
                type='date'
                name='date_of_birth'
                value={formData.date_of_birth}
                onChange={handleChange}
                placeholder='Date of Birth'
                className='w-full px-2 py-4 border rounded-lg bg-none  text-black'
              />
              {/* {errors.date_of_birth && (
                <p className="text-red-500 text-sm">{errors.date_of_birth}</p>
              )} */}

              <input
                type='text'
                name='residential_address'
                placeholder='Residential Address'
                value={formData.residential_address}
                onChange={handleChange}
                className='w-full px-2 py-4 border rounded-lg'
              />
              {/* {errors.residential_address && (
                <p className="text-red-500 text-sm">
                  {errors.residential_address}
                </p>
              )} */}

              <button
                type='button'
                onClick={handleNextStep}
                className='w-full px-2 py-4 bg-black text-white rounded-lg'
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className='text-xl text-center font-bold mb-4'>
                Select the type of ID to Validate
              </h2>
              <select
                name='gender'
                value={formData.gender}
                onChange={handleChange}
                required
                className='w-full px-2 py-4 border rounded-lg'
              >
                <option value=''>Select Gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>

              <select
                name='document_type'
                value={formData.document_type}
                onChange={handleChange}
                required
                className='w-full px-2 py-4 border rounded-lg'
              >
                <option value='DL'>Driver's License</option>
                <option value='Passport'>Passport</option>
                <option value='ID Card'>ID Card</option>
              </select>

              <input
                type='file'
                name='id_document'
                accept='image/*'
                onChange={handleFileChange}
                required
                className='w-full px-2 py-4 border rounded-lg'
              />

              <button
                type='submit'
                className='w-full px-2 py-4 bg-black text-white rounded-lg'
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Complete KYC'}
              </button>
            </>
          )}
        </form>
      )}

      {step === 3 && (
        <SuccessModal
          header={'Verification Submitted'}
          subtext={
            'You will be notified once your verification process is completed'
          }
          setActiveSidebar={setActiveSidebar}
        />
      )}
    </div>
  )
}

export default KYCForm
