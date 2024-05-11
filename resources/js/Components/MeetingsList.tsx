const MeetingsList = ( {meetings}: any) => {
    
    return (
        (meetings.length > 0) ? 
       
        <div className="flex flex-col items-center justify-center p-10 mr-10">  
           <ul className="divide-y divide-gray-200">
                {meetings.map((meeting: any, index: number) => (
                    <li key={index} className="py-4">
                        <div className="flex items-center space-x-4">
                            {/* Replace the content below with meeting details */}
                            <div className="flex-shrink-0">
                                <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <span className="font-medium text-gray-600 dark:text-gray-300">{meeting.code}</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{meeting.name}</p>
                                <p className="text-sm text-gray-500 truncate">{meeting.start_at}</p>
                            </div>
                            <div className="flex-shrink-0">
                                <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Join</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
      </div> :
        <div className="flex flex-col items-center justify-center p-10 mr-10">
                            <div>
                                <img width="300" src="https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg" />
                            </div>
                            <p className="mb-2 text-2xl">Get a link you can share</p>
                            <div className="text-sm">Click <strong>New meeting</strong> to get a link you can send to people </div>
                            <div className="text-sm">you want to meet with</div>
        </div>
    )
   
 }

export default MeetingsList;