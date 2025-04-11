import Image from 'next/image'
import { FaMapMarkerAlt, FaGlobe } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { ExternalLink, MapPin, Share2 } from 'lucide-react'
import { CardFooter } from '@/components/ui/card'

interface School {
  id: string;
  name: string;
  location: string;
  website: string;
  imageUrl?: string;
  googleMapLink?: string;
  socialUrl?: string;
  // ... other properties
}

interface SchoolCardProps {
  school: School;
  layout: 'grid' | 'list';
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}

const SchoolCard = ({ school, layout, handleEdit, handleDelete }: SchoolCardProps) => {
  return (
    <div className={`
      bg-white rounded-lg shadow-md overflow-hidden
      ${layout === 'grid' 
        ? 'flex flex-col'
        : 'flex flex-row'
      }
    `}>
      {/* Image */}
      <div className={`
        relative
        ${layout === 'grid'
          ? 'w-full h-48'
          : 'w-48 h-32 flex-shrink-0'
        }
      `}>
        <Image
          src={school.imageUrl || '/placeholder-school.jpg'}
          alt={school.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className={`
        p-4 flex flex-col
        ${layout === 'grid'
          ? ''
          : 'flex-1'
        }
      `}>
        <h3 className="text-xl font-semibold mb-2">{school.name}</h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <FaMapMarkerAlt className="flex-shrink-0" />
          <span>{school.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <FaGlobe className="flex-shrink-0" />
          {school.website ? (
            <a 
              href={school.website.startsWith('http') ? school.website : `https://${school.website}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 text-sm"
            >
              Visit Website
            </a>
          ) : (
            <span>No Website</span>
          )}
        </div>

        {/* Spacer for list layout */}
        {layout === 'list' && <div className="flex-grow"></div>}

        {/* Admin Actions */}
        <div className={`
          flex gap-2 
          ${layout === 'grid'
            ? 'mt-auto flex-col'
            : 'flex-row items-end'
          }
        `}>
          <button
            onClick={() => handleEdit(school.id)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(school.id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>

        <CardFooter className="flex flex-col gap-2 pt-0">
          <div className="flex flex-wrap gap-2">
            {school.website && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(school.website, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Website
              </Button>
            )}
            {school.googleMapLink && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(school.googleMapLink, '_blank')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                View on Map
              </Button>
            )}
            {school.socialUrl && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(school.socialUrl, '_blank')}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Social Media
              </Button>
            )}
          </div>
        </CardFooter>
      </div>
    </div>
  )
}

export default SchoolCard; 