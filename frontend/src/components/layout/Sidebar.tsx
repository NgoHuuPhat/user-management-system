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
import { Separator } from '@/components/ui/separator'

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Users, label: 'Users', badge: '12' },
    { icon: FileText, label: 'Documents' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Settings, label: 'Settings' },
  ]

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed left-0 top-0 z-50 h-screen shadow-xs w-64 transform bg-white transition-transform duration-200 ease-in-out lg:fixed lg:translate-x-0 overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-16 items-center justify-between lg:justify-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl ml-4 lg:ml-0">UMS</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-2 p-4">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              {item.active ? (
                <>
                  <item.icon className="mr-3 h-4 w-4 text-blue-400" />
                  <p className="text-blue-400">{item.label}</p>
                </>
              ) : (
                <>
                  <item.icon className="mr-3 h-4 w-4" />
                  <p>{item.label}</p>
                </>
              )}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        <Separator className="my-4" />
        
        <div className="p-4">
          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
            <h4 className="font-medium text-sm">Need help?</h4>
            <p className="text-xs text-gray-600 mt-1">
              Check our documentation for guides and tutorials
            </p>
            <Button size="sm" className="mt-3 w-full">
              View Docs
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar