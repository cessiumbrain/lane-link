
import './LaneDisplay.css'
import { useEffect, useState, useContext } from "react"    
import { laneCallTypes } from "./laneCallTypes"
import { LaneCall, UserContext, LaneContext, EventStreamContext } from "./App"

function LaneDisplay(props){
    const [showCallForm, setShowCallForm] = useState(false)
    const [selectedLane, setSelectedLane] = useState(null)
    const lanes = useContext(LaneContext)    
    return(
        <div className="lane-display">
            {lanes.map((lane) => {
                return(
                    <div className={`lane ${lane.number}`} key={lane.number}>
                        <span>{`Lane ${lane.number}`}</span>
                        <div className={`status ${lane.status}`}></div>
                        <button onClick={()=>{setSelectedLane(lane); setShowCallForm(true)}}>Make Call</button>
                    </div>
                )
            })}
            {showCallForm && <CallForm createLaneCall={props.createLaneCall} selectedLane={selectedLane}setShowCallForm={setShowCallForm} />}
            
        </div>
    )
}

function CallForm(props){
    const [selectedCallType, setSelectedCallType] = useState(laneCallTypes[0])
    const [selectedPins, setSelectedPins] = useState([])
    const [notes, setNotes] = useState('')


    const currentUser = useContext(UserContext).currentUser

    return(
        <div className="call-form">
            <i class="fa-solid fa-xmark" onClick={()=>{props.setShowCallForm(false)}}></i>
            <h1>Call Form Lane {props.selectedLane.number}</h1>
            <select onChange={(e)=>{setSelectedCallType(e.target.value)}}>
                {laneCallTypes.map((callType)=>{
                    return(
                        <option value={callType}>{callType}</option>
                    )
                })}
            </select>
        
            <label>Notes:</label>
            <input value={notes} onChange={(e)=>setNotes(e.target.value)}></input>
            {selectedCallType === "pin-spot" && <PinSelector selectedPins={selectedPins} setSelectedPins={setSelectedPins} />}
            <button onClick={()=>{
                props.createLaneCall(new LaneCall(props.selectedLane.number, selectedCallType, currentUser, notes, selectedPins, new Date ))
                props.setShowCallForm(false)
                }}>Place Call</button>
        </div>
    )
}

function PinSelector(props){
    function handlePinChange(pin){
        if(props.selectedPins.includes(pin)){
            let newPinArray = props.selectedPins.filter((p)=>p !==pin)
            props.setSelectedPins(newPinArray)
        } else {
            props.setSelectedPins([...props.selectedPins, pin])
        }
    }
    return(
        <div className="pin-selector">
            {[1,2,3,4,5,6,7,8,9,10].map((pin)=>{
                return(
                    <div className="pin-div">
                        <label>{`${pin}`}</label>
                        <input checked={props.selectedPins && props.selectedPins.includes(pin)} onChange={(e)=>{handlePinChange(pin)}}type="checkbox"></input>
                    </div>
                )
            })}
        </div>
    )
}

export default LaneDisplay