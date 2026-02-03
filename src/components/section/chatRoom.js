import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Message from './messageCommunizi'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
    fetchCollectionByMapping2,
    fetchCollectionBySorting3
} from '../../helper/globalCommonFunctions'
import moment from 'moment'
// Helper to process Firestore snapshots
const processSnapshot = (snapshot) => {
    const data = []
    snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() })
    })
    return data
}

export default function ChatRoom({ user, userDB, title }) {
    const [messages, setMessages] = useState([])
    const [chatRoom, setChatRoom] = useState(null)

    // Fetch chat messages
    useEffect(() => {
        if (!userDB?.hotelId || !title) return

        const unsubscribe = fetchCollectionBySorting3(
            "hotels", userDB.hotelId, "chat", title, "chatRoom", "markup", "desc", 50
        ).onSnapshot((snapshot) => {
            setMessages(processSnapshot(snapshot))
        })

        return unsubscribe
    }, [userDB?.hotelId, title])

    // Fetch chat room metadata
    useEffect(() => {
        if (!userDB?.hotelId || !title) return

        const unsubscribe = fetchCollectionByMapping2(
            "hotels", userDB.hotelId, "chat", "title", "==", title
        ).onSnapshot((snapshot) => {
            const rooms = processSnapshot(snapshot)
            setChatRoom(rooms[0] || null)
        })

        return unsubscribe
    }, [userDB?.hotelId, title])

    // Get translation based on user language
    const getTranslation = useCallback((flow) => {
        return flow?.translated?.[userDB?.language] || flow?.text
    }, [userDB?.language])

    // Identify messages that start a new conversation section
    const lastMessageSet = useMemo(() => {
        if (!messages?.length) return new Set()

        return new Set(
            messages
                .filter((msg, idx) => msg.title !== messages[idx - 1]?.title)
                .map(msg => msg.id)
        )
    }, [messages])

    const newDay = useCallback((msg, idx) => {
        if (!messages?.length) return false

        const currentDate = msg?.date?.toDate?.()
        const prevDate = messages[idx - 1]?.date?.toDate?.()

        if (currentDate && (!prevDate || moment(currentDate).format('L') !== moment(prevDate).format('L'))) {
            return true
        }
        return false
    }, [messages])

    // Determine if translation is needed
    const needsTranslation = useMemo(() => {
        return chatRoom && userDB?.language !== chatRoom.guestLanguage
    }, [userDB?.language, chatRoom])

    // Render nothing if required data is missing
    if (!user || !userDB) return null

    return (
        <div>
            <PerfectScrollbar style={{ paddingTop: "3vh" }}>
                {messages.map((flow, idx) => {
                    const isLastMessage = lastMessageSet.has(flow.id)

                    // Skip messages without translation when translation is needed
                    // if (needsTranslation && !flow.translated) {
                    //     return null
                    // }

                    return (
                        <>
                            {newDay(flow, idx) && <div style={{
                                textAlign: "center",
                                marginTop: "3vh",
                                marginBottom: "3vh",
                            }}>
                                <span style={{
                                    backgroundColor: "black",
                                    color: "#B8860B",
                                    padding: "1%",
                                    borderRadius: "5px",
                                    fontWeight: "bolder"
                                }}>{flow.date && moment(flow.date.toDate()).format('L') === moment(new Date()).format('L') ? "Aujourd'hui" : moment(flow.date.toDate()).format('L')}</span>
                                </div>}
                            <Message
                                key={flow.id}
                                author={flow.author}
                                photo={flow.photo}
                                text={needsTranslation ? undefined : flow.text}
                                translation={needsTranslation ? getTranslation(flow) : undefined}
                                markup={flow.markup}
                                date={flow.date}
                                title={flow.title}
                                lastMessage={isLastMessage}
                            />
                        </>
                    )
                })}
            </PerfectScrollbar>
        </div>
    )
}
