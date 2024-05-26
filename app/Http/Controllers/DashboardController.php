<?php

namespace App\Http\Controllers;

use App\Events\SendHandShake;
use App\Models\Meeting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
       //$today = Carbon::today();

        //$user = auth()->user();

       //$meetings = Meeting::where('user_id', $user->id)

        //->where('start_at', '>=', Carbon::today())
       // ->where('start_at', '<', Carbon::tomorrow())
       // ->orderBy('start_at', 'asc')
       // ->get();

       $today = Carbon::today();

       $user = auth()->user();

       $meetings = Meeting::leftJoin('invitations', 'meetings.id', '=', 'invitations.meeting_id')
           ->where(function ($query) use ($user) {
               $query->where('meetings.user_id', $user->id)
                   ->orWhere('invitations.user_id', $user->id);
              })
            ->get();

       $allUsers = User::all()->except(auth()->id())->toArray();
     ///  dd($allUsers, $meetings);

        return Inertia::render('Dashboard', compact('meetings', 'allUsers'));
    }

    public function meeting($id)
    {
        return Inertia::render('Meeting', compact('id'));
    }

    public function handshake(Request $request)
    {
        event(new SendHandShake($request->reciver_id, auth()->id() , $request->data));

        return response([
            "status" => true,
            "message" => "handshake send.."
        ]);
    }

    public function scheduledMeetings()
    {

       $user = auth()->user();
       $meetings = Meeting::where('user_id', $user->id)
       ->get();

       return $meetings;


    }

    public function findMeetingByCode($code)
    {
        $meeting_exists = Meeting::where('code', $code)->exists();
        return response()->json($meeting_exists);
    }

    public function createMeeting(Request $request)
    {
       // dd($request->all());
        // Validate the incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'invitees' => 'required|array', // array of user IDs
        ]);

        // Create a new meeting
        $meeting = new Meeting();
        $meeting->name = $validatedData['name'];
        $meeting->start_at = $validatedData['start_date'];
        $meeting->end_at = $validatedData['end_date'];
        $meeting->code = uniqid('meeting_'); // Generates a unique code like 'meeting_5f34d8f6b7f6a
        $meeting->user_id = Auth::id(); // Assuming the currently authenticated user is the creator

        // Save the meeting
        $meeting->save();

        // Attach invitees to the meeting
        $meeting->invitees()->attach($validatedData['invitees']);

        return redirect()->route('dashboard');
    }
}
