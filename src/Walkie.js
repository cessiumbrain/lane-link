import { Room, TokenSource } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
import './Walkie.css'




function Walkie(props) {
    const roomRef = useRef(null)

    const [walkieActive, setWalkieActive] = useState(false)

    useEffect(() => {
        roomRef.current = new Room();

        async function connectToRoom(){
            const tokenSource = TokenSource.sandboxTokenServer("lanelinkbeta-1r2rkc");

            const { serverUrl, participantToken } = await tokenSource.fetch({
                roomName: "room name to join",
            });

            await roomRef.current.connect(serverUrl, participantToken);
        }
            connectToRoom()
            
        




    }, [])

    async function handleWalkieToggle(e){
        console.log(roomRef.current)
        if(!roomRef.current){
            return
        }

        if(e.type==='pointerdown'){
            
            try {
               await roomRef.current.localParticipant.setMicrophoneEnabled(true) 
               setWalkieActive(true)
            } catch(error) {
                console.error("Error enabling microphone:", error);
            }
            
        } else if(e.type === 'pointerup' || e.type === 'pointercancel'){
            try {
                setWalkieActive(false)
            await roomRef.current.localParticipant.setMicrophoneEnabled(false)
            } catch(error) {
                console.error("Error disabling microphone:", error);
            }
        }
    }
    return (
        <div className="walkie">
            <h1>Walkie Talkie</h1>
            
            <button className={walkieActive ? 'active' : 'inactive'}onPointerDown={(e)=>{handleWalkieToggle(e)}} onPointerUp={(e)=>{handleWalkieToggle(e)}}><i class="fa-solid fa-walkie-talkie"></i>Push To Talk</button>
        </div>
    )
}

export default Walkie