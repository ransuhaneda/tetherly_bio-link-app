<x-mail::message>
# Your account deletion was requested

Tetherly received a request to delete your account on **{{ $requestDate }} (UTC)**.

- **Username:** {{ '@'.$username }}
- **Public visibility:** Your Tether was unpublished immediately and is no longer publicly visible.
- **Scheduled deletion date:** {{ $deletionDate }} (UTC)

Your account and username remain reserved until the scheduled deletion date. To restore your account before then, visit Tetherly's normal login page at {{ $loginUrl }} and sign in with your email address and password. Signing in does not restore the account automatically; Tetherly will ask you to confirm restoration.

If you did not request deletion, use the normal login page as soon as possible. Never share your password or a session code with anyone.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
