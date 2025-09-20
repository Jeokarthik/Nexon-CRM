import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { salesPerformanceData } from '../data';
import { Deal, Lead, Task, DealStatus } from '../types';
import { SalesIcon, VisitorsIcon, RefundsIcon } from './icons';

interface DashboardProps {
    deals: Deal[];
    leads: Lead[];
    tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ deals, leads, tasks }) => {
    const gridColor = '#e5e7eb';
    const textColor = '#6b7280';
    const line1Color = '#1f2937';
    const line2Color = '#9ca3af';
    const barColor = '#1f2937';
    
    const tooltipStyle = {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        color: '#1f2937',
        borderRadius: '12px',
    };

    const totalRevenue = deals.filter(d => d.status === DealStatus.ClosedWon).reduce((sum, deal) => sum + deal.value, 0);
    const dealsInProgress = deals.filter(d => d.status === DealStatus.Negotiation || d.status === DealStatus.Proposal).length;
    const newLeadsCount = leads.filter(l => l.status === 'New').length;

    const leadSourceData = leads.reduce((acc, lead) => {
        const source = lead.source;
        const existing = acc.find(item => item.name === source);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: source, value: 1 });
        }
        return acc;
    }, [] as { name: string; value: number }[]);
    const totalLeadSources = leads.length;

    const dealFunnelData = [
        { name: 'New', count: deals.filter(d => d.status === DealStatus.New).length },
        { name: 'Proposal', count: deals.filter(d => d.status === DealStatus.Proposal).length },
        { name: 'Negotiation', count: deals.filter(d => d.status === DealStatus.Negotiation).length },
        { name: 'Won', count: deals.filter(d => d.status === DealStatus.ClosedWon).length },
    ];
    
    const tasksOverviewData = [
        { name: 'Completed', value: tasks.filter(t => t.completed).length },
        { name: 'Pending', value: tasks.filter(t => !t.completed).length },
    ];
    const totalTasks = tasks.length;

    const COLORS = ['#1f2937', '#6b7280', '#d1d5db', '#9ca3af'];
    const TASK_COLORS = ['#22c55e', '#f97316'];

    const SummaryCard: React.FC<{ title: string; value: string; percentage: string; icon: React.ReactNode; isHighlighted?: boolean; }> = ({ title, value, percentage, icon, isHighlighted = false }) => (
        <div className={`${isHighlighted ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg ${isHighlighted ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {icon}
                </div>
                 <span className={`text-sm font-semibold ${percentage.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{percentage}</span>
            </div>
            <p className="mt-4 text-sm text-gray-400">{title}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
        </div>
    );
    
    // FIX: Changed children prop type from React.ReactNode to React.ReactElement to match what ResponsiveContainer expects.
    const ChartContainer: React.FC<{ title: string; children: React.ReactElement }> = ({ title, children }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">{title}</h2>
            <div style={{width: '100%', height: 300}}>
                <ResponsiveContainer>
                    {children}
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <SummaryCard title="Total Sales" value={`$${totalRevenue.toLocaleString()}`} percentage="+15.4%" icon={<SalesIcon />} isHighlighted />
                <SummaryCard title="Visitors" value={newLeadsCount.toString()} percentage="+12.7%" icon={<VisitorsIcon />} />
                <SummaryCard title="Refunds" value={deals.filter(d => d.status === DealStatus.ClosedLost).length.toString()} percentage="-12.7%" icon={<RefundsIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartContainer title="Sales Performance">
                    <LineChart data={salesPerformanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis dataKey="name" stroke={textColor} fontSize={12} />
                        <YAxis stroke={textColor} fontSize={12} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend iconType="circle" iconSize={8} />
                        <Line type="monotone" dataKey="Sales" stroke={line1Color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="LastYear" stroke={line2Color} strokeWidth={2} strokeDasharray="3 3" />
                    </LineChart>
                </ChartContainer>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Lead Sources</h2>
                    <div className="relative" style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" nameKey="name">
                                    {leadSourceData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend iconType="circle" iconSize={8} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-bold text-gray-800">{totalLeadSources}</span>
                            <span className="text-sm text-gray-500">Total Leads</span>
                        </div>
                    </div>
                </div>


                <ChartContainer title="Deal Funnel">
                     <BarChart data={dealFunnelData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false}/>
                        <XAxis type="number" stroke={textColor} fontSize={12} />
                        <YAxis type="category" dataKey="name" stroke={textColor} fontSize={12} width={80} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="count" fill={barColor} radius={[0, 8, 8, 0]} barSize={25} />
                    </BarChart>
                </ChartContainer>

                 <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Tasks Overview</h2>
                    <div className="relative" style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={tasksOverviewData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" nameKey="name">
                                    {tasksOverviewData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={TASK_COLORS[index % TASK_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend iconType="circle" iconSize={8} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-bold text-gray-800">{totalTasks}</span>
                            <span className="text-sm text-gray-500">Total Tasks</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;