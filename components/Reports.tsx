import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Deal, Lead, DealStatus } from '../types';

interface ReportsProps {
    deals: Deal[];
    leads: Lead[];
}

const Reports: React.FC<ReportsProps> = ({ deals, leads }) => {
    const gridColor = '#e5e7eb';
    const textColor = '#6b7280';
    
    const tooltipStyle = {
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        color: '#1f2937',
        borderRadius: '12px',
    };

    // Data for Deal Value by Status Pie Chart
    const dealValueByStatus = deals
        .filter(d => d.status !== DealStatus.ClosedWon && d.status !== DealStatus.ClosedLost)
        .reduce((acc, deal) => {
            const status = deal.status;
            acc[status] = (acc[status] || 0) + deal.value;
            return acc;
        }, {} as Record<string, number>);

    const dealValueData = Object.keys(dealValueByStatus).map(status => ({
        name: status,
        value: dealValueByStatus[status],
    }));

    // Data for Lead Conversion Funnel Bar Chart
    const leadConversionData = [
        { name: 'New', count: leads.filter(l => l.status === 'New').length },
        { name: 'Contacted', count: leads.filter(l => l.status === 'Contacted').length },
        { name: 'Qualified', count: leads.filter(l => l.status === 'Qualified').length },
        { name: 'Won', count: deals.filter(d => d.status === DealStatus.ClosedWon).length }, // Assuming won deals come from qualified leads
    ];
    
    // Data for Monthly Sales Performance (Won vs. Lost by Value)
    const monthlyPerformance = deals
        .filter(d => d.status === DealStatus.ClosedWon || d.status === DealStatus.ClosedLost)
        .reduce((acc, deal) => {
            const month = new Date(deal.closeDate).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!acc[month]) {
                acc[month] = { name: month, Won: 0, Lost: 0 };
            }
            if (deal.status === DealStatus.ClosedWon) {
                acc[month].Won += deal.value;
            } else {
                acc[month].Lost += deal.value;
            }
            return acc;
        }, {} as Record<string, { name: string; Won: number; Lost: number }>);
    
    const monthlyPerformanceData = Object.values(monthlyPerformance).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    // Data for Lead Source Effectiveness
    const leadSources = leads.reduce((acc, lead) => {
        const source = lead.source;
        if (!acc[source]) {
            acc[source] = { name: source, "Total Leads": 0, "Converted Leads": 0 };
        }
        acc[source]["Total Leads"]++;
        
        const wonDeal = deals.find(deal => deal.contactName === lead.name && deal.status === DealStatus.ClosedWon);
        if (wonDeal) {
            acc[source]["Converted Leads"]++;
        }
        
        return acc;
    }, {} as Record<string, { name: string; "Total Leads": number; "Converted Leads": number }>);

    const leadSourceEffectivenessData = Object.values(leadSources);
    
    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-900 sr-only md:not-sr-only">Reports & Analytics</h1>

            <div className="flex flex-wrap gap-4 mb-8">
                <select 
                    className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
                    aria-label="Filter by date range"
                >
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>This Year</option>
                    <option>All Time</option>
                </select>
                <select 
                    className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
                    aria-label="Filter by team"
                >
                    <option>All Teams</option>
                    <option>Sales Team A</option>
                    <option>Sales Team B</option>
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-medium mb-4 text-gray-900">Deal Value in Pipeline</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dealValueData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                            >
                                {dealValueData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip
                                contentStyle={tooltipStyle}
                                wrapperClassName="!border-none shadow-lg rounded-xl"
                                formatter={(value: number) => `$${value.toLocaleString()}`}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-medium mb-4 text-gray-900">Lead Conversion Funnel</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={leadConversionData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis type="number" stroke={textColor} />
                            <YAxis type="category" dataKey="name" stroke={textColor} width={80} />
                            <Tooltip
                                contentStyle={tooltipStyle}
                                wrapperClassName="!border-none shadow-lg rounded-xl"
                            />
                            <Legend />
                            <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-medium mb-4 text-gray-900">Monthly Sales Performance</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyPerformanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis dataKey="name" stroke={textColor} fontSize={12} />
                            <YAxis stroke={textColor} fontSize={12} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                            <Tooltip
                                contentStyle={tooltipStyle}
                                formatter={(value: number) => `$${value.toLocaleString()}`}
                            />
                            <Legend />
                            <Bar dataKey="Won" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Lost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-medium mb-4 text-gray-900">Lead Source Effectiveness</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={leadSourceEffectivenessData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis dataKey="name" stroke={textColor} fontSize={12} />
                            <YAxis stroke={textColor} fontSize={12} />
                            <Tooltip
                                contentStyle={tooltipStyle}
                            />
                            <Legend />
                            <Bar dataKey="Total Leads" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Converted Leads" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;