<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class LiuEmailFormat implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  Closure  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // email must be like this format: *digits @students.liu.edu.lb or name@liu.edu.lb or name@instructors.liu.edu.lb

        if (!preg_match('/^[0-9._%+-]+@students.liu.edu.lb$|^[a-zA-Z0-9._%+-]+@liu.edu.lb$|^[a-zA-Z0-9._%+-]+@instructors.liu.edu.lb$/', $value)) {
            $fail('The '.$attribute.' must be a valid LIU email address.');
        }
    }
}
