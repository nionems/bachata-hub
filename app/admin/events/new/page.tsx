'use client'

import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DANCE_STYLES } from '@/lib/constants'

// Interface for event form data
interface EventFormData {
  name: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string; // Often Venue Name
  city: string;
  state: string;
  description: string;
  price: string;
  danceStyles: string[];
  eventLink: string;
  ticketLink: string;
  image: File | null;
  imageUrl: string; // Add imageUrl field
  isWeekly: boolean;
  recurrence: string;
  googleMapLink: string;
  isWorkshop: boolean;
  published: boolean;
}

export default function NewEventPage() {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    location: '',
    city: '',
    state: '',
    description: '',
    price: '',
    danceStyles: ['Bachata'], // Default
    eventLink: '',
    ticketLink: '',
    image: null,
    imageUrl: '', // Initialize imageUrl
    isWeekly: false,
    recurrence: '',
    googleMapLink: '',
    isWorkshop: false,
    published: true // Default to published
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  // --- Populate States Array ---
  const states = [
    { value: 'NSW', label: 'New South Wales' },
    { value: 'VIC', label: 'Victoria' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'WA', label: 'Western Australia' },
    { value: 'SA', label: 'South Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'ACT', label: 'Australian Capital Territory' },
    { value: 'NT', label: 'Northern Territory' },
  ];
  // --- End Populate States Array ---

  // --- Robust handleChange with Preview Logic ---
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0] || null;
      setFormData((prev) => ({ ...prev, image: file }));
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(file ? URL.createObjectURL(file) : null);
    } else {
      // Handle price specifically if you want to format it (e.g., remove non-numeric)
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- Cleanup Effect for Preview ---
  useEffect(() => {
    return () => { if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl); };
  }, [imagePreviewUrl]);

  // --- Robust handleImageUpload ---
  const handleImageUpload = async (file: File): Promise<string> => {
    console.log("Event Form: Starting image upload for", file.name);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('folder', 'events'); // Store in events folder

    try {
      console.log('Sending image upload request to API...') // Debug log
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Upload API error:', errorData) // Debug log
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()
      console.log('Upload API response:', data) // Debug log
      
      if (!data.imageUrl) {
        console.error('Invalid upload response:', data)
        throw new Error('Invalid upload response: missing imageUrl')
      }
      
      return data.imageUrl;
    } catch (error) {
      console.error('Upload error:', error)
      throw error instanceof Error ? error : new Error('Failed to upload image')
    }
  };
  // --- End handleImageUpload ---

  // --- Robust handleSubmit ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log("Event Form: Starting handleSubmit");

    let uploadedImageUrl = formData.imageUrl; // Start with existing imageUrl
    if (formData.image) {
      console.log("Event Form: Image selected, attempting upload...");
      try {
        uploadedImageUrl = await handleImageUpload(formData.image);
        console.log("Event Form: Image upload successful, URL:", uploadedImageUrl);
      } catch (uploadError: any) {
        console.error("Event Form: Image upload failed during submit:", uploadError);
        setError(`Image upload failed: ${uploadError.message || 'Unknown error'}`);
        setIsLoading(false);
        return; // Stop submission
      }
    } else {
      console.log("Event Form: No image selected for upload.");
    }

    // Prepare data for the event creation API
    const eventData = {
      name: formData.name,
      eventDate: formData.eventDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      city: formData.city,
      state: formData.state,
      description: formData.description,
      price: formData.price,
      danceStyles: formData.danceStyles,
      eventLink: formData.eventLink,
      ticketLink: formData.ticketLink,
      imageUrl: uploadedImageUrl, // Send the URL string from the upload
      isWeekly: formData.isWeekly,
      recurrence: formData.recurrence,
      googleMapLink: formData.googleMapLink,
      isWorkshop: formData.isWorkshop,
      published: formData.published
    };

    console.log("Event Form: Submitting data to /api/events:", eventData);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      console.log(`Event Form: Received response status ${response.status} from /api/events`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error("Event Form: Error submitting event data:", errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      console.log("Event Form: Event added successfully!");
      router.push('/admin/dashboard?tab=events'); // Redirect on success

    } catch (submitError: any) {
      console.error("Event Form: Error during event submission:", submitError);
      setError(`Failed to add event: ${submitError.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  // --- End handleSubmit ---

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Event</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Event Name <span className="text-red-500">*</span></label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Sydney Bachata Gala"/>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
          <input type="date" id="eventDate" name="eventDate" value={formData.eventDate} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>

        {/* Start/End Time */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time <span className="text-red-500">*</span></label>
            <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time <span className="text-red-500">*</span></label>
            <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
        </div>

        {/* Location (Venue) */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location / Venue Name <span className="text-red-500">*</span></label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Sydney Dance Studio"/>
        </div>

        {/* City & State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Sydney"/>
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
            <select id="state" name="state" value={formData.state} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option value="">Select State</option>
              {states.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
          <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Describe the event..."></textarea>
        </div>

        {/* Price & Dance Styles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (e.g., $20 or Free)</label>
            <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="$25 online, $30 at door"/>
          </div>
          <div>
            <label htmlFor="danceStyles" className="block text-sm font-medium text-gray-700 mb-1">Main Dance Style(s)</label>
            <div className="space-y-2">
              {DANCE_STYLES.map(style => (
                <label key={style} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={style}
                    checked={formData.danceStyles.includes(style)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ 
                          ...prev, 
                          danceStyles: [...prev.danceStyles, style] 
                        }))
                      } else {
                        setFormData(prev => ({ 
                          ...prev, 
                          danceStyles: prev.danceStyles.filter(s => s !== style) 
                        }))
                      }
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{style}</span>
                </label>
              ))}
            </div>
            {formData.danceStyles.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {formData.danceStyles.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Event Link & Ticket Link */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="eventLink" className="block text-sm font-medium text-gray-700 mb-1">Event Link (Website/Facebook)</label>
            <input type="url" id="eventLink" name="eventLink" value={formData.eventLink} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://..."/>
          </div>
          <div>
            <label htmlFor="ticketLink" className="block text-sm font-medium text-gray-700 mb-1">Ticket Purchase Link</label>
            <input type="url" id="ticketLink" name="ticketLink" value={formData.ticketLink} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://..."/>
          </div>
        </div>

        {/* Google Map Link */}
        <div>
          <label htmlFor="googleMapLink" className="block text-sm font-medium text-gray-700 mb-1">Google Map Link</label>
          <input type="url" id="googleMapLink" name="googleMapLink" value={formData.googleMapLink} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://..."/>
        </div>

        {/* Workshop Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isWorkshop"
            name="isWorkshop"
            checked={formData.isWorkshop}
            onChange={(e) => setFormData(prev => ({ ...prev, isWorkshop: e.target.checked }))}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="isWorkshop" className="text-sm font-medium text-gray-700">
            This is a workshop
          </label>
        </div>

        {/* Image Input + Preview */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
          <div className="space-y-2">
            {formData.imageUrl && (
              <div className="w-32 h-32 relative mb-2">
                <img
                  src={formData.imageUrl}
                  alt="Current event image"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="text-sm text-gray-500">OR</div>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Image URL"
            />
            {imagePreviewUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
                <img src={imagePreviewUrl} alt="Preview" className="max-w-xs max-h-48 object-contain border rounded shadow-sm" />
              </div>
            )}
          </div>
        </div>
        {/* --- End Image Input --- */}

        {/* Weekly Event Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isWeekly"
            name="isWeekly"
            checked={formData.isWeekly}
            onChange={(e) => setFormData(prev => ({ ...prev, isWeekly: e.target.checked }))}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="isWeekly" className="text-sm font-medium text-gray-700">
            This is a recurring event
          </label>
        </div>

        {/* Recurrence Pattern */}
        {formData.isWeekly && (
          <div>
            <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">
              Recurrence Pattern
            </label>
            <select
              id="recurrence"
              name="recurrence"
              value={formData.recurrence}
              onChange={(e) => setFormData(prev => ({ ...prev, recurrence: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">Select pattern</option>
              <option value="every monday">Every Monday</option>
              <option value="every tuesday">Every Tuesday</option>
              <option value="every wednesday">Every Wednesday</option>
              <option value="every thursday">Every Thursday</option>
              <option value="every friday">Every Friday</option>
              <option value="every saturday">Every Saturday</option>
              <option value="every sunday">Every Sunday</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="first monday of month">First Monday Of Month</option>
              <option value="last friday of month">Last Friday Of Month</option>
              <option value="monthly">Monthly</option>
              <option value="2nd and 4th saturday">Every 2nd & 4th Saturday Of The Month</option>
              <option value="2nd and 4th sunday">Every 2nd & 4th Sunday Of The Month</option>
            </select>
          </div>
        )}

        {/* Published Status */}
        <div>
          <label htmlFor="published" className="block text-sm font-medium text-gray-700 mb-1">Published Status</label>
          <select
            id="published"
            name="published"
            value={formData.published ? 'true' : 'false'}
            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.value === 'true' }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="true">Published (Visible to public)</option>
            <option value="false">Draft (Hidden from public)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Draft events are hidden from the public but can be edited and published later
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button type="submit" disabled={isLoading} className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {isLoading ? 'Adding Event...' : 'Add Event'}
          </button>
        </div>
      </form>
    </div>
  );
} 