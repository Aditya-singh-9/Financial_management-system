
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import ProfilePictureUpload from '@/components/user/ProfilePictureUpload';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, PhoneCall, MapPin, Lock, CreditCard, Bell } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('9876543210'); // Mock data
  const [address, setAddress] = useState('123 Education Lane, Knowledge City'); // Mock data
  
  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleSaveChanges = () => {
    // In a real application, this would call an API to update the user profile
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    });
    setIsEditing(false);
  };

  const handleProfilePictureUpdate = (url: string) => {
    setProfilePicture(url);
    // In a real app, this would update the user's profile picture in the database
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and settings
        </p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <ProfilePictureUpload 
                username={user?.name || ''} 
                currentUrl={profilePicture || undefined}
                onUploadSuccess={handleProfilePictureUpdate}
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsEditing(false);
                            setName(user?.name || '');
                            setEmail(user?.email || '');
                            // Reset other fields to their original values
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="bg-edu-purple-400 hover:bg-edu-purple-500"
                          onClick={handleSaveChanges}
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Full Name
                      </Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <PhoneCall className="h-4 w-4" /> Phone Number
                      </Label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Address
                      </Label>
                      <Input 
                        id="address" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account security and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                  </div>
                  <Button variant="outline">Change</Button>
                </div>
                <Separator />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Payment Methods</h3>
                      <p className="text-sm text-muted-foreground">Manage your saved payment methods</p>
                    </div>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
                <Separator />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Account Type</h3>
                      <p className="text-sm text-muted-foreground">Your account role: {user?.role}</p>
                    </div>
                  </div>
                  <Button variant="outline" disabled>Change</Button>
                </div>
                <Separator />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" /> Notification Preferences
              </CardTitle>
              <CardDescription>Control how and when we contact you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Payment Reminders</h3>
                      <p className="text-sm text-muted-foreground">Receive notifications about upcoming fee payments</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="email-notifications" className="text-sm">Email</Label>
                      <input type="checkbox" id="email-notifications" className="h-4 w-4" defaultChecked />
                      
                      <Label htmlFor="sms-notifications" className="text-sm ml-4">SMS</Label>
                      <input type="checkbox" id="sms-notifications" className="h-4 w-4" defaultChecked />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Account Updates</h3>
                      <p className="text-sm text-muted-foreground">Important information about your account</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="account-email" className="text-sm">Email</Label>
                      <input type="checkbox" id="account-email" className="h-4 w-4" defaultChecked />
                      
                      <Label htmlFor="account-sms" className="text-sm ml-4">SMS</Label>
                      <input type="checkbox" id="account-sms" className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Marketing Communications</h3>
                      <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="marketing-email" className="text-sm">Email</Label>
                      <input type="checkbox" id="marketing-email" className="h-4 w-4" />
                      
                      <Label htmlFor="marketing-sms" className="text-sm ml-4">SMS</Label>
                      <input type="checkbox" id="marketing-sms" className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                
                <Button className="mt-4 bg-edu-purple-400 hover:bg-edu-purple-500">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
