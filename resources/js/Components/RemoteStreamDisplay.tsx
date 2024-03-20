import React, { useEffect, useRef, useState } from 'react';
import SoundWaveCanvas from './SoundWaveCanvas';
import { Avatar } from '@chakra-ui/react';
import {AiOutlineAudio, AiOutlineAudioMuted} from "react-icons/ai";

interface RemoteStreamDisplayProps {
    remoteStream: MediaStream | undefined;
    name: string;
}

const RemoteStreamDisplay: React.FC<RemoteStreamDisplayProps> = ({
    remoteStream,
    name,
}) => {
    const [videoEnabled, setVideoEnabled] = useState(false)
    const [audioEnabled, setAudioEnabled] = useState(false)



    useEffect(() => {
        if (remoteStream) {
            setVideoEnabled(remoteStream.getVideoTracks().length > 0);
            setAudioEnabled(remoteStream.getAudioTracks().length > 0);

            remoteStream.onremovetrack = () => {
                setVideoEnabled(false);
                setAudioEnabled(false);
            }
        } else {
            setVideoEnabled(false);
            setAudioEnabled(false);
        }
    }, [remoteStream]);

    return (
        <div>
            <div
                className={`relative flex items-center justify-center bg-gray-400 rounded ${!videoEnabled ? '' : 'hidden'
                    }`}
                style={{ width: '30rem', height: '18rem' }}
            >
                <Avatar className='z-10' name={name} size='2xl' />
                {(audioEnabled && remoteStream) && (
                    <SoundWaveCanvas mediaStream={remoteStream} />
                )}
                {!audioEnabled && <AiOutlineAudioMuted className="absolute top-4 right-4 text-white text-md font-bold" />}
                {audioEnabled && <AiOutlineAudio className="absolute top-4 right-4 text-white text-md font-bold" />}
                <span className='absolute bottom-1 right-2 text-white text-sm font-bold'>{name}</span>
            </div>

            <video
                autoPlay
                playsInline
                className={`w-full h-full rounded ${videoEnabled && remoteStream ? '' : 'hidden'}`}
                style={{ width: "30rem", height: "18rem", transform: "scaleX(-1)" }}
                ref={(videoRef) => {
                    if (videoRef && remoteStream) {
                        (videoRef as HTMLVideoElement).srcObject = remoteStream;
                    }
                }}
            ></video>
        </div>
    );
};

export default RemoteStreamDisplay;
