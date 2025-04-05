import React, { useState } from 'react';
import Image from 'next/image';

const [formData, setFormData] = useState({
  name: '',
  location: '',
  description: '',
  website: '',
  image: ''
});

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
    
    // Update the schools list or redirect to the new school
    // Option 1: Update state if showing schools list
    setSchools(prev => [...prev, newSchool]);
    
    // Option 2: Redirect to the new school page
    // router.push(`/schools/${newSchool.id}`);
    
    // Clear form
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