import { useRef, useState, FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton";
import Select from "react-tailwindcss-select";
import {User} from "@/types";
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Button } from 'primereact/button';
        


export default function ScheduleMeetingForm({ users = [], className = '' }: { users?: any| User[] , className?: string }) {
    const [confirmingMeetingCreate, setConfirmMeetingCreation] = useState(false);
    const [invitees, setInvitees] = useState(null);
    const meetingNameInput = useRef<HTMLInputElement>();
    const dateInput = useRef<HTMLInputElement>();
    const options = users.map((user: User) => ({ name: user.name +' ('+ user.email+')', code: user.id }));
    
    
    
    const {
        data,
        setData,
        post: create,
        processing,
        reset,
        errors,
    } = useForm({
        name: '',
        date: '',
        invitees: [],
    });

    const confirmMeetingCreation = () => {
        setConfirmMeetingCreation(true);
    };

    const handleInvitees = (e: any) => {
        console.log(e)
        setInvitees(e)
        setData('invitees', e.map((user: any) => user.value));
    }

    const createMeeting: FormEventHandler = (e) => {
        e.preventDefault();

        create(route('meeting.create'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => dateInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmMeetingCreation(false);

        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>


            <PrimaryButton onClick={confirmMeetingCreation} className=''>
                Create New Meeting
            </PrimaryButton>

            <Modal show={confirmingMeetingCreate} onClose={closeModal} closeable={true}>
    <form onSubmit={createMeeting} className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
           Create an instant meeting or schedule for later.
        </h2>

        <div className="mt-6">
            <InputLabel htmlFor="name" value="Meeting Name" className="sr-only" />
            <TextInput
                id="name"
                type="text"
                name="name"
                ref={meetingNameInput}
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="mt-1 block w-full"
                isFocused
                placeholder="Meeting Name"
            />
            <InputError message={errors.name} className="mt-2" />
        </div>

        <div className="mt-6">
            <InputLabel htmlFor="date" value="Date" className="sr-only" />
            <TextInput
                id="date"
                type="datetime-local"
                name="date"
                ref={dateInput}
                value={data.date}
                onChange={(e) => setData('date', e.target.value)}
                className="mt-1 block w-full"
                isFocused
                placeholder="Date"
            />
            <InputError message={errors.date} className="mt-2" />
        </div>

        <div className="mt-6">
            <div className="card flex justify-content-center">
                <MultiSelect
                    value={invitees}
                    onChange={(e) => setInvitees(e.value)}
                    optionLabel="name"
                    options={options}
                    placeholder="Select users"
                    className="w-full md:w-20rem"
                    filter
                />
            </div>
        </div>
        
        <div className="mt-6 flex justify-end">
            <button onClick={confirmMeetingCreation} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                 Create Meeting
             </button>
        </div>

    </form>
</Modal>

        </section>
    );
}
