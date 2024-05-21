<?php

namespace App\Http\Controllers;

use App\Events\SendHandShake;
use App\Models\Meeting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
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
            ->where('invitations.user_id', $user->id)
            ->get();

       $allUsers = User::all()->except(auth()->id())->toArray();

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
        
        $validatedData = $request->validate([
            'name' => 'required|string',
            'date' => 'required|date',
            'invitees' => 'required|array', 
        ]);

        
        $meeting = new Meeting();
        $meeting->name = $validatedData['name'];
        $meeting->date = $validatedData['date'];
       
        $meeting->save();

        
        $meeting->invitees()->attach($validatedData['invitees']);

     
        return response()->json(['message' => 'Meeting created successfully'], 201);
    }
}
