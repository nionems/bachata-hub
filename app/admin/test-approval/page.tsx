"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TestApprovalPage() {
  const [shopData, setShopData] = useState({
    name: 'Test Shop Item',
    location: 'Sydney',
    state: 'NSW',
    address: '123 Test Street',
    contactName: 'John Doe',
    contactEmail: 'john@example.com',
    contactPhone: '0412345678',
    website: 'https://example.com',
    instagramUrl: 'https://instagram.com/test',
    facebookUrl: 'https://facebook.com/test',
    price: '$50-100',
    condition: 'New',
    comment: 'Test comment',
    discountCode: 'TEST10',
    imageUrl: 'https://via.placeholder.com/400x300',
    googleMapLink: 'https://maps.google.com',
    info: 'This is a test shop item for testing the approval system.'
  })

  const handleApprove = () => {
    const approvalUrl = new URL('/api/approve-shop', window.location.origin)
    
    // Add all shop data to URL parameters
    Object.entries(shopData).forEach(([key, value]) => {
      approvalUrl.searchParams.set(key, value)
    })

    // Open approval URL in new window
    window.open(approvalUrl.toString(), '_blank')
  }

  const handleReject = () => {
    const rejectionUrl = new URL('/api/reject-shop', window.location.origin)
    
    // Add basic shop data to URL parameters
    rejectionUrl.searchParams.set('name', shopData.name)
    rejectionUrl.searchParams.set('location', shopData.location)
    rejectionUrl.searchParams.set('state', shopData.state)
    rejectionUrl.searchParams.set('contactName', shopData.contactName)
    rejectionUrl.searchParams.set('contactEmail', shopData.contactEmail)

    // Open rejection URL in new window
    window.open(rejectionUrl.toString(), '_blank')
  }

  const updateField = (field: string, value: string) => {
    setShopData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Test Shop Approval System</h1>
        <p className="text-gray-600">
          This page simulates the shop approval process. Fill in the details below and test the approval/rejection functionality.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Shop Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Shop name / Item name</Label>
              <Input
                id="name"
                value={shopData.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location (city)</Label>
                <Input
                  id="location"
                  value={shopData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={shopData.state} onValueChange={(value) => updateField('state', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NSW">NSW</SelectItem>
                    <SelectItem value="VIC">VIC</SelectItem>
                    <SelectItem value="QLD">QLD</SelectItem>
                    <SelectItem value="WA">WA</SelectItem>
                    <SelectItem value="SA">SA</SelectItem>
                    <SelectItem value="TAS">TAS</SelectItem>
                    <SelectItem value="ACT">ACT</SelectItem>
                    <SelectItem value="NT">NT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={shopData.address}
                onChange={(e) => updateField('address', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Contact name</Label>
                <Input
                  id="contactName"
                  value={shopData.contactName}
                  onChange={(e) => updateField('contactName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={shopData.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact phone</Label>
              <Input
                id="contactPhone"
                value={shopData.contactPhone}
                onChange={(e) => updateField('contactPhone', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={shopData.website}
                onChange={(e) => updateField('website', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagramUrl">Instagram</Label>
                <Input
                  id="instagramUrl"
                  value={shopData.instagramUrl}
                  onChange={(e) => updateField('instagramUrl', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="facebookUrl">Facebook</Label>
                <Input
                  id="facebookUrl"
                  value={shopData.facebookUrl}
                  onChange={(e) => updateField('facebookUrl', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price range</Label>
                <Input
                  id="price"
                  value={shopData.price}
                  onChange={(e) => updateField('price', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select value={shopData.condition} onValueChange={(value) => updateField('condition', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Second Hand">Second Hand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={shopData.comment}
                onChange={(e) => updateField('comment', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="discountCode">Discount code</Label>
              <Input
                id="discountCode"
                value={shopData.discountCode}
                onChange={(e) => updateField('discountCode', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={shopData.imageUrl}
                onChange={(e) => updateField('imageUrl', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="googleMapLink">Google map link</Label>
              <Input
                id="googleMapLink"
                value={shopData.googleMapLink}
                onChange={(e) => updateField('googleMapLink', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="info">Item info</Label>
              <Textarea
                id="info"
                value={shopData.info}
                onChange={(e) => updateField('info', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview & Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Shop Preview:</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {shopData.name}</p>
                <p><strong>Location:</strong> {shopData.location}, {shopData.state}</p>
                <p><strong>Contact:</strong> {shopData.contactName} ({shopData.contactEmail})</p>
                <p><strong>Price:</strong> {shopData.price}</p>
                <p><strong>Condition:</strong> {shopData.condition}</p>
                <p><strong>Info:</strong> {shopData.info}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleApprove} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                ✅ Test Approve Shop
              </Button>
              
              <Button 
                onClick={handleReject} 
                className="w-full bg-red-600 hover:bg-red-700"
              >
                ❌ Test Reject Shop
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Fill in the shop details on the left</li>
                <li>• Click "Test Approve" to simulate approval</li>
                <li>• Click "Test Reject" to simulate rejection</li>
                <li>• Both actions will open in a new window</li>
                <li>• Approval will add the shop to the database</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 