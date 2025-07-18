'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DANCE_STYLES, AUSTRALIAN_STATES } from '@/lib/constants'

interface Festival {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  state: string
  country?: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  danceStyles: string[] | string
  imageUrl: string
  description?: string
  ambassadorCode?: string
  googleMapLink: string
  featured?: 'yes' | 'no'
  published?: boolean
  instagramLink?: string
  facebookLink?: string
}

export default function EditFestivalPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Festival>({
    id: '',
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
    featured: undefined,
    published: true,
    instagramLink: '',
    facebookLink: ''
  })
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const fetchFestival = useCallback(async () => {
    try {
      const response = await fetch(`/api/festivals/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch festival')
      const data = await response.json()
      // Normalize danceStyles to array
      let danceStylesArr: string[] = []
      if (Array.isArray(data.danceStyles)) {
        danceStylesArr = data.danceStyles
      } else if (typeof data.danceStyles === 'string') {
        danceStylesArr = data.danceStyles.split(',').map((s: string) => s.trim()).filter(Boolean)
      }
      setFormData({ ...data, danceStyles: danceStylesArr })
    } catch (error) {
      console.error('Error fetching festival:', error)
      setError('Failed to load festival data')
    }
  }, [params.id])

  useEffect(() => {
    fetchFestival()
  }, [fetchFestival])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/festivals/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to update festival')
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update festival')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (1MB limit for Firestore)
      const maxSize = 1024 * 1024 // 1MB in bytes
      if (file.size > maxSize) {
        setError('Image file is too large. Please choose an image smaller than 1MB.')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        // Additional check for base64 size (should be roughly 33% larger than file size)
        if (result.length > 1400000) { // ~1.4MB base64 limit
          setError('Image file is too large. Please choose an image smaller than 1MB.')
          return
        }
        
        setImagePreviewUrl(result)
        setFormData({ ...formData, imageUrl: result })
        setError(null) // Clear any previous errors
      }
      reader.readAsDataURL(file)
    }
  }

  // Add handler for dance style checkboxes
  const handleDanceStyleChange = (style: string) => {
    setFormData(prev => {
      const current = Array.isArray(prev.danceStyles) ? prev.danceStyles : []
      if (current.includes(style)) {
        return { ...prev, danceStyles: current.filter(s => s !== style) }
      } else {
        return { ...prev, danceStyles: [...current, style] }
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Festival</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Festival Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Festival Name*</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date*</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date*</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Location + State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location*</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State*</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a state</option>
              {AUSTRALIAN_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1">Address*</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Event Links & Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Link</label>
            <input
              type="url"
              value={formData.eventLink}
              onChange={(e) => setFormData({ ...formData, eventLink: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price*</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, ticketLink: e.target.value })}
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
                  checked={Array.isArray(formData.danceStyles) && formData.danceStyles.includes(style)}
                  onChange={() => handleDanceStyleChange(style)}
                  className="accent-primary"
                />
                {style}
              </label>
            ))}
          </div>
          {Array.isArray(formData.danceStyles) && formData.danceStyles.length === 0 && (
            <div className="text-xs text-red-500 mt-1">Please select at least one dance style.</div>
          )}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <select
            value={formData.country || 'Australia'}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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

        {/* Social Media Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Instagram Link</label>
            <input
              type="url"
              value={formData.instagramLink || ''}
              onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="https://instagram.com/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Facebook Link</label>
            <input
              type="url"
              value={formData.facebookLink || ''}
              onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="https://facebook.com/username"
            />
          </div>
        </div>

        {/* Featured Festival */}
        <div>
          <label className="block text-sm font-medium mb-1">Featured Festival</label>
          <select
            value={formData.featured || 'no'}
            onChange={(e) => setFormData({ ...formData, featured: e.target.value as 'yes' | 'no' })}
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
            onChange={(e) => setFormData({ ...formData, published: e.target.value === 'true' })}
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
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum file size: 1MB. Larger images will be rejected.
              </p>
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
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            value={formData.ambassadorCode || ''}
            onChange={(e) => setFormData({ ...formData, ambassadorCode: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, googleMapLink: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Updating...' : 'Update Festival'}
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
