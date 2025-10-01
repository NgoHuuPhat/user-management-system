import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import AdminLayout from "@/components/layout/AdminLayout"
import { 
  User,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Eye,
  Save,
  Loader2,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import type { IUser, IRole } from "@/types/user"
import { getUsers, createUser, updateUser, deleteUser, getRoles } from "@/services/api"
import { handleError } from "@/utils/handleError"
import { getTimeAgo } from "@/utils/date"

const ManageUserPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [roles, setRoles] = useState<IRole[]>([])
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [users, setUsers] = useState<IUser[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleId: "2",
    active: true
  })

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "")
    setRoleFilter(searchParams.get("role") || "all")
    setStatusFilter(searchParams.get("status") || "all")
  }, [searchParams])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(searchQuery, roleFilter, statusFilter)
        setUsers(data)
      } catch (error) {
        handleError(error)
      }
    }
    fetchUsers()
  }, [searchQuery, roleFilter, statusFilter])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles()
        setRoles(data)
      } catch (error) {
        handleError(error)
      }
    }
    fetchRoles()
  }, [])

  const updateSearchParams = (newParams: { [key: string]: string }) => {
    const params = {
      search: searchQuery,
      role: roleFilter,
      status: statusFilter,
      ...newParams
    }

    const newSearchParams = new URLSearchParams()
    if(params.search) newSearchParams.set("search", params.search)
    if(params.role !== "all") newSearchParams.set("role", params.role)
    if(params.status !== "all") newSearchParams.set("status", params.status)

    setSearchParams(newSearchParams)
  }
  
  const getUserStats = () => {
    const total = users.length
    const active = users.filter(u => u.active).length
    const inactive = users.filter(u => !u.active).length
    
    return { total, active, inactive }
  }
  const stats = getUserStats()

  const getStatusColor = (active: boolean) => {
    return active 
      ? "bg-green-100 text-green-800 hover:bg-green-200"
      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }

  const getRoleColor = (roleName?: string) => {
    if (!roleName) return "bg-gray-100 text-gray-800 hover:bg-gray-200"

    const name = roleName.toLowerCase()
    switch (name) {
      case "admin": return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "user": return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const formatRoleName = (roleName?: string) => {
    if (!roleName) return "N/A"
    return roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      roleId: "2",
      active: true
    })
  }

  const handleAddUser = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      password: "",
      roleId: user.roleId.toString(),
      active: user.active
    })
    setIsEditDialogOpen(true)
  }

  const handleViewUser = (user: IUser) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleDeleteUser = (user: IUser) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const payload = { ...formData, roleId: Number(formData.roleId) }
      const data = await createUser(payload)

      setUsers([...users, data.user])
      setIsAddDialogOpen(false)
      resetForm()
      toast.success(data.message)
    } catch (error) {
      toast.error(handleError(error))
      console.error(handleError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    setSubmitting(true)
   
    try {
      const payload = { ...formData, roleId: Number(formData.roleId) }
      const data = await updateUser(selectedUser.id, payload)

      setUsers(users.map(u => u.id === selectedUser.id ? data.user : u))
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      resetForm()
    } catch (error) {
      console.error(handleError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return 
    setSubmitting(true)

    try {
      await deleteUser(selectedUser.id)  

      setUsers(users.filter(u => u.id !== selectedUser.id))
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error(handleError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    updateSearchParams({ search: value })
  }

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role)
    updateSearchParams({ role })
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status)
    updateSearchParams({ status })
  }

  return (
    <AdminLayout>
      <>
        <div>
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6 sm:p-8 shadow-sm shadow-blue-100/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  User Management 👥
                </h1>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Manage and monitor all users in your system
                </p>
              </div>
              <Button onClick={handleAddUser} className="w-full sm:w-auto">
                <Plus className="mr-1 h-4 w-4" />
                Add New User
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "Total Users", value: stats.total, color: "bg-blue-500", icon: "👥" },
                { title: "Active Users", value: stats.active, color: "bg-green-500", icon: "✅" },
                { title: "Inactive Users", value: stats.inactive, color: "bg-gray-500", icon: "⏸️" },
              ].map((card, index) => (
                <Card key={index} className="shadow-purple-100/50 bg-white/50 shadow-sm hover:shadow-md hover:shadow-purple-100 transition-all duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">{card.title}</p>
                        <p className="text-xl sm:text-2xl font-bold">{card.value}</p>
                      </div>
                      <div className="text-xl sm:text-2xl">{card.icon}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="mb-6 shadow-sm shadow-blue-100/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users by name, email..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 text-sm sm:text-base"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => handleRoleFilterChange("all")}
                      className={roleFilter === "all" ? "bg-blue-50" : ""}
                    >
                      All Roles
                    </DropdownMenuItem>
                    {roles.map((role) => (
                      <DropdownMenuItem
                        key={role.id}
                        onClick={() => handleRoleFilterChange(role.id.toString())}
                        className={roleFilter === role.id.toString() ? "bg-blue-50" : ""}
                      >
                        {formatRoleName(role.name)}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    {["all", "Active", "Inactive"].map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusFilterChange(status)}
                        className={statusFilter === status ? "bg-blue-50" : ""}
                      >
                        {status === "all" ? "All Statuses" : status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Mobile View */}
          <div className="lg:hidden space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="shadow-sm shadow-blue-100/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(user.role?.name)}>{formatRoleName(user.role?.name)}</Badge>
                      <Badge className={getStatusColor(user.active)}>{user.active ? "Active" : "Inactive"}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-gray-500">
                      Last Active: {getTimeAgo(user.updatedAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop View */}
          <Card className="hidden lg:block shadow-sm shadow-blue-100/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">All Users</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50/50">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-600">User</th>
                      <th className="text-left p-4 font-medium text-gray-600">Contact</th>
                      <th className="text-left p-4 font-medium text-gray-600">Role</th>
                      <th className="text-left p-4 font-medium text-gray-600">Status</th>
                      <th className="text-left p-4 font-medium text-gray-600">Joined</th>
                      <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span>{user.email}</span>
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getRoleColor(user.role?.name)}>
                            {formatRoleName(user.role?.name)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(user.active)}>
                            {user.active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <p className="text-gray-500 flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" />
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {users.length} of {users.length} users
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="link" size="sm" className="bg-blue-50 text-blue-600">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. Fill in all required fields.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="link"
                    size="lg"
                    className="absolute right-0 top-0 h-full px-4 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={formData.roleId}
                  onValueChange={(value) => setFormData({ ...formData, roleId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {formatRoleName(role.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active Status</Label>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Leave password blank to keep current password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">New Password (optional)</Label>
                <div className="relative">
                  <Input
                    id="edit-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Leave blank to keep current"
                  />
                  <Button
                    type="button"
                    variant="link"
                    size="lg"
                    className="absolute right-0 top-0 h-full px-4 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role *</Label>
                <Select
                  value={formData.roleId}
                  onValueChange={(value) => setFormData({ ...formData, roleId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Admin</SelectItem>
                    <SelectItem value="2">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-active">Active Status</Label>
                <Switch
                  id="edit-active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update User
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View detailed information about this user.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} className="object-cover" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                    <User/>
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">ID: {selectedUser.id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <span className="text-sm col-span-2">{selectedUser.email}</span>
                </div>
                
                {selectedUser.phone && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                    <span className="text-sm col-span-2">{selectedUser.phone}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm font-medium text-gray-500">Role:</span>
                  <div className="col-span-2">
                    <Badge className={getRoleColor(selectedUser.role?.name)}>
                      {formatRoleName(selectedUser.role?.name)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <div className="col-span-2">
                    <Badge className={getStatusColor(selectedUser.active)}>
                      {selectedUser.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm font-medium text-gray-500">Joined:</span>
                  <span className="text-sm col-span-2">
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm font-medium text-gray-500">Updated:</span>
                  <span className="text-sm col-span-2">
                    {new Date(selectedUser.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedUser && (
              <Button onClick={() => {
                setIsViewDialogOpen(false)
                handleEditUser(selectedUser)
              }}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit User
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} className="object-cover" />
                  <AvatarFallback className="bg-red-100 text-red-700">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

export default ManageUserPage