import React from 'react'
// import "./Schedule.scss"
// import { INITIAL_EVENTS, createEventId } from './event-utils'


// import FullCalendar, { formatDate } from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'


function Schedule() {



    // const handleDateSelect = (selectInfo) => {
    //     console.log(selectInfo)
    //     let title = prompt('Please enter a new title for your event')
    //     let calendarApi = selectInfo.view.calendar

    //     calendarApi.unselect() // clear date selection

    //     if (title) {
    //         calendarApi.addEvent({
    //         id: createEventId(),
    //         title,
    //         start: selectInfo.startStr,
    //         end: selectInfo.endStr,
    //         allDay: selectInfo.allDay
    //         })
    //     }
    // }

    // const handleEventClick = (clickInfo) => {
    //     if (alert(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //       clickInfo.event.remove()
    //     }
    //   }
    
    // const handleEvents = (events) => {
    //     // this.setState({
    //     //   currentEvents: events
    //     // })
    //   }
    
    // function renderEventContent(eventInfo) {
    //   return (
    //     <>
    //       <b>{eventInfo.timeText}</b>
    //       <i>{eventInfo.event.title}</i>
    //     </>
    //   )
    // }
    
    return (
        <>
            <div className="schedule" style={{backgroundImage: "url('/images/main2.jfif')"}}>
                {/* <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    initialView='dayGridMonth'
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    //weekends={this.state.weekendsVisible}
                    initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
                    select={handleDateSelect}
                    eventContent={renderEventContent} // custom render function
                    eventClick={handleEventClick}
                    eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                    /* you can update a remote database when these fire:
                    eventAdd={function(){}}
                    eventChange={function(){}}
                    eventRemove={function(){}}
                    */}
                {/* /> */}
				<img className="construction" src="/images/construction.jfif"/>
            </div>            
        </>
    )
}

export default Schedule