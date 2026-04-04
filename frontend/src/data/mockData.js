import { Users, LogIn, LogOut, MessageSquare, ShieldAlert } from 'lucide-react';

export const stats = [
  { label: 'TOTAL STUDENTS', value: '482', icon: Users },
  { label: 'PRESENT INSIDE', value: '412', icon: LogIn, color: 'text-green-500' },
  { label: 'OUTSIDE HOSTEL', value: '70', icon: LogOut, color: 'text-orange-500' },
  { label: 'PENDING COMPLAINTS', value: '12', icon: MessageSquare, color: 'text-red-500' },
  { label: 'ACTIVE OFFENDERS', value: '04', icon: ShieldAlert, color: 'text-red-600' },
];

export const attentionAlerts = [
  {
    id: 1,
    title: 'Students out past curfew (12)',
    description: 'Automatic alerts triggered at 11:30 PM. Parents notified via SMS system.',
    linkText: 'View Details',
    type: 'curfew',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-50'
  },
  {
    id: 2,
    title: 'High severity offenders (02)',
    description: "Action required for Block C misconduct case. Dean's approval pending.",
    linkText: 'Review Case',
    type: 'offenders',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    id: 3,
    title: 'Unresolved complaints (05)',
    description: 'Maintenance issues in Block A & B reported over 48 hours ago.',
    linkText: 'Open Tickets',
    type: 'complaints',
    borderColor: 'border-gray-400',
    bgColor: 'bg-gray-100'
  }
];

export const activityLogs = [
  { id: 1, name: 'Arjun Malhotra', room: 'B-204', time: '10:45 AM', status: 'IN', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Sarah Jenkins', room: 'A-112', time: '10:42 AM', status: 'OUT', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Michael Chen', room: 'C-405', time: '10:35 AM', status: 'IN', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Priya Sharma', room: 'B-301', time: '10:30 AM', status: 'OUT', avatar: 'https://i.pravatar.cc/150?u=4' },
];

export const complaints = {
  roommate: [
    { id: 1, title: 'Room 204B Noise Complaint', status: 'New', description: 'Continuous loud music after curfew hou...', type: 'roommate' },
  ],
  infra: [
    { id: 2, title: 'Hygiene Issue - Shared Bath', status: 'Pending', description: 'Block A Second Floor bathroom requires...', type: 'infra' },
  ]
};

export const notices = [
  { id: 1, date: '24 OCT', title: 'Annual Fire Drill Schedule', subtitle: 'Scheduled for tomorrow at 4 PM.' },
  { id: 2, date: '22 OCT', title: 'Diwali Holiday Checkout', subtitle: 'Inventory submission deadline extended.' },
];
