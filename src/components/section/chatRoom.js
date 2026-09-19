import React, { useMemo, useCallback, useContext } from 'react'
import Message from './messageCommunizi'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useFirestoreSubscription } from '../../utils/hooks/useFirestore'
import { FirebaseContext } from '../../config/Firebase'
import moment from 'moment'

export default function ChatRoom({ title }) {
    const { user, userDB } = useContext(FirebaseContext)

    // Fetch chat messages
    const { data: messages = [] } = useFirestoreSubscription(
        ['hotels', userDB?.hotelId, 'chat', title, 'chatRoom'],
        { orderBy: ['markup', 'desc'], limit: 50, enabled: !!(userDB?.hotelId && title) }
    )

    // Fetch chat room metadata
    const { data: chatRooms = [] } = useFirestoreSubscription(
        ['hotels', userDB?.hotelId, 'chat'],
        { where: ['title', '==', title], enabled: !!(userDB?.hotelId && title) }
    )
    const chatRoom = chatRooms[0] || null

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
