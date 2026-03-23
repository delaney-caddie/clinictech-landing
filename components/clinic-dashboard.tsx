"use client"

import { useState } from "react"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  Plus,
  Zap,
  MessageSquare,
  Search,
  RotateCcw,
  Save,
  Phone,
  Mail,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  Upload,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  FileText,
  Video,
  GripVertical,
  Settings,
  Palette,
  UserPlus,
  Link,
  Bot,
  ToggleLeft,
  X,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Sparkles,
  Send,
  Globe,
  HardDrive,
  Forward,
  StickyNote,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ClinicDashboardProps {
  activePage: string
}

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  treatment: string
  value: number
  stage: string
  source: string
  assignedTo: string
  date: string
  notes?: string
  lastContact?: string
}

const initialLeads: Lead[] = [
  { id: "1", name: "Jennifer M.", email: "jennifer@email.com", phone: "(555) 123-4567", treatment: "Knee Stem Cell Therapy", value: 12000, stage: "new", source: "Website", assignedTo: "Dr. Chen", date: "Mar 15", notes: "Interested in non-surgical options", lastContact: "Mar 18" },
  { id: "2", name: "Michael T.", email: "michael@email.com", phone: "(555) 234-5678", treatment: "PRP Consultation", value: 5000, stage: "new", source: "Referral", assignedTo: "Dr. Chen", date: "Mar 14", notes: "Referred by David R.", lastContact: "Mar 17" },
  { id: "3", name: "Amanda S.", email: "amanda@email.com", phone: "(555) 345-6789", treatment: "Shoulder Regeneration", value: 8500, stage: "new", source: "Google Ads", assignedTo: "Sarah", date: "Mar 13", notes: "Previous surgery unsuccessful", lastContact: "Mar 16" },
  { id: "4", name: "James P.", email: "james@email.com", phone: "(555) 456-7890", treatment: "Hip Treatment", value: 15000, stage: "new", source: "Facebook", assignedTo: "Sarah", date: "Mar 12", notes: "Athlete, needs quick recovery", lastContact: "Mar 15" },
  { id: "5", name: "Robert K.", email: "robert@email.com", phone: "(555) 567-8901", treatment: "Hip Regeneration", value: 18000, stage: "consult", source: "Website", assignedTo: "Dr. Chen", date: "Mar 10", notes: "Consultation scheduled for next week", lastContact: "Mar 18" },
  { id: "6", name: "Sarah L.", email: "sarah@email.com", phone: "(555) 678-9012", treatment: "Shoulder PRP", value: 6500, stage: "consult", source: "Referral", assignedTo: "Dr. Chen", date: "Mar 9", notes: "Very interested, asked about financing", lastContact: "Mar 17" },
  { id: "7", name: "Emily R.", email: "emily@email.com", phone: "(555) 789-0123", treatment: "Knee Therapy", value: 11000, stage: "consult", source: "Website", assignedTo: "Sarah", date: "Mar 8", notes: "Coming in for second opinion", lastContact: "Mar 16" },
  { id: "8", name: "Lisa W.", email: "lisa@email.com", phone: "(555) 890-1234", treatment: "Stem Cell - Knee", value: 15000, stage: "treatment", source: "Google Ads", assignedTo: "Dr. Chen", date: "Mar 5", notes: "Treatment in progress, week 2", lastContact: "Mar 18" },
  { id: "9", name: "Mark D.", email: "mark@email.com", phone: "(555) 901-2345", treatment: "Full Joint Care", value: 22000, stage: "treatment", source: "Website", assignedTo: "Dr. Chen", date: "Mar 3", notes: "Excellent progress so far", lastContact: "Mar 17" },
  { id: "10", name: "David R.", email: "david@email.com", phone: "(555) 012-3456", treatment: "Post-PRP Check-in", value: 8000, stage: "followup", source: "Referral", assignedTo: "Sarah", date: "Feb 28", notes: "6-week follow-up scheduled", lastContact: "Mar 15" },
  { id: "11", name: "Susan T.", email: "susan@email.com", phone: "(555) 111-2222", treatment: "Recovery Review", value: 3000, stage: "followup", source: "Website", assignedTo: "Dr. Chen", date: "Feb 25", notes: "Final review, considering testimonial", lastContact: "Mar 14" },
  { id: "12", name: "Brian C.", email: "brian@email.com", phone: "(555) 222-3333", treatment: "6-Month Follow-up", value: 2500, stage: "followup", source: "Website", assignedTo: "Sarah", date: "Feb 20", notes: "Doing well, no concerns", lastContact: "Mar 10" },
  { id: "13", name: "Karen H.", email: "karen@email.com", phone: "(555) 333-4444", treatment: "Annual Check", value: 4000, stage: "followup", source: "Referral", assignedTo: "Dr. Chen", date: "Feb 15", notes: "Interested in additional treatments", lastContact: "Mar 8" },
  { id: "14", name: "Tom W.", email: "tom@email.com", phone: "(555) 444-5555", treatment: "Progress Eval", value: 3500, stage: "followup", source: "Website", assignedTo: "Sarah", date: "Feb 10", notes: "Good progress, planning next phase", lastContact: "Mar 5" },
]

const stages = [
  { id: "new", label: "NEW LEAD", color: "bg-primary" },
  { id: "consult", label: "CONSULT BOOKED", color: "bg-chart-3" },
  { id: "treatment", label: "TREATMENT", color: "bg-secondary" },
  { id: "followup", label: "FOLLOW-UP", color: "bg-chart-5" },
]

const patients = [
  { id: 1, name: "Lisa Williams", email: "lisa@email.com", phone: "(555) 890-1234", treatment: "Stem Cell - Knee", status: "In Treatment", lastVisit: "Mar 10", nextAppt: "Mar 24", notes: "Week 3 of treatment", progress: 65 },
  { id: 2, name: "Mark Davis", email: "mark@email.com", phone: "(555) 901-2345", treatment: "Full Joint Care", status: "In Treatment", lastVisit: "Mar 3", nextAppt: "Mar 20", notes: "Responding well to therapy", progress: 45 },
  { id: 3, name: "David Roberts", email: "david@email.com", phone: "(555) 012-3456", treatment: "Post-PRP Check-in", status: "Recovery", lastVisit: "Feb 28", nextAppt: "Apr 5", notes: "Recovery on track", progress: 80 },
  { id: 4, name: "Susan Thompson", email: "susan@email.com", phone: "(555) 111-2222", treatment: "Recovery Review", status: "Completed", lastVisit: "Feb 25", nextAppt: "-", notes: "Treatment completed successfully", progress: 100 },
]

