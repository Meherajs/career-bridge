"use client"

import { MapPin, Briefcase, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface JobCardProps {
  id: string
  title: string
  company: string
  location: string
  type: string
  skills: string[]
  postedDate: string
  onViewDetails: (id: string) => void
}

export default function JobCard({
  id,
  title,
  company,
  location,
  type,
  skills,
  postedDate,
  onViewDetails,
}: JobCardProps) {
  return (
    <div className="glass-effect rounded-xl p-6 hover:border-glow-blue transition-all duration-300 group cursor-pointer">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">{company}</p>
          </div>
          <Badge
            variant="secondary"
            className="glass-effect text-xs font-medium px-3 py-1 border border-blue-500/30"
          >
            {type}
          </Badge>
        </div>

        {/* Location and Time */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>{postedDate}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 4).map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs px-2 py-1 border-white/20 hover:border-blue-400/50 transition-colors"
            >
              {skill}
            </Badge>
          ))}
          {skills.length > 4 && (
            <Badge
              variant="outline"
              className="text-xs px-2 py-1 border-white/20"
            >
              +{skills.length - 4} more
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onViewDetails(id)}
          className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
        >
          View Details
        </Button>
      </div>
    </div>
  )
}