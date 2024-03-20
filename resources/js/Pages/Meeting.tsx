import { Head, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { AiOutlineAudio, AiOutlineAudioMuted, AiOutlineClose, AiOutlineCopy } from "react-icons/ai";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs";
import { LuScreenShare, LuScreenShareOff } from "react-icons/lu";
import { HiPhoneMissedCall } from "react-icons/hi";
import { useWebRTC, WebRTCState } from "@/hooks/useWebRTC";
import { PageProps, User } from "@/types";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { Avatar, useToast } from '@chakra-ui/react'
import SoundWaveCanvas from "@/Components/SoundWaveCanvas";
import RemoteStreamDisplay from "@/Components/RemoteStreamDisplay";
import {FaMicrophone, FaMicrophoneSlash} from "react-icons/fa";

interface MeetingProps extends PageProps {
    id: string;
}

export default function Meeting({ auth, id }: MeetingProps) {
    const {
        isAudioMuted,
        isVideoOff,
        isScreenSharing,
        setIsScreenSharing,
        createOffer,
        createPeer,
        removePeer,
        createMyVideoStream,
        destroyConnection,
        localStream,
        remoteStreams,
        isToggling,
        toggleMic,
        toggleVideo
    }: WebRTCState = useWebRTC({ meetingCode: id, userId: auth.user.id });
    const toast = useToast()

    const [showInviteModal, setshowInviteModal] = useState(true);
    const [meetingUsers, setMeetingUsers] = useState<User[]>([]);


    const endCall = () => {
        destroyConnection().then(r => {
            toast({
                title: 'Call Ended.',
                status: "success",
                position: "top-right",
                variant: 'left-accent',
                duration: 2000,
                isClosable: true,
            })
            router.visit(`/dashboard`);
        }).catch(e => {
            console.error(e);
            toast({
                title: 'Error ending call.',
                status: "error",
                position: "top-right",
                variant: 'left-accent',
                duration: 2000,
                isClosable: true,
            })
        })
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: 'Copied.',
            status: "success",
            position: "top-right",
            variant: 'left-accent',
            duration: 2000,
            isClosable: true,
        })
    }

    const date = new Date();

    useEffect(() => {
        const initializeVideoStream = async () => {
            const stream = await createMyVideoStream(false, false);
            toast({
                title: 'Call Started.',
                status: "success",
                position: "top-right",
                variant: 'left-accent',
                duration: 2000,
                isClosable: true,
            })

            if (id) {
                (window as any).Echo.join(`meeting.${id}`)
                    .here(async (users: User[]) => {
                        setMeetingUsers(users);
                        users.map(async (user) => {
                            if (user.id !== auth.user.id) {
                                await createPeer(user.id, stream);
                            }
                        });
                    })
                    .joining(async (user: User) => {
                        setMeetingUsers(prev => [...prev, user]);
                        createOffer(user.id, stream);
                    })
                    .leaving((user: User) => {
                        setMeetingUsers(prev => prev.filter(u => u.id != user.id));
                        removePeer(user.id);
                    })
                    .error((error: any) => {
                        console.error({ error });
                    });
            }
        };

        initializeVideoStream().then(r => {
            console.log('Video Stream Initialized');
        }).catch(e => {
            console.error(e);
        })

        return () => {
            (window as any).Echo.leave(`meeting.${id}`);
        };
    }, [id]);

    // useEffect(() => {
    //     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    //         e.preventDefault();
    //         e.returnValue = 'Please end the call ';
    //     };
    //
    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //
    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, []);

    return (
        <div className="relative w-screen h-screen bg-black opacity-90">
            <Head title="Meeting" />

            {/*/!* Chatbox *!/*/}
            {/*<div className="absolute w-80 top-10 bottom-20 h-[85vh] right-10 transition rounded">*/}
            {/*    <Chatbox />*/}
            {/*</div>*/}


            <div className="absolute text-sm font-bold text-white bottom-20 left-10">
                {auth?.user.name || ""}
            </div>

            <div
                className="grid col-auto xl:grid-cols-4 gap-2 px-10 pt-10 pb-32 sm:grid-cols-1 md:grid-cols-3">

                <div>
                    <div className={`relative flex items-center justify-center bg-gray-400 rounded  ${isVideoOff && !isScreenSharing ? '' : 'hidden'}`} style={{ width: "100%", height: "18rem" }}>
                        <Avatar className="z-10" name={auth.user.name} size='2xl' />
                        {!isAudioMuted && <SoundWaveCanvas mediaStream={localStream} />}
                        {isAudioMuted && <FaMicrophoneSlash className="absolute top-4 right-4 text-white text-md font-bold" />}
                        {!isAudioMuted && <FaMicrophone className="absolute top-4 right-4 text-white text-md font-bold" />}
                        <span className='absolute bottom-1 right-2 text-white text-sm font-bold'>You</span>
                    </div>
                    {!isVideoOff && (
                            <video
                                autoPlay
                                id={auth.user.id.toString()}
                                muted
                                playsInline
                                style={{ width: "100%", height: "18rem", transform: "scaleX(-1)" }}
                                className="rounded"
                                ref={(videoRef) => {
                                    if (videoRef && localStream) {
                                        (videoRef as HTMLVideoElement).srcObject = localStream;
                                    }
                                }}
                            >
                            </video>

                    )}
                </div>




                {meetingUsers.filter(x => x.id != auth.user.id).map((user) => (
                    <RemoteStreamDisplay
                        key={user.id}
                        remoteStream={remoteStreams[user.id]}
                        name={meetingUsers.find(u => u.id == user.id)?.name || 'N/A'}
                    />
                ))}

            </div>
            {/* Video grid container */}


            {/*footer*/}
            <div className="absolute grid w-screen grid-cols-3 px-10 text-white bottom-5">
                <div className="flex">
                    <div className="mr-1 cursor-not-allowed">


                         |
                    </div>
                    <div>{id}</div>
                </div>

                <div className="space-x-2 text-center">
                    <PrimaryButton onClick={toggleMic} disabled={isToggling == 'audio'}>
                        {isAudioMuted ? (
                            <AiOutlineAudioMuted className="w-5 h-5" style={{ color: "red"}} />
                        ) : (
                            <AiOutlineAudio className="w-5 h-5" style={{ color: "green"}} />
                        )}
                    </PrimaryButton>

                    <PrimaryButton onClick={toggleVideo} disabled={isToggling == 'video'}>
                        {isVideoOff ? (
                            <BsCameraVideoOff className="w-5 h-5" style={{ color: "red"}} />
                        ) : (
                            <BsCameraVideo className="w-5 h-5" style={{ color: "green"}} />
                        )}
                    </PrimaryButton>

                    <PrimaryButton
                        disabled={isScreenSharing}
                        style={{ color: "cyan"}}
                        onClick={() => { setIsScreenSharing(true) }}
                    >
                        {isScreenSharing ? (
                            <LuScreenShareOff className="w-5 h-5" />
                        ) : (
                            <LuScreenShare className="w-5 h-5" />
                        )}
                    </PrimaryButton>

                    <PrimaryButton onClick={endCall}>
                        <HiPhoneMissedCall className="w-5 h-5" style={{ color: "red"}} />
                    </PrimaryButton>
                </div>

                <div className="text-right">
                    <PrimaryButton >Chat</PrimaryButton>
                </div>
            </div>
            {/*footer*/}


            {/*pop new meeting*/}
            <div className={`absolute p-5 bg-white rounded-lg w-80 bottom-20 left-10 ${showInviteModal ? '' : 'hidden'}`}>
                <div className="flex justify-between mb-5">
                    <h1 className="text-lg font-bold text">Your meeting's ready</h1>
                    <button onClick={() => { setshowInviteModal(false) }}><AiOutlineClose /></button>
                </div>

                <p className="mb-5 text-sm">Share this meeting link with others you want in the meeting</p>

                <div className="flex justify-between p-3 mb-5 bg-gray-200 rounded">
                    <div className="text-lg text">{window.location.pathname.substring(1)}</div>
                    <button onClick={handleCopy} >
                        <AiOutlineCopy className="cursor-pointer w-7 h-7" />
                    </button>

                </div>

            </div>
            {/*pop new meeting*/}

        </div>
    );
}
