// Socket events that the server listens to (incoming from clients)
export enum SocketListenEvents {
  CAPTAIN_AUTHENTICATE = "captain:authenticate",
  CAPTAIN_LOCATION_UPDATE = "captain:location_update",
  ADMIN_JOIN = "admin:join",
  DISCONNECT = "disconnect",
}

// Socket events that the server emits (outgoing to clients)
export enum SocketEmitEvents {
  AUTH_ERROR = "auth_error",
  AUTHENTICATED = "authenticated",
  VALIDATION_ERROR = "validation_error",
  LOCATION_UPDATED = "location:updated",
  LOCATION_UPDATE_SUCCESS = "location:update_success",
  ERROR = "error",
  ADMIN_JOINED = "admin:joined",
}
