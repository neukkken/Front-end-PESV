import React, { useState, useEffect } from "react";
import ReactECharts from 'echarts-for-react';
import { useAdmin } from "../../context/AdminContext";
import {
    Car, Loader2, AlertCircle, ChevronRight,
    Users, ClipboardCheck, Truck,
    MapPin, Activity, Calendar, FileText,
    CheckCircle, CreditCardIcon, XCircle, Clock,
    CircleAlert,
    DownloadIcon
} from "lucide-react";
import { exportExcel } from "../../utils/exportExcel";

const Dashboard = () => {
    const { getDashBoardData } = useAdmin();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('today');



    // Paleta de colores mejorada
    const colors = {
        primary: '#165a31',      // Verde principal
        greenLight: '#28a745',   // Verde claro
        greenDark: '#0f3d21',    // Verde oscuro
        blue: '#1e88e5',         // Azul
        orange: '#fd7e14',       // Naranja
        red: '#dc3545',          // Rojo
        purple: '#6f42c1',       // Morado
        teal: '#20c997',         // Verde azulado
        yellow: '#ffc107',       // Amarillo
        pink: '#e83e8c',         // Rosado
        cyan: '#17a2b8'          // Cyan
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getDashBoardData();
                setData(res.data);
            } catch (err) {
                setError("Error al cargar los datos del dashboard");
           
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleExport = () => {
        exportExcel(data.resposeFormsPre, null, 'reporte_respuestas.xlsx');
    };

    // Estilo base para los gráficos
    const chartStyle = {
        height: '400px',
        width: '100%'
    };

    // Filtrado de formularios por rango de tiempo
    const filterFormsByTime = (forms) => {
        if (!forms) return [];

        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));

        return forms.filter(form => {
            const formDate = new Date(form.fechaRespuesta);

            switch (timeRange) {
                case 'today': return formDate >= today;
                case 'week': return formDate >= new Date(today.setDate(today.getDate() - 7));
                case 'month': return formDate >= new Date(today.setMonth(today.getMonth() - 1));
                default: return true;
            }
        });
    };

    // 1. Gráfico de estado general de formularios (con tooltip centrado)
    const getFormsStatusChart = () => {
        const filteredForms = filterFormsByTime(data?.resposeFormsPre);

        const statusCount = filteredForms.reduce((acc, form) => {
            acc[form.estadoFormulario] = (acc[form.estadoFormulario] || 0) + 1;
            return acc;
        }, {});

        return {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
                position: ['50%', '50%'] // Centrar el tooltip
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'center',
                data: Object.keys(statusCount)
            },
            series: [{
                name: 'Estado de Formularios',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['40%', '50%'], // Ajustar posición para el tooltip centrado
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 5,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold',
                        formatter: '{b}\n{c} ({d}%)'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {
                        value: statusCount['operativo'] || 0,
                        name: 'Operativo',
                        itemStyle: { color: colors.greenLight }
                    },
                    {
                        value: statusCount['en_revision'] || 0,
                        name: 'En Revisión',
                        itemStyle: { color: colors.orange }
                    },
                    {
                        value: statusCount['no_aplica'] || 0,
                        name: 'No aplica',
                        itemStyle: { color: colors.blue }
                    },
                    {
                        value: statusCount['no_reporta'] || 0,
                        name: 'No Reporta',
                        itemStyle: { color: colors.red },

                    },
                    {
                        value: statusCount['revisado_corregido'] || 0,
                        name: 'Revisado y Corregido',
                        itemStyle: { color: colors.teal }
                    }
                ].filter(item => item.value > 0)
            }]
        };
    };

    // 2. Gráfico de vehículos por servicio
    const getVehiclesByServiceChart = () => ({
    
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: data?.responseeEstadisticasVehiculos?.vehiculosPorServicio?.map(v => v._id) || []
        },
        yAxis: { type: 'value' },
        series: [{
            name: 'Vehículos',
            type: 'bar',
            barWidth: '60%',
            data: data?.responseeEstadisticasVehiculos?.vehiculosPorServicio?.map((v, i) => ({
                value: v.cantidad,
                itemStyle: {
                    color: [colors.primary, colors.blue, colors.teal][i % 3]
                }
            })) || []
        }]
    });

    

    // 3. Gráfico de vehículos por zona
    const getVehiclesByZoneChart = () => ({
        tooltip: { trigger: 'item' },
        series: [{
            name: 'Vehículos por Zona',
            type: 'pie',
            radius: ['40%', '70%'],
            data: data?.responseeEstadisticasVehiculos?.vehiculosPorZona?.map((zone, i) => ({
                value: zone.cantidad,
                name: zone.zona,
                itemStyle: {
                    color: [colors.primary, colors.purple, colors.cyan][i % 3]
                }
            })) || []
        }]
    });

    // 4. Gráfico de vehículos por actividad
    const getVehiclesByActivityChart = () => ({
        tooltip: { trigger: 'item' },
        series: [{
            name: 'Vehículos por Actividad',
            type: 'pie',
            radius: ['40%', '70%'],
            roseType: 'radius',
            data: data?.responseeEstadisticasVehiculos?.vehiculosPorActividad?.map((act, i) => ({
                value: act.cantidad,
                name: act.actividad,
                itemStyle: {
                    color: [colors.greenLight, colors.yellow, colors.pink][i % 3]
                }
            })) || []
        }]
    });

    // 5. Gráfico de usuarios por cargo
    const getUsersByRoleChart = () => {
        const rolesCount = data?.responseUsers?.reduce((acc, user) => {
            const role = user.idCargo?.name || 'Sin cargo';
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {}) || {};

        return {
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: Object.keys(rolesCount),
                axisLabel: { rotate: 30 }
            },
            yAxis: { type: 'value' },
            series: [{
                type: 'bar',
                barWidth: '60%',
                data: Object.entries(rolesCount).map(([role, count], i) => ({
                    value: count,
                    name: role,
                    itemStyle: {
                        color: [colors.primary, colors.blue, colors.teal, colors.purple][i % 4]
                    }
                }))
            }]
        };
    };

    // 6. Gráfico de tipos de licencia
    const getLicenseTypesChart = () => {
        const licensesCount = data?.responseUsers?.reduce((acc, user) => {
            const license = user.tipoLicencia || 'Sin licencia';
            acc[license] = (acc[license] || 0) + 1;
            return acc;
        }, {}) || {};

        return {
            tooltip: { trigger: 'item' },
            series: [{
                name: 'Tipos de Licencia',
                type: 'pie',
                radius: ['40%', '70%'],
                roseType: 'area',
                data: Object.entries(licensesCount).map(([license, count], i) => ({
                    value: count,
                    name: license,
                    itemStyle: {
                        color: [colors.primary, colors.orange, colors.blue, colors.pink][i % 4]
                    }
                }))
            }]
        };
    };

    const getFormsTimelineChart = () => {
        const agrupados = data?.responseEstadisticasFormularios?.formulariosAgrupados ?? [];

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                data: ['Operativo', 'En Revisión', 'No aplica', 'No Reporta', 'Revisado Corregido'],
                bottom: 10
            },
            xAxis: {
                type: 'category',
                data: agrupados.map(f =>
                    new Date(f.fecha).toISOString().split("T")[0]
                )
            },
            yAxis: { type: 'value' },
            series: [
                {
                    name: 'Operativo',
                    type: 'line',
                    smooth: true,
                    data: agrupados.map(f => f.formulariosOperativos),
                    itemStyle: { color: colors.greenDark },
                    lineStyle: { width: 3 },
                    symbolSize: 8,
                    areaStyle: { opacity: 0.1, color: colors.greenDark }
                },
                {
                    name: 'En Revisión',
                    type: 'line',
                    smooth: true,
                    data: agrupados.map(f => f.formulariosEnRevision),
                    itemStyle: { color: colors.orange },
                    lineStyle: { width: 3 },
                    symbolSize: 8,
                    areaStyle: { opacity: 0.1, color: colors.orange }
                },
                {
                    name: 'No aplica',
                    type: 'line',
                    smooth: true,
                    data: agrupados.map(f => f.formulariosNoAplica),
                    itemStyle: { color: colors.blue },
                    lineStyle: { width: 3 },
                    symbolSize: 8,
                    areaStyle: { opacity: 0.1, color: colors.blue }
                },
                {
                    name: 'No Reporta',
                    type: 'line',
                    smooth: true,
                    data: agrupados.map(f => f.formulariosNoReporta),
                    itemStyle: { color: colors.red },
                    lineStyle: { width: 3 },
                    symbolSize: 8,
                    areaStyle: { opacity: 0.1, color: colors.red }
                },
                {
                    name: 'Revisado Corregido',
                    type: 'line',
                    smooth: true,
                    data: agrupados.map(f => f.formulariosRevisadosCorregidos),
                    itemStyle: { color: colors.greenLight },
                    lineStyle: { width: 3 },
                    symbolSize: 8,
                    areaStyle: { opacity: 0.1, color: colors.greenLight }
                }
            ]
        };
    };



    // 8. Gráfico de completitud por actividad
    const getActivityCompletionChart = () => {
        const chartData = data?.obtenerEstadisticasPorActividad?.detallePorActividad || [];

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function (params) {
                    const dataIndex = params[0].dataIndex;
                    const item = chartData[dataIndex];
                    return `
            <strong>${item.actividad}</strong><br/>
            Finalizados: ${item.completados}<br/>
            Pendientes: ${item.faltantes}<br/>
            Avance: ${item.porcentajeCompletados}%
          `;
                }
            },
            legend: {
                data: ['Finalizados', 'Pendientes'],
                bottom: 10
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: chartData.map(item => item.actividad),
                axisLabel: {
                    rotate: 30,
                    interval: 0,
                    fontSize: 12
                }
            },
            yAxis: {
                type: 'value',
                name: 'Vehículos',
            },
            series: [
                {
                    name: 'Finalizados',
                    type: 'bar',
                    barWidth: '40%',
                    data: chartData.map(item => item.completados),
                    itemStyle: {
                        color: colors.greenLight,
                        borderRadius: [4, 4, 0, 0]
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}'
                    }
                },
                {
                    name: 'Pendientes',
                    type: 'bar',
                    barWidth: '40%',
                    data: chartData.map(item => item.faltantes),
                    itemStyle: {
                        color: colors.orange,
                        borderRadius: [4, 4, 0, 0]
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}'
                    }
                }
            ]
        };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin w-10 h-10" style={{ color: colors.primary }} />
                <p className="ml-3 text-lg">Cargando dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <AlertCircle className="w-10 h-10 text-red-500" />
                <p className="ml-3 text-lg text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>/Pesv</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium">Dashboard</span>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>
                    Dashboard Operacional
                </h1>
                <button onClick={handleExport} className="px-3 py-1 rounded-md transition-colors bg-white text-gray-700 flex hover:bg-gray-100 hover:text-text gap-2"><DownloadIcon />Consolidado de formularios</button>
            </div>

            {/* Cards de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        icon: <Truck />,
                        title: 'Vehículos y Equipos totales',
                        value: data?.responseeEstadisticasVehiculos?.totalVehiculos || 0,
                        color: colors.primary
                    },
                    {
                        icon: <Activity />,
                        title: 'Vehículos y Equipos activos',
                        value: data?.responseeEstadisticasVehiculos?.vehiculosEnUso || 0,
                        color: colors.greenLight
                    },
                    {
                        icon: <CircleAlert />,
                        title: 'Vehículos y Equipos Inactivos',
                        value: data?.responseeEstadisticasVehiculos?.vehiculosInactivos || 0,
                        color: colors.red
                    },
                    {
                        icon: <Users />,
                        title: 'Usuarios',
                        value: data?.responseUsers?.length || 0,
                        color: colors.blue
                    },
                ].map((card, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center">
                            <div
                                className="p-3 rounded-full mr-4"
                                style={{ backgroundColor: `${card.color}20` }}
                            >
                                {React.cloneElement(card.icon, { style: { color: card.color } })}
                            </div>
                            <div>
                                <p className="text-gray-600">{card.title}</p>
                                <p className="text-2xl font-bold" style={{ color: card.color }}>
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mb-6">
                {['today', 'week', 'month'].map((range) => (
                    <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-3 py-1 rounded-md transition-colors ${timeRange === range ? 'text-white' : 'bg-white text-gray-700'
                            }`}
                        style={{
                            backgroundColor: timeRange === range ? colors.primary : '',
                            border: timeRange === range ? 'none' : '1px solid #e5e7eb'
                        }}
                    >
                        {range === 'today' ? 'Hoy' : range === 'week' ? '7 días' : '30 días'}
                    </button>
                ))}
            </div>

            {/* Gráficos principales */}
            <div className="space-y-6">
                {/* Fila 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center mb-4">
                            <ClipboardCheck className="mr-2" style={{ color: colors.primary }} />
                            <h2 className="text-lg font-semibold">Estado de Formularios</h2>
                        </div>
                        <ReactECharts
                            option={getFormsStatusChart()}
                            style={chartStyle}
                            theme="light"
                        />
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center mb-4">
                            <Truck className="mr-2" style={{ color: colors.primary }} />
                            <h2 className="text-lg font-semibold">Vehículos por Servicio</h2>
                        </div>
                        <ReactECharts
                            option={getVehiclesByServiceChart()}
                            style={chartStyle}
                        />
                    </div>
                </div>

                {/* Fila 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center mb-4">
                            <MapPin className="mr-2" style={{ color: colors.primary }} />
                            <h2 className="text-lg font-semibold">Vehículos y Equipos por Zona</h2>
                        </div>
                        <ReactECharts
                            option={getVehiclesByZoneChart()}
                            style={chartStyle}
                        />
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center mb-4">
                            <Activity className="mr-2" style={{ color: colors.primary }} />
                            <h2 className="text-lg font-semibold">Vehículos y Equipos por Actividad</h2>
                        </div>
                        <ReactECharts
                            option={getVehiclesByActivityChart()}
                            style={chartStyle}
                        />
                    </div>
                </div>

                {/* Fila 3 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center mb-4">
                            <Users className="mr-2" style={{ color: colors.primary }} />
                            <h2 className="text-lg font-semibold">Usuarios por Cargo</h2>
                        </div>
                        <ReactECharts
                            option={getUsersByRoleChart()}
                            style={chartStyle}
                        />
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center mb-4">
                            <CreditCardIcon className="mr-2" style={{ color: colors.primary }} />
                            <h2 className="text-lg font-semibold">Tipos de Licencia</h2>
                        </div>
                        <ReactECharts
                            option={getLicenseTypesChart()}
                            style={chartStyle}
                        />
                    </div>
                </div>

                {/* Fila 4 - Gráficos anchos */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center mb-4">
                            <Calendar className="mr-2" style={{ color: colors.primary }} />
                            <h2 className="text-lg font-semibold">Evolución de Formularios</h2>
                        </div>
                        <ReactECharts
                            option={getFormsTimelineChart()}
                            style={{ ...chartStyle, height: '450px' }}
                        />
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center mb-4">
                            <CheckCircle className="mr-2" style={{ color: colors.primary }} />
                            <h2 className="text-lg font-semibold">Cumplimiento por Actividad</h2>
                        </div>
                        <ReactECharts
                            option={getActivityCompletionChart()}
                            style={{ ...chartStyle, height: '450px' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;