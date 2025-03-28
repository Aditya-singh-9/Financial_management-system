
import React from 'react';
import { Badge } from '@/components/ui/badge';

type SeverityLevel = 'high' | 'medium' | 'low';

interface SeverityBadgeProps {
  severity: string;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  switch (severity.toLowerCase()) {
    case 'high':
      return <Badge className="bg-red-500 hover:bg-red-600">High</Badge>;
    case 'medium':
      return <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
    case 'low':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Low</Badge>;
    default:
      return <Badge className="bg-slate-500 hover:bg-slate-600">{severity}</Badge>;
  }
};

export default SeverityBadge;
