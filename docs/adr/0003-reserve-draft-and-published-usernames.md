# Reserve draft and selected-publication usernames

When a published creator changes their draft username, the old public URL continues serving the selected immutable snapshot until the creator republishes. Tetherly reserves both the draft username and selected-publication username during that interval; republishing moves public availability to the new username and releases the old one, while unpublishing or account purge also releases the old publication username. The MVP does not redirect old public URLs because redirects would complicate username reuse and ownership.
