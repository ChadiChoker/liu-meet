<?php

namespace App\Notifications;

use App\Models\Meeting;
use Carbon\Carbon;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MeetingInvitation extends Notification
{

    /**
     * Create a new notification instance.
     */

    public function __construct(
       private readonly Meeting $meeting
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = route('meeting', $this->meeting->code);

        return (new MailMessage)
            ->subject('Meeting Invitation')
            ->line('You are invited to a meeting by ' . $this->meeting->user->name)
            ->line('Meeting Name: ' . $this->meeting->name)
            ->line('Meeting Date: ' . Carbon::parse($this->meeting->start_at)->format('d M Y H:i'))
            ->action('Join Meeting', $url)
            ->line('Thank you for using our application!');

    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
