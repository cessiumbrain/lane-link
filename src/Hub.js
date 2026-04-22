import { LaneCall, Message, UserContext, EventStreamContext, LaneCallResponse } from "./App"
import { useContext, useState } from "react"
import './Hub.css'


function Hub(props) {
    return (
        <div className="hub">
            <h1>Hub</h1>
            {props.eventStream.map((evnt, index) => {
                if (evnt.subType === 'lane-call') {
                    return (
                        <LaneCallEvent evnt={evnt}></LaneCallEvent>
                    )
                } else if (evnt.subType === 'message') {
                    return (
                        <div class="hub-event message">

                        </div>
                    )
                }
            })}
            <textarea className="message-textarea" name="message-textarea" id="message-textarea"></textarea>
            <button className="send-message-button">Send Message</button>
        </div>
    )
}

function LaneCallEvent({ evnt }) {
    const currentUser = useContext(UserContext).currentUser
    const { eventStream, setEventStream } = useContext(EventStreamContext)
    const [selectedStatus, setSelectedStatus] = useState(evnt.status)

    function handleMechanicResponse(evnt, updatedStatus) {
        const updateEventStream = eventStream.map((streamEvent) => {
            if (streamEvent.id === evnt.id) {
                return { ...evnt, status: updatedStatus, responseHistory: [...evnt.responseHistory, new LaneCallResponse(currentUser, updatedStatus, new Date())] }
            }

            return streamEvent
        })

        setSelectedStatus(updatedStatus)
        setEventStream(updateEventStream)
    }


    return (
        <div className={`hub-event call ${evnt.status}`}>
            <div className="initial-event-row">
            <div className="hub-event-info">
                <div className={`status ${evnt.status}`}></div> -
                <span>Lane{evnt.laneNumber}</span> -
                <span>{evnt.callType}</span> -

                <span>Called by: {evnt.calledBy.firstName} {evnt.calledBy.lastName.charAt(0)}</span> -
                <span>{evnt.timeStamp.toLocaleTimeString()}</span>
                <span>{evnt.notes}</span>
            </div>
            
            <div className="hub-event-buttons">
                {currentUser.role === 'admin' || currentUser.role === 'mechanic' ? <button value='in-progress' disabled={evnt.status === 'in-progress'} onClick={() => { handleMechanicResponse(evnt, 'in-progress') }}>In-Progress</button> : ''}
                { }
                <button onClick={() => { handleMechanicResponse(evnt, 'active') }} disabled={evnt.status === 'active'}>Active Call</button>
                <button onClick={() => { handleMechanicResponse(evnt, 'resolved') }} disabled={evnt.status === 'resolved'}>Resolved</button>
            </div>
            </div>
            <div className="response-history">
                {evnt.responseHistory.map((response) => {
                    return (
                        <div className="response-history-entry">
                            <span>{response.timeStamp.toLocaleTimeString()} - </span>
                            <span>{response.respondedBy.firstName} {response.respondedBy.lastName.charAt(0)} - </span>
                            <span>{response.responseText}</span>
                        </div>
                    )
                })}
            </div>


        </div>
    )
}

export default Hub