
## TODO:
1. Get camera and audio from user - DONE
2. Show camera on screen. - DONE
3. Use socket to call others clients
4. Send and receive the stream of all connected clients (p2p)
    - Make an unique ID
    - Call others peers connected to same server
    - On call: send ID and current stream
    - On Answer: send your id and current stream
    - Each client add the answered stream to your screen
5. Share your screen to others clients (and receive too)
6. record the call.

## Classes:
- Main: will delivery responsabilities to another classes to make everything more organizated. 
- View: change the DOM
- Media: everything about webrtc 
- Index: get all objects and call main, sending these. 
