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
  EyeOff,
  CheckSquare,
  ArrowUpDown,
  ArrowDownWideNarrow,
  ArrowDownNarrowWide
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import type { IUser, IUserCard, IRole, BulkAction } from "@/types/user"
import { getAllUsers, getFilteredUsers, createUser, updateUser, deleteUser, getRoles, bulkAction } from "@/services/api"
import { handleError } from "@/utils/handleError"
import { getTimeAgo } from "@/utils/date"

const ManageUserPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const hasSortField = searchParams.has("sortField")
  
  const [showPassword, setShowPassword] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [roles, setRoles] = useState<IRole[]>([])
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("id")
  const [sortOrder, setSortOrder] = useState<string>("desc")
  const [users, setUsers] = useState<IUserCard[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)
  const [limit] = useState(5)
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
    setSortField(searchParams.get("sortField") || "id")
    setSortOrder(searchParams.get("sortOrder") || "desc")
    setCurrentPage(Number(searchParams.get("page")) || 1)
  }, [searchParams])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers()
        await new Promise(resolve => setTimeout(resolve, 300)) 

        setUsers(data.allUsers)
      } catch (error) {
        handleError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchFilteredUsers = async () => {
      try {
        const data = await getFilteredUsers(searchQuery, roleFilter, statusFilter, currentPage, limit, sortField, sortOrder)
        setFilteredUsers(data.users)
        setTotalPages(data.totalPages)
        setTotalUsers(data.total)
        setStartIndex(data.startIndex)
        setEndIndex(data.endIndex)
      } catch (error) {
        handleError(error)
      }
    }
    fetchFilteredUsers()
  }, [searchQuery, roleFilter, statusFilter, currentPage, limit, sortField, sortOrder])

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

  const updateSearchParams = (newParams: { [key: string]: string | number }) => {
    const params = {
      search: searchQuery,
      role: roleFilter,
      status: statusFilter,
      sortField,
      sortOrder,
      page: currentPage,
      ...newParams
    }

    const newSearchParams = new URLSearchParams()
    if(params.search) newSearchParams.set("search", params.search)
    if(params.role !== "all") newSearchParams.set("role", params.role)
    if(params.status !== "all") newSearchParams.set("status", params.status)
    if(params.sortField) newSearchParams.set("sortField", params.sortField)
    if(params.sortOrder) newSearchParams.set("sortOrder", params.sortOrder)
    if (params.page) newSearchParams.set("page", params.page.toString())

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

  const handleSelectUser = (userId: number) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedUserIds(checked ? filteredUsers.map(user => user.id) : [])
  }

  const handleBulkAction = async (action: BulkAction) => {
    if (selectedUserIds.length === 0) {
      toast.error("Please select at least one user")
      return
    }

    setSubmitting(true)
    setSelectedUserIds([])

    try {
      const data = await bulkAction(selectedUserIds, action)
      
      switch (action) {
        case 'delete':
          setTotalUsers(prev => prev - selectedUserIds.length)
          setTotalPages(Math.ceil((totalUsers - selectedUserIds.length) / limit))

          setUsers(prev => prev.filter(u => !selectedUserIds.includes(u.id)))
          setFilteredUsers(prev => prev.filter(u => !selectedUserIds.includes(u.id)))
          break
        case 'activate':
          setUsers(prev => prev.map(u => selectedUserIds.includes(u.id) ? { ...u, active: true } : u))
          setFilteredUsers(prev => prev.map(u => selectedUserIds.includes(u.id) ? { ...u, active: true } : u))
          break
        case 'deactivate':
          setUsers(prev => prev.map(u => selectedUserIds.includes(u.id) ? { ...u, active: false } : u))
          setFilteredUsers(prev => prev.map(u => selectedUserIds.includes(u.id) ? { ...u, active: false } : u))
          break
      }

      toast.success(data.message)
    } catch (error) {
      toast.error(handleError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const payload = { ...formData, roleId: Number(formData.roleId) }
      const data = await createUser(payload)
      
      setTotalUsers(prev => prev + 1)
      setTotalPages(Math.ceil((totalUsers + 1) / limit))

      setUsers(prev => [data.user, ...prev])
      setFilteredUsers(prev => [data.user, ...prev])
      setIsAddDialogOpen(false)
      resetForm()
      toast.success(data.message)
    } catch (error) {
      toast.error(handleError(error))
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

      setUsers(prev => prev.map(u => u.id === selectedUser.id ? data.user : u))
      setFilteredUsers(prev => prev.map(u => u.id === selectedUser.id ? data.user : u))
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      resetForm()
      toast.success(data.message)
    } catch (error) {
      toast.error(handleError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return 
    setSubmitting(true)

    try {
      const data = await deleteUser(selectedUser.id)  

      setTotalUsers(prev => prev - 1)
      setTotalPages(Math.ceil((totalUsers - 1) / limit))

      setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
      setFilteredUsers(prev => prev.filter(u => u.id !== selectedUser.id))
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
      toast.success(data.message)
    } catch (error) {
      toast.error(handleError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setCurrentPage(1)
    updateSearchParams({ search: value, page: 1 })
  }

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role)
    setCurrentPage(1)
    updateSearchParams({ role, page: 1 })
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
    updateSearchParams({ status, page: 1 })
  }

  const handleSortChange = (field: string) => {
    const newSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc"
    setSortField(field)
    setSortOrder(newSortOrder)
    setCurrentPage(1)
    updateSearchParams({ sortField: field, sortOrder: newSortOrder, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateSearchParams({ page })
  }

  const renderPaginationItems = () => {
    const items = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              href="#" 
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            href="#" 
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(1)
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              href="#" 
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault()
                handlePageChange(i)
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            href="#" 
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(totalPages)
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <AdminLayout>
      <>
        <div>
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6 sm:p-8 shadow-sm shadow-blue-100/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Manage and monitor all users in your system
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => {
                  resetForm()
                  setIsAddDialogOpen(true)
                }} 
                className="w-full sm:w-auto">
                  <Plus className="mr-1 h-4 w-4" />
                  Add New User
                </Button>
              </div>
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
                        { loading ? (<Loader2 className="mt-2 h-4 w-4 animate-spin" />) : (
                          <p className="text-2xl sm:text-3xl font-bold">{card.value}</p>
                        )}
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
                {selectedUserIds.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="sm:w-auto">
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Actions ({selectedUserIds.length})
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                        Activate Selected
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                        Deactivate Selected
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        onClick={() => handleBulkAction('delete')}
                      >
                        Delete Selected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mobile View */}
          <div className="lg:hidden space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="shadow-sm shadow-blue-100/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                      />
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
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user)
                          setIsViewDialogOpen(true)
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                          setSelectedUser(user)
                          setIsDeleteDialogOpen(true)
                        }}>
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
                      <th className="text-left p-4 font-medium text-gray-600 w-12">
                        <Checkbox
                          checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left p-2 font-medium text-gray-600">
                        <Button
                          variant="ghost"
                          onClick={() => handleSortChange('id')}
                          className="flex items-center gap-2"
                        >
                          ID
                          { hasSortField && sortField === 'id' && (
                            sortOrder === 'asc' ? (
                              <ArrowDownNarrowWide className="h-4 w-4" />
                            ) : (
                              <ArrowDownWideNarrow className="h-4 w-4" />
                            ) 
                          )}
                        </Button>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">
                        <Button
                          variant="ghost"
                          onClick={() => handleSortChange('name')}
                          className="flex items-center gap-2"
                        >
                          Name
                          {sortField === 'name' && (
                            sortOrder === 'asc' ? (
                              <ArrowDownNarrowWide className="h-4 w-4" />
                            ) : (
                              <ArrowDownWideNarrow className="h-4 w-4" />
                            ) 
                          )}
                        </Button>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">
                        <Button
                          variant="ghost"
                          onClick={() => handleSortChange('email')}
                          className="flex items-center gap-2"
                        >
                          Email
                          {sortField === 'email' && (
                            sortOrder === 'asc' ? (
                              <ArrowDownNarrowWide className="h-4 w-4" />
                            ) : (
                              <ArrowDownWideNarrow className="h-4 w-4" />
                            ) 
                          )}
                        </Button>
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">
                          Phone
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">
                          Role
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">
                          Status
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">
                        <Button variant="ghost" onClick={() => handleSortChange('createdAt')} className="flex items-center gap-2">
                          Joined
                          {sortField === 'createdAt' && <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />}
                        </Button>
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <Checkbox
                            checked={selectedUserIds.includes(user.id)}
                            onCheckedChange={() => handleSelectUser(user.id)}
                          />
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-500">{user.id}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-medium text-gray-900">{user.name}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span>{user.phone}</span>
                            </div>
                          )}
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
                              <DropdownMenuItem onClick={() => {
                                setSelectedUser(user)
                                setIsViewDialogOpen(true)
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => {
                                setSelectedUser(user)
                                setIsDeleteDialogOpen(true)
                              }}>
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
            <p
              className={`text-sm text-gray-600 sm:order-1 ${totalUsers === 0 ? 'text-center w-full' : ''}`}
            >
              {totalUsers > 0
                ? `Showing ${startIndex} to ${endIndex} of ${totalUsers} users (Page ${currentPage} of ${totalPages})`
                : 'No users found.'}
            </p>

            {totalPages >= 1 && (
              <div className="w-full sm:w-auto sm:order-2 flex justify-end">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) handlePageChange(currentPage - 1)
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage < totalPages) handlePageChange(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
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
                  disabled
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </DialogClose>
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
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {formatRoleName(role.name)}
                      </SelectItem>
                    ))}
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
            <DialogClose asChild>
              <Button variant="outline">
                Close
              </Button>
            </DialogClose>
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
            <DialogClose asChild>
              <Button variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </DialogClose>
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