class SocketEventEmitter {
   emitMessage(eventName: string, data: any) {
      const globalVar: any = global;
      globalVar.socket.emit(eventName, data);
   }
}

export default new SocketEventEmitter();
