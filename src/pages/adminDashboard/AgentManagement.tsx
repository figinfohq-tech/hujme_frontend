import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { 
  Users, 
  Search, 
  CheckCircle, 
  XCircle, 
  Crown, 
  Building2,
  FileText,
  Package,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react'
import { toast } from 'sonner'

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  company: string
  license: string
  location: string
  subscriptionTier: string
  status: 'Active' | 'Inactive' | 'Pending'
  packagesCreated: number
  joinedDate: string
  documents: 'Complete' | 'Pending' | 'Incomplete'
}

function AgentManagement() {
  console.log('👥 AgentManagement page rendered')

  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      email: 'ahmed@albarakah.com',
      phone: '+966 50 123 4567',
      company: 'Al-Barakah Travel Agency',
      license: 'LIC-2024-001',
      location: 'Riyadh, Saudi Arabia',
      subscriptionTier: 'Premium',
      status: 'Active',
      packagesCreated: 15,
      joinedDate: '2024-01-15',
      documents: 'Complete'
    },
    {
      id: '2',
      name: 'Fatima Hassan',
      email: 'fatima@makkah-tours.com',
      phone: '+966 55 987 6543',
      company: 'Makkah Tours Ltd',
      license: 'LIC-2024-002',
      location: 'Jeddah, Saudi Arabia',
      subscriptionTier: 'Enterprise',
      status: 'Active',
      packagesCreated: 32,
      joinedDate: '2023-11-20',
      documents: 'Complete'
    },
    {
      id: '3',
      name: 'Omar Abdullah',
      email: 'omar@greencrescent.com',
      phone: '+966 52 456 7890',
      company: 'Green Crescent Tours',
      license: 'LIC-2024-003',
      location: 'Medina, Saudi Arabia',
      subscriptionTier: 'Basic',
      status: 'Pending',
      packagesCreated: 0,
      joinedDate: '2024-03-10',
      documents: 'Pending'
    },
    {
      id: '4',
      name: 'Aisha Ibrahim',
      email: 'aisha@holyjourney.com',
      phone: '+966 54 321 0987',
      company: 'Holy Journey Travel',
      license: 'LIC-2024-004',
      location: 'Dammam, Saudi Arabia',
      subscriptionTier: 'Premium',
      status: 'Inactive',
      packagesCreated: 8,
      joinedDate: '2024-02-05',
      documents: 'Complete'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterTier, setFilterTier] = useState<string>('all')
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Basic': return 'bg-blue-100 text-blue-800'
      case 'Premium': return 'bg-purple-100 text-purple-800'
      case 'Enterprise': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const approveAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId 
        ? { ...agent, status: 'Active' as const }
        : agent
    ))
    
    const agent = agents.find(a => a.id === agentId)
    console.log('✅ Agent approved:', agent?.name)
    toast.success(`${agent?.name} has been approved and activated`)
  }

  const rejectAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId 
        ? { ...agent, status: 'Inactive' as const }
        : agent
    ))
    
    const agent = agents.find(a => a.id === agentId)
    console.log('❌ Agent rejected:', agent?.name)
    toast.success(`${agent?.name} registration has been rejected`)
  }

  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId 
        ? { 
            ...agent, 
            status: agent.status === 'Active' ? 'Inactive' : 'Active' as const
          }
        : agent
    ))
    
    const agent = agents.find(a => a.id === agentId)
    console.log(`🔄 Toggled agent status: ${agent?.name}`)
    toast.success(`Agent ${agent?.status === 'Active' ? 'deactivated' : 'activated'} successfully`)
  }

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus
    const matchesTier = filterTier === 'all' || agent.subscriptionTier === filterTier
    
    return matchesSearch && matchesStatus && matchesTier
  })

  return (
    <div className="space-y-6 animate-fade-in pb-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Agent Management</h2>
          <p className="text-muted-foreground">Manage agent registrations and subscriptions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Agents</p>
              <p className="text-2xl font-bold">{agents.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{agents.filter(a => a.status === 'Active').length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold">{agents.filter(a => a.status === 'Inactive').length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{agents.filter(a => a.status === 'Pending').length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="p-0">
          <CardContent className="flex items-center gap-4 p-4">
            <Package className="w-8 h-8 text-primary/90" />
            <div>
              <p className="text-sm text-muted-foreground">Total Packages</p>
              <p className="text-2xl font-bold">{agents.reduce((sum, agent) => sum + agent.packagesCreated, 0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-0">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agents List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${agent.name}`} />
                    <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription>{agent.company}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                  <Badge className={getTierColor(agent.subscriptionTier)}>
                    {agent.subscriptionTier}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{agent.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{agent.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>{agent.license}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span>{agent.packagesCreated} packages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(agent.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Documents:</span>
                  <Badge variant={agent.documents === 'Complete' ? 'default' : 'secondary'}>
                    {agent.documents}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                {agent.status === 'Pending' ? (
                  <>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => approveAgent(agent.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700"
                      onClick={() => rejectAgent(agent.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileText className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{agent.name} - Agent Details</DialogTitle>
                          <DialogDescription>{agent.company}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Email</p>
                              <p className="text-sm text-muted-foreground">{agent.email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Phone</p>
                              <p className="text-sm text-muted-foreground">{agent.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">License</p>
                              <p className="text-sm text-muted-foreground">{agent.license}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Location</p>
                              <p className="text-sm text-muted-foreground">{agent.location}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleAgentStatus(agent.id)}
                      className={agent.status === 'Active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                    >
                      {agent.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      <Crown className="w-4 h-4 mr-2" />
                      Change Tier
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <Card className="p-0">
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No agents found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AgentManagement