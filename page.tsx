import React, { useState } from 'react';
import Image from 'next/image';

export default function Page() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    website: '',
    image: ''
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [schools, setSchools] = useState<School[]>([]);

  interface School {
    id: string;
    name: string;
    location: string;
    description: string;
    website: string;
    image: string;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.url) {
        throw new Error('Invalid response from upload server');
      }

      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to upload file');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let imageUrl = '';
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage);
        console.log('Uploaded image URL:', imageUrl);
      }

      const schoolData = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        website: formData.website,
        image: imageUrl,
      };

      console.log('School data being submitted:', schoolData);

      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolData),
      });

      if (!response.ok) {
        throw new Error('Failed to create school');
      }

      const newSchool = await response.json();
      console.log('School created successfully:', newSchool);
      
      setSchools(prev => [...prev, newSchool]);
      
      setFormData({
        name: '',
        location: '',
        description: '',
        website: '',
        image: ''
      });
      setSelectedImage(null);
    } catch (error) {
      console.error('Error creating school:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="School Name"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Location"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="Website"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit">Submit</button>
      </form>

      {schools.map((school) => (
        <div key={school.id}>
          {school.image && (
            <Image
              src={school.image}
              alt={school.name || 'School image'}
              width={300}
              height={200}
              className="object-cover"
              unoptimized
              onError={(e) => {
                console.error('Image failed to load:', school.image);
                e.currentTarget.src = '/fallback-image.jpg';
              }}
            />
          )}
          <h3>{school.name}</h3>
          <p>{school.location}</p>
        </div>
      ))}
    </div>
  );
} 