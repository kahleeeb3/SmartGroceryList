import asyncio
import websockets
import base64

async def save_image(websocket):
    while True:
        try:
            # Receive Base64-encoded image data from client
            message = await websocket.recv()
            print("Received image data")

            # Extract Base64 data (remove the "data:image/png;base64," prefix)
            if message.startswith("data:image/png;base64,"):
                message = message.replace("data:image/png;base64,", "")

            # Decode the Base64 string to bytes
            image_data = base64.b64decode(message)

            # Save the image
            with open("received_image.png", "wb") as file:
                file.write(image_data)

            print("Image saved as received_image.png")

            # Send confirmation back to client
            await websocket.send("Image received and saved!")

        except websockets.exceptions.ConnectionClosed:
            print("Connection closed")
            break

async def main():
    async with websockets.serve(save_image, "localhost", 8765):
        await asyncio.Future()  # Run the server forever

asyncio.run(main())
