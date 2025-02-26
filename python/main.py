import asyncio
import websockets
from handwrittenOCR import convertToText

async def receiveData(websocket):
    while True:
        try:
            # Receive Base64-encoded image data from client
            message = await websocket.recv()

            # Extract Base64 data (remove the "data:image/png;base64," prefix)
            if message.startswith("data:image/png;base64,"):
                message = message.replace("data:image/png;base64,", "")

            # saveImage(message) # if you want to save the image data
            recognized_text = convertToText(message)
            
            # Send confirmation back to client
            await websocket.send(recognized_text)

        except websockets.exceptions.ConnectionClosed:
            print("Connection closed")
            break

async def main():
    async with websockets.serve(receiveData, "localhost", 8765):
        print("Server Running...")
        await asyncio.Future()  # Run the server forever

asyncio.run(main())
