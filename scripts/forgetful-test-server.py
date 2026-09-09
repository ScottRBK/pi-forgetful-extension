"""Run the real Forgetful REST routes and SQLite repositories with fake embeddings.

This uses Forgetful's own test fixture and never opens its production database.
Invoke with the checkout's virtualenv Python and pass its checkout path as argv[1].
"""
import asyncio
import importlib.util
import os
from pathlib import Path
import socket
import sys

os.environ["DATABASE"] = "SQLite"
os.environ["SQLITE_MEMORY"] = "true"
os.environ["FASTMCP_SERVER_AUTH"] = ""
os.environ["RERANKING_ENABLED"] = "false"

source = Path(sys.argv[1]).resolve()
sys.path.insert(0, str(source))
spec = importlib.util.spec_from_file_location(
    "forgetful_test_fixture", source / "tests/e2e_sqlite/conftest.py"
)
fixture = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = fixture
spec.loader.exec_module(fixture)


class FixedEmbeddings:
    async def generate_embedding(self, text: str) -> list[float]:
        from app.config.settings import settings

        if not isinstance(text, str):
            raise TypeError("embedding text must be a string")
        await asyncio.sleep(0)
        return [1.0] + [0.0] * (settings.EMBEDDING_DIMENSIONS - 1)


async def main():
    import uvicorn

    apps = fixture.build_sqlite_app(FixedEmbeddings(), None, enabled_features={"files"})
    app = await anext(apps)
    listener = socket.socket()
    listener.bind(("127.0.0.1", 0))
    port = listener.getsockname()[1]
    config = uvicorn.Config(app.http_app(), log_level="error")
    server = uvicorn.Server(config)
    task = asyncio.create_task(server.serve(sockets=[listener]))
    while not server.started:
        if task.done():
            await task
            raise RuntimeError("Test server failed to start")
        await asyncio.sleep(0.01)
    print(f"READY http://127.0.0.1:{port}/api/v1", flush=True)
    try:
        await task
    finally:
        await apps.aclose()


asyncio.run(main())
