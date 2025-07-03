import { FaPlus } from "react-icons/fa";
import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Form({formData}) {
  const [touched, setTouched] = useState({});
  const [values, setValues] = useState(formData);
  const handleChange = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value });
    setTouched({ ...touched, [field]: true });
  };
  const isValid = (field) => {
    if (!touched[field]) return null;
    if (field === 'email') return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email);
    if (field === 'password') return values.password.length >= 6;
    if (field === 'dob') return !!values.dob;
    return values[field] && values[field].length > 1;
  };
  return (
    <form className="flex-1 grid grid-cols-2 gap-6" autoComplete="on">
      {/* Name */}
      <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor="name">Your Name</label>
        <div className="relative">
          <input
            id="name"
            type="text"
            className={`border rounded-lg p-2 pr-8 ${isValid('name') === true ? 'border-green-500' : isValid('name') === false ? 'border-red-500' : ''}`}
            value={values.name}
            onChange={handleChange('name')}
            autoComplete="name"
            aria-label="Your Name"
          />
          {isValid('name') === true && <CheckCircle className="absolute right-2 top-2 text-green-500 w-5 h-5" />}
          {isValid('name') === false && <XCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />}
        </div>
      </div>

      {/* Username */}
      <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor="username">User Name</label>
        <div className="relative">
          <input
            id="username"
            type="text"
            className={`border rounded-lg p-2 pr-8 ${isValid('username') === true ? 'border-green-500' : isValid('username') === false ? 'border-red-500' : ''}`}
            value={values.username}
            onChange={handleChange('username')}
            autoComplete="username"
            aria-label="User Name"
          />
          {isValid('username') === true && <CheckCircle className="absolute right-2 top-2 text-green-500 w-5 h-5" />}
          {isValid('username') === false && <XCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />}
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor="email">Email</label>
        <div className="relative">
          <input
            id="email"
            type="email"
            className={`border rounded-lg p-2 pr-8 ${isValid('email') === true ? 'border-green-500' : isValid('email') === false ? 'border-red-500' : ''}`}
            value={values.email}
            onChange={handleChange('email')}
            autoComplete="email"
            aria-label="Email"
            inputMode="email"
          />
          {isValid('email') === true && <CheckCircle className="absolute right-2 top-2 text-green-500 w-5 h-5" />}
          {isValid('email') === false && <XCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />}
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor="password">Password</label>
        <div className="relative">
          <input
            id="password"
            type="password"
            className={`border rounded-lg p-2 pr-8 ${isValid('password') === true ? 'border-green-500' : isValid('password') === false ? 'border-red-500' : ''}`}
            value={values.password}
            onChange={handleChange('password')}
            autoComplete="new-password"
            aria-label="Password"
          />
          {isValid('password') === true && <CheckCircle className="absolute right-2 top-2 text-green-500 w-5 h-5" />}
          {isValid('password') === false && <XCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />}
        </div>
      </div>

      {/* Date of Birth */}
      <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor="dob">Date of Birth</label>
        <div className="relative">
          <input
            id="dob"
            type="date"
            className={`border rounded-lg p-2 pr-8 ${isValid('dob') === true ? 'border-green-500' : isValid('dob') === false ? 'border-red-500' : ''}`}
            value={values.dob}
            onChange={handleChange('dob')}
            autoComplete="bday"
            aria-label="Date of Birth"
          />
          {isValid('dob') === true && <CheckCircle className="absolute right-2 top-2 text-green-500 w-5 h-5" />}
          {isValid('dob') === false && <XCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />}
        </div>
      </div>

      {/* Address */}
      <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor="address">Present Address</label>
        <div className="relative">
          <input
            id="address"
            type="text"
            className={`border rounded-lg p-2 pr-8 ${isValid('address') === true ? 'border-green-500' : isValid('address') === false ? 'border-red-500' : ''}`}
            value={values.address}
            onChange={handleChange('address')}
            autoComplete="street-address"
            aria-label="Present Address"
          />
          {isValid('address') === true && <CheckCircle className="absolute right-2 top-2 text-green-500 w-5 h-5" />}
          {isValid('address') === false && <XCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />}
        </div>
      </div>

      {/* City */}
      <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor="city">City</label>
        <div className="relative">
          <input
            id="city"
            type="text"
            className={`border rounded-lg p-2 pr-8 ${isValid('city') === true ? 'border-green-500' : isValid('city') === false ? 'border-red-500' : ''}`}
            value={values.city}
            onChange={handleChange('city')}
            autoComplete="address-level2"
            aria-label="City"
          />
          {isValid('city') === true && <CheckCircle className="absolute right-2 top-2 text-green-500 w-5 h-5" />}
          {isValid('city') === false && <XCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />}
        </div>
      </div>

      {/* Country */}
      <div className="flex flex-col">
        <label className="text-sm mb-1" htmlFor="country">Country</label>
        <div className="relative">
          <input
            id="country"
            type="text"
            className={`border rounded-lg p-2 pr-8 ${isValid('country') === true ? 'border-green-500' : isValid('country') === false ? 'border-red-500' : ''}`}
            value={values.country}
            onChange={handleChange('country')}
            autoComplete="country"
            aria-label="Country"
          />
          {isValid('country') === true && <CheckCircle className="absolute right-2 top-2 text-green-500 w-5 h-5" />}
          {isValid('country') === false && <XCircle className="absolute right-2 top-2 text-red-500 w-5 h-5" />}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-[3em] mb-8">
        <button className="bg-[#00613A] font-medium text-white px-4 py-2 rounded-lg flex items-center gap-2">
          Save <FaPlus />
        </button>
      </div>
    </form>
  );
}
