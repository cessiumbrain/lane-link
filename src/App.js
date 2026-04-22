import './App.css';
import LaneDisplay from './LaneDisplay';
import { createContext, useEffect, useMemo, useState } from 'react';
import Hub from './Hub';
import { lanes } from './lanes';
import { Link, Route, Routes, useLocation } from 'react-router';
import Walkie from './Walkie'


export const UserContext = createContext()
export const LaneContext = createContext()
export const EventStreamContext = createContext()


export class LaneCallResponse {
  constructor(respondedBy, responseType, timeStamp) {

    this.respondedBy = respondedBy
    this.responseType = responseType
    this.timeStamp = timeStamp
    this.responseTextOptions = [{
      type: 'in-progress',
      text: "I've seen this and am working on it."
    }, {
      type: 'active',
      text: "Problem on lane"
    },
    {
      type: 'resolved',
      text: "Problem is fixed.  Lane is usable again."
    }]
    this.responseText = this.responseTextOptions.find((option) => option.type === responseType).text
  }

}
export class LaneCall {
  constructor(laneNumber, callType, calledBy, notes, pinsArr, timeStamp) {
    this.laneNumber = laneNumber
    this.callType = callType
    this.notes = notes
    this.pinsArr = pinsArr
    this.calledBy = calledBy
    this.timeStamp = timeStamp
    //status should be active, in-progress, or resolved
    this.status = 'active'
    this.id = `${laneNumber}-${timeStamp.getTime()}`
    this.type = 'event'
    this.subType = 'lane-call'
    this.responseHistory = []

  }
}
export class Message {
  constructor(sentBy, messageText, timeStamp) {
    this.sentBy = sentBy
    this.messageText = messageText
    this.timeStamp = timeStamp
    this.type = 'event'
    this.subType = 'message'
  }
}
const user1 = {
  firstName: 'Joe',
  lastName: 'Iannotta',
  role: 'admin',
  id: 1
}
function App() {
  const location = useLocation()

  const [eventStream, setEventStream] = useState([])
  const [currentUser, setCurrentUser] = useState(user1)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    setShowDropdown(false)
  }, [location.pathname])



  function createLaneCall(laneCallObject) {
    const newEventStream = [...eventStream, laneCallObject]
    setEventStream(newEventStream)
  }

  const displayLanes = useMemo(() => {

    let newLanes = [...lanes]
    if (eventStream.length === 0) {
      return newLanes
    }
    const activeCallCounts = eventStream.reduce((acc, evnt) => {
      console.log('event in reducer', evnt)
      if (evnt.subType === 'lane-call' && (evnt.status === 'active' || evnt.status === 'in-progress')) {
        acc[evnt.laneNumber] = (acc[evnt.laneNumber] || 0) + 1
      }
      return acc
    }, {})

    return newLanes.map((lane) => {
      return {
        ...lane,
        activeCallCount: activeCallCounts[lane.number] || 0,
        status: activeCallCounts[lane.number] > 0 ? 'pending-call' : lane.status
      }
    })

  }, [eventStream])


  return (
    <LaneContext.Provider value={displayLanes}>
      <EventStreamContext.Provider value={{ eventStream, setEventStream }}>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          <div className="App">
            <div className="app-shell">
              <header className="app-header">
                <div className="brand-block">
                  <span className="brand-eyebrow">Lane Link</span>
                  <h1>Navigation</h1>
                </div>

                <div className="nav-menu">
                  <button
                    type="button"
                    className="nav-toggle"
                    aria-expanded={showDropdown}
                    aria-controls="primary-navigation"
                    onClick={() => setShowDropdown((currentValue) => !currentValue)}
                  >
                    Menu
                  </button>

                  {showDropdown && (
                    <nav id="primary-navigation" className="dropdown-panel" aria-label="Primary navigation">
                      <Link className="dropdown-link" to="/">
                        Lane Display
                      </Link>
                      <Link className="dropdown-link" to="/hub">
                        Hub
                      </Link>
                      <Link className="dropdown-link" to="/walkie">
                        Walkie Talkie
                      </Link>
                    </nav>
                  )}
                </div>
              </header>

              <main className="app-content">
                <Routes>
                  <Route path="/" element={<LaneDisplay createLaneCall={createLaneCall} />} />
                  <Route path="/hub" element={<Hub eventStream={eventStream}></Hub>} />
                  <Route path="/walkie" element={<Walkie></Walkie>} />
                </Routes>
              </main>
            </div>
          </div>
        </UserContext.Provider>
      </EventStreamContext.Provider>
    </LaneContext.Provider>
  );
}

export default App;