const knowledgeCategories = [
  { id: 1, name: "Treatment Protocols", articles: 12, icon: FileText },
  { id: 2, name: "Recovery Guidelines", articles: 8, icon: FileText },
  { id: 3, name: "Patient FAQs", articles: 24, icon: MessageSquare },
  { id: 4, name: "Educational Videos", articles: 6, icon: Video },
]

const documents = [
  { id: 1, name: "Consent Form - Stem Cell", type: "PDF", visibility: "All Patients", date: "Mar 1" },
  { id: 2, name: "Pre-Procedure Checklist", type: "PDF", visibility: "All Patients", date: "Feb 28" },
  { id: 3, name: "Insurance Authorization Template", type: "DOCX", visibility: "Staff Only", date: "Feb 15" },
  { id: 4, name: "Recovery Diet Guide", type: "PDF", visibility: "All Patients", date: "Feb 10" },
]

const messages = [
  { id: 1, from: "Jennifer M.", subject: "Question about procedure", time: "10m ago", unread: true },
  { id: 2, from: "Robert K.", subject: "Rescheduling appointment", time: "1h ago", unread: true },
  { id: 3, from: "Lisa W.", subject: "Recovery update", time: "3h ago", unread: false },
  { id: 4, from: "Mark D.", subject: "Thank you!", time: "1d ago", unread: false },
]

interface InboxMessage {
  id: number
  from: string
  email: string
  subject: string
  preview: string
  time: string
  source: "email" | "website" | "phone"
  leadStatus: "hot" | "new" | "patient" | "followup"
  unread: boolean
  treatment: string
  stage: string
  suggestion: {
    type: "booking" | "scheduling" | "testimonial"
    label: string
    text: string
    actions: string[]
  } | null
}

const inboxMessages: InboxMessage[] = [
  {
    id: 1,
    from: "Jennifer M.",
    email: "jennifer@email.com",
    subject: "Re: Knee stem cell therapy consultation",
    preview: "Hi, I wanted to follow up on our call. I'm very interested in scheduling the consultation we discussed...",
    time: "10m ago",
    source: "email",
    leadStatus: "hot",
    unread: true,
    treatment: "Knee Stem Cell Therapy",
    stage: "Consult Booked",
    suggestion: {
      type: "booking",
      label: "ClinicIQ suggestion",
      text: "She's ready to book. Suggest confirming the March 25th slot and sending the pre-consultation form.",
      actions: ["Send suggested reply", "Edit first"]
    }
  },
  {
    id: 2,
    from: "Alex T.",
    email: "alex@email.com",
    subject: "Contact form: PRP treatment inquiry",
    preview: "I've been dealing with chronic knee pain for 3 years. My orthopedist suggested looking into PRP...",
    time: "32m ago",
    source: "website",
    leadStatus: "new",
    unread: true,
    treatment: "PRP Therapy",
    stage: "New Lead",
    suggestion: null
  },
  {
    id: 3,
    from: "Robert K.",
    email: "robert@email.com",
    subject: "Rescheduling tomorrow's appointment",
    preview: "Something came up, would it be possible to move my 10:30 to later in the week?",
    time: "1h ago",
    source: "email",
    leadStatus: "patient",
    unread: true,
    treatment: "Hip Regeneration",
    stage: "In Treatment",
    suggestion: {
      type: "scheduling",
      label: "Scheduling update",
      text: "Robert wants to move his 10:30 tomorrow. Next available: Thursday 2pm, Friday 9am.",
      actions: ["Offer Thursday 2pm", "Offer both", "Reply manually"]
    }
  },
  {
    id: 4,
    from: "Sarah L.",
    email: "sarah@email.com",
    subject: "Re: Post-treatment feedback",
    preview: "The shoulder is feeling so much better! I'd be happy to share my experience if that helps...",
    time: "3h ago",
    source: "email",
    leadStatus: "followup",
    unread: false,
    treatment: "Shoulder PRP",
    stage: "Follow-up",
    suggestion: {
      type: "testimonial",
      label: "Testimonial opportunity",
      text: "Sarah is expressing interest in sharing her story. Send the testimonial intake form?",
      actions: ["Send form", "Dismiss"]
    }
  },
  {
    id: 5,
    from: "Maria G.",
    email: "maria@email.com",
    subject: "Website inquiry: Stem cell treatment costs",
    preview: "Hello, I found your clinic through Google. Could you provide information about pricing for...",
    time: "5h ago",
    source: "website",
    leadStatus: "new",
    unread: false,
    treatment: "Stem Cell Therapy",
    stage: "New Lead",
    suggestion: null
  },
  {
    id: 6,
    from: "Dr. Martinez (referral)",
    email: "martinez@hospital.com",
    subject: "Patient referral - James P.",
    preview: "I'm referring my patient James P. for evaluation. He's a 45yo athlete with bilateral knee...",
    time: "Yesterday",
    source: "email",
    leadStatus: "new",
    unread: false,
    treatment: "Knee Evaluation",
    stage: "New Lead",
    suggestion: null
  },
  {
    id: 7,
    from: "Lisa W.",
    email: "lisa@email.com",
    subject: "Recovery update and question",
    preview: "Week 3 update: the knee feels much better. Quick question about the exercises you recommended...",
    time: "Yesterday",
    source: "email",
    leadStatus: "patient",
    unread: false,
    treatment: "Stem Cell - Knee",
    stage: "In Treatment",
    suggestion: null
  },
]

const insightsQuickActions = [
  { title: "Morning briefing", description: "New leads, today's schedule, pending follow-ups" },
  { title: "Follow up on stale leads", description: "Draft emails for leads with no activity in 5+ days" },
  { title: "Pipeline report", description: "Revenue by stage, conversion rates, trends" },
  { title: "Prep for consultation", description: "Summarize a patient's history before their visit" },
]

interface Conversation {
  id: string
  title: string
  time: string
  group: "Today" | "Yesterday" | "Last week"
}

