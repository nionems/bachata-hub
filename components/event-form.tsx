import React, { useState } from "react";
import { Label, Select, SelectItem } from "@/components/ui/select";

const EventForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    location: "",
    imageUrl: "",
    colorId: "1", // Default color
  });

  const colorOptions = [
    { id: "1", name: "Lavender", value: "#7986cb" },
    { id: "2", name: "Sage", value: "#33b679" },
    { id: "3", name: "Grape", value: "#8e24aa" },
    { id: "4", name: "Flamingo", value: "#e67c73" },
    { id: "5", name: "Banana", value: "#f6c026" },
    { id: "6", name: "Tangerine", value: "#f5511d" },
    { id: "7", name: "Peacock", value: "#039be5" },
    { id: "8", name: "Graphite", value: "#616161" },
    { id: "9", name: "Blueberry", value: "#3f51b5" },
    { id: "10", name: "Basil", value: "#0b8043" },
    { id: "11", name: "Tomato", value: "#d60000" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="colorId">Event Color</Label>
        <Select
          id="colorId"
          value={formData.colorId}
          onValueChange={(value) => setFormData({ ...formData, colorId: value })}
        >
          {colorOptions.map((color) => (
            <SelectItem key={color.id} value={color.id}>
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: color.value }}
                />
                {color.name}
              </div>
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default EventForm; 