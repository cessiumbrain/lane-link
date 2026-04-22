To Do
- allow fire calls from hub
- work on hub display of calls
    - split each event into two columns - info and a two button side panel
    - status button allows users to change the status of a call from three options
    - map out responses
- have copilot mock up global styles and color pallet
- wire navigation of components for users

Components
- 

Questions
- do mechanics respond to calls?
- do calls have "response" or "status" properties?
    - this allows messages to be targeted at specific calls
    - or are the calls just general flags and then messages can address the calls?

- mechanics should respond to calls or lanes
    - mechanics should respond to calls with "orange light" with "10-4 I'm on it" yellow light. And then "fixed" green light

I'm having trouble making some design decisions about my application.  The design decisions are related to both data architecture and UI and UX.  My main focus right now is on UI and UX.  I want an easy streamlined experience that lets the back of house in the bowling alley communicate quickly and easily with the front of house.  So I'm not sure if each lane call for service should have "responses" where the mechanic can say quickly fire a quick response e.g.
 - I've seen this and am on it
 - hold up bowlers while I fix this
 - this will be a minute
 - I need another set of hands
 - I can't fix this move them

 I see the main UI for this as being a "hub".  This is essentially a stream of events that looks like a chatroom.  The downside to attaching specific responses to events is that this will either crowd the hub by firing a new event line or make it confusing for users who have to scroll back up to see the status of a call.

 Other UI options might include simply displaying the array of lanes and then each lane display containing calls for that lane.  The drawback here is that 

 Solution:
 - active calls go at the top
 - response and status messages can go with them
 - a message stream goes under that