const insightsConversations: Conversation[] = [
  { id: "c1", title: "Set up auto-responses for web leads", time: "10m ago", group: "Today" },
  { id: "c2", title: "Morning briefing", time: "2h ago", group: "Today" },
  { id: "c3", title: "Draft testimonial request for Lisa W.", time: "Yesterday", group: "Yesterday" },
  { id: "c4", title: "Which lead source converts best?", time: "Yesterday", group: "Yesterday" },
  { id: "c5", title: "Pipeline report March", time: "Mar 14", group: "Last week" },
  { id: "c6", title: "Prep for Jennifer M. consultation", time: "Mar 13", group: "Last week" },
  { id: "c7", title: "Show all patients in recovery", time: "Mar 12", group: "Last week" },
]

const automationRules = [
  { name: "After-hours web lead auto-response", description: "Auto-respond to website leads received between 7pm - 7am", enabled: true, source: "Created via ClinicIQ" },
  { name: "Auto-follow up new leads", description: "Send follow-up email to leads who haven't responded in 3 days", enabled: true, source: null },
  { name: "Send appointment reminders", description: "Send reminder 24 hours before scheduled appointments", enabled: true, source: null },
  { name: "Request testimonials after treatment", description: "Send testimonial request 2 weeks after treatment completion", enabled: false, source: null },
]

const settingsIntegrations = [
  { name: "Gmail", description: "See and send emails from your inbox", status: "Connected", connectedAs: "admin@yourclinic.com", icon: Mail },
  { name: "Google Calendar", description: "Sync appointments and availability", status: "Connected", connectedAs: "admin@yourclinic.com", icon: Calendar },
  { name: "Website Forms", description: "Auto-import leads from your contact forms", status: "Connected", connectedAs: "yourclinic.com", icon: Globe },
  { name: "QuickBooks", description: "Sync invoices and payment status", status: "Not Connected", icon: DollarSign },
  { name: "Google Drive", description: "Access and generate documents", status: "Not Connected", icon: HardDrive },
]

const appointments = [
  { id: 1, patient: "Jennifer M.", type: "Consultation", time: "9:00 AM", date: "Today", status: "Confirmed" },
  { id: 2, patient: "Robert K.", type: "Follow-up", time: "10:30 AM", date: "Today", status: "Pending" },
  { id: 3, patient: "Lisa W.", type: "Treatment", time: "2:00 PM", date: "Today", status: "Confirmed" },
  { id: 4, patient: "Mark D.", type: "Check-up", time: "9:00 AM", date: "Tomorrow", status: "Confirmed" },
]

const caseStudies = [
  { id: 1, patient: "Anonymous", treatment: "Knee Stem Cell", outcome: "95% improvement", status: "Published", date: "Mar 10" },
  { id: 2, patient: "David R.", treatment: "PRP Therapy", outcome: "Full recovery", status: "Draft", date: "Mar 5" },
  { id: 3, patient: "Susan T.", treatment: "Shoulder Regen", outcome: "87% improvement", status: "Review", date: "Feb 28" },
]

const recentActivity = [
  { id: 1, type: "booking", message: "Jennifer M. booked consultation", time: "Just now", icon: Calendar, color: "bg-primary/15 text-primary" },
  { id: 2, type: "automation", message: "Auto-followed up with 3 leads", time: "2m ago", icon: Zap, color: "bg-secondary/15 text-secondary" },
  { id: 3, type: "engagement", message: "Sent testimonial request to Sarah L.", time: "12m ago", icon: MessageSquare, color: "bg-primary/15 text-primary" },
  { id: 4, type: "call", message: "Phone call logged with Robert K.", time: "25m ago", icon: Phone, color: "bg-secondary/15 text-secondary" },
]

