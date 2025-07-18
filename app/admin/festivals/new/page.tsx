'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DANCE_STYLES, AUSTRALIAN_STATES } from '@/lib/constants'

interface FestivalFormData {
  name: string
  startDate: string
  endDate: string
  location: string
  state: string
  country: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  danceStyles: string[]
  imageUrl: string
  description: string
  ambassadorCode: string
  googleMapLink: string
  featured: 'yes' | 'no'
  published: boolean
  instagramLink: string
  facebookLink: string
}

export default function NewFestivalPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<FestivalFormData>({
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    state: '',
    country: 'Australia',
    address: '',
    eventLink: '',
    price: '',
    ticketLink: '',
    danceStyles: [],
    imageUrl: '',
    description: '',
    ambassadorCode: '',
    googleMapLink: '',
    featured: 'no',
    published: true,
    instagramLink: '',
    facebookLink: ''
  })

  const handleImageUpload = async (file: File): Promise<string> => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('folder', 'festivals')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()
      if (!data.imageUrl) throw new Error('Invalid upload response: missing imageUrl')
      return data.imageUrl
    } catch (error) {
      console.error('Upload error:', error)
      throw error instanceof Error ? error : new Error('Failed to upload image')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      const file = fileInput.files?.[0] || null
      setSelectedImage(file)
      if (imagePreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(file ? URL.createObjectURL(file) : null)
    } else {
      // Handle country change logic
      if (name === 'country') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          // Auto-set state to N/A for non-Australian countries
          state: value !== 'Australia' ? 'N/A' : 'NSW'
        }))
      } else {
        setFormData(prev => ({ ...prev, [name]: value }))
      }
    }
  }

  const handleDanceStyleChange = (style: string) => {
    setFormData(prev => {
      if (prev.danceStyles.includes(style)) {
        return { ...prev, danceStyles: prev.danceStyles.filter(s => s !== style) }
      } else {
        return { ...prev, danceStyles: [...prev.danceStyles, style] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      let imageUrl = formData.imageUrl
      if (selectedImage) {
        try {
          imageUrl = await handleImageUpload(selectedImage)
        } catch (uploadError: any) {
          setError(`Image upload failed: ${uploadError.message || 'Unknown error'}`)
          setIsLoading(false)
          return
        }
      }

      const response = await fetch('/api/festivals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      router.push('/admin/dashboard?tab=festivals')
    } catch (submitError: any) {
      setError(`Failed to create festival: ${submitError.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Festival</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium mb-1">Festival Name*</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange}
            name="name"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Festival Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date*</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              name="startDate"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date*</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              name="endDate"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location*</label>
            <input
              type="text"
              value={formData.location}
              onChange={handleChange}
              name="location"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <select
              value={formData.country}
              onChange={handleChange}
              name="country"
              className="w-full p-2 border rounded"
            >
              <option value="Australia">Australia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Spain">Spain</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Italy">Italy</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Belgium">Belgium</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Austria">Austria</option>
              <option value="Sweden">Sweden</option>
              <option value="Norway">Norway</option>
              <option value="Denmark">Denmark</option>
              <option value="Finland">Finland</option>
              <option value="Poland">Poland</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Hungary">Hungary</option>
              <option value="Romania">Romania</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Greece">Greece</option>
              <option value="Portugal">Portugal</option>
              <option value="Ireland">Ireland</option>
              <option value="Iceland">Iceland</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Malta">Malta</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Estonia">Estonia</option>
              <option value="Latvia">Latvia</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Croatia">Croatia</option>
              <option value="Serbia">Serbia</option>
              <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
              <option value="Montenegro">Montenegro</option>
              <option value="North Macedonia">North Macedonia</option>
              <option value="Albania">Albania</option>
              <option value="Kosovo">Kosovo</option>
              <option value="Moldova">Moldova</option>
              <option value="Ukraine">Ukraine</option>
              <option value="Belarus">Belarus</option>
              <option value="Russia">Russia</option>
              <option value="Georgia">Georgia</option>
              <option value="Armenia">Armenia</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Turkey">Turkey</option>
              <option value="Israel">Israel</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Syria">Syria</option>
              <option value="Jordan">Jordan</option>
              <option value="Iraq">Iraq</option>
              <option value="Iran">Iran</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Qatar">Qatar</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Oman">Oman</option>
              <option value="Yemen">Yemen</option>
              <option value="Egypt">Egypt</option>
              <option value="Libya">Libya</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Algeria">Algeria</option>
              <option value="Morocco">Morocco</option>
              <option value="Western Sahara">Western Sahara</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mali">Mali</option>
              <option value="Niger">Niger</option>
              <option value="Chad">Chad</option>
              <option value="Sudan">Sudan</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Somalia">Somalia</option>
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Burundi">Burundi</option>
              <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
              <option value="Republic of the Congo">Republic of the Congo</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Niger">Niger</option>
              <option value="Chad">Chad</option>
              <option value="Libya">Libya</option>
              <option value="Algeria">Algeria</option>
              <option value="Mali">Mali</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Ghana">Ghana</option>
              <option value="Côte d'Ivoire">Côte d'Ivoire</option>
              <option value="Liberia">Liberia</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Senegal">Senegal</option>
              <option value="The Gambia">The Gambia</option>
              <option value="Cape Verde">Cape Verde</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Morocco">Morocco</option>
              <option value="Western Sahara">Western Sahara</option>
              <option value="Algeria">Algeria</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Libya">Libya</option>
              <option value="Egypt">Egypt</option>
              <option value="Sudan">Sudan</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Somalia">Somalia</option>
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Burundi">Burundi</option>
              <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
              <option value="Republic of the Congo">Republic of the Congo</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Gabon">Gabon</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="São Tomé and Príncipe">São Tomé and Príncipe</option>
              <option value="Angola">Angola</option>
              <option value="Zambia">Zambia</option>
              <option value="Malawi">Malawi</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Zimbabwe">Zimbabwe</option>
              <option value="Botswana">Botswana</option>
              <option value="Namibia">Namibia</option>
              <option value="South Africa">South Africa</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Eswatini">Eswatini</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Comoros">Comoros</option>
              <option value="Mayotte">Mayotte</option>
              <option value="Réunion">Réunion</option>
              <option value="Saint Helena">Saint Helena</option>
              <option value="Ascension Island">Ascension Island</option>
              <option value="Tristan da Cunha">Tristan da Cunha</option>
              <option value="Falkland Islands">Falkland Islands</option>
              <option value="South Georgia and the South Sandwich Islands">South Georgia and the South Sandwich Islands</option>
              <option value="Antarctica">Antarctica</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {formData.country === 'Australia' ? 'State*' : 'State/Province'}
            </label>
            {formData.country === 'Australia' ? (
              <select
                value={formData.state}
                onChange={handleChange}
                name="state"
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select a state</option>
                {AUSTRALIAN_STATES.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.state}
                onChange={handleChange}
                name="state"
                className="w-full p-2 border rounded"
                placeholder="e.g., Catalonia, California, Ontario"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address*</label>
          <input
            type="text"
            value={formData.address}
            onChange={handleChange}
            name="address"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Links and Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Link</label>
            <input
              type="url"
              value={formData.eventLink}
              onChange={handleChange}
              name="eventLink"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price*</label>
            <input
              type="number"
              value={formData.price}
              onChange={handleChange}
              name="price"
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ticket Link</label>
            <input
              type="url"
              value={formData.ticketLink}
              onChange={handleChange}
              name="ticketLink"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Dance Styles */}
        <div>
          <label className="block text-sm font-medium mb-1">Dance Styles*</label>
          <div className="flex flex-wrap gap-2">
            {DANCE_STYLES.map(style => (
              <label key={style} className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={formData.danceStyles.includes(style)}
                  onChange={() => handleDanceStyleChange(style)}
                  className="accent-primary"
                />
                {style}
              </label>
            ))}
          </div>
          {formData.danceStyles.length === 0 && (
            <div className="text-xs text-red-500 mt-1">Please select at least one dance style.</div>
          )}
        </div>

        {/* Social Media Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Instagram Link</label>
            <input
              type="url"
              value={formData.instagramLink}
              onChange={handleChange}
              name="instagramLink"
              className="w-full p-2 border rounded"
              placeholder="https://instagram.com/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Facebook Link</label>
            <input
              type="url"
              value={formData.facebookLink}
              onChange={handleChange}
              name="facebookLink"
              className="w-full p-2 border rounded"
              placeholder="https://facebook.com/username"
            />
          </div>
        </div>

        {/* Featured Festival */}
        <div>
          <label className="block text-sm font-medium mb-1">Featured Festival</label>
          <select
            value={formData.featured}
            onChange={handleChange}
            name="featured"
            className="w-full p-2 border rounded"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Featured festivals will be highlighted on the website
          </p>
        </div>

        {/* Published Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Published Status</label>
          <select
            value={formData.published ? 'true' : 'false'}
            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.value === 'true' }))}
            name="published"
            className="w-full p-2 border rounded"
          >
            <option value="true">Published (Visible to public)</option>
            <option value="false">Draft (Hidden from public)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Draft festivals are hidden from the public but can be edited and published later
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Festival Image *</label>
          <div className="space-y-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                name="image"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {imagePreviewUrl && (
              <div className="mt-4 p-4 border rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <div className="relative aspect-video w-full max-w-md">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description & Ambassador Code */}
        <div>
          <label className="block text-sm font-medium mb-1">Festival Description</label>
          <textarea
            value={formData.description}
            onChange={handleChange}
            name="description"
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Describe your festival, what makes it special, what dancers can expect, workshops, performances, etc..."
          />
          <p className="text-xs text-gray-500 mt-1">
            This description will be displayed on the festival card to help dancers understand what your festival offers.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ambassador/Discount Code</label>
          <input
            type="text"
            value={formData.ambassadorCode}
            onChange={handleChange}
            name="ambassadorCode"
            className="w-full p-2 border rounded"
            placeholder="e.g., BACHATAHUB20, DANCE10, etc."
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Add a discount code for our community members to use when purchasing tickets.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Google Map Link</label>
          <input
            type="url"
            value={formData.googleMapLink}
            onChange={handleChange}
            name="googleMapLink"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Creating...' : 'Create Festival'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 