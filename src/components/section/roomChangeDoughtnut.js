import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next"
import { Modal, Button, Tab, Tabs, Table, ModalBody, Nav, Row, Col } from 'react-bootstrap'
import {db} from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import { Chart } from 'primereact/chart';
import BarChart from '../../images/barChart.png'

const RoomChangeDoughtnut = ({userDB, filter, period}) => {
    const [data, setData] = useState([])
    const [roomChangeCategory, setRoomChangeCategory] = useState({noise: [], temperature: [], maintenance: [], housekeeping: [], others: []});
    const { t, i18n } = useTranslation()

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
            .collection("roomChange")
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
                    console.log(snapInfo)
    
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
        const dMonth = t("msh_dashboard.d_time_period.t_month").charAt(0)
        const dSemester = t("msh_dashboard.d_time_period.t_semester").charAt(0)
        const dYear = t("msh_dashboard.d_time_period.t_year").charAt(0)

        const stackedDataWeek = {
            labels: [`${dDay}-6`, `${dDay}-5`, `${dDay}-4`, `${dDay}-3`, `${dDay}-2`, `${dDay}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_noise'),
                backgroundColor: 'yellow',
                data: [
                    reasonFilter(roomChangeCategory.noise, sixDayAgo, sevenDayAgo),
                    reasonFilter(roomChangeCategory.noise, fiveDayAgo, sixDayAgo),
                    reasonFilter(roomChangeCategory.noise, fourDayAgo, fiveDayAgo),
                    reasonFilter(roomChangeCategory.noise, threeDayAgo, fourDayAgo),
                    reasonFilter(roomChangeCategory.noise, twoDayAgo, threeDayAgo),
                    reasonFilter(roomChangeCategory.noise, oneDayAgo, twoDayAgo),
                    reasonFilter(roomChangeCategory.noise, Date.now(), oneDayAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_temperature'),
                backgroundColor: 'blue',
                data: [
                    reasonFilter(roomChangeCategory.temperature, sixDayAgo, sevenDayAgo),
                    reasonFilter(roomChangeCategory.temperature, fiveDayAgo, sixDayAgo),
                    reasonFilter(roomChangeCategory.temperature, fourDayAgo, fiveDayAgo),
                    reasonFilter(roomChangeCategory.temperature, threeDayAgo, fourDayAgo),
                    reasonFilter(roomChangeCategory.temperature, twoDayAgo, threeDayAgo),
                    reasonFilter(roomChangeCategory.temperature, oneDayAgo, twoDayAgo),
                    reasonFilter(roomChangeCategory.temperature, Date.now(), oneDayAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_maintenance'),
                backgroundColor: 'red',
                data: [
                    reasonFilter(roomChangeCategory.maintenance, sixDayAgo, sevenDayAgo),
                    reasonFilter(roomChangeCategory.maintenance, fiveDayAgo, sixDayAgo),
                    reasonFilter(roomChangeCategory.maintenance, fourDayAgo, fiveDayAgo),
                    reasonFilter(roomChangeCategory.maintenance, threeDayAgo, fourDayAgo),
                    reasonFilter(roomChangeCategory.maintenance, twoDayAgo, threeDayAgo),
                    reasonFilter(roomChangeCategory.maintenance, oneDayAgo, twoDayAgo),
                    reasonFilter(roomChangeCategory.maintenance, Date.now(), oneDayAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_cleaning'),
                backgroundColor: 'green',
                data: [
                    reasonFilter(roomChangeCategory.housekeeping, sixDayAgo, sevenDayAgo),
                    reasonFilter(roomChangeCategory.housekeeping, fiveDayAgo, sixDayAgo),
                    reasonFilter(roomChangeCategory.housekeeping, fourDayAgo, fiveDayAgo),
                    reasonFilter(roomChangeCategory.housekeeping, threeDayAgo, fourDayAgo),
                    reasonFilter(roomChangeCategory.housekeeping, twoDayAgo, threeDayAgo),
                    reasonFilter(roomChangeCategory.housekeeping, oneDayAgo, twoDayAgo),
                    reasonFilter(roomChangeCategory.housekeeping, Date.now(), oneDayAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_others'),
                backgroundColor: '#FFA726',
                data: [
                    reasonFilter(roomChangeCategory.others, sixDayAgo, sevenDayAgo),
                    reasonFilter(roomChangeCategory.others, fiveDayAgo, sixDayAgo),
                    reasonFilter(roomChangeCategory.others, fourDayAgo, fiveDayAgo),
                    reasonFilter(roomChangeCategory.others, threeDayAgo, fourDayAgo),
                    reasonFilter(roomChangeCategory.others, twoDayAgo, threeDayAgo),
                    reasonFilter(roomChangeCategory.others, oneDayAgo, twoDayAgo),
                    reasonFilter(roomChangeCategory.others, Date.now(), oneDayAgo)
                ]
            }]
        };



        const stackedDataMonth = {
            labels: [`${dMonth}-4`, `${dMonth}-3`, `${dMonth}-2`, `${dMonth}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_noise'),
                backgroundColor: 'yellow',
                data: [
                    reasonFilter(roomChangeCategory.noise, threeWeekAgo, fourWeekAgo),
                    reasonFilter(roomChangeCategory.noise, twoWeekAgo, threeWeekAgo),
                    reasonFilter(roomChangeCategory.noise, oneWeekAgo, twoWeekAgo),
                    reasonFilter(roomChangeCategory.noise, Date.now(), oneWeekAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_temperature'),
                backgroundColor: 'blue',
                data: [
                    reasonFilter(roomChangeCategory.temperature, threeWeekAgo, fourWeekAgo),
                    reasonFilter(roomChangeCategory.temperature, twoWeekAgo, threeWeekAgo),
                    reasonFilter(roomChangeCategory.temperature, oneWeekAgo, twoWeekAgo),
                    reasonFilter(roomChangeCategory.temperature, Date.now(), oneWeekAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_maintenance'),
                backgroundColor: 'red',
                data: [
                    reasonFilter(roomChangeCategory.maintenance, threeWeekAgo, fourWeekAgo),
                    reasonFilter(roomChangeCategory.maintenance, twoWeekAgo, threeWeekAgo),
                    reasonFilter(roomChangeCategory.maintenance, oneWeekAgo, twoWeekAgo),
                    reasonFilter(roomChangeCategory.maintenance, Date.now(), oneWeekAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_cleaning'),
                backgroundColor: 'green',
                data: [
                    reasonFilter(roomChangeCategory.housekeeping, threeWeekAgo, fourWeekAgo),
                    reasonFilter(roomChangeCategory.housekeeping, twoWeekAgo, threeWeekAgo),
                    reasonFilter(roomChangeCategory.housekeeping, oneWeekAgo, twoWeekAgo),
                    reasonFilter(roomChangeCategory.housekeeping, Date.now(), oneWeekAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_others'),
                backgroundColor: '#FFA726',
                data: [
                    reasonFilter(roomChangeCategory.others, threeMonthAgo, fourMonthAgo),
                    reasonFilter(roomChangeCategory.others, twoMonthAgo, threeMonthAgo),
                    reasonFilter(roomChangeCategory.others, oneMonthAgo, twoMonthAgo),
                    reasonFilter(roomChangeCategory.others, Date.now(), oneMonthAgo)
                ]
            }]
        };


        const stackedDataSemester = {
            labels: [`${dSemester}-6`, `${dSemester}-5`, `${dSemester}-4`, `${dSemester}-3`, `${dSemester}-2`, `${dSemester}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_noise'),
                backgroundColor: 'yellow',
                data: [
                    reasonFilter(roomChangeCategory.noise, fiveDayAgo, sixMonthAgo),
                    reasonFilter(roomChangeCategory.noise, fourMonthAgo, fiveDayAgo),
                    reasonFilter(roomChangeCategory.noise, threeMonthAgo, fourMonthAgo),
                    reasonFilter(roomChangeCategory.noise, twoMonthAgo, threeMonthAgo),
                    reasonFilter(roomChangeCategory.noise, oneMonthAgo, twoMonthAgo),
                    reasonFilter(roomChangeCategory.noise, Date.now(), oneMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_temperature'),
                backgroundColor: 'blue',
                data: [
                    reasonFilter(roomChangeCategory.temperature, fiveMonthAgo, sixMonthAgo),
                    reasonFilter(roomChangeCategory.temperature, fourMonthAgo, fiveMonthAgo),
                    reasonFilter(roomChangeCategory.temperature, threeMonthAgo, fourMonthAgo),
                    reasonFilter(roomChangeCategory.temperature, twoMonthAgo, threeMonthAgo),
                    reasonFilter(roomChangeCategory.temperature, oneMonthAgo, twoMonthAgo),
                    reasonFilter(roomChangeCategory.temperature, Date.now(), oneMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_maintenance'),
                backgroundColor: 'red',
                data: [
                    reasonFilter(roomChangeCategory.maintenance, fiveMonthAgo, sixMonthAgo),
                    reasonFilter(roomChangeCategory.maintenance, fourMonthAgo, fiveMonthAgo),
                    reasonFilter(roomChangeCategory.maintenance, threeMonthAgo, fourMonthAgo),
                    reasonFilter(roomChangeCategory.maintenance, twoMonthAgo, threeMonthAgo),
                    reasonFilter(roomChangeCategory.maintenance, oneMonthAgo, twoMonthAgo),
                    reasonFilter(roomChangeCategory.maintenance, Date.now(), oneMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_cleaning'),
                backgroundColor: 'green',
                data: [
                    reasonFilter(roomChangeCategory.housekeeping, fiveMonthAgo, sixMonthAgo),
                    reasonFilter(roomChangeCategory.housekeeping, fourMonthAgo, fiveMonthAgo),
                    reasonFilter(roomChangeCategory.housekeeping, threeMonthAgo, fourMonthAgo),
                    reasonFilter(roomChangeCategory.housekeeping, twoMonthAgo, threeMonthAgo),
                    reasonFilter(roomChangeCategory.housekeeping, oneMonthAgo, twoMonthAgo),
                    reasonFilter(roomChangeCategory.housekeeping, Date.now(), oneMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_others'),
                backgroundColor: '#FFA726',
                data: [
                    reasonFilter(roomChangeCategory.others, fiveMonthAgo, sixMonthAgo),
                    reasonFilter(roomChangeCategory.others, fourMonthAgo, fiveMonthAgo),
                    reasonFilter(roomChangeCategory.others, threeMonthAgo, fourMonthAgo),
                    reasonFilter(roomChangeCategory.others, twoMonthAgo, threeMonthAgo),
                    reasonFilter(roomChangeCategory.others, oneMonthAgo, twoMonthAgo),
                    reasonFilter(roomChangeCategory.others, Date.now(), oneMonthAgo)
                ]
            }]
        };


        const stackedDataYear = {
            labels: [`${dYear}-4`, `${dYear}-3`, `${dYear}-2`, `${dYear}-1`],
            datasets: [{
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_noise'),
                backgroundColor: 'yellow',
                data: [
                    reasonFilter(roomChangeCategory.noise, nineMonthAgo, twelveMonthAgo),
                    reasonFilter(roomChangeCategory.noise, sixMonthAgo, nineMonthAgo),
                    reasonFilter(roomChangeCategory.noise, threeMonthAgo, sixMonthAgo),
                    reasonFilter(roomChangeCategory.noise, Date.now(), threeMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_temperature'),
                backgroundColor: 'blue',
                data: [
                    reasonFilter(roomChangeCategory.temperature, nineMonthAgo, twelveMonthAgo),
                    reasonFilter(roomChangeCategory.temperature, sixMonthAgo, nineMonthAgo),
                    reasonFilter(roomChangeCategory.temperature, threeMonthAgo, sixMonthAgo),
                    reasonFilter(roomChangeCategory.temperature, Date.now(), threeMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_maintenance'),
                backgroundColor: 'red',
                data: [
                    reasonFilter(roomChangeCategory.maintenance, nineMonthAgo, twelveMonthAgo),
                    reasonFilter(roomChangeCategory.maintenance, sixMonthAgo, nineMonthAgo),
                    reasonFilter(roomChangeCategory.maintenance, threeMonthAgo, sixMonthAgo),
                    reasonFilter(roomChangeCategory.maintenance, Date.now(), threeMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_cleaning'),
                backgroundColor: 'green',
                data: [
                    reasonFilter(roomChangeCategory.housekeeping, nineMonthAgo, twelveMonthAgo),
                    reasonFilter(roomChangeCategory.housekeeping, sixMonthAgo, nineMonthAgo),
                    reasonFilter(roomChangeCategory.housekeeping, threeMonthAgo, sixMonthAgo),
                    reasonFilter(roomChangeCategory.housekeeping, Date.now(), threeMonthAgo)
                ]
            }, {
                type: 'bar',
                label: t('msh_dashboard.room_change_data.d_others'),
                backgroundColor: '#FFA726',
                data: [
                    reasonFilter(roomChangeCategory.others, nineMonthAgo, twelveMonthAgo),
                    reasonFilter(roomChangeCategory.others, sixMonthAgo, nineMonthAgo),
                    reasonFilter(roomChangeCategory.others, threeMonthAgo, sixMonthAgo),
                    reasonFilter(roomChangeCategory.others, Date.now(), threeMonthAgo)
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
                    width: "6vw",
                    height: "12vh",
                    backgroundColor: "whitesmoke",
                    filter: "drop-shadow(2px 4px 6px)", 
                    marginTop: "2vh",
                    marginBottom: "2vh"
                }}>
                    <img src={BarChart} style={{width: "3vw"}} />
                </div>
                <h6>{t("msh_dashboard.d_no_data")}</h6>
                </div>}
        </div>
}

export default RoomChangeDoughtnut;
