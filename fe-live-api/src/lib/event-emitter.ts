export const EVENT_EMITTER_NAME = {
  EVENT_UNAUTHORIZED_USER: 'EVENT_UNAUTHORIZED_USER',
  USER_ACCOUNT_CHANGE: 'USER_ACCOUNT_CHANGE',
  USER_PROFILE_UPDATE: 'USER_PROFILE_UPDATE',
  LIVE_STREAM_START: 'LIVE_STREAM_START',
  LIVE_STREAM_END: 'LIVE_STREAM_END',
} as const;

type EventName = keyof typeof EVENT_EMITTER_NAME;
type EventCallback<T = unknown> = (data: T) => void;

type EventRegistry = {
  [K in EventName]?: Array<EventCallback>;
};

const events: EventRegistry = {};

const emitCallback = async <T>(
  callbackFn: EventCallback<T>,
  data: T
): Promise<void> => {
  if (callbackFn) callbackFn(data);
};

export const EventEmitter = {
  emit<T>(event: EventName, data?: T): void {
    const emitEvents = events[event];
    if (emitEvents) {
      emitEvents.forEach((callback) => emitCallback(callback, data as T));
    }
  },

  subscribe<T>(event: EventName, callback: EventCallback<T>): void {
    if (callback) {
      const emitEvents = events[event] || [];
      emitEvents.push(callback as EventCallback);
      events[event] = emitEvents;
    }
  },

  unsubscribe<T>(
    event: EventName,
    unsubscribeCallback: EventCallback<T>
  ): void {
    const emitEvents = events[event];
    if (emitEvents) {
      events[event] = emitEvents.filter(
        (callback) => callback !== unsubscribeCallback
      );
    }
  },
};
