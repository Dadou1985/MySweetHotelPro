import React, { useState, useEffect, memo } from 'react';
import { useTranslation } from "react-i18next"
import {db} from '../../Firebase'
import { Chart } from 'primereact/chart';
import BarChart from '../../images/barChart.png'

const MaintenancePieChart = ({userDB, filter, period}) => {
    const [data, setData] = useState([])
    const [maintenanceCategory, setMaintenanceCategory] = useState({paint: [], electricity: [], plumbery: [], cleaning: [], others: []});
    const { t } = useTranslation()

    const oneDayAgo = Date.now() - 86400000
    const twoDayAgo = Date.now() - 172800000
    const threeDayAgo = Date.now() - 259200000
    const fourDayAgo = Date.now() - 345600000
    const fiveDayAgo = Date.now() - 432000000
    const sixDayAgo = Date.now() - 518400000
    const sevenDayAgo = Date.now() - 604800000

    const oneWeekAgo = Date.now() - 604800000
    const twoWeekAgo = Date.now() - 1209600000
    const threeWeekAgo = Date.now() - 1814400000
    const fourWeekAgo = Date.now() - 2419200000

    const oneMonthAgo = Date.now() - 2678400000
    const twoMonthAgo = Date.now() - 5356800000
    const threeMonthAgo = Date.now() - 8035200000
    const fourMonthAgo = Date.now() - 10713600000
    const fiveMonthAgo = Date.now() - 13392000000
    const sixMonthAgo = Date.now() - 16070400000
    const nineMonthAgo = Date.now() - 24105600000
    const twelveMonthAgo = Date.now() - 32140800000

    const reasonFilter = (array, start, end) => {
        const arrayFiltered = array.filter(reason => {return reason.markup < start && reason.markup > end})
        return arrayFiltered.length
    }

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection("maintenance")
            .where("markup", ">=", filter)
        }
    
        let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
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
                data: [
                    reasonFilter(maintenanceCategory.paint, sixDayAgo, sevenDayAgo),
                    reasonFilter(maintenanceCategory.paint, fiveDayAgo, sixDayAgo),
                    reasonFilter(maintenanceCategory.paint, fourDayAgo, fiveDayAgo),
                    reasonFilter(maintenanceCategory.paint, threeDayAgo, fourDayAgo),
                    reasonFilter(maintenanceCategory.paint, twoDayAgo, threeDayAgo),
                    reasonFilter(maintenanceCategory.paint, oneDayAgo, twoDayAgo),
                    reasonFilter(maintenanceCategory.paint, Date.now(), oneDayAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_electricity'),
                backgroundColor: 'blue',
                data: [
                    reasonFilter(maintenanceCategory.electricity, sixDayAgo, sevenDayAgo),
                    reasonFilter(maintenanceCategory.electricity, fiveDayAgo, sixDayAgo),
                    reasonFilter(maintenanceCategory.electricity, fourDayAgo, fiveDayAgo),
                    reasonFilter(maintenanceCategory.electricity, threeDayAgo, fourDayAgo),
                    reasonFilter(maintenanceCategory.electricity, twoDayAgo, threeDayAgo),
                    reasonFilter(maintenanceCategory.electricity, oneDayAgo, twoDayAgo),
                    reasonFilter(maintenanceCategory.electricity, Date.now(), oneDayAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_plumbery'),
                backgroundColor: 'red',
                data: [
                    reasonFilter(maintenanceCategory.plumbery, sixDayAgo, sevenDayAgo),
                    reasonFilter(maintenanceCategory.plumbery, fiveDayAgo, sixDayAgo),
                    reasonFilter(maintenanceCategory.plumbery, fourDayAgo, fiveDayAgo),
                    reasonFilter(maintenanceCategory.plumbery, threeDayAgo, fourDayAgo),
                    reasonFilter(maintenanceCategory.plumbery, twoDayAgo, threeDayAgo),
                    reasonFilter(maintenanceCategory.plumbery, oneDayAgo, twoDayAgo),
                    reasonFilter(maintenanceCategory.plumbery, Date.now(), oneDayAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_cleaning'),
                backgroundColor: 'green',
                data: [
                    reasonFilter(maintenanceCategory.cleaning, sixDayAgo, sevenDayAgo),
                    reasonFilter(maintenanceCategory.cleaning, fiveDayAgo, sixDayAgo),
                    reasonFilter(maintenanceCategory.cleaning, fourDayAgo, fiveDayAgo),
                    reasonFilter(maintenanceCategory.cleaning, threeDayAgo, fourDayAgo),
                    reasonFilter(maintenanceCategory.cleaning, twoDayAgo, threeDayAgo),
                    reasonFilter(maintenanceCategory.cleaning, oneDayAgo, twoDayAgo),
                    reasonFilter(maintenanceCategory.cleaning, Date.now(), oneDayAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_others'),
                backgroundColor: '#FFA726',
                data: [
                    reasonFilter(maintenanceCategory.others, sixDayAgo, sevenDayAgo),
                    reasonFilter(maintenanceCategory.others, fiveDayAgo, sixDayAgo),
                    reasonFilter(maintenanceCategory.others, fourDayAgo, fiveDayAgo),
                    reasonFilter(maintenanceCategory.others, threeDayAgo, fourDayAgo),
                    reasonFilter(maintenanceCategory.others, twoDayAgo, threeDayAgo),
                    reasonFilter(maintenanceCategory.others, oneDayAgo, twoDayAgo),
                    reasonFilter(maintenanceCategory.others, Date.now(), oneDayAgo)
                ]
            }]
        };



        const stackedDataMonth = {
            labels: [`${dMonth}-4`, `${dMonth}-3`, `${dMonth}-2`, `${dMonth}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_paint'),
                backgroundColor: 'yellow',
                data: [
                    reasonFilter(maintenanceCategory.paint, threeWeekAgo, fourWeekAgo),
                    reasonFilter(maintenanceCategory.paint, twoWeekAgo, threeWeekAgo),
                    reasonFilter(maintenanceCategory.paint, oneWeekAgo, twoWeekAgo),
                    reasonFilter(maintenanceCategory.paint, Date.now(), oneWeekAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_electricity'),
                backgroundColor: 'blue',
                data: [
                    reasonFilter(maintenanceCategory.electricity, threeWeekAgo, fourWeekAgo),
                    reasonFilter(maintenanceCategory.electricity, twoWeekAgo, threeWeekAgo),
                    reasonFilter(maintenanceCategory.electricity, oneWeekAgo, twoWeekAgo),
                    reasonFilter(maintenanceCategory.electricity, Date.now(), oneWeekAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_plumbery'),
                backgroundColor: 'red',
                data: [
                    reasonFilter(maintenanceCategory.plumbery, threeWeekAgo, fourWeekAgo),
                    reasonFilter(maintenanceCategory.plumbery, twoWeekAgo, threeWeekAgo),
                    reasonFilter(maintenanceCategory.plumbery, oneWeekAgo, twoWeekAgo),
                    reasonFilter(maintenanceCategory.plumbery, Date.now(), oneWeekAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_cleaning'),
                backgroundColor: 'green',
                data: [
                    reasonFilter(maintenanceCategory.cleaning, threeWeekAgo, fourWeekAgo),
                    reasonFilter(maintenanceCategory.cleaning, twoWeekAgo, threeWeekAgo),
                    reasonFilter(maintenanceCategory.cleaning, oneWeekAgo, twoWeekAgo),
                    reasonFilter(maintenanceCategory.cleaning, Date.now(), oneWeekAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_others'),
                backgroundColor: '#FFA726',
                data: [
                    reasonFilter(maintenanceCategory.others, threeMonthAgo, fourMonthAgo),
                    reasonFilter(maintenanceCategory.others, twoMonthAgo, threeMonthAgo),
                    reasonFilter(maintenanceCategory.others, oneMonthAgo, twoMonthAgo),
                    reasonFilter(maintenanceCategory.others, Date.now(), oneMonthAgo)
                ]
            }]
        };


        const stackedDataSemester = {
            labels: [`${dSemester}-6`, `${dSemester}-5`, `${dSemester}-4`, `${dSemester}-3`, `${dSemester}-2`, `${dSemester}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_paint'),
                backgroundColor: 'yellow',
                data: [
                    reasonFilter(maintenanceCategory.paint, fiveDayAgo, sixMonthAgo),
                    reasonFilter(maintenanceCategory.paint, fourMonthAgo, fiveDayAgo),
                    reasonFilter(maintenanceCategory.paint, threeMonthAgo, fourMonthAgo),
                    reasonFilter(maintenanceCategory.paint, twoMonthAgo, threeMonthAgo),
                    reasonFilter(maintenanceCategory.paint, oneMonthAgo, twoMonthAgo),
                    reasonFilter(maintenanceCategory.paint, Date.now(), oneMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_electricity'),
                backgroundColor: 'blue',
                data: [
                    reasonFilter(maintenanceCategory.electricity, fiveMonthAgo, sixMonthAgo),
                    reasonFilter(maintenanceCategory.electricity, fourMonthAgo, fiveMonthAgo),
                    reasonFilter(maintenanceCategory.electricity, threeMonthAgo, fourMonthAgo),
                    reasonFilter(maintenanceCategory.electricity, twoMonthAgo, threeMonthAgo),
                    reasonFilter(maintenanceCategory.electricity, oneMonthAgo, twoMonthAgo),
                    reasonFilter(maintenanceCategory.electricity, Date.now(), oneMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_plumbery'),
                backgroundColor: 'red',
                data: [
                    reasonFilter(maintenanceCategory.plumbery, fiveMonthAgo, sixMonthAgo),
                    reasonFilter(maintenanceCategory.plumbery, fourMonthAgo, fiveMonthAgo),
                    reasonFilter(maintenanceCategory.plumbery, threeMonthAgo, fourMonthAgo),
                    reasonFilter(maintenanceCategory.plumbery, twoMonthAgo, threeMonthAgo),
                    reasonFilter(maintenanceCategory.plumbery, oneMonthAgo, twoMonthAgo),
                    reasonFilter(maintenanceCategory.plumbery, Date.now(), oneMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_cleaning'),
                backgroundColor: 'green',
                data: [
                    reasonFilter(maintenanceCategory.cleaning, fiveMonthAgo, sixMonthAgo),
                    reasonFilter(maintenanceCategory.cleaning, fourMonthAgo, fiveMonthAgo),
                    reasonFilter(maintenanceCategory.cleaning, threeMonthAgo, fourMonthAgo),
                    reasonFilter(maintenanceCategory.cleaning, twoMonthAgo, threeMonthAgo),
                    reasonFilter(maintenanceCategory.cleaning, oneMonthAgo, twoMonthAgo),
                    reasonFilter(maintenanceCategory.cleaning, Date.now(), oneMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_others'),
                backgroundColor: '#FFA726',
                data: [
                    reasonFilter(maintenanceCategory.others, fiveMonthAgo, sixMonthAgo),
                    reasonFilter(maintenanceCategory.others, fourMonthAgo, fiveMonthAgo),
                    reasonFilter(maintenanceCategory.others, threeMonthAgo, fourMonthAgo),
                    reasonFilter(maintenanceCategory.others, twoMonthAgo, threeMonthAgo),
                    reasonFilter(maintenanceCategory.others, oneMonthAgo, twoMonthAgo),
                    reasonFilter(maintenanceCategory.others, Date.now(), oneMonthAgo)
                ]
            }]
        };


        const stackedDataYear = {
            labels: [`${dYear}-4`, `${dYear}-3`, `${dYear}-2`, `${dYear}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_paint'),
                backgroundColor: 'yellow',
                data: [
                    reasonFilter(maintenanceCategory.paint, nineMonthAgo, twelveMonthAgo),
                    reasonFilter(maintenanceCategory.paint, sixMonthAgo, nineMonthAgo),
                    reasonFilter(maintenanceCategory.paint, threeMonthAgo, sixMonthAgo),
                    reasonFilter(maintenanceCategory.paint, Date.now(), threeMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_electricity'),
                backgroundColor: 'blue',
                data: [
                    reasonFilter(maintenanceCategory.electricity, nineMonthAgo, twelveMonthAgo),
                    reasonFilter(maintenanceCategory.electricity, sixMonthAgo, nineMonthAgo),
                    reasonFilter(maintenanceCategory.electricity, threeMonthAgo, sixMonthAgo),
                    reasonFilter(maintenanceCategory.electricity, Date.now(), threeMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_plumbery'),
                backgroundColor: 'red',
                data: [
                    reasonFilter(maintenanceCategory.plumbery, nineMonthAgo, twelveMonthAgo),
                    reasonFilter(maintenanceCategory.plumbery, sixMonthAgo, nineMonthAgo),
                    reasonFilter(maintenanceCategory.plumbery, threeMonthAgo, sixMonthAgo),
                    reasonFilter(maintenanceCategory.plumbery, Date.now(), threeMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_cleaning'),
                backgroundColor: 'green',
                data: [
                    reasonFilter(maintenanceCategory.cleaning, nineMonthAgo, twelveMonthAgo),
                    reasonFilter(maintenanceCategory.cleaning, sixMonthAgo, nineMonthAgo),
                    reasonFilter(maintenanceCategory.cleaning, threeMonthAgo, sixMonthAgo),
                    reasonFilter(maintenanceCategory.cleaning, Date.now(), threeMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.maintenance_data.d_others'),
                backgroundColor: '#FFA726',
                data: [
                    reasonFilter(maintenanceCategory.others, nineMonthAgo, twelveMonthAgo),
                    reasonFilter(maintenanceCategory.others, sixMonthAgo, nineMonthAgo),
                    reasonFilter(maintenanceCategory.others, threeMonthAgo, sixMonthAgo),
                    reasonFilter(maintenanceCategory.others, Date.now(), threeMonthAgo)
                ]
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
                    <img src={BarChart} style={{width: "50%"}} />
                </div>
                <h6>{t("msh_dashboard.d_no_data")}</h6>
                </div>}
        </div>
}

export default memo(MaintenancePieChart);
