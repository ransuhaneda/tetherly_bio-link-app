from http.server import BaseHTTPRequestHandler, HTTPServer
import json

PROFILE = {
    "username": "alice",
    "display_name": "Alice Example",
    "bio": "Designer and maker.",
    "avatar_url": None,
    "theme": "editorial-bento",
    "version": 3,
    "published_at": "2026-01-01T00:00:00Z",
    "links": [
        {"id": 2, "label": "Second", "url": "https://second.example/path", "icon": None, "category": "work", "position": 2},
        {"id": 1, "label": "First", "url": "https://first.example", "icon": "globe", "category": "social", "position": 1},
        {"id": 3, "label": "Unsafe", "url": "javascript:alert(1)", "icon": None, "category": None, "position": 0},
    ],
}

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/api/v1/profiles/alice":
            body = json.dumps({"data": PROFILE}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        body = json.dumps({"message": "Not found"}).encode()
        self.send_response(404)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass

HTTPServer(("127.0.0.1", 8000), Handler).serve_forever()
