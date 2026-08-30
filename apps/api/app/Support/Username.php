<?php

namespace App\Support;

use Illuminate\Validation\Rule;

final class Username
{
    private const RESERVED = [
        'about',
        'api',
        'forgot-password',
        'login',
        'mockapi',
        'pricing',
        'privacy',
        'restore-account',
        'samplepage',
        'sanctum',
        'signup',
        'terms',
        'up',
    ];

    public static function normalize(mixed $value): string
    {
        return strtolower(trim((string) $value));
    }

    /**
     * @return array<int, mixed>
     */
    public static function validationRules(bool $required = true): array
    {
        $rules = [
            'string',
            'regex:/^[a-z0-9](?:[a-z0-9_-]{1,28}[a-z0-9])?$/',
            'min:3',
            'max:30',
            Rule::notIn(self::RESERVED),
        ];

        if ($required) {
            array_unshift($rules, 'required');
        }

        return $rules;
    }
}
