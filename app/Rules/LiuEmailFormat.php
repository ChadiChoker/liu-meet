<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class LiuEmailFormat implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! preg_match('/^[0-9]+@students.liu.edu.lb$|^[a-zA-Z0-9._%+-]+@liu.edu.lb$/', $value )) {
            $fail('Enter a valid LIU email address');
        }
    }
}
