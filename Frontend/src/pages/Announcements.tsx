
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';

// This would normally come from your database
// DATABASE INTEGRATION POINT: Replace this with a fetch call to your backend API
const MOCK_ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'Fee Payment Deadline Extended',
    content: 'The deadline for Term 3 fee payment has been extended to May 30, 2023.',
    date: '2023-04-10',
    category: 'fees',
    isImportant: true
  },
  {
    id: '2',
    title: 'Holiday Notice',
    content: 'The institute will remain closed from May 1 to May 5, 2023 on account of summer vacation.',
    date: '2023-04-15',
    category: 'holiday',
    isImportant: false
  },
  {
    id: '3',
    title: 'Examination Schedule',
    content: 'The end-term examination schedule has been published. Please check your email for details.',
    date: '2023-04-20',
    category: 'exam',
    isImportant: true
  },
  {
    id: '4',
    title: 'Sports Day',
    content: 'Annual sports day will be held on April 25, 2023. All students are encouraged to participate.',
    date: '2023-04-12',
    category: 'event',
    isImportant: false
  },
  {
    id: '5',
    title: 'Library Book Return',
    content: 'All borrowed books must be returned by April 30, 2023. Late returns will incur a penalty.',
    date: '2023-04-18',
    category: 'library',
    isImportant: false
  }
];

// Map categories to badge colors
const getCategoryBadgeColor = (category: string) => {
  const categoryMap: Record<string, string> = {
    fees: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    holiday: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    exam: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
    event: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
    library: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
  };
  
  return categoryMap[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
};

const Announcements = () => {
  // This state would be populated from your database
  // DATABASE INTEGRATION POINT: Replace with a useQuery hook to fetch announcements
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-muted-foreground">
          Stay updated with the latest news and notifications
        </p>
      </div>

      <div className="grid gap-6">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className={announcement.isImportant ? 'border-2 border-red-500' : ''}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {announcement.title}
                    {announcement.isImportant && (
                      <Badge variant="destructive">Important</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Posted on {formatDate(announcement.date)}
                  </CardDescription>
                </div>
                <Badge className={getCategoryBadgeColor(announcement.category)}>
                  {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p>{announcement.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