export function ClinicDashboard({ activePage }: ClinicDashboardProps) {
  const [leads] = useState<Lead[]>(initialLeads)
  const [leadsView, setLeadsView] = useState<"kanban" | "table">("kanban")
  const [leadsTab, setLeadsTab] = useState<"leads" | "pipeline">("leads")
  const [selectedProfile, setSelectedProfile] = useState<Lead | typeof patients[0] | null>(null)
  const [profileType, setProfileType] = useState<"lead" | "patient">("lead")
  const [selectedInboxMessage, setSelectedInboxMessage] = useState<InboxMessage | null>(null)
  const [inboxFilter, setInboxFilter] = useState<"all" | "email" | "website" | "phone">("all")
  const [selectedConversation, setSelectedConversation] = useState<string>("c1")
  const [insightsChatInput, setInsightsChatInput] = useState("")

  const weeklyStats = {
    newLeads: leads.filter(l => l.stage === "new").length,
    consultsBooked: leads.filter(l => l.stage === "consult").length,
    treatmentsActive: leads.filter(l => l.stage === "treatment").length,
    followUps: leads.filter(l => l.stage === "followup").length,
    pipelineValue: leads.reduce((acc, lead) => acc + lead.value, 0),
    conversionRate: 34,
  }

  const renderPageHeader = (title: string, description?: string) => (
    <div className="mb-6">
      <h1 className="font-serif text-2xl font-semibold italic text-foreground">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  )

  const openLeadProfile = (lead: Lead) => {
    setSelectedProfile(lead)
    setProfileType("lead")
  }

  const openPatientProfile = (patient: typeof patients[0]) => {
    setSelectedProfile(patient as any)
    setProfileType("patient")
  }

  const ProfileModal = () => {
    if (!selectedProfile) return null

    const isLead = profileType === "lead"
    const profile = selectedProfile as Lead

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedProfile(null)}>
        <div className="w-full max-w-2xl rounded-xl bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {profile.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{profile.name}</h2>
                <Badge variant={isLead ? "outline" : "secondary"}>
                  {isLead ? (profile as Lead).stage.charAt(0).toUpperCase() + (profile as Lead).stage.slice(1) : (selectedProfile as typeof patients[0]).status}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedProfile(null)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Contact Information</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">Treatment</p>
                  <p className="mt-1 text-sm font-medium">{profile.treatment}</p>
                </div>

                {isLead && (
                  <>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Value</p>
                      <p className="mt-1 text-lg font-semibold text-secondary">${(profile as Lead).value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Source</p>
                      <p className="mt-1 text-sm">{(profile as Lead).source}</p>
                    </div>
                  </>
                )}

                {!isLead && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Progress</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Treatment Progress</span>
                        <span className="font-medium">{(selectedProfile as typeof patients[0]).progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div 
                          className="h-2 rounded-full bg-secondary transition-all"
                          style={{ width: `${(selectedProfile as typeof patients[0]).progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Assigned To</p>
                  <p className="mt-1 text-sm">{isLead ? (profile as Lead).assignedTo : "Dr. Chen"}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {isLead ? "Last Contact" : "Last Visit"}
                  </p>
                  <p className="mt-1 text-sm">{isLead ? (profile as Lead).lastContact : (selectedProfile as typeof patients[0]).lastVisit}</p>
                </div>

                {!isLead && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Next Appointment</p>
                    <p className="mt-1 text-sm">{(selectedProfile as typeof patients[0]).nextAppt}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-medium text-muted-foreground">Notes</p>
                  <p className="mt-1 text-sm text-muted-foreground">{isLead ? (profile as Lead).notes : (selectedProfile as typeof patients[0]).notes}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 border-t border-border pt-6">
              <Button className="flex-1 gap-2">
                <Phone className="h-4 w-4" />
                Call
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </Button>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Overview/Dashboard Page - Weekly Summary
  if (activePage === "overview") {
    return (
      <div className="p-6">
        {selectedProfile && <ProfileModal />}
        {renderPageHeader("This Week at ClinicTech", "March 13 - March 19, 2026")}
        
        {/* Quick Stats Row */}
        <div className="mb-6 grid grid-cols-5 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">New Leads</p>
                  <p className="text-2xl font-bold text-foreground">{weeklyStats.newLeads}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-secondary">
                <ArrowUpRight className="h-3 w-3" />
                <span>+2 from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Consults Booked</p>
                  <p className="text-2xl font-bold text-foreground">{weeklyStats.consultsBooked}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/20">
                  <Calendar className="h-5 w-5 text-chart-3" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-secondary">
                <ArrowUpRight className="h-3 w-3" />
                <span>+1 from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">In Treatment</p>
                  <p className="text-2xl font-bold text-foreground">{weeklyStats.treatmentsActive}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                  <Activity className="h-5 w-5 text-secondary" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <span>Same as last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Follow-ups</p>
                  <p className="text-2xl font-bold text-foreground">{weeklyStats.followUps}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-5/20">
                  <Clock className="h-5 w-5 text-chart-5" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                <ArrowDownRight className="h-3 w-3" />
                <span>-1 from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-primary-foreground/70">Pipeline Value</p>
                  <p className="text-2xl font-bold">${(weeklyStats.pipelineValue / 1000).toFixed(0)}k</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-primary-foreground/70">
                <ArrowUpRight className="h-3 w-3" />
                <span>+18% this month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="col-span-2 space-y-6">
            {/* Stage Overview with Clickable Cards */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Pipeline Overview</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {stages.map((stage) => {
                    const stageLeads = leads.filter((lead) => lead.stage === stage.id)
                    return (
                      <div key={stage.id} className="rounded-lg bg-muted/50 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                            <span className="text-[10px] font-semibold tracking-wide text-muted-foreground">
                              {stage.label}
                            </span>
                          </div>
                          <Badge variant="secondary" className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">
                            {stageLeads.length}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {stageLeads.slice(0, 2).map((lead) => (
                            <button
                              key={lead.id}
                              onClick={() => openLeadProfile(lead)}
                              className="group w-full cursor-pointer rounded-md border border-border/50 bg-card p-2 text-left shadow-sm transition-all hover:shadow-md hover:border-primary/30"
                            >
                              <p className="text-sm font-medium text-foreground group-hover:text-primary">{lead.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{lead.treatment}</p>
                              <p className="mt-1 text-xs font-semibold text-secondary">
                                ${lead.value.toLocaleString()}
                              </p>
                            </button>
                          ))}
                          {stageLeads.length > 2 && (
                            <p className="text-center text-[10px] text-muted-foreground">
                              +{stageLeads.length - 2} more
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Today's Appointments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Today&apos;s Schedule</CardTitle>
                <Badge variant="secondary">{appointments.filter(a => a.date === "Today").length} appointments</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.filter(a => a.date === "Today").map((appt) => {
                    const matchingLead = leads.find(l => l.name === appt.patient)
                    return (
                      <button
                        key={appt.id}
                        onClick={() => matchingLead && openLeadProfile(matchingLead)}
                        className="flex w-full items-center justify-between rounded-lg border border-border/50 p-3 text-left transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {appt.patient.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{appt.patient}</p>
                            <p className="text-xs text-muted-foreground">{appt.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{appt.time}</p>
                          <Badge variant={appt.status === "Confirmed" ? "secondary" : "outline"} className="text-[10px]">
                            {appt.status}
                          </Badge>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Patients in Treatment */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Active Patients</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  View All Patients
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patients.filter(p => p.status === "In Treatment" || p.status === "Recovery").map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => openPatientProfile(patient)}
                      className="flex w-full items-center justify-between rounded-lg border border-border/50 p-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 text-sm font-medium text-secondary">
                          {patient.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.treatment}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{patient.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted">
                            <div 
                              className="h-1.5 rounded-full bg-secondary transition-all"
                              style={{ width: `${patient.progress}%` }}
                            />
                          </div>
                        </div>
                        <Badge variant={patient.status === "In Treatment" ? "default" : "secondary"}>
                          {patient.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Recent Activity & Notifications */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${activity.color}`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Unread Messages</CardTitle>
                <Badge variant="destructive" className="text-[10px]">{messages.filter(m => m.unread).length}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {messages.filter(m => m.unread).map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3 rounded-lg border border-border/50 p-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {msg.from.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{msg.from}</p>
                        <p className="text-xs text-muted-foreground truncate">{msg.subject}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View All Messages
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Automation Active</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Auto-follow-ups are enabled. 3 messages sent today.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  View Automation Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-secondary/5 border-secondary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <p className="text-sm font-medium">Quick Insight</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Your website leads convert 2.3x better than paid ads this month.
                </p>
                <Button variant="outline" size="sm" className="w-full gap-1">
                  View in Insights
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Leads Page
  if (activePage === "leads") {
    return (
      <div className="p-6">
        {selectedProfile && <ProfileModal />}
        {renderPageHeader("Leads Management", "Track and manage your sales pipeline")}
        
        {/* Tabs for Leads and Pipeline Settings */}
        <div className="mb-6 flex items-center gap-1 border-b border-border">
          <button
            onClick={() => setLeadsTab("leads")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              leadsTab === "leads" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Leads
            </span>
          </button>
          <button
            onClick={() => setLeadsTab("pipeline")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              leadsTab === "pipeline" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Pipeline Settings
            </span>
          </button>
        </div>

        {leadsTab === "pipeline" ? (
          // Pipeline Builder Section
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <span className="text-primary">Your Brand</span>
                </Badge>
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <Zap className="h-3 w-3 text-primary" />
                  Auto-Follow-Up On
                </Badge>
                <Badge variant="outline" className="gap-1.5 text-xs">
                  <TrendingUp className="h-3 w-3 text-secondary" />
                  {leads.length} Active Leads
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Undo
                </Button>
                <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
                  <Save className="h-4 w-4" />
                  Save Pipeline
                </Button>
              </div>
            </div>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <div className="h-3 w-3 rounded-full bg-secondary" />
                    <div className="h-3 w-3 rounded-full bg-primary/50" />
                  </div>
                  <CardTitle className="text-lg">Pipeline Stages</CardTitle>
                </div>
                <Button variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary/10">
                  <Plus className="h-4 w-4" />
                  Add Stage
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {stages.map((stage) => {
                    const stageLeads = leads.filter((lead) => lead.stage === stage.id)
                    return (
                      <div key={stage.id} className="rounded-xl bg-muted/50 p-3">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                            <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                              {stage.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="h-5 min-w-5 rounded-full px-1.5 text-xs">
                              {stageLeads.length}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {stageLeads.slice(0, 3).map((lead) => (
                            <button
                              key={lead.id}
                              onClick={() => openLeadProfile(lead)}
                              className="group w-full cursor-pointer rounded-lg border border-border/50 bg-card p-3 text-left shadow-sm transition-all hover:shadow-md"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-foreground">{lead.name}</p>
                                  <p className="text-xs text-muted-foreground">{lead.treatment}</p>
                                </div>
                                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                              <p className="mt-2 text-sm font-semibold text-secondary">
                                ${lead.value.toLocaleString()}
                              </p>
                            </button>
                          ))}
                          {stageLeads.length > 3 && (
                            <button className="w-full rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary">
                              +{stageLeads.length - 3} more
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 flex items-center justify-end border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground">
                    Drag stages to reorder. Branded as <span className="font-medium text-primary">Your Clinic</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // Leads List Section
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    className="h-9 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-border p-1">
                  <Button
                    variant={leadsView === "kanban" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => setLeadsView("kanban")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={leadsView === "table" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => setLeadsView("table")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
                  <Plus className="h-4 w-4" />
                  Add Lead
                </Button>
              </div>
            </div>

            {leadsView === "table" ? (
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Treatment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Value</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Source</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Assigned</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr 
                          key={lead.id} 
                          className="border-b border-border/50 hover:bg-muted/30 cursor-pointer"
                          onClick={() => openLeadProfile(lead)}
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground">{lead.name}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" /> {lead.email}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Phone className="h-3 w-3" /> {lead.phone}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">{lead.treatment}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-secondary">${lead.value.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="capitalize">{lead.stage}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{lead.source}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{lead.assignedTo}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {stages.map((stage) => {
                  const stageLeads = leads.filter((lead) => lead.stage === stage.id)
                  return (
                    <div key={stage.id} className="rounded-xl bg-muted/50 p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                          <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                            {stage.label}
                          </span>
                        </div>
                        <Badge variant="secondary" className="h-5 min-w-5 rounded-full px-1.5 text-xs">
                          {stageLeads.length}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {stageLeads.map((lead) => (
                          <button
                            key={lead.id}
                            onClick={() => openLeadProfile(lead)}
                            className="group w-full cursor-pointer rounded-lg border border-border/50 bg-card p-3 text-left shadow-sm transition-all hover:shadow-md"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-foreground">{lead.name}</p>
                                <p className="text-xs text-muted-foreground">{lead.treatment}</p>
                              </div>
                              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-secondary">
                              ${lead.value.toLocaleString()}
                            </p>
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                              <span>{lead.source}</span>
                              <span>{lead.date}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  // Patients Page
  if (activePage === "patients") {
    return (
      <div className="p-6">
        {selectedProfile && <ProfileModal />}
        {renderPageHeader("Patients", "Manage patient profiles and treatment plans")}
        
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients..."
              className="h-9 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Treatment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Last Visit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Next Appt</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    className="border-b border-border/50 hover:bg-muted/30 cursor-pointer"
                    onClick={() => openPatientProfile(patient)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {patient.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{patient.treatment}</td>
                    <td className="px-4 py-3">
                      <Badge variant={patient.status === "In Treatment" ? "default" : patient.status === "Recovery" ? "secondary" : "outline"}>
                        {patient.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-20">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="font-medium">{patient.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted">
                          <div 
                            className="h-1.5 rounded-full bg-secondary transition-all"
                            style={{ width: `${patient.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{patient.lastVisit}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{patient.nextAppt}</td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm" className="gap-1" onClick={(e) => e.stopPropagation()}>
                        View <ChevronRight className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Knowledge Base Page
  if (activePage === "knowledge") {
    return (
      <div className="p-6">
        {renderPageHeader("Knowledge Base Manager", "Manage content for patients and AI assistant")}
        
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              className="h-9 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Bulk Upload
            </Button>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
              <Plus className="h-4 w-4" />
              New Article
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {knowledgeCategories.map((cat) => (
            <Card key={cat.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <cat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.articles} articles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "Stem Cell Therapy: What to Expect", category: "Treatment Protocols", visible: true, published: true },
                { title: "Post-Procedure Care Guidelines", category: "Recovery Guidelines", visible: true, published: true },
                { title: "Common Questions About PRP", category: "Patient FAQs", visible: true, published: false },
              ].map((article, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div>
                      <p className="font-medium text-foreground">{article.title}</p>
                      <p className="text-xs text-muted-foreground">{article.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={article.visible ? "secondary" : "outline"} className="gap-1">
                      {article.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {article.visible ? "Visible" : "Hidden"}
                    </Badge>
                    <Badge variant={article.published ? "default" : "outline"}>
                      {article.published ? "Published" : "Draft"}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Documents Page
  if (activePage === "documents") {
    return (
      <div className="p-6">
        {renderPageHeader("Documents", "Manage patient forms and clinic documents")}
        
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              className="h-9 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
              <Plus className="h-4 w-4" />
              New Document
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Document</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Visibility</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <p className="font-medium text-foreground">{doc.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{doc.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{doc.visibility}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{doc.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Unified Inbox Page
  if (activePage === "inbox") {
    const filteredMessages = inboxFilter === "all" 
      ? inboxMessages 
      : inboxMessages.filter(m => m.source === inboxFilter)
    
    const getSourceColor = (source: string) => {
      switch (source) {
        case "email": return "bg-amber-100 text-amber-800"
        case "website": return "bg-teal-100 text-teal-800"
        case "phone": return "bg-gray-100 text-gray-800"
        default: return "bg-gray-100 text-gray-800"
      }
    }

    const getInitialsColor = (source: string) => {
      switch (source) {
        case "email": return "bg-primary/10 text-primary"
        case "website": return "bg-teal-100 text-teal-700"
        case "phone": return "bg-gray-100 text-gray-700"
        default: return "bg-primary/10 text-primary"
      }
    }

    const getLeadStatusBadge = (status: string) => {
      switch (status) {
        case "hot": return "bg-green-100 text-green-800"
        case "new": return "bg-amber-100 text-amber-800"
        case "patient": return "bg-primary/10 text-primary"
        case "followup": return "bg-purple-100 text-purple-800"
        default: return "bg-gray-100 text-gray-800"
      }
    }

    const getSuggestionAccent = (type: string) => {
      switch (type) {
        case "booking": return "border-l-primary bg-primary/5"
        case "scheduling": return "border-l-amber-500 bg-amber-50"
        case "testimonial": return "border-l-green-500 bg-green-50"
        default: return "border-l-primary bg-primary/5"
      }
    }

    return (
      <div className="p-6 h-[calc(100vh-32px)]">
        {renderPageHeader("Inbox", "All patient and lead communications in one place")}
        
        <div className="grid grid-cols-5 gap-6 h-[calc(100%-80px)]">
          {/* Message List - Left Panel */}
          <div className="col-span-2 flex flex-col">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="pb-3 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">Inbox</CardTitle>
                    <Badge variant="destructive" className="text-xs">{inboxMessages.filter(m => m.unread).length}</Badge>
                  </div>
                </div>
                {/* Filter Pills */}
                <div className="flex items-center gap-2">
                  {(["all", "email", "website", "phone"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setInboxFilter(filter)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        inboxFilter === filter 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
                {/* Search */}
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="h-8 w-full rounded-lg border border-input bg-card pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto">
                <div className="divide-y divide-border">
                  {filteredMessages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedInboxMessage(msg)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                        msg.unread ? 'bg-primary/5' : ''
                      } ${selectedInboxMessage?.id === msg.id ? 'bg-muted' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${getInitialsColor(msg.source)}`}>
                          {msg.from.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className={`text-sm ${msg.unread ? 'font-semibold' : 'font-medium'} text-foreground truncate`}>
                              {msg.from}
                            </p>
                            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getSourceColor(msg.source)}`}>
                              via {msg.source}
                            </span>
                            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getLeadStatusBadge(msg.leadStatus)}`}>
                              {msg.leadStatus === "hot" ? "hot lead" : msg.leadStatus === "new" ? "new lead" : msg.leadStatus === "followup" ? "follow-up" : "patient"}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-foreground truncate">{msg.subject}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.preview}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                            {msg.unread && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Suggestion Card */}
                      {msg.suggestion && (
                        <div className={`mt-3 p-3 rounded-lg border-l-4 ${getSuggestionAccent(msg.suggestion.type)}`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Sparkles className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[10px] font-medium text-muted-foreground">{msg.suggestion.label}</span>
                          </div>
                          <p className="text-xs text-foreground mb-2">{msg.suggestion.text}</p>
                          <div className="flex items-center gap-2">
                            {msg.suggestion.actions.map((action, i) => (
                              <Button 
                                key={i} 
                                variant={i === 0 ? "default" : "outline"} 
                                size="sm" 
                                className="h-6 text-[10px] px-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {action}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversation Detail - Right Panel */}
          <div className="col-span-3 flex flex-col">
            <Card className="flex-1 flex flex-col overflow-hidden">
              {selectedInboxMessage ? (
                <>
                  {/* Profile Summary Header */}
                  <CardHeader className="pb-3 border-b border-border shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold ${getInitialsColor(selectedInboxMessage.source)}`}>
                          {selectedInboxMessage.from.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{selectedInboxMessage.from}</h3>
                            <Badge variant="outline" className="text-[10px]">{selectedInboxMessage.stage}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{selectedInboxMessage.treatment}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {selectedInboxMessage.email} • Last contact: {selectedInboxMessage.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Conversation Thread */}
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {/* Incoming message */}
                      <div className="flex gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${getInitialsColor(selectedInboxMessage.source)}`}>
                          {selectedInboxMessage.from.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{selectedInboxMessage.from}</span>
                            <span className="text-[10px] text-muted-foreground">{selectedInboxMessage.time}</span>
                          </div>
                          <div className="rounded-lg bg-muted p-3">
                            <p className="text-sm font-medium mb-1">{selectedInboxMessage.subject}</p>
                            <p className="text-sm text-muted-foreground">{selectedInboxMessage.preview}</p>
                          </div>
                        </div>
                      </div>

                      {/* Previous message in thread */}
                      <div className="flex gap-3 justify-end">
                        <div className="flex-1 max-w-[80%]">
                          <div className="flex items-center gap-2 mb-1 justify-end">
                            <span className="text-[10px] text-muted-foreground">Yesterday</span>
                            <span className="text-sm font-medium">You</span>
                          </div>
                          <div className="rounded-lg bg-primary text-primary-foreground p-3">
                            <p className="text-sm">Thank you for reaching out! I&apos;d be happy to discuss your treatment options. Would you be available for a consultation next week?</p>
                          </div>
                        </div>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          CT
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Quick Actions Bar */}
                  <div className="border-t border-border p-3 shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        Reply
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Forward className="h-3.5 w-3.5" />
                        Forward
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Schedule Follow-up
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <StickyNote className="h-3.5 w-3.5" />
                        Add Note
                      </Button>
                    </div>
                    {/* Reply Composer */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type your reply..."
                        className="flex-1 h-10 rounded-lg border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Sparkles className="h-3 w-3" />
                        Draft with ClinicIQ
                      </Button>
                      <Button size="sm" className="gap-1.5">
                        <Send className="h-3.5 w-3.5" />
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="flex h-full items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="mx-auto h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm">Select a conversation to view</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Appointments Page
  if (activePage === "appointments") {
    return (
      <div className="p-6">
        {selectedProfile && <ProfileModal />}
        {renderPageHeader("Appointments", "Manage clinic schedule and bookings")}
        
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">Today</Button>
            <Button variant="ghost" size="sm">This Week</Button>
            <Button variant="ghost" size="sm">This Month</Button>
          </div>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => {
                  const matchingLead = leads.find(l => l.name === appt.patient)
                  return (
                    <tr 
                      key={appt.id} 
                      className="border-b border-border/50 hover:bg-muted/30 cursor-pointer"
                      onClick={() => matchingLead && openLeadProfile(matchingLead)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {appt.patient.split(" ").map(n => n[0]).join("")}
                          </div>
                          <p className="font-medium text-foreground">{appt.patient}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{appt.type}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{appt.date}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{appt.time}</td>
                      <td className="px-4 py-3">
                        <Badge variant={appt.status === "Confirmed" ? "secondary" : "outline"}>
                          {appt.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Case Studies Page
  if (activePage === "case-studies") {
    return (
      <div className="p-6">
        {renderPageHeader("Case Studies", "Document and share patient success stories")}
        
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search case studies..."
              className="h-9 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" />
            New Case Study
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {caseStudies.map((cs) => (
            <Card key={cs.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={cs.status === "Published" ? "default" : cs.status === "Draft" ? "outline" : "secondary"}>
                    {cs.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{cs.date}</span>
                </div>
                <h3 className="font-medium text-foreground mb-1">{cs.treatment}</h3>
                <p className="text-sm text-muted-foreground mb-2">Patient: {cs.patient}</p>
                <p className="text-sm font-medium text-secondary">{cs.outcome}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Insights Page (AI Chat Interface with Conversation Sidebar)
  if (activePage === "insights") {
    const groupedConversations = {
      "Today": insightsConversations.filter(c => c.group === "Today"),
      "Yesterday": insightsConversations.filter(c => c.group === "Yesterday"),
      "Last week": insightsConversations.filter(c => c.group === "Last week"),
    }

    const renderWorkflowConversation = () => (
      <div className="space-y-4">
        {/* User Message 1 */}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-lg bg-primary text-primary-foreground p-3">
            <p className="text-sm">Set up auto-responses for new website leads that come in after hours</p>
          </div>
        </div>

        {/* ClinicIQ Response with Workflow Proposal */}
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">ClinicIQ</span>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-foreground">I can set that up. Here&apos;s what I&apos;d recommend:</p>
              
              {/* Workflow Proposal Card */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-medium text-amber-800 mb-2">Proposed workflow: After-hours web lead response</p>
                <div className="space-y-1.5 text-sm">
                  <p><span className="font-medium text-foreground">Trigger:</span> <span className="text-muted-foreground">New website form submission received outside business hours (6pm - 8am)</span></p>
                  <p><span className="font-medium text-foreground">Action:</span> <span className="text-muted-foreground">Send personalized email within 5 minutes acknowledging their inquiry</span></p>
                  <p><span className="font-medium text-foreground">Template:</span> <span className="text-muted-foreground">Warm greeting, confirm we received their inquiry about [treatment type], let them know a team member will reach out first thing in the morning</span></p>
                  <p><span className="font-medium text-foreground">Follow-up:</span> <span className="text-muted-foreground">Flag lead as &quot;needs morning call&quot; for your dashboard</span></p>
                </div>
              </div>

              <p className="text-sm text-foreground">Want me to activate this? You can always adjust the hours or template in Settings &gt; Automations later.</p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button size="sm" className="h-7 text-xs border-primary text-primary-foreground">Activate this workflow</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">Edit the template first</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">Change the hours</Button>
              </div>
            </div>
          </div>
        </div>

        {/* User Message 2 */}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-lg bg-primary text-primary-foreground p-3">
            <p className="text-sm">Activate it, but make the window 7pm to 7am instead</p>
          </div>
        </div>

        {/* ClinicIQ Confirmation Response */}
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">ClinicIQ</span>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-foreground">Done. Your after-hours auto-response is now active for 7pm - 7am. Here&apos;s what&apos;s set up:</p>
              
              {/* Workflow Confirmation Card */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-700">Workflow active</span>
                </div>
                <p className="text-sm text-foreground mt-1">After-hours web lead auto-response (7pm - 7am)</p>
              </div>

              <p className="text-sm text-foreground">
                You can toggle this on/off anytime from{" "}
                <button 
                  onClick={() => {/* Would navigate to settings */}}
                  className="text-primary underline hover:text-primary/80"
                >
                  Settings &gt; Automations
                </button>
                . Anything else?
              </p>
            </div>
          </div>
        </div>
      </div>
    )

    const renderMorningBriefingConversation = () => (
      <div className="space-y-4">
        {/* User Message */}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-lg bg-primary text-primary-foreground p-3">
            <p className="text-sm">Morning briefing</p>
          </div>
        </div>

        {/* ClinicIQ Response */}
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">ClinicIQ</span>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm mb-4">Here&apos;s your morning overview for today:</p>
              
              {/* Embedded Mini KPI Cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-lg bg-card border border-border p-3">
                  <p className="text-[10px] font-medium text-muted-foreground">New Leads</p>
                  <p className="text-xl font-bold text-foreground">2</p>
                </div>
                <div className="rounded-lg bg-card border border-border p-3">
                  <p className="text-[10px] font-medium text-muted-foreground">Appointments Today</p>
                  <p className="text-xl font-bold text-foreground">3</p>
                </div>
                <div className="rounded-lg bg-card border border-border p-3">
                  <p className="text-[10px] font-medium text-muted-foreground">Pending Follow-ups</p>
                  <p className="text-xl font-bold text-foreground">4</p>
                </div>
              </div>

              <p className="text-sm text-foreground mb-4">
                You have 3 appointments starting at 9:00 AM with Jennifer M. (consultation). Two leads haven&apos;t been contacted in over 5 days - <span className="font-medium">Amanda S.</span> and <span className="font-medium">James P.</span> - and Sarah L. responded positively to the testimonial request yesterday.
              </p>

              <p className="text-sm text-foreground mb-3">Would you like me to draft follow-up emails for the stale leads?</p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button size="sm" className="h-7 text-xs">Draft follow-ups</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">Show me the leads</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">I&apos;ll handle it</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div className="flex h-[calc(100vh-32px)]">
        {/* Conversation History Sidebar */}
        <div className="w-60 shrink-0 border-r border-border bg-background flex flex-col">
          {/* New Conversation Button */}
          <div className="p-3 border-b border-border">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => setSelectedConversation("")}
            >
              <Plus className="h-4 w-4" />
              New conversation
            </Button>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {(["Today", "Yesterday", "Last week"] as const).map((group) => (
              groupedConversations[group].length > 0 && (
                <div key={group}>
                  <div className="px-4 py-1">
                    <span className="text-[11px] font-medium text-muted-foreground">{group}</span>
                  </div>
                  {groupedConversations[group].map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full px-4 py-2.5 text-left transition-colors ${
                        selectedConversation === conv.id ? "bg-muted" : "hover:bg-muted/50"
                      }`}
                    >
                      <p className="text-sm text-foreground truncate">{conv.title}</p>
                      <p className="text-[11px] text-muted-foreground">{conv.time}</p>
                    </button>
                  ))}
                </div>
              )
            ))}
          </div>

          {/* Connected Tools Status */}
          <div className="p-3 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Gmail", connected: true },
                { name: "Calendar", connected: true },
                { name: "Forms", connected: true },
                { name: "QuickBooks", connected: false },
              ].map((tool, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className={`h-1.5 w-1.5 rounded-full ${tool.connected ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-[10px] text-muted-foreground">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-6">
          {!selectedConversation ? (
            // Landing State (New Conversation)
            <div className="h-full flex flex-col">
              {/* Hero Area */}
              <div className="flex-1 flex flex-col items-center justify-center max-w-[500px] mx-auto text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h1 className="font-serif text-3xl font-semibold italic text-foreground mb-2">ClinicIQ</h1>
                <p className="text-muted-foreground mb-8">
                  Your clinic&apos;s intelligent sidekick. Ask anything, get answers, take action.
                </p>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-2 gap-3 w-full">
                  {insightsQuickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (action.title === "Morning briefing") {
                          setSelectedConversation("c2")
                        } else {
                          setSelectedConversation("c1")
                        }
                      }}
                      className="p-4 rounded-lg bg-muted/50 hover:bg-muted text-left transition-colors"
                    >
                      <p className="font-medium text-foreground mb-1">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="pt-4">
                <div className="max-w-[500px] mx-auto">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={insightsChatInput}
                      onChange={(e) => setInsightsChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && insightsChatInput.trim()) {
                          setSelectedConversation("c1")
                        }
                      }}
                      placeholder="Ask ClinicIQ anything about your clinic..."
                      className="flex-1 h-12 rounded-lg border border-input bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button 
                      size="lg" 
                      className="h-12 px-4"
                      onClick={() => insightsChatInput.trim() && setSelectedConversation("c1")}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    ClinicIQ can access your leads, patients, inbox, and connected tools
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Active Chat State
            <div className="h-full flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto pb-4">
                {selectedConversation === "c1" && renderWorkflowConversation()}
                {selectedConversation === "c2" && renderMorningBriefingConversation()}
                {selectedConversation !== "c1" && selectedConversation !== "c2" && (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p className="text-sm">Select a conversation or start a new one</p>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask ClinicIQ anything about your clinic..."
                    className="flex-1 h-12 rounded-lg border border-input bg-card px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button size="lg" className="h-12 px-4">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  ClinicIQ can access your leads, patients, inbox, and connected tools
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Settings Page
  if (activePage === "settings") {
    return (
      <div className="p-6">
        {renderPageHeader("Settings", "Configure your clinic dashboard")}
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Clinic Information</CardTitle>
                <CardDescription>Update your clinic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Clinic Name</label>
                    <input
                      type="text"
                      defaultValue="Your Clinic"
                      className="mt-1 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      defaultValue="contact@yourclinic.com"
                      className="mt-1 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Palette className="h-5 w-5" />
                  Brand Settings
                </CardTitle>
                <CardDescription>Customize your patient portal appearance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Branding settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link className="h-5 w-5" />
                  Connected Integrations
                </CardTitle>
                <CardDescription>Connect your tools to unlock ClinicIQ features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {settingsIntegrations.map((integration, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <integration.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{integration.name}</p>
                          <p className="text-xs text-muted-foreground">{integration.description}</p>
                          {integration.status === "Connected" && integration.connectedAs && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">{integration.connectedAs}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {integration.status === "Connected" ? (
                          <>
                            <Badge variant="secondary" className="gap-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Connected
                            </Badge>
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline" size="sm">
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bot className="h-5 w-5" />
                  Automation Rules
                </CardTitle>
                <CardDescription>Manage your clinic&apos;s automated workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {automationRules.map((rule, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{rule.name}</span>
                          {rule.source && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-primary/10 text-primary">
                              via ClinicIQ
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <ToggleLeft className={`h-6 w-6 ${rule.enabled ? 'text-secondary' : 'text-muted-foreground'}`} />
                        <span className="text-sm text-muted-foreground w-6">{rule.enabled ? 'On' : 'Off'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserPlus className="h-5 w-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Dr. Chen", role: "Admin", email: "chen@clinic.com" },
                    { name: "Sarah", role: "Staff", email: "sarah@clinic.com" },
                  ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite Team Member
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return null
}
