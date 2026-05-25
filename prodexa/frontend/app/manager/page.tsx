'use client';

import {
    useEffect,
    useState,
} from 'react';

import Sidebar
    from '@/components/layout/Sidebar';

import {
    Users,
    FolderOpen,
    ShieldAlert,
    Activity,
    AlertTriangle,
} from 'lucide-react';

import {
    api,
} from '@/lib/api';
import DevAvatar from '@/components/project-detail/shared/DevAvatar';

interface ManagerData {

    kpis: {

        totalProjects: number;

        healthyProjects: number;

        highRiskProjects: number;

        totalDevelopers: number;
    };

    projects: any[];

    developers: any[];

    risks: any[];
}

export default function ManagerPage() {

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        activeTab,
        setActiveTab,
    ] = useState<
        'projects' |
        'developers' |
        'risks'
    >('projects');

    const [
        data,
        setData,
    ] = useState<ManagerData | null>(
        null,
    );

    async function loadManagerData() {

        try {

            const response =
                await api.manager.overview();

            setData(response);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {

        loadManagerData();

    }, []);

    const tabs = [

        {
            key: 'projects',
            label: 'Projects',
        },

        {
            key: 'developers',
            label: 'Developers',
        },

        {
            key: 'risks',
            label: 'Risks',
        },
    ];

    if (loading) {

        return (

            <div className="page-shell">

                <Sidebar />

                <main
                    className="main-content page-main"
                >

                    <div
                        style={{

                            display: 'flex',

                            alignItems: 'center',

                            justifyContent:
                                'center',

                            minHeight: '60vh',

                            fontSize: '1rem',

                            color:
                                'var(--text-secondary)',
                        }}
                    >
                        Loading Manager Dashboard...
                    </div>

                </main>

            </div>
        );
    }

    return (

        <div
            className="page-shell"
            style={{
                width: '100%',
                overflowX: 'hidden',
            }}
        >

            <Sidebar />

            <main
                className="
          main-content
          page-main
        "
                style={{

                    width: '100%',

                    minWidth: 0,

                    overflowX: 'hidden',

                    padding:
                        'clamp(0.75rem,2vw,1.5rem)',
                }}
            >

                {/* HEADER */}

                <div
                    style={{
                        marginBottom: '2rem',
                    }}
                >

                    <h1
                        style={{

                            fontSize:
                                'clamp(1.8rem,4vw,2.4rem)',

                            fontWeight: 800,

                            marginBottom: '0.5rem',

                            color:
                                'var(--text-primary)',
                        }}
                    >
                        Welcome back
                    </h1>

                    <p
                        style={{

                            color:
                                'var(--text-secondary)',

                            fontSize:
                                '0.96rem',
                        }}
                    >
                        AI-powered project intelligence
                    </p>

                </div>

                {/* KPI GRID */}

                <div
                    style={{

                        display: 'grid',

                        gridTemplateColumns:
                            'repeat(auto-fit,minmax(220px,1fr))',

                        gap: '1rem',

                        marginBottom: '2rem',

                        width: '100%',
                    }}
                >

                    <KpiCard
                        icon={<FolderOpen size={18} />}
                        label="Total Projects"
                        value={
                            data?.kpis.totalProjects || 0
                        }
                    />

                    <KpiCard
                        icon={<Activity size={18} />}
                        label="Healthy Projects"
                        value={
                            data?.kpis.healthyProjects || 0
                        }
                    />

                    <KpiCard
                        icon={<ShieldAlert size={18} />}
                        label="High Risk Projects"
                        value={
                            data?.kpis.highRiskProjects || 0
                        }
                    />

                    <KpiCard
                        icon={<Users size={18} />}
                        label="Total Developers"
                        value={
                            data?.kpis.totalDevelopers || 0
                        }
                    />

                </div>

                {/* TABS */}

                <div
                    style={{

                        display: 'flex',

                        gap: '0.75rem',

                        marginBottom: '1.5rem',

                        overflowX: 'auto',

                        width: '100%',

                        scrollbarWidth: 'none',

                        msOverflowStyle: 'none',

                        paddingBottom: 4,
                    }}
                >

                    {tabs.map((tab) => {

                        const active =
                            activeTab === tab.key;

                        return (

                            <button
                                key={tab.key}
                                onClick={() =>
                                    setActiveTab(
                                        tab.key as any,
                                    )
                                }
                                style={{

                                    border:
                                        active
                                            ? '1px solid var(--accent)'
                                            : '1px solid var(--border)',

                                    background:
                                        active
                                            ? 'var(--accent)'
                                            : 'var(--surface)',

                                    color:
                                        active
                                            ? '#fff'
                                            : 'var(--text-primary)',

                                    borderRadius: 14,

                                    padding:
                                        '0.8rem 1.2rem',

                                    minWidth: 120,

                                    fontWeight: 600,

                                    cursor: 'pointer',

                                    transition:
                                        'all 0.2s ease',

                                    whiteSpace: 'nowrap',

                                    flexShrink: 0,

                                    boxShadow:
                                        active
                                            ? '0 10px 25px var(--accent-glow)'
                                            : 'none',
                                }}
                            >

                                {tab.label}

                            </button>
                        );
                    })}

                </div>

                {/* PROJECTS */}

                {activeTab ===
                    'projects' && (

                        <div className="card">

                            {!data?.projects?.length ? (

                                <EmptyState
                                    text="No projects found"
                                />

                            ) : (

                                <div
                                    style={{
                                        overflowX: 'auto',
                                        width: '100%',
                                    }}
                                >

                                    <table
                                        style={{

                                            width: '100%',

                                            minWidth: 700,

                                            borderCollapse:
                                                'collapse',
                                        }}
                                    >

                                        <thead>

                                            <tr>

                                                <TableHead>
                                                    Project
                                                </TableHead>

                                                <TableHead>
                                                    Health
                                                </TableHead>

                                                <TableHead>
                                                    Risk
                                                </TableHead>

                                                <TableHead>
                                                    Developers
                                                </TableHead>

                                                <TableHead>
                                                    Status
                                                </TableHead>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {data.projects.map(
                                                (project) => (

                                                    <tr
                                                        key={project.id}
                                                    >

                                                        <TableCell>

                                                            <Badge
                                                                color={
                                                                    project.healthScore >= 70
                                                                        ? 'green'
                                                                        : project.healthScore >= 40
                                                                            ? 'yellow'
                                                                            : 'red'
                                                                }
                                                            >
                                                                {
                                                                    project.healthScore
                                                                }
                                                            </Badge>

                                                        </TableCell>

                                                        <TableCell>

                                                            <Badge
                                                                color={
                                                                    project.risk === 'High'
                                                                        ? 'red'
                                                                        : 'green'
                                                                }
                                                            >
                                                                {project.risk}
                                                            </Badge>

                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                project.developersCount
                                                            }
                                                        </TableCell>

                                                        <TableCell>

                                                            <Badge color="blue">
                                                                {
                                                                    project.status
                                                                }
                                                            </Badge>

                                                        </TableCell>

                                                    </tr>

                                                ),
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>
                    )}

                {/* DEVELOPERS */}

                {activeTab ===
                    'developers' && (

                        <div className="card">

                            {!data?.developers?.length ? (

                                <EmptyState
                                    text="No developers found"
                                />

                            ) : (

                                <div
                                    style={{
                                        overflowX: 'auto',
                                        width: '100%',
                                    }}
                                >

                                    <table
                                        style={{

                                            width: '100%',

                                            minWidth: 700,

                                            borderCollapse:
                                                'collapse',
                                        }}
                                    >

                                        <thead>

                                            <tr>

                                                <TableHead>
                                                    Developer
                                                </TableHead>

                                                <TableHead>
                                                    Projects
                                                </TableHead>

                                                <TableHead>
                                                    Commits
                                                </TableHead>

                                                <TableHead>
                                                    Avg Productivity
                                                </TableHead>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {data.developers.map(
                                                (developer) => (

                                                    <tr
                                                        key={
                                                            developer.developerLogin
                                                        }
                                                    >

                                                        <TableCell>

                                                            <div
                                                                style={{

                                                                    display: 'flex',

                                                                    alignItems: 'center',

                                                                    gap: '0.75rem',

                                                                    minWidth: 180,
                                                                }}
                                                            >

                                                                <DevAvatar
                                                                    login={
                                                                        developer.developerLogin
                                                                    }
                                                                />

                                                                <div
                                                                    style={{
                                                                        minWidth: 0,
                                                                    }}
                                                                >

                                                                    <div
                                                                        style={{

                                                                            fontWeight: 600,

                                                                            color:
                                                                                'var(--text-primary)',

                                                                            overflow: 'hidden',

                                                                            textOverflow:
                                                                                'ellipsis',

                                                                            whiteSpace: 'nowrap',
                                                                        }}
                                                                    >
                                                                        {
                                                                            developer.developerLogin
                                                                        }
                                                                    </div>

                                                                    <div
                                                                        style={{

                                                                            fontSize: '0.78rem',

                                                                            color:
                                                                                'var(--text-secondary)',
                                                                        }}
                                                                    >
                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                developer.projectsCount
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                developer.totalCommits
                                                            }
                                                        </TableCell>

                                                        <TableCell>

                                                            <Badge
                                                                color={
                                                                    developer.averageProductivity >= 70
                                                                        ? 'green'
                                                                        : developer.averageProductivity >= 40
                                                                            ? 'yellow'
                                                                            : 'red'
                                                                }
                                                            >
                                                                {
                                                                    developer.averageProductivity
                                                                }
                                                            </Badge>

                                                        </TableCell>

                                                    </tr>

                                                ),
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>
                    )}

                {/* RISKS */}

                {activeTab ===
                    'risks' && (

                        <div
                            style={{

                                display: 'flex',

                                flexDirection: 'column',

                                gap: '1rem',
                            }}
                        >

                            {!data?.risks?.length ? (

                                <EmptyState
                                    text="No risks detected"
                                />

                            ) : (

                                data.risks.map(
                                    (
                                        risk,
                                        index,
                                    ) => (

                                        <div
                                            key={index}
                                            className="card"
                                            style={{

                                                border:
                                                    '1px solid rgba(239,68,68,0.25)',

                                                display: 'flex',

                                                alignItems: 'flex-start',

                                                gap: '1rem',
                                            }}
                                        >

                                            <div
                                                style={{

                                                    width: 42,

                                                    height: 42,

                                                    borderRadius: 12,

                                                    background:
                                                        'rgba(239,68,68,0.12)',

                                                    display: 'flex',

                                                    alignItems: 'center',

                                                    justifyContent:
                                                        'center',

                                                    flexShrink: 0,
                                                }}
                                            >

                                                <AlertTriangle
                                                    size={18}
                                                    color="#ef4444"
                                                />

                                            </div>

                                            <div>

                                                <div
                                                    style={{

                                                        fontWeight: 700,

                                                        marginBottom:
                                                            '0.35rem',

                                                        color:
                                                            'var(--text-primary)',
                                                    }}
                                                >
                                                    {risk.title}
                                                </div>

                                                <div
                                                    style={{

                                                        color:
                                                            'var(--text-secondary)',

                                                        lineHeight: 1.7,
                                                    }}
                                                >
                                                    {risk.message}
                                                </div>

                                            </div>

                                        </div>

                                    ),
                                )

                            )}

                        </div>
                    )}

            </main>

        </div>
    );
}

function KpiCard({
    icon,
    label,
    value,
}: any) {

    return (

        <div
            className="card"
            style={{

                transition:
                    'all 0.25s ease',

                cursor: 'default',
            }}
        >

            <div
                style={{

                    display: 'flex',

                    alignItems: 'center',

                    justifyContent:
                        'space-between',

                    marginBottom: '1rem',

                    color:
                        'var(--accent)',
                }}
            >

                {icon}

            </div>

            <div
                style={{

                    fontSize:
                        'clamp(1.8rem,4vw,2.4rem)',

                    fontWeight: 800,

                    marginBottom: '0.35rem',

                    color:
                        'var(--text-primary)',
                }}
            >
                {value}
            </div>

            <div
                style={{

                    color:
                        'var(--text-secondary)',

                    fontSize: '0.92rem',
                }}
            >
                {label}
            </div>

        </div>
    );
}

function TableHead({
    children,
}: any) {

    return (

        <th
            style={{

                textAlign: 'left',

                padding:
                    '1rem 0.75rem',

                borderBottom:
                    '1px solid var(--border)',

                color:
                    'var(--text-secondary)',

                fontSize: '0.85rem',

                fontWeight: 600,

                whiteSpace: 'nowrap',
            }}
        >
            {children}
        </th>
    );
}

function TableCell({
    children,
}: any) {

    return (

        <td
            style={{

                padding:
                    '1rem 0.75rem',

                borderBottom:
                    '1px solid var(--border)',

                color:
                    'var(--text-primary)',

                whiteSpace: 'nowrap',
            }}
        >
            {children}
        </td>
    );
}

function Badge({
    children,
    color,
}: any) {

    const colors: any = {

        green: {

            bg:
                'rgba(34,197,94,0.12)',

            text:
                '#22c55e',
        },

        red: {

            bg:
                'rgba(239,68,68,0.12)',

            text:
                '#ef4444',
        },

        yellow: {

            bg:
                'rgba(245,158,11,0.12)',

            text:
                '#f59e0b',
        },

        blue: {

            bg:
                'rgba(59,130,246,0.12)',

            text:
                '#3b82f6',
        },
    };

    return (

        <span
            style={{

                display: 'inline-flex',

                alignItems: 'center',

                justifyContent: 'center',

                padding:
                    '0.35rem 0.7rem',

                borderRadius: 999,

                fontSize: '0.8rem',

                fontWeight: 700,

                background:
                    colors[color].bg,

                color:
                    colors[color].text,
            }}
        >
            {children}
        </span>
    );
}

function EmptyState({
    text,
}: any) {

    return (

        <div
            style={{

                display: 'flex',

                alignItems: 'center',

                justifyContent: 'center',

                minHeight: 220,

                color:
                    'var(--text-secondary)',

                textAlign: 'center',
            }}
        >
            {text}
        </div>
    );
}