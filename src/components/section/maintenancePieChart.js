import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next"
import { Chart } from 'primereact/chart'
import { StaticImage } from 'gatsby-plugin-image'
import { fetchCollectionByMapping2 } from '../../helper/globalCommonFunctions';
import {
    stackedDataForWeek, 
    stackedDataForMonth, 
    stackedDataForSemester, 
    stackedDataForYear} 
from '../../helper/common/timeRange/stackedData';

const MaintenancePieChart = ({userDB, filter, period}) => {
    const [data, setData] = useState([])
    const [maintenanceCategory, setMaintenanceCategory] = useState({paint: [], electricity: [], plumbery: [], cleaning: [], others: []});
    const { t } = useTranslation()

    useEffect(() => {
        let unsubscribe = fetchCollectionByMapping2('hotels', userDB.hotelId, 'maintenance', "markup", '>=', filter).onSnapshot(function(snapshot) {
                const snapInfo = []
                snapshot.forEach(function(doc) {          
                snapInfo.push({
                    id: doc.id,
                    ...doc.data()
                    })        
                });

                const paint = snapInfo && snapInfo.filter(reason => reason.type === "paint")
                const electricity = snapInfo && snapInfo.filter(reason => reason.type === "electricity")
                const plumbery = snapInfo && snapInfo.filter(reason => reason.type === "plumbery")
                const housekeeping = snapInfo && snapInfo.filter(reason => reason.type === "cleaning")
                const others = snapInfo && snapInfo.filter(reason => reason.type === "others")

                setData(snapInfo)
                setMaintenanceCategory({
                    paint: paint,
                    electricity: electricity,
                    plumbery: plumbery,
                    cleaning: housekeeping,
                    others: others
                })
            });
            return unsubscribe
        },[filter])   

        const dDay = t("msh_dashboard.d_time_period.t_day").charAt(0)
        const dMonth = t("msh_dashboard.d_time_period.t_week").charAt(0)
        const dSemester = t("msh_dashboard.d_time_period.t_month").charAt(0)
        const dYear = t("msh_dashboard.d_time_period.t_trimester").charAt(0)

        const stackedDataWeek = {
            labels: [`${dDay}-6`, `${dDay}-5`, `${dDay}-4`, `${dDay}-3`, `${dDay}-2`, `${dDay}-1`, `${dDay} 0`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_paint'),
                backgroundColor: 'yellow',
                data: stackedDataForWeek(maintenanceCategory.paint)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_electricity'),
                backgroundColor: 'blue',
                data: stackedDataForWeek(maintenanceCategory.electricity)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_plumbery'),
                backgroundColor: 'red',
                data: stackedDataForWeek(maintenanceCategory.plumbery)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_cleaning'),
                backgroundColor: 'green',
                data: stackedDataForWeek(maintenanceCategory.cleaning)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_others'),
                backgroundColor: '#FFA726',
                data: stackedDataForWeek(maintenanceCategory.others)
            }]
        };

        const stackedDataMonth = {
            labels: [`${dMonth}-4`, `${dMonth}-3`, `${dMonth}-2`, `${dMonth}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_paint'),
                backgroundColor: 'yellow',
                data: stackedDataForMonth(maintenanceCategory.paint)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_electricity'),
                backgroundColor: 'blue',
                data: stackedDataForMonth(maintenanceCategory.electricity)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_plumbery'),
                backgroundColor: 'red',
                data: stackedDataForMonth(maintenanceCategory.plumbery)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_cleaning'),
                backgroundColor: 'green',
                data: stackedDataForMonth(maintenanceCategory.cleaning)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_others'),
                backgroundColor: '#FFA726',
                data: stackedDataForMonth(maintenanceCategory.others)
            }]
        };

        const stackedDataSemester = {
            labels: [`${dSemester}-6`, `${dSemester}-5`, `${dSemester}-4`, `${dSemester}-3`, `${dSemester}-2`, `${dSemester}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_paint'),
                backgroundColor: 'yellow',
                data: stackedDataForSemester(maintenanceCategory.paint)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_electricity'),
                backgroundColor: 'blue',
                data: stackedDataForSemester(maintenanceCategory.electricity)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_plumbery'),
                backgroundColor: 'red',
                data: stackedDataForSemester(maintenanceCategory.plumbery)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_cleaning'),
                backgroundColor: 'green',
                data: stackedDataForSemester(maintenanceCategory.cleaning)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_others'),
                backgroundColor: '#FFA726',
                data: stackedDataForSemester(maintenanceCategory.others)
            }]
        };

        const stackedDataYear = {
            labels: [`${dYear}-4`, `${dYear}-3`, `${dYear}-2`, `${dYear}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_paint'),
                backgroundColor: 'yellow',
                data: stackedDataForYear(maintenanceCategory.paint)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_electricity'),
                backgroundColor: 'blue',
                data: stackedDataForYear(maintenanceCategory.electricity)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_plumbery'),
                backgroundColor: 'red',
                data: stackedDataForYear(maintenanceCategory.plumbery)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_cleaning'),
                backgroundColor: 'green',
                data: stackedDataForYear(maintenanceCategory.cleaning)
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_others'),
                backgroundColor: '#FFA726',
                data: stackedDataForYear(maintenanceCategory.others)
            }]
        };

        let stackedOptions = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

    const renderSwitch = (time) => {
        switch(time) {
            case 'week':
            return <Chart type="bar" data={stackedDataWeek} options={stackedOptions} style={{ width: '100%' }} />
            case 'month':
            return <Chart type="bar" data={stackedDataMonth} options={stackedOptions} style={{ width: '100%' }} />
            case 'semester':
            return <Chart type="bar" data={stackedDataSemester} options={stackedOptions} style={{ width: '100%' }} />
            case 'year':
            return <Chart type="bar" data={stackedDataYear} options={stackedOptions} style={{ width: '100%' }} />
            default:
            return <Chart type="bar" data={stackedDataWeek} options={stackedOptions} style={{ width: '100%' }} />
        }
    }

    return <div className="card" style={{
        display: "flex",
        flexFlow: "row",
        width: "100%",  
        padding: "3%",
        border: "transparent",
        justifyContent: "center",
        }}>
        {data.length > 0 ? renderSwitch(period) : <div style={{
            display: "flex",
            flexFlow: "column",
            alignItems: "center"
        }}>
            <div style={{
                display: "flex",
                flexFlow: "column",
                justifyContent: "center",
                alignItems: "center",
                borderBottom: "5px solid lightgray",
                borderRight: "5px solid lightgray",
                border: '1px solid lightgrey',
                borderRadius: "100%",
                padding: "2vw",
                width: typeof window && window.innerWidth > 768 ? "20vw" : "20vw",
                height:  typeof window && window.innerWidth > 768 ? "40vh" : "12vh",
                backgroundColor: "whitesmoke",
                filter: "drop-shadow(2px 4px 6px)", 
                marginTop: "2vh",
                marginBottom: "2vh"
            }}>
                <StaticImage src='../../images/barChart.png' style={{width: "50%"}} />
            </div>
            <h6>{t("msh_dashboard.d_no_data")}</h6>
        </div>}
    </div>
}

export default MaintenancePieChart;
