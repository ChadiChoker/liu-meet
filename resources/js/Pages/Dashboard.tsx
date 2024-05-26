import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';
import useRandomStringGenerator from '@/hooks/useRandomStringGenerator';
import MeetingsList from '@/Components/MeetingsList';
import axios from 'axios';
import DeleteUserForm from "@/Pages/Profile/Partials/DeleteUserForm";
import ScheduleMeetingForm from "@/Pages/ScheduleMeetingForm";
import { User } from '@/types';

export default function Dashboard({ auth, meetings, allUsers }: PageProps) {


    const [meetingId, setMeetingId] = useState('');
    const generateNewRandomString = useRandomStringGenerator();




    const newMeetingHandle = () => {
        const randomString = generateNewRandomString(11);
        router.visit(`/meeting/${randomString}`);

    }

    const handleJoin = () => {
        if('' == meetingId) return;
        axios({
            method: "get",
            url: '/check-meeting/'+meetingId
          }).then(function (response) {
            if (!response.data) {
                alert('meeting does not exists')
                return;
            }
            router.visit(`/meeting/${meetingId}`);
          });
    }


    // @ts-ignore
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Meeting</h2>}
        >
            <Head title="Meeting" />

            <div className="py-12 ">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg grid  gap-4 grid-cols-1 md:grid-cols-2  h-[34rem] overflow-scroll">


                        <div className="flex flex-col justify-center p-10">
                            <h1 className="text-4xl font-semibold">Premium video meetings.</h1>
                            <h1 className="mb-5 text-4xl font-semibold"> Now free for everyone.</h1>
                            <p>We re-engineered the service we built for secure business meetings, Google Meet, to make it free and available for all.</p>
                            <div className="grid grid-cols-6 gap-2 mt-10 lg:grid-cols-12">
                                { auth.user.role === 'instructor' &&

                                    <ScheduleMeetingForm users={allUsers} className="col-span-4 text-center" />

                                }
                                <TextInput onChange={(e) => {
                                    setMeetingId(e.target.value)
                                }} className="col-span-4" />
                                <SecondaryButton onClick={handleJoin} className="col-span-2">Join</SecondaryButton>
                            </div>
                        </div>


                        <div>
                        <MeetingsList meetings={meetings} />
                        </div>
                    </div>

                </div>
            </div>


        </AuthenticatedLayout>
    );
}
