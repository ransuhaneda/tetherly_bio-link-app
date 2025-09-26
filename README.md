Code Usage Example of Env variables

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

fetch(`${apiBaseUrl}/endpoint`)
  .then(response => response.json())
  .then(data => console.log(data));
```
