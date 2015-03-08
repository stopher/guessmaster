function createEvent(nameOfCustomEvent) {
  

  var event; // The custom event that will be created

  if (document.createEvent) {
    event = document.createEvent("HTMLEvents");
    event.initEvent(nameOfCustomEvent, true, true);
  } else {
    event = document.createEventObject();
    event.eventType = nameOfCustomEvent;
  }

  event.eventName = nameOfCustomEvent;

  if (document.createEvent) {
    document.dispatchEvent(event);
  } else {
    document.fireEvent("on" + event.eventType, event);
  }

}