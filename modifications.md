Removed

```sh
  . "$(dirname -- "$0")/_/husky.sh"
```

from pre-commit and commit-msg due to the following error.
"husky - DEPRECATED

Please remove the following two lines from .husky/pre-commit:

#!/usr/bin/env sh
. "$(dirname -- "$0")/\_/husky.sh"

They WILL FAIL in v10.0.0"

Removed eslintignore since its no longer supported, add ignore to the eslint.config.js and put the contents inside "ignores"
