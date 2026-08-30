# Keep link reordering accessible beyond drag and drop

Creator link cards use dedicated drag handles and update visually during a gesture, then persist the final order with one request on drop. Move up and Move down remain available through an overflow menu and keyboard-accessible handle behavior, with position changes announced through an `aria-live` region. A failed save restores the previous order and offers an inline retry. Disabled links remain visible, reorderable, and explicitly marked as hidden from the public profile.
