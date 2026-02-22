import { ArrowDownOutlined, ArrowUpOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, notification, Row, Spin, Statistic as AntStatistic, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import getRegistrationData from '../api/statistic/getRegistrationData';
import { Page } from '../components/Page';
import { RegistrationData, RegistrationStatistics } from '../types/registrationData';

const { Text } = Typography;

const CSV_HEADERS = [
    'tenant_name',
    'agency_name',
    'user_id',
    'date_register',
    'date_last_activity',
    'user_age',
    'user_gender',
    'registration_consulting_reason',
    'registration_consulting_topic',
    'registration_zip',
    'date_archived',
    'registration_referer',
    'activity_appointments',
    'activity_calls',
    'activity_messages',
];

const RANK_COLORS = ['#ffd700', '#c0c0c0', '#cd7f32'];

const escapeCsvField = (field: string): string => {
    if (field.includes(';') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
};

const toCsvRow = (entry: RegistrationStatistics): string[] => [
    entry.tenantName,
    entry.agencyName,
    entry.userId,
    entry.registrationDate,
    entry.dateLastActivity || '',
    entry.age != null ? entry.age.toString() : '',
    entry.gender || '',
    entry.counsellingRelation || '',
    entry.mainTopicInternalAttribute || '',
    entry.postalCode,
    entry.endDate,
    entry.referer ? decodeURI(entry.referer) : '',
    entry.appointmentsBookedCount != null ? entry.appointmentsBookedCount.toString() : '',
    entry.attendedVideoCallsCount != null ? entry.attendedVideoCallsCount.toString() : '',
    entry.consultantMessagesCount != null ? entry.consultantMessagesCount.toString() : '',
];

const formatTimestamp = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d}_${h}-${min}`;
};

type DownloadFilter = 'all' | 'currentMonth' | 'lastMonth' | 'currentYear' | 'lastYear';

const FILTER_SUFFIX: Record<DownloadFilter, string> = {
    all: '_alle',
    currentMonth: '_laufender_Monat',
    lastMonth: '_letzter_Monat',
    currentYear: '_laufendes_Jahr',
    lastYear: '_letztes_Jahr',
};

const downloadCsv = (data: RegistrationStatistics[], filter: DownloadFilter): void => {
    const rows = [CSV_HEADERS.join(';')];
    data.forEach((entry) => {
        rows.push(toCsvRow(entry).map(escapeCsvField).join(';'));
    });
    const csvContent = rows.join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
        'download',
        `Connecta_Statistics${FILTER_SUFFIX[filter]}_${formatTimestamp(new Date())}.csv`,
    );
    link.style.position = 'fixed';
    link.style.left = '-9999px';
    link.style.top = '-9999px';
    link.style.opacity = '0';
    document.body.appendChild(link);
    // Use requestAnimationFrame to ensure the link is rendered before clicking
    requestAnimationFrame(() => {
        link.click();
        // Delay cleanup to give the browser time to process the download
        setTimeout(() => {
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
            URL.revokeObjectURL(url);
        }, 3000);
    });
};

const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
};

const filterByDateRange = (data: RegistrationStatistics[], start: Date, end: Date): RegistrationStatistics[] => {
    return data.filter((entry) => {
        const d = parseDate(entry.registrationDate);
        return d && d >= start && d <= end;
    });
};

const getMonthRange = (year: number, month: number): [Date, Date] => {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
    return [start, end];
};

const getYearRange = (year: number): [Date, Date] => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);
    return [start, end];
};

export const Statistic = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [data, setData] = useState<RegistrationStatistics[]>([]);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setHasError(false);
        getRegistrationData()
            .then((response: RegistrationData) => {
                setData(response?.registrationStatistics || []);
            })
            .catch(() => {
                setData([]);
                setHasError(true);
                notification.error({
                    message: t('statistic.error.loadFailed'),
                    duration: 5,
                });
            })
            .finally(() => setIsLoading(false));
    }, [t]);

    const stats = useMemo(() => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDay = now.getDate();

        // Current month & year data
        const [cmStart, cmEnd] = getMonthRange(currentYear, currentMonth);
        const currentMonthData = filterByDateRange(data, cmStart, cmEnd);

        const [cyStart, cyEnd] = getYearRange(currentYear);
        const currentYearData = filterByDateRange(data, cyStart, cyEnd);

        // Previous month data up to the same day of month
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const [pmStart] = getMonthRange(prevMonthYear, prevMonth);
        const lastDayOfPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
        const pmEndSameDay = new Date(
            prevMonthYear,
            prevMonth,
            Math.min(currentDay, lastDayOfPrevMonth),
            23,
            59,
            59,
            999,
        );
        const prevMonthDataSameDay = filterByDateRange(data, pmStart, pmEndSameDay);

        // Current month up to today
        const cmEndToday = new Date(currentYear, currentMonth, currentDay, 23, 59, 59, 999);
        const currentMonthDataToday = filterByDateRange(data, cmStart, cmEndToday);

        // KPIs
        const newConsultationsMonth = currentMonthData.length;
        const newConsultationsYear = currentYearData.length;

        const messagesMonth = currentMonthData.reduce((sum, e) => sum + (e.consultantMessagesCount || 0), 0);
        const messagesYear = currentYearData.reduce((sum, e) => sum + (e.consultantMessagesCount || 0), 0);

        const videoCallsMonth = currentMonthData.reduce((sum, e) => sum + (e.attendedVideoCallsCount || 0), 0);
        const videoCallsYear = currentYearData.reduce((sum, e) => sum + (e.attendedVideoCallsCount || 0), 0);

        // Change vs previous month (same-day comparison)
        const currentCount = currentMonthDataToday.length;
        const prevCount = prevMonthDataSameDay.length;
        const changePercent =
            prevCount > 0 ? ((currentCount - prevCount) / prevCount) * 100 : currentCount > 0 ? 100 : 0;

        // Top 3 topics (unique users)
        const topicMap = new Map<string, Set<string>>();
        data.forEach((entry) => {
            const topic = entry.mainTopicInternalAttribute;
            if (topic) {
                if (!topicMap.has(topic)) topicMap.set(topic, new Set());
                topicMap.get(topic)!.add(entry.userId);
            }
        });
        const topTopics = Array.from(topicMap.entries())
            .map(([topic, users]) => ({ name: topic, count: users.size }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        // Top 3 agencies (unique users)
        const agencyMap = new Map<string, Set<string>>();
        data.forEach((entry) => {
            const agency = entry.agencyName;
            if (agency) {
                if (!agencyMap.has(agency)) agencyMap.set(agency, new Set());
                agencyMap.get(agency)!.add(entry.userId);
            }
        });
        const topAgencies = Array.from(agencyMap.entries())
            .map(([agency, users]) => ({ name: agency, count: users.size }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        return {
            newConsultationsMonth,
            newConsultationsYear,
            messagesMonth,
            messagesYear,
            videoCallsMonth,
            videoCallsYear,
            changePercent,
            currentCount,
            prevCount,
            topTopics,
            topAgencies,
        };
    }, [data]);

    const handleDownload = useCallback(
        (filter: DownloadFilter) => {
            if (isDownloading || data.length === 0) return;
            setIsDownloading(true);

            const now = new Date();
            let filtered: RegistrationStatistics[];

            switch (filter) {
                case 'currentMonth': {
                    const [start, end] = getMonthRange(now.getFullYear(), now.getMonth());
                    filtered = filterByDateRange(data, start, end);
                    break;
                }
                case 'lastMonth': {
                    const month = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
                    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
                    const [start, end] = getMonthRange(year, month);
                    filtered = filterByDateRange(data, start, end);
                    break;
                }
                case 'currentYear': {
                    const [start, end] = getYearRange(now.getFullYear());
                    filtered = filterByDateRange(data, start, end);
                    break;
                }
                case 'lastYear': {
                    const [start, end] = getYearRange(now.getFullYear() - 1);
                    filtered = filterByDateRange(data, start, end);
                    break;
                }
                default:
                    filtered = data;
            }

            downloadCsv(filtered, filter);
            // Re-enable after a short delay to prevent rapid double-clicks
            setTimeout(() => setIsDownloading(false), 1500);
        },
        [data, isDownloading],
    );

    const rankItemStyle = (isLast: boolean): React.CSSProperties => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
    });

    const rankBadgeStyle = (index: number): React.CSSProperties => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: RANK_COLORS[index],
        color: '#fff',
        fontSize: 12,
        fontWeight: 700,
        marginRight: 8,
    });

    return (
        <Page>
            <Page.Title titleKey="statistic.title" />

            {isLoading ? (
                <Row justify="center" style={{ padding: '48px 0' }}>
                    <Spin size="large" />
                </Row>
            ) : (
                <>
                    {/* KPI Cards */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={12} lg={8}>
                            <Card title={t('statistic.dashboard.newConsultations')}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <AntStatistic
                                            title={t('statistic.dashboard.month')}
                                            value={stats.newConsultationsMonth}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <AntStatistic
                                            title={t('statistic.dashboard.year')}
                                            value={stats.newConsultationsYear}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card title={t('statistic.dashboard.chatMessages')}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <AntStatistic
                                            title={t('statistic.dashboard.month')}
                                            value={stats.messagesMonth}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <AntStatistic
                                            title={t('statistic.dashboard.year')}
                                            value={stats.messagesYear}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card title={t('statistic.dashboard.videoCalls')}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <AntStatistic
                                            title={t('statistic.dashboard.month')}
                                            value={stats.videoCallsMonth}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <AntStatistic
                                            title={t('statistic.dashboard.year')}
                                            value={stats.videoCallsYear}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    {/* Change indicator + Rankings */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={12} lg={8}>
                            <Card title={t('statistic.dashboard.changeVsPrevMonth')}>
                                <AntStatistic
                                    value={stats.changePercent}
                                    precision={1}
                                    valueStyle={{
                                        color: stats.changePercent >= 0 ? '#3f8600' : '#cf1322',
                                    }}
                                    prefix={
                                        stats.changePercent >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
                                    }
                                    suffix="%"
                                />
                                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                                    {stats.currentCount} vs. {stats.prevCount} ({t('statistic.dashboard.newConsultations')})
                                </Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card title={t('statistic.dashboard.topTopics')}>
                                {stats.topTopics.length > 0 ? (
                                    stats.topTopics.map((topic, index) => (
                                        <div
                                            key={topic.name}
                                            style={rankItemStyle(index === stats.topTopics.length - 1)}
                                        >
                                            <span>
                                                <span style={rankBadgeStyle(index)}>{index + 1}</span>
                                                {topic.name}
                                            </span>
                                            <Text strong>{topic.count}</Text>
                                        </div>
                                    ))
                                ) : (
                                    <Text type="secondary">{t('statistic.dashboard.noData')}</Text>
                                )}
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card title={t('statistic.dashboard.topAgencies')}>
                                {stats.topAgencies.length > 0 ? (
                                    stats.topAgencies.map((agency, index) => (
                                        <div
                                            key={agency.name}
                                            style={rankItemStyle(index === stats.topAgencies.length - 1)}
                                        >
                                            <span>
                                                <span style={rankBadgeStyle(index)}>{index + 1}</span>
                                                {agency.name}
                                            </span>
                                            <Text strong>{agency.count}</Text>
                                        </div>
                                    ))
                                ) : (
                                    <Text type="secondary">{t('statistic.dashboard.noData')}</Text>
                                )}
                            </Card>
                        </Col>
                    </Row>

                    {/* Download Section */}
                    <Card title={t('statistic.download.title')}>
                        <Row gutter={[12, 12]}>
                            <Col>
                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload('all')}
                                    disabled={data.length === 0 || hasError}
                                    loading={isDownloading}
                                >
                                    {t('statistic.download.all')}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload('currentMonth')}
                                    disabled={data.length === 0 || hasError || isDownloading}
                                >
                                    {t('statistic.download.currentMonth')}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload('lastMonth')}
                                    disabled={data.length === 0 || hasError || isDownloading}
                                >
                                    {t('statistic.download.lastMonth')}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload('currentYear')}
                                    disabled={data.length === 0 || hasError || isDownloading}
                                >
                                    {t('statistic.download.currentYear')}
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload('lastYear')}
                                    disabled={data.length === 0 || hasError || isDownloading}
                                >
                                    {t('statistic.download.lastYear')}
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </>
            )}
        </Page>
    );
};
