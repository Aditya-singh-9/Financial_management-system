
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Lock, User, Mail, Globe, Shield, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    
    // Simulate saving
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          {user?.role === 'student' && (
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          )}
          {user?.role === 'admin' && (
            <TabsTrigger value="system">System</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-edu-purple-300 text-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="mt-4">
                    Change Avatar
                  </Button>
                </div>
                
                <div className="flex-grow space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user?.name} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" defaultValue={user?.email} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <div className="flex items-center space-x-2 h-10 px-4 border rounded-md bg-muted">
                        <span className="capitalize">{user?.role}</span>
                        <Badge variant="outline">Read Only</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <select 
                        id="language" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Marathi</option>
                        <option>Tamil</option>
                      </select>
                    </div>
                  </div>
                  
                  {user?.role === 'student' && (
                    <>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="student-id">Student ID</Label>
                          <Input id="student-id" defaultValue="STU12345" readOnly />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="batch">Batch / Year</Label>
                          <Input id="batch" defaultValue="2023-24" />
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      className="bg-edu-purple-400 hover:bg-edu-purple-500"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notification Settings</CardTitle>
              </div>
              <CardDescription>Control when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-payments">Payment Reminders</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications about upcoming payments</p>
                      </div>
                      <Switch id="email-payments" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-updates">Platform Updates</Label>
                        <p className="text-sm text-muted-foreground">Get notified about new features and updates</p>
                      </div>
                      <Switch id="email-updates" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-news">Newsletter</Label>
                        <p className="text-sm text-muted-foreground">Receive our monthly newsletter</p>
                      </div>
                      <Switch id="email-news" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-payments">Payment Updates</Label>
                        <p className="text-sm text-muted-foreground">Notifications for payment status changes</p>
                      </div>
                      <Switch id="app-payments" defaultChecked />
                    </div>
                    
                    {user?.role === 'admin' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="app-alerts">Fraud Alerts</Label>
                          <p className="text-sm text-muted-foreground">Get notified of potential suspicious activities</p>
                        </div>
                        <Switch id="app-alerts" defaultChecked />
                      </div>
                    )}
                    
                    {user?.role === 'student' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="app-reminders">Due Date Reminders</Label>
                          <p className="text-sm text-muted-foreground">Get reminders before payment due dates</p>
                        </div>
                        <Switch id="app-reminders" defaultChecked />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    className="bg-edu-purple-400 hover:bg-edu-purple-500"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    
                    <Button 
                      className="bg-edu-purple-400 hover:bg-edu-purple-500"
                      onClick={() => {
                        toast({
                          title: "Password Updated",
                          description: "Your password has been changed successfully.",
                        });
                      }}
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                    
                    <Button variant="outline">
                      Set Up Two-Factor Authentication
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Session Management</h3>
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">
                            Started: {new Date().toLocaleString()}<br />
                            IP: 192.168.1.1<br />
                            Device: Chrome on Windows
                          </p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="text-destructive"
                      onClick={() => {
                        toast({
                          title: "Sessions Terminated",
                          description: "All other sessions have been logged out.",
                        });
                      }}
                    >
                      Log Out All Other Sessions
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {user?.role === 'student' && (
          <TabsContent value="payment" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <CardTitle>Payment Methods</CardTitle>
                </div>
                <CardDescription>Manage your payment options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Saved Payment Methods</h3>
                    <div className="space-y-4">
                      <div className="rounded-md border p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">HDFC Debit Card</p>
                            <p className="text-sm text-muted-foreground">
                              **** **** **** 1234<br />
                              Expires: 05/26
                            </p>
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-destructive">Remove</Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-md border p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">UPI ID</p>
                            <p className="text-sm text-muted-foreground">
                              student@okaxis
                            </p>
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-destructive">Remove</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        toast({
                          title: "Feature Coming Soon",
                          description: "The ability to add new payment methods will be available soon.",
                        });
                      }}
                    >
                      Add New Payment Method
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Default Payment Method</h3>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option>HDFC Debit Card (**** 1234)</option>
                      <option>UPI ID (student@okaxis)</option>
                    </select>
                    
                    <div className="pt-4 flex justify-end">
                      <Button 
                        className="bg-edu-purple-400 hover:bg-edu-purple-500"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {user?.role === 'admin' && (
          <TabsContent value="system" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <CardTitle>System Settings</CardTitle>
                </div>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Templates</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="template-payment">Payment Receipt Template</Label>
                          <p className="text-sm text-muted-foreground">Template used for payment receipts</p>
                        </div>
                        <Button variant="outline" size="sm">Edit Template</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="template-reminder">Payment Reminder Template</Label>
                          <p className="text-sm text-muted-foreground">Template used for payment reminders</p>
                        </div>
                        <Button variant="outline" size="sm">Edit Template</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Payment Gateway</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="gateway-active">Enable Payment Gateway</Label>
                          <p className="text-sm text-muted-foreground">Allow students to make payments</p>
                        </div>
                        <Switch id="gateway-active" defaultChecked />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="gateway-id">Gateway API Key</Label>
                          <Input id="gateway-id" defaultValue="pk_test_1234567890" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="gateway-secret">Gateway Secret Key</Label>
                          <Input id="gateway-secret" type="password" defaultValue="sk_test_1234567890" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button 
                      className="bg-edu-purple-400 hover:bg-edu-purple-500"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
