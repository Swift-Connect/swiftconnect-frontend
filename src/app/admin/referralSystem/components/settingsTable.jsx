import React, { useState, useRef } from 'react'
import {
  Cog,
  CheckCircle,
  XCircle,
  Edit2,
  Loader2,
  Info,
  Calendar,
  Clock
} from 'lucide-react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import api from '@/utils/api'
import { createPortal } from 'react-dom'

// Tooltip component using portal
const Tooltip = ({ children, targetRef, show }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef(null)

  React.useEffect(() => {
    if (show && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect()
      const tooltipWidth = tooltipRef.current?.offsetWidth || 220
      const tooltipHeight = tooltipRef.current?.offsetHeight || 40
      let left = rect.left + window.scrollX + rect.width / 2 - tooltipWidth / 2
      let top = rect.top + window.scrollY - tooltipHeight - 12
      // Prevent overflow left/right
      left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8))
      // Prevent overflow top
      if (top < window.scrollY + 8) {
        top = rect.bottom + window.scrollY + 12
      }
      setPos({ top, left })
    }
  }, [show, targetRef])

  if (!show) return null
  return createPortal(
    <div
      ref={tooltipRef}
      className='z-[9999] fixed pointer-events-none animate-fade-in transition-opacity duration-150'
      style={{ top: pos.top, left: pos.left, width: 220 }}
    >
      <div className='relative'>
        {/* Arrow */}
        <div className='absolute left-1/2 -translate-x-1/2 -top-2'>
          <div className='w-3 h-3 bg-white border border-gray-200 rotate-45 shadow-sm'></div>
        </div>
        <div className='bg-white border border-gray-200 shadow-lg rounded px-3 py-2 text-xs text-gray-700 w-full'>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

const fields = [
  {
    key: 'signup_bonus',
    label: 'Signup Bonus',
    icon: <Cog className='w-5 h-5 text-green-600' />,
    prefix: '₦',
    type: 'number',
    min: 0,
    tooltip: 'Amount given to a user when they sign up with a referral code.'
  },
  {
    key: 'first_transaction_bonus',
    label: 'First Transaction Bonus',
    icon: <Cog className='w-5 h-5 text-blue-600' />,
    prefix: '₦',
    type: 'number',
    min: 0,
    tooltip: 'Bonus for the first transaction made by a referred user.'
  },
  {
    key: 'transaction_percentage',
    label: 'Transaction Percentage',
    icon: <Cog className='w-5 h-5 text-purple-600' />,
    suffix: '%',
    type: 'number',
    step: '0.01',
    min: 0,
    tooltip: 'Percentage commission on each transaction by a referred user.'
  },
  {
    key: 'monthly_active_bonus',
    label: 'Monthly Active Bonus',
    icon: <Cog className='w-5 h-5 text-yellow-600' />,
    prefix: '₦',
    type: 'number',
    min: 0,
    tooltip: 'Bonus for referred users who are active monthly.'
  },
  {
    key: 'minimum_transaction_amount',
    label: 'Minimum Transaction Amount',
    icon: <Cog className='w-5 h-5 text-pink-600' />,
    prefix: '₦',
    type: 'number',
    min: 0,
    tooltip: 'Minimum transaction amount to qualify for referral commission.'
  }
]

const SettingsTable = ({ settings = [], onEdit }) => {
  const s = settings[0] || {}
  const kycId = s.id
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...s })
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [inputErrors, setInputErrors] = useState({})
  const [tooltipIdx, setTooltipIdx] = useState(null)
  const tooltipRefs = useRef([])

  const hasChanges = JSON.stringify(form) !== JSON.stringify(s)

  const validateField = (name, value) => {
    if (fields.find(f => f.key === name)?.type === 'number') {
      if (value === '' || value === null) return ''
      if (isNaN(Number(value))) return 'Must be a number'
      if (Number(value) < 0) return 'Value must be positive'
    }
    return ''
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    let val = type === 'checkbox' ? checked : value
    if (type === 'number' && val !== '') {
      if (Number(val) < 0) val = '0'
    }
    setForm(prev => ({
      ...prev,
      [name]: val
    }))
    setInputErrors(prev => ({
      ...prev,
      [name]: validateField(name, val)
    }))
  }

  const hasInputErrors = Object.values(inputErrors).some(Boolean)

  const handleSave = async () => {
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    if (!kycId) {
      setErrorMsg('Settings ID not found. Cannot save.')
      setLoading(false)
      return
    }
    try {
      const payload = { ...form }
      Object.keys(payload).forEach(k => {
        if (
          typeof payload[k] === 'number' ||
          /^\d+(\.\d+)?$/.test(payload[k])
        ) {
          payload[k] = String(payload[k])
        }
      })
      const res = await api.patch(`/users/referral-settings/${kycId}/`, payload)
      const updated = res.data || payload
      setForm({ ...updated })
      if (settings.length > 0) settings[0] = { ...updated }
      setEditing(false)
      setSuccessMsg('Settings updated successfully!')
      toast.success('Settings updated successfully!')
      if (onEdit) onEdit(updated)
    } catch (err) {
      setErrorMsg('Failed to update settings.')
      toast.error('Failed to update settings.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setForm({ ...s })
    setErrorMsg('')
    setSuccessMsg('')
    setInputErrors({})
  }

  return (
    <div className='bg-white border border-green-100 rounded-none shadow-none p-0 w-full'>
      {/* Sticky Header for Edit Mode */}
      <div
        className={`flex items-center justify-between px-8 py-6 bg-gradient-to-r from-green-50 to-green-100 border-b sticky top-0 z-20 transition-all duration-300 ${
          editing ? 'shadow-lg' : ''
        }`}
      >
        <div className='flex items-center gap-3'>
          <Cog className='w-8 h-8 text-[#00613A]' />
          <h2 className='text-2xl font-bold text-[#00613A]'>
            Referral Program Settings
          </h2>
        </div>
        {!editing && (
          <button
            className='flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold shadow transition'
            onClick={() => setEditing(true)}
          >
            <Edit2 className='w-4 h-4' /> Edit
          </button>
        )}
      </div>
      {/* Success/Error Message */}
      {successMsg && (
        <div className='bg-green-50 text-green-700 px-8 py-2 text-center'>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className='bg-red-50 text-red-700 px-8 py-2 text-center'>
          {errorMsg}
        </div>
      )}
      {/* Settings Fields */}
      <div className='px-8 py-10 bg-white w-full'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 w-full'>
          {fields.map((field, idx) => (
            <div
              key={field.key}
              className='flex flex-col gap-1 mb-2 relative group bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-200'
            >
              <div className='flex items-center gap-2 mb-1'>
                {field.icon}
                <span className='text-gray-700 font-semibold'>
                  {field.label}
                </span>
                <span className='ml-1 relative'>
                  <span
                    ref={el => (tooltipRefs.current[idx] = el)}
                    onMouseEnter={() => setTooltipIdx(idx)}
                    onMouseLeave={() => setTooltipIdx(null)}
                    tabIndex={0}
                    onFocus={() => setTooltipIdx(idx)}
                    onBlur={() => setTooltipIdx(null)}
                    className='inline-block align-middle'
                  >
                    <Info className='w-4 h-4 text-gray-400 cursor-pointer hover:text-green-600 focus:text-green-600' />
                  </span>
                  <Tooltip
                    show={tooltipIdx === idx}
                    targetRef={{ current: tooltipRefs.current[idx] }}
                  >
                    {field.tooltip}
                  </Tooltip>
                </span>
              </div>
              {editing ? (
                <div className='flex items-center gap-1 animate-fade-in'>
                  {field.prefix && (
                    <span className='text-gray-500'>{field.prefix}</span>
                  )}
                  <input
                    type={field.type}
                    step={field.step || '1'}
                    min={field.min}
                    name={field.key}
                    value={form[field.key] || ''}
                    onChange={handleChange}
                    className={`border rounded px-3 py-2 w-40 text-right focus:ring-2 focus:ring-green-200 bg-green-50 font-semibold text-lg transition-all duration-200 outline-none shadow-sm ${
                      inputErrors[field.key]
                        ? 'border-red-400'
                        : 'border-gray-200'
                    }`}
                  />
                  {field.suffix && (
                    <span className='text-gray-500'>{field.suffix}</span>
                  )}
                </div>
              ) : (
                <span className='font-bold text-lg text-gray-900'>
                  {field.prefix || ''}
                  {parseFloat(s[field.key] || 0).toLocaleString()}
                  {field.suffix || ''}
                </span>
              )}
              {editing && inputErrors[field.key] && (
                <span className='text-xs text-red-500 mt-1'>
                  {inputErrors[field.key]}
                </span>
              )}
            </div>
          ))}
          {/* Section Divider */}
          <div className='col-span-1 md:col-span-2 flex items-center my-6'>
            <div className='flex-1 h-px bg-gradient-to-r from-green-200 via-green-400 to-green-200 opacity-60'></div>
            <span className='mx-4 text-gray-400 font-semibold text-xs tracking-widest'>
              PROGRAM STATUS
            </span>
            <div className='flex-1 h-px bg-gradient-to-l from-green-200 via-green-400 to-green-200 opacity-60'></div>
          </div>
          {/* Active Toggle */}
          <div className='flex flex-col gap-1 mb-2 col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-200'>
            <div className='flex items-center gap-2 mb-1'>
              <CheckCircle className='w-5 h-5 text-green-600' />
              <span className='text-gray-700 font-semibold'>Active</span>
              <span className='ml-1 relative'>
                <span
                  ref={el => (tooltipRefs.current[fields.length] = el)}
                  onMouseEnter={() => setTooltipIdx(fields.length)}
                  onMouseLeave={() => setTooltipIdx(null)}
                  tabIndex={0}
                  onFocus={() => setTooltipIdx(fields.length)}
                  onBlur={() => setTooltipIdx(null)}
                  className='inline-block align-middle'
                >
                  <Info className='w-4 h-4 text-gray-400 cursor-pointer hover:text-green-600 focus:text-green-600' />
                </span>
                <Tooltip
                  show={tooltipIdx === fields.length}
                  targetRef={{ current: tooltipRefs.current[fields.length] }}
                >
                  Toggle to activate or deactivate the referral program.
                </Tooltip>
              </span>
            </div>
            {editing ? (
              <input
                type='checkbox'
                name='is_active'
                checked={!!form.is_active}
                onChange={handleChange}
                className='w-5 h-5 accent-green-600 mt-2'
              />
            ) : (
              <span
                className={`font-bold text-lg mt-2 ${
                  s.is_active ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {s.is_active ? 'Yes' : 'No'}
              </span>
            )}
          </div>
        </div>
        {/* Dates Row */}
        <div className='flex flex-col justify-end items-end gap-2 mt-10'>
          {s.created_at && (
            <div className='flex items-center gap-1 text-md text-gray-400'>
              <Calendar className='w-4 h-4' />
              <span>
                Created:{' '}
                {new Date(s.created_at).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
          {s.updated_at && (
            <div className='flex items-center gap-1 text-md text-gray-400'>
              <Clock className='w-4 h-4' />
              <span>
                Last updated:{' '}
                {new Date(s.updated_at).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Floating Save/Cancel Bar */}
      {editing && (
        <div className='flex justify-end gap-4 px-8 py-4 bg-gradient-to-r from-green-50 to-green-100 border-t sticky bottom-0 z-10 animate-fade-in shadow-lg'>
          <button
            className={`flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold shadow transition ${
              !hasChanges || loading || hasInputErrors || !kycId
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={handleSave}
            disabled={!hasChanges || loading || hasInputErrors || !kycId}
          >
            {loading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <CheckCircle className='w-4 h-4' />
            )}{' '}
            Save
          </button>
          <button
            className='flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 text-sm font-semibold shadow transition'
            onClick={handleCancel}
            disabled={loading}
          >
            <XCircle className='w-4 h-4' /> Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default SettingsTable
