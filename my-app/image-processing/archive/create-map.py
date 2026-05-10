import asyncio
from websockets.asyncio.server import serve

async def echo(websocket):
    async for message in websocket:
        await websocket.send(message)


async def main():
    async with serve(echo, "ws://192.168.3.5", 8484) as server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(main())