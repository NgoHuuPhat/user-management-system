import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Settings, 
  Users, 
  FileText, 
  BarChart3, 
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const sidebarItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/dashboard' 
    },
    { 
      icon: Users, 
      label: 'Users', 
      path: '/manage-users',
      badge: '12' 
    },
    { 
      icon: FileText, 
      label: 'Documents', 
      path: '/documents'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      path: '/analytics'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings'
    },
  ]

  return (
    <>
      <div 
        className={`fixed inset-0 z-20 bg-black/50 lg:hidden transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <aside className={`
        fixed left-0 top-0 z-50 h-full min-h-screen w-64 bg-white shadow-lg 
        flex flex-col
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex h-16 items-center justify-between lg:justify-center px-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-sm">U</span>
            </div>
            <span className="font-bold text-xl text-gray-800">UMS</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onClose()
                }
              }}
              className={({ isActive }) => `
                flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium 
                transition-all duration-200 ease-in-out group
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-400 shadow-sm border border-blue-100/80' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                    isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={`ml-auto text-xs px-2 py-0.5 transition-colors duration-200 ${
                        isActive 
                          ? 'bg-blue-100 text-blue-400 border-blue-200' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Card className="rounded-xl bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 border border-blue-100/50 shadow-none gap-1">
            <div className="flex items-center">
              <h4 className="font-semibold text-sm text-gray-800">Need help?</h4>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              Check our documentation for guides and tutorials
            </p>
            <Button size="sm" className="w-full">
              View Docs
            </Button>
          </Card>
        </div>
      </aside>
    </>
  )
}

export default Sidebar