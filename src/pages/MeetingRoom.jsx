import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyMeetingDetails, dummyUser } from '../assets/asset';
import VideoGrid from '../components/meeting/VideoGrid';
import useWEBRTC from '../hooks/useWEBRTC';
import ChatPanel from '../components/meeting/ChatPanel';
import { useChat } from '../hooks/useChat';
import ParticipantList from '../components/meeting/ParticipantList';
import ControlBar from '../components/meeting/ControlBar';
import toast from 'react-hot-toast';

const MeetingRoom = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const userdata = dummyUser;

  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);

  const handleMeetingEnded = useCallback(() => {
    navigate('/dashboard')
  }, [navigate])


  //INITiAZE WEBRTC_______________________
  const { localStream, remoteUsers, audioEnabled, videoEnabled, toggleAudio, toggleVideo, endMeeting } = useWEBRTC(meetingId, userdata, handleMeetingEnded);
  //INITiAZE CHAT_______________________
  const { messages, sendMessage, unreadCount, isChatOpen, toggleChat } = useChat(meetingId, userdata);


  const isHost = true;

  const handleLeave = () => {
    toast("You left the meeting");
    navigate("/dashboard")
  }

  const handleEndMeeting = async () => {
    try {
      if (typeof endMeeting === 'function') {
        await endMeeting();
      }
      toast.success("Meeting Ended for all users");
    } catch (error) {
      console.error("Error ending meeting:", error);
      toast.error("Failed to end meeting properly");
    } finally {
      navigate("/dashboard");
    }
  };


  return (
    <div className='h-screen w-screen bg-slate-100 text-slate-900 flex flex-col overflow-hidden 
    relative font-sans'>

      {/*    TOP BAR    */}
      <header className='w-full bg-white/90 backdrop-blur-md px-6 py-3 border-b border-slate-200 
    flex items-center justify-between z-30 shadow-xs'>

        <div className='flex items-center gap-3'>

          <h2 className='text-base font-semibold text-slate-900 tracking-tight'>
            {dummyMeetingDetails.title}({meetingId || dummyMeetingDetails.meetingId})
          </h2>
          <span className='size-1.5 rounded-full bg-emerald-500 animate-pulse' />
        </div>
      </header>

      {/*    MAIN CONTENT AREA     */}
      <div className='flex flex-1 overflow-hidden relative'>

        {/*    VIDEO GRID CENTER     */}
        <VideoGrid localStream={localStream}
          localUser={userdata}
          remoteUsers={remoteUsers}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled} />
        {/*    IN MEETING CHART DRAWER     */}
        <ChatPanel
          isOpen={isChatOpen}
          onClose={toggleChat}
          messages={messages}
          onSendMessage={sendMessage}
          currentUser={userdata}
        />
        {/*    PARTICIPANTS DRAWER     */}
        <ParticipantList
          isOpen={isParticipantsOpen}
          onClose={() => isParticipantsOpen(false)}
          localUser={userdata}
          localAudio={audioEnabled}
          localVideo={videoEnabled}
          remoteUsers={remoteUsers}
          meetingHostId={dummyUser.id}
        />



      </div>
      {/*    BOTTOM FLOAT CONTROL BAR      */}
      <ControlBar
        roomId={meetingId || dummyMeetingDetails.meetingId}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleChat={toggleChat}
        onToggleParticipants={() => setIsParticipantsOpen((prev) => !prev)}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantsOpen}
        unreadCount={unreadCount}
        participantCount={1 + remoteUsers?.length}
        isHost={isHost}
        onLeave={handleLeave}
        onEndMeeting={handleEndMeeting}

      />

    </div>
  )
}

export default MeetingRoom