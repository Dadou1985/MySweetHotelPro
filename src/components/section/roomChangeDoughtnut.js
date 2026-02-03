import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next"
import { Chart } from 'primereact/chart';
import BarChart from '../../images/barChart.png'
import { fetchCollectionByMapping2 } from '../../helper/globalCommonFunctions';
import {
    stackedDataForWeek, 
    stackedDataForMonth, 
    stackedDataForSemester, 
    stackedDataForYear} 
from '../../helper/common/timeRange/stackedData';

const RoomChangeDoughtnut = ({userDB, filter, period}) => {
    const [data, setData] = useState([])
    const [roomChangeCategory, setRoomChangeCategory] = useState({noise: [], temperature: [], maintenance: [], housekeeping: [], others: []});
    const { t } = useTranslation()

    useEffect(() => {
        let unsubscribe = fetchCollectionByMapping2('hotels', userDB.hotelId, 'roomChange', "markup", '>=', filter).onSnapshot(function(snapshot) {
            const snapInfo = []
            snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
                })        
            });

            const noise = snapInfo && snapInfo.filter(reason => reason.reason === "noise")
            const temperature = snapInfo && snapInfo.filter(reason => reason.reason === "temperature")
            const maintenance = snapInfo && snapInfo.filter(reason => reason.reason === "maintenance")
            const cleaning = snapInfo && snapInfo.filter(reason => reason.reason === "cleaning")
            const others = snapInfo && snapInfo.filter(reason => reason.reason === "others")
            
            setData(snapInfo)
            setRoomChangeCategory({
                noise: noise,
                temperature: temperature,
                maintenance: maintenance,
                housekeeping: cleaning,
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
                label: t('msh_dashboard.room_change_data.d_noise'),
                backgroundColor: 'yellow',
                data: stackedDataForWeek(roomChangeCategory.noise)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_temperature'),
                backgroundColor: 'blue',
                data: stackedDataForWeek(roomChangeCategory.temperature)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_maintenance'),
                backgroundColor: 'red',
                data: stackedDataForWeek(roomChangeCategory.maintenance)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_cleaning'),
                backgroundColor: 'green',
                data: stackedDataForWeek(roomChangeCategory.housekeeping)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_others'),
                backgroundColor: '#FFA726',
                data: stackedDataForWeek(roomChangeCategory.others)
            }]
        };

        const stackedDataMonth = {
            labels: [`${dMonth}-4`, `${dMonth}-3`, `${dMonth}-2`, `${dMonth}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_noise'),
                backgroundColor: 'yellow',
                data: stackedDataForMonth(roomChangeCategory.noise)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_temperature'),
                backgroundColor: 'blue',
                data: stackedDataForMonth(roomChangeCategory.temperature)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_maintenance'),
                backgroundColor: 'red',
                data: stackedDataForMonth(roomChangeCategory.maintenance)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_cleaning'),
                backgroundColor: 'green',
                data: stackedDataForMonth(roomChangeCategory.housekeeping)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_others'),
                backgroundColor: '#FFA726',
                data: stackedDataForMonth(roomChangeCategory.others)
            }]
        };

        const stackedDataSemester = {
            labels: [`${dSemester}-6`, `${dSemester}-5`, `${dSemester}-4`, `${dSemester}-3`, `${dSemester}-2`, `${dSemester}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_noise'),
                backgroundColor: 'yellow',
                data: stackedDataForSemester(roomChangeCategory.noise)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_temperature'),
                backgroundColor: 'blue',
                data: stackedDataForSemester(roomChangeCategory.temperature)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_maintenance'),
                backgroundColor: 'red',
                data: stackedDataForSemester(roomChangeCategory.maintenance)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_cleaning'),
                backgroundColor: 'green',
                data: stackedDataForSemester(roomChangeCategory.housekeeping)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_others'),
                backgroundColor: '#FFA726',
                data: stackedDataForSemester(roomChangeCategory.others)
            }]
        };

        const stackedDataYear = {
            labels: [`${dYear}-4`, `${dYear}-3`, `${dYear}-2`, `${dYear}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_noise'),
                backgroundColor: 'yellow',
                data: stackedDataForYear(roomChangeCategory.noise)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_temperature'),
                backgroundColor: 'blue',
                data: stackedDataForYear(roomChangeCategory.temperature)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_maintenance'),
                backgroundColor: 'red',
                data: stackedDataForYear(roomChangeCategory.maintenance)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_cleaning'),
                backgroundColor: 'green',
                data: stackedDataForYear(roomChangeCategory.housekeeping)
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_others'),
                backgroundColor: '#FFA726',
                data: stackedDataForYear(roomChangeCategory.others)
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
                width: window?.innerWidth > 768 ? "10rem" : "5rem",
                height:  window?.innerWidth > 768 ? "10rem" : "5rem",
                backgroundColor: "whitesmoke",
                filter: "drop-shadow(2px 4px 6px)", 
                marginTop: "2vh",
                marginBottom: "2vh"
            }}>
                <img src={BarChart} style={{width: window?.innerWidth > 768 ? "3vw" : "6vw"}} />
            </div>
            <h6>{t("msh_dashboard.d_no_data")}</h6>
        </div>}
    </div>
}

export default RoomChangeDoughtnut;
