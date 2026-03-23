"use client"

import { useState } from "react"
import {
  Calendar,
  FileText,
  MessageCircle,
  Send,
  Clock,
  CheckCircle2,
  ChevronRight,
  Download,
  Star,
  Heart,
  Activity,
  Play,
  BookOpen,
  Search,
  TrendingUp,
  Smile,
  Frown,
  Meh,
  Video,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PatientPortalProps {
  activePage: string
  clinicName?: string
}

const patientData = {
  name: "Jennifer Martinez",
  initials: "JM",
  treatment: "Knee Stem Cell Therapy",
  nextAppointment: "March 24, 2026 at 10:00 AM",
  provider: "Dr. Sarah Chen",
  status: "In Treatment",
}

const appointments = [
  { id: 1, date: "Mar 24", time: "10:00 AM", type: "Follow-up Consultation", provider: "Dr. Sarah Chen", status: "upcoming", location: "Main Clinic" },
  { id: 2, date: "Mar 10", time: "2:30 PM", type: "Stem Cell Treatment", provider: "Dr. Sarah Chen", status: "completed", location: "Treatment Center" },
  { id: 3, date: "Feb 28", time: "11:00 AM", type: "Initial Consultation", provider: "Dr. Sarah Chen", status: "completed", location: "Main Clinic" },
]

const documents = [
  { id: 1, name: "Treatment Plan - Knee Regeneration", date: "Mar 10, 2026", type: "PDF", source: "Care Team" },
  { id: 2, name: "Pre-Procedure Instructions", date: "Mar 5, 2026", type: "PDF", source: "Care Team" },
  { id: 3, name: "Consent Form - Stem Cell", date: "Feb 28, 2026", type: "PDF", source: "General" },
  { id: 4, name: "Recovery Diet Guide", date: "Feb 28, 2026", type: "PDF", source: "General" },
  { id: 5, name: "Insurance Authorization", date: "Feb 25, 2026", type: "PDF", source: "Care Team" },
]

const treatmentProgress = [
  { phase: "Initial Consultation", status: "completed", date: "Feb 28" },
  { phase: "Pre-Treatment Prep", status: "completed", date: "Mar 5" },
  { phase: "Stem Cell Procedure", status: "completed", date: "Mar 10" },
  { phase: "Recovery Week 1", status: "current", date: "Mar 17" },
  { phase: "Follow-up Visit", status: "upcoming", date: "Mar 24" },
  { phase: "Recovery Week 4", status: "upcoming", date: "Apr 7" },
]

const knowledgeCategories = [
  { id: 1, name: "My Treatment", icon: Heart, articles: 5 },
  { id: 2, name: "Recovery Tips", icon: TrendingUp, articles: 12 },
  { id: 3, name: "Diet & Nutrition", icon: Activity, articles: 8 },
  { id: 4, name: "Exercise Guide", icon: Activity, articles: 6 },
]

const knowledgeArticles = [
  { id: 1, title: "Understanding Stem Cell Therapy", category: "Treatment", readTime: "5 min" },
  { id: 2, title: "Week 1 Recovery: What to Expect", category: "Recovery", readTime: "3 min" },
  { id: 3, title: "Foods That Support Healing", category: "Nutrition", readTime: "4 min" },
]

const videos = [
  { id: 1, title: "Post-Procedure Care Guide", duration: "8:30", thumbnail: "" },
  { id: 2, title: "Gentle Mobility Exercises", duration: "12:15", thumbnail: "" },
]

const resultEntries = [
  { date: "Mar 17", pain: 3, mobility: 6, energy: 7, mood: "good", notes: "Feeling better today, less stiffness" },
  { date: "Mar 16", pain: 4, mobility: 5, energy: 6, mood: "neutral", notes: "Some discomfort in the morning" },
  { date: "Mar 15", pain: 5, mobility: 4, energy: 5, mood: "neutral", notes: "First day post-procedure" },
  { date: "Mar 14", pain: 6, mobility: 3, energy: 4, mood: "bad", notes: "Day of procedure, expected soreness" },
]

const messages = [
  { id: 1, from: "Dr. Sarah Chen", preview: "Your recovery is looking great! Keep up with...", time: "2h ago", unread: true },
  { id: 2, from: "Care Team", preview: "Reminder: Your follow-up is scheduled for...", time: "1d ago", unread: false },
  { id: 3, from: "AI Assistant", preview: "I've compiled some recovery tips based on...", time: "2d ago", unread: false },
]

const faqs = [
  { q: "What should I expect during recovery?", category: "Recovery" },
  { q: "When can I resume normal activities?", category: "Lifestyle" },
  { q: "What are the signs of complications?", category: "Safety" },
  { q: "How do I care for the treatment site?", category: "Care" },
]

export function PatientPortal({ activePage, clinicName }: PatientPortalProps) {
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "ai"; message: string }[]>([
    {
      role: "ai",
      message: "Hello Jennifer! I'm your AI health assistant. I can answer questions about your stem cell treatment, recovery process, and upcoming appointments. How can I help you today?",
    },
  ])

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return
    setChatHistory((prev) => [...prev, { role: "user", message: chatMessage }])
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          message: "Based on your treatment plan, you're progressing well through week 1 of recovery. It's normal to experience some mild discomfort. Remember to follow your prescribed exercises and avoid high-impact activities. Would you like more specific information about your recovery timeline?",
        },
      ])
    }, 1000)
    setChatMessage("")
  }

  const renderPageHeader = (title: string, description?: string) => (
    <div className="mb-6">
      <h1 className="font-serif text-2xl font-semibold italic text-foreground">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  )

  // Home Page
  if (activePage === "home") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl">
          {/* Welcome Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-semibold italic text-foreground">
                Welcome back, {patientData.name.split(" ")[0]}
              </h1>
              <p className="mt-1 text-muted-foreground">
                Track your treatment progress and connect with your care team
              </p>
            </div>
            <Badge className="gap-2 bg-secondary/20 px-4 py-2 text-secondary">
              <Activity className="h-4 w-4" />
              {patientData.status}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="col-span-2 space-y-6">
              {/* Next Appointment Card */}
              <Card className="border-secondary/30 bg-gradient-to-r from-secondary/10 to-transparent">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                      <Calendar className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Appointment</p>
                      <p className="text-lg font-semibold text-foreground">{patientData.nextAppointment}</p>
                      <p className="text-sm text-muted-foreground">with {patientData.provider}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline">Reschedule</Button>
                    <Button className="bg-primary text-primary-foreground">Join Video Call</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Treatment Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-secondary" />
                    Your Treatment Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
                    <div className="space-y-4">
                      {treatmentProgress.map((step, index) => (
                        <div key={index} className="relative flex items-center gap-4 pl-10">
                          <div
                            className={`absolute left-2 flex h-5 w-5 items-center justify-center rounded-full ${
                              step.status === "completed"
                                ? "bg-secondary text-secondary-foreground"
                                : step.status === "current"
                                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                  : "border-2 border-border bg-card"
                            }`}
                          >
                            {step.status === "completed" && <CheckCircle2 className="h-3 w-3" />}
                            {step.status === "current" && <div className="h-2 w-2 rounded-full bg-current" />}
                          </div>
                          <div
                            className={`flex-1 rounded-lg p-3 ${
                              step.status === "current" ? "bg-primary/5 border border-primary/20" : "bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p className={`font-medium ${step.status === "current" ? "text-primary" : "text-foreground"}`}>
                                {step.phase}
                              </p>
                              <span className="text-xs text-muted-foreground">{step.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How Are You Feeling */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">How are you feeling today?</p>
                      <p className="text-sm text-muted-foreground">Log your daily progress to track your recovery</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                        <Smile className="h-6 w-6 text-secondary" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                        <Meh className="h-6 w-6 text-primary" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                        <Frown className="h-6 w-6 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Recommended for You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {knowledgeArticles.map((article) => (
                      <div key={article.id} className="cursor-pointer rounded-lg border border-border/50 p-3 hover:bg-muted/50 transition-colors">
                        <Badge variant="outline" className="mb-2 text-xs">{article.category}</Badge>
                        <p className="font-medium text-sm text-foreground">{article.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{article.readTime} read</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Chat & Quick Access */}
            <div className="space-y-6">
              {/* AI Chat Assistant */}
              <Card className="flex h-[360px] flex-col">
                <CardHeader className="border-b border-border pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    AI Health Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col p-0">
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {chatHistory.map((chat, index) => (
                        <div key={index} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                              chat.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                            }`}
                          >
                            <p className="text-sm">{chat.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border p-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Ask a question..."
                        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <Button size="icon" onClick={handleSendMessage} className="bg-secondary text-secondary-foreground">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Heart className="h-4 w-4" />
                    Log Results
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <BookOpen className="h-4 w-4" />
                    Browse Knowledge Base
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Message Care Team
                  </Button>
                </CardContent>
              </Card>

              {/* Share Experience */}
              <Card className="border-chart-3/30 bg-gradient-to-br from-chart-3/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-3/20">
                      <Star className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Share Your Experience</p>
                      <p className="mt-1 text-sm text-muted-foreground">Help others by sharing your treatment journey</p>
                      <Button variant="outline" size="sm" className="mt-3 text-chart-3 border-chart-3/30">
                        Write a Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Knowledge Base Page
  if (activePage === "knowledge") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl">
          {renderPageHeader("Knowledge Base", "Browse articles and ask questions about your treatment")}

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles, videos, FAQs..."
                  className="h-11 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Categories */}
              <div className="grid grid-cols-4 gap-3">
                {knowledgeCategories.map((cat) => (
                  <Card key={cat.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <cat.icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-medium text-sm text-foreground">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">{cat.articles} articles</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Topic Chips */}
              <div className="flex flex-wrap gap-2">
                {faqs.map((faq, idx) => (
                  <button key={idx} className="rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground hover:bg-muted/80 transition-colors">
                    {faq.q}
                  </button>
                ))}
              </div>

              {/* Articles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Featured Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {knowledgeArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4 hover:bg-muted/30 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{article.title}</p>
                          <p className="text-xs text-muted-foreground">{article.category} - {article.readTime} read</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Videos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Video className="h-5 w-5" />
                    Video Library
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {videos.map((video) => (
                      <div key={video.id} className="cursor-pointer group">
                        <div className="relative aspect-video rounded-lg bg-muted mb-2 flex items-center justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/80 text-primary-foreground group-hover:bg-primary transition-colors">
                            <Play className="h-6 w-6 ml-1" />
                          </div>
                          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                            {video.duration}
                          </span>
                        </div>
                        <p className="font-medium text-sm text-foreground">{video.title}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - AI Chat */}
            <div>
              <Card className="sticky top-6 flex h-[500px] flex-col">
                <CardHeader className="border-b border-border pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    Ask AI Assistant
                  </CardTitle>
                  <CardDescription>Get instant answers from our knowledge base</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col p-0">
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {chatHistory.map((chat, index) => (
                        <div key={index} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                              chat.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                            }`}
                          >
                            <p className="text-sm">{chat.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border p-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Ask anything..."
                        className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <Button size="icon" onClick={handleSendMessage} className="bg-secondary text-secondary-foreground">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Documents Page
  if (activePage === "documents") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl">
          {renderPageHeader("My Documents", "View and download your medical documents")}

          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents..."
                className="h-9 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {documents.map((doc, idx) => (
                <div key={doc.id} className={`flex items-center justify-between p-4 ${idx !== documents.length - 1 ? "border-b border-border/50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-red-100 text-red-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{doc.date}</span>
                        <Badge variant="outline" className="text-xs">
                          {doc.source === "Care Team" ? "From your care team" : "General resource"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Results/Treatment Tracker Page
  if (activePage === "results") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-5xl">
          {renderPageHeader("Treatment Tracker", "Log your daily progress and view your recovery journey")}

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              {/* Log Entry Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Log Today's Entry</CardTitle>
                  <CardDescription>Track how you're feeling to monitor your progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Pain Level (1-10)</label>
                      <input type="range" min="1" max="10" className="w-full mt-2" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Mobility (1-10)</label>
                      <input type="range" min="1" max="10" className="w-full mt-2" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Energy (1-10)</label>
                      <input type="range" min="1" max="10" className="w-full mt-2" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Notes</label>
                    <textarea
                      className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={3}
                      placeholder="How are you feeling today? Any specific observations..."
                    />
                  </div>
                  <Button className="bg-primary text-primary-foreground">Save Entry</Button>
                </CardContent>
              </Card>

              {/* Progress Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Progress Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground">
                    Progress chart visualization
                  </div>
                </CardContent>
              </Card>

              {/* Entry History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Entries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {resultEntries.map((entry, idx) => (
                    <div key={idx} className="rounded-lg border border-border/50 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{entry.date}</span>
                        <div className="flex items-center gap-1">
                          {entry.mood === "good" && <Smile className="h-4 w-4 text-secondary" />}
                          {entry.mood === "neutral" && <Meh className="h-4 w-4 text-primary" />}
                          {entry.mood === "bad" && <Frown className="h-4 w-4 text-destructive" />}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Pain:</span>{" "}
                          <span className="font-medium">{entry.pain}/10</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Mobility:</span>{" "}
                          <span className="font-medium">{entry.mobility}/10</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Energy:</span>{" "}
                          <span className="font-medium">{entry.energy}/10</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.notes}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Case Study Prompt */}
              <Card className="border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
                      <TrendingUp className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Your progress looks great!</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Would you like to share your experience as a case study to help others?
                      </p>
                      <Button variant="outline" size="sm" className="mt-3 border-secondary/30 text-secondary">
                        Share My Story
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Days Tracked</span>
                    <span className="font-semibold text-foreground">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Pain (last 7d)</span>
                    <span className="font-semibold text-foreground">4.5/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Mobility Trend</span>
                    <Badge className="bg-secondary/15 text-secondary">Improving</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Messages Page
  if (activePage === "messages") {
    return (
      <div className="flex h-screen">
        <div className="w-80 border-r border-border bg-card p-4">
          <div className="mb-4">
            <h2 className="font-serif text-xl font-semibold italic text-foreground">Messages</h2>
          </div>
          <div className="space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`cursor-pointer rounded-lg p-3 transition-colors ${
                  msg.unread ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-medium text-sm ${msg.unread ? "text-foreground" : "text-muted-foreground"}`}>
                    {msg.from}
                  </p>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{msg.preview}</p>
                {msg.unread && <div className="mt-2 h-2 w-2 rounded-full bg-primary" />}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="border-b border-border p-4">
            <h3 className="font-medium text-foreground">Dr. Sarah Chen</h3>
            <p className="text-sm text-muted-foreground">Your Care Provider</p>
          </div>
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to view messages
          </div>
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button className="bg-primary text-primary-foreground">Send</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Appointments Page
  if (activePage === "appointments") {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-4xl">
          {renderPageHeader("Appointments", "View and manage your scheduled appointments")}

          <div className="space-y-4">
            {appointments.map((apt) => (
              <Card key={apt.id} className={apt.status === "upcoming" ? "border-secondary/30" : ""}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-14 w-14 flex-col items-center justify-center rounded-lg ${
                        apt.status === "upcoming" ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className="text-xs font-medium">{apt.date.split(" ")[0]}</span>
                      <span className="text-lg font-bold">{apt.date.split(" ")[1]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{apt.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {apt.time} with {apt.provider}
                      </p>
                      <p className="text-xs text-muted-foreground">{apt.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {apt.status === "upcoming" ? (
                      <>
                        <Badge className="bg-secondary/20 text-secondary">
                          <Clock className="mr-1 h-3 w-3" />
                          Upcoming
                        </Badge>
                        <Button variant="outline" size="sm">Reschedule</Button>
                      </>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full gap-2">
              <Calendar className="h-4 w-4" />
              Request New Appointment
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
