import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const AccountCenterSection = () => {
    const [name, setName] = useState('Clisma Admin')
    const [email, setEmail] = useState('admin@clisma.io')
    const [phone, setPhone] = useState('')

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Account Center</h1>
                <p className="text-muted-foreground mt-1">Manage your profile, security, and preferences.</p>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Contact</Label>
                                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button>Save Changes</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="password" className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="current">Current Password</Label>
                                    <Input id="current" type="password" />
                                </div>
                                <div>
                                    <Label htmlFor="new">New Password</Label>
                                    <Input id="new" type="password" />
                                </div>
                                <div>
                                    <Label htmlFor="confirm">Confirm Password</Label>
                                    <Input id="confirm" type="password" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button>Change Password</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="security" className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm">Two-Factor Authentication</p>
                                <Button variant="outline">Configure 2FA</Button>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm">Active Sessions</p>
                                <Button variant="outline">View Sessions</Button>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm">Login History</p>
                                <Button variant="outline">View History</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="notifications" className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between border rounded-md p-3">
                                    <div>
                                        <p className="text-sm font-medium">Email Notifications</p>
                                        <p className="text-xs text-muted-foreground">Receive updates via email.</p>
                                    </div>
                                    <Button variant="outline">Manage</Button>
                                </div>
                                <div className="flex items-center justify-between border rounded-md p-3">
                                    <div>
                                        <p className="text-sm font-medium">SMS Notifications</p>
                                        <p className="text-xs text-muted-foreground">Receive alerts via SMS.</p>
                                    </div>
                                    <Button variant="outline">Manage</Button>
                                </div>
                                <div className="flex items-center justify-between border rounded-md p-3">
                                    <div>
                                        <p className="text-sm font-medium">In-app Alerts</p>
                                        <p className="text-xs text-muted-foreground">Configure alert preferences.</p>
                                    </div>
                                    <Button variant="outline">Manage</Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="danger" className="space-y-4">
                            <Card className="border-destructive/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground">Delete or deactivate your account. This action may be irreversible.</p>
                                    <div className="flex gap-2">
                                        <Button variant="destructive">Delete Account</Button>
                                        <Button variant="outline">Deactivate Account</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default AccountCenterSection
