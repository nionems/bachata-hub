interface SchoolCardProps {
  school: School
  layout: 'grid' | 'list'
}

const SchoolCard = ({ school, layout }: SchoolCardProps) => {
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
          : 'w-48 h-32'
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
          <FaMapMarkerAlt />
          <span>{school.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <FaGlobe />
          <a 
            href={school.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Visit Website
          </a>
        </div>

        {/* Admin Actions */}
        <div className={`
          flex gap-2 mt-auto
          ${layout === 'grid'
            ? 'flex-col'
            : 'flex-row'
          }
        `}>
          <button
            onClick={() => handleEdit(school.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(school.id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
} 