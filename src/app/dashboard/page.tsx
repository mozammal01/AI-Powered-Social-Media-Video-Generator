import Link from "next/link";
import {
  Video,
  ArrowRight,
  Film,
  Layers,
  Clock,
  Calendar,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { demoProjects, demoTemplates } from "@/data/defaults";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFramesToTime(frames: number, fps: number): string {
  const seconds = Math.round(frames / fps);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDateStr(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardHome() {
  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <section className="relative rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/5 via-indigo-500/5 to-transparent p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/10 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI Video Suite Active
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, John!
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg">
            Create high-quality, professional social media videos from scripts
            and templates using the Remotion rendering engine.
          </p>
        </div>
        <Link href="/create-video">
          <Button size="lg" className="gap-2 shrink-0">
            <Video className="w-4 h-4" />
            Create New Video
          </Button>
        </Link>
      </section>

      {/* Overview Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projects
            </CardTitle>
            <Film className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{demoProjects.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {demoProjects.filter((p) => p.status === "completed").length}{" "}
              completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Renders
            </CardTitle>
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {demoProjects.filter((p) => p.status === "rendering").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated completion in 45s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Video Templates
            </CardTitle>
            <Layers className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{demoTemplates.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Set(demoTemplates.map((t) => t.category)).size} categories
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Recent Videos */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">Recent Videos</h2>
            <p className="text-xs text-muted-foreground">
              Access your recently generated videos and rendering statuses.
            </p>
          </div>
          <Link href="/dashboard/my-videos">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden flex flex-col justify-between"
            >
              {/* Thumbnail placeholder */}
              <div className="aspect-video w-full bg-slate-900/10 border-b border-border/40 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/10 via-primary/5 to-slate-900/10 flex flex-col items-center justify-center text-muted-foreground/30">
                  <Film className="w-10 h-10 stroke-[1.2]" />
                  <span className="text-[10px] mt-2 tracking-widest font-mono">
                    {project.aspectRatio} · {project.width}×{project.height}
                  </span>
                </div>

                {/* Duration chip */}
                <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/75 text-[10px] font-medium text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatFramesToTime(project.durationInFrames, project.fps)}
                </div>

                {/* Status badge */}
                <div className="absolute top-2.5 left-2.5">
                  {project.status === "rendering" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/15">
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      Rendering
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/15">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base truncate font-medium">
                  {project.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  Created {formatDateStr(project.createdAt)}
                </CardDescription>
              </CardHeader>

              <CardFooter className="p-4 pt-2 mt-0 border-t-0">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  {project.status === "rendering" ? "View Status" : "Open Editor"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Available Templates */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
              Available Templates
            </h2>
            <p className="text-xs text-muted-foreground">
              Select a pre-designed template to start generating your next video.
            </p>
          </div>
          <Link href="/dashboard/templates">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              View All Templates
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {template.category}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {template.aspectRatio}
                  </span>
                </div>
                <CardTitle className="text-base font-semibold">
                  {template.name}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatFramesToTime(template.durationInFrames, template.fps)}
                  </span>
                  <span>{template.fps} FPS</span>
                  <span>{template.scenes.length} scenes</span>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Link
                  href={`/create-video?template=${template.id}`}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 text-xs"
                  >
                    Use Template
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
