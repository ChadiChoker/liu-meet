<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    // A meeting belongs to a user (the creator)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A meeting can have many invitees (many-to-many relationship)
    public function invitees()
    {
        return $this->belongsToMany(User::class, 'invitations');
    }
}
