// @ts-nocheck
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { User, UserCog, GraduationCap, Shield } from 'lucide-react';
import React from 'react';

const DiagramCard = ({ icon: Icon, title, className, iconClassName }) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex flex-col items-center justify-center gap-2 w-36 h-36", className)}>
    <Icon className={cn("w-10 h-10", iconClassName)} />
    <span className="font-semibold">{title}</span>
  </div>
);

const ModuleCard = ({ title }) => (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex items-center justify-center w-36 h-16">
        <span className="font-semibold">{title}</span>
    </div>
)

const Arrow = ({ from, to, toSide, fromSide, straight, className }) => {
    const positions = {
        top: 'top-0 -translate-y-1/2',
        bottom: 'bottom-0 translate-y-1/2',
        left: 'left-0 -translate-x-1/2',
        right: 'right-0 translate-x-1/2',
    }
    return (
      <div className={cn("absolute", className)} style={{ left: from.x, top: from.y, width: Math.abs(to.x - from.x), height: Math.abs(to.y - from.y) }}>
         <svg className="absolute w-full h-full" preserveAspectRatio="none">
            <line x1={from.x < to.x ? 0 : '100%'} y1={from.y < to.y ? 0 : '100%'} x2={to.x > from.x ? '100%' : 0} y2={to.y > from.y ? '100%' : 0} stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        </svg>
      </div>
    );
};


const CommunicationFlowPage = () => {
  return (
    <>
      <PageHeader
        title="Communication Flow"
        description="This diagram illustrates the school management communication system."
      />
      <Card className="p-8 relative min-h-[800px] flex items-center justify-center">
        <div className="grid grid-cols-3 gap-x-24 gap-y-16 items-center">
            {/* Row 1 */}
            <DiagramCard icon={GraduationCap} title="Student" className="border-blue-500" iconClassName="text-blue-500"/>
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                    <ModuleCard title="Lessons"/>
                    <ModuleCard title="Payments"/>
                </div>
            </div>
            <DiagramCard icon={User} title="Teacher" className="border-orange-500" iconClassName="text-orange-500"/>
            
            {/* Row 2 */}
            <div />
            <div className="flex justify-center">
                <ModuleCard title="Communication"/>
            </div>
            <div />
            
            {/* Row 3 */}
            <DiagramCard icon={UserCog} title="Parent" className="border-gray-500" iconClassName="text-gray-500"/>
            <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                    <ModuleCard title="Payments"/>
                    <ModuleCard title="Attendance"/>
                </div>
            </div>
            <DiagramCard icon={Shield} title="Admin" className="border-gray-500" iconClassName="text-gray-500"/>
        </div>

        {/* This is a simplified representation of lines. A proper library or more complex SVG would be better for production. */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" />
                </marker>
            </defs>
            
            {/* Student to Lessons */}
            <path d="M 230 150 C 230 200, 320 200, 320 200" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            {/* Student from Lessons */}
            <path d="M 320 232 C 320 282, 230 282, 230 282" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            
            {/* Teacher to Payments */}
            <path d="M 700 282 C 600 282, 530 282, 530 282" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            {/* Teacher to Lessons */}
            <path d="M 700 200 C 600 200, 530 200, 530 200" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="2" markerEnd="url(#arrowhead)"/>
            
            {/* Communication to Lessons/Payments */}
            <line x1="425" y1="232" x2="425" y2="330" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
            <line x1="350" y1="232" x2="350" y2="330" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
            
            {/* Communication to Parent/Admin Payments/Attendance */}
            <line x1="425" y1="462" x2="425" y2="560" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
            <line x1="505" y1="462" x2="505" y2="560" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />

            {/* Communication Hub connections */}
            <line x1="230" y1="400" x2="380" y2="400" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
            <line x1="570" y1="400" x2="700" y2="400" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
            
            {/* Parent to Communication */}
            <path d="M 230 480 C 230 420, 380 420, 380 420" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="2" markerEnd="url(#arrowhead)"/>

            {/* Parent from Payments */}
            <path d="M 320 592 C 320 642, 230 642, 230 642" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="2" markerEnd="url(#arrowhead)"/>

            {/* Admin from Attendance */}
            <path d="M 530 592 C 600 592, 700 592, 700 592" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="2" markerEnd="url(#arrowhead)"/>

            {/* Admin to Communication */}
            <path d="M 700 480 C 700 420, 570 420, 570 420" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="2" markerEnd="url(#arrowhead)"/>

            {/* Teacher to communication */}
             <path d="M 570 345 C 650 345, 650 282, 700 282" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="2" markerStart="url(#arrowhead)"/>

        </svg>
      </Card>
    </>
  );
};

export default CommunicationFlowPage;